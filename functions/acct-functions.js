const functions = require('firebase-functions');
const express = require('express');
const bodyParser = require('body-parser');
const moment = require('moment-timezone');
const acct = express();
const cors = require('cors');
const { credentials } = require('./credentials');
const { google } = require('googleapis');
const session = require('express-session');
const FirestoreStore = require('firestore-store')(session);
const segmentCodes = require('./segmentCodes');

const LOCAL = true;

const { db } = require('./admin');
// const { throws } = require('assert');
let unitsHash = {};

acct.use(bodyParser.json());
acct.use(bodyParser.urlencoded({ extended: false }));
acct.use(cors({ origin: true }));

const client_id = credentials.xero_client_id;
const client_secret = credentials.xero_client_secret;
const redirectUrl = (LOCAL ? "http://localhost:5001/ghotels-production/us-central1/acct/callback" : credentials.xero_redirect_uri);
//uncomment for local testing.
// const redirectUrl =
//   'http://localhost:5000/ghotels-production/us-central1/acct/callback';
const xeroTenantId = credentials.xero_tennat_id;
const scopes =
  'openid profile email accounting.contacts.read accounting.settings accounting.transactions offline_access';

const authenticationData = (req, res) => {
  return {
    decodedIdToken: req.session.decodedIdToken,
    decodedAccessToken: req.session.decodedAccessToken,
    tokenSet: req.session.tokenSet,
    allTenants: req.session.allTenants,
    activeTenant: req.session.activeTenant,
  };
};

acct.use(
  session({
    store: new FirestoreStore({
      database: db,
    }),

    name: '__session', // ← required for Cloud Functions / Cloud Run
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
  })
);

acct.get('/connect', async (req, res) => {
  res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
  const { XeroClient } = require('xero-node');

  const xero = new XeroClient({
    clientId: client_id,
    clientSecret: client_secret,
    redirectUris: [redirectUrl],
    scopes: scopes.split(' '),
  });
  try {
    await xero.initialize();
  } catch (err) {
    console.log(err);
  }

  try {
    const consentUrl = await xero.buildConsentUrl();
    res.redirect(consentUrl);
  } catch (err) {
    console.log(err);
    res.send('Sorry, something went wrong in connect');
  }
});

acct.get('/callback', async (req, res) => {
  const jwtDecode = require('jwt-decode');
  const { XeroClient } = require('xero-node');
  const xero = new XeroClient({
    clientId: client_id,
    clientSecret: client_secret,
    redirectUris: [redirectUrl],
    scopes: scopes.split(' '),
  });
  await xero.initialize();
  try {
    const tokenSet = await xero.apiCallback(req.url);
    //console.log(tokenSet);
    await xero.updateTenants();

    const decodedIdToken = jwtDecode(tokenSet.id_token);
    const decodedAccessToken = jwtDecode(tokenSet.access_token);

    req.session.decodedIdToken = decodedIdToken;
    req.session.decodedAccessToken = decodedAccessToken;
    req.session.tokenSet = tokenSet;
    req.session.allTenants = xero.tenants;
    // XeroClient is sorting tenants behind the scenes so that most recent / active connection is at index 0
    req.session.activeTenant = xero.tenants[0];

    const authData = authenticationData(req, res);
    //console.log(authData)
    res.send('Connected to Xero!');
  } catch (err) {
    console.log(err);
    res.send('Sorry, something went wrong in callback');
  }
});

acct.get('/hawaiiRevenue', async (req, res) => {
  unitsHash = await createUnitsHash();

  const vrbo = await getVRBOData();
  const airbnb = await getAirbnbData();
  let revenue = 0.0;

  if (airbnb !== undefined && airbnb.length > 0) {
    for (let i = 0; i < airbnb.length; i++) {
      if (
        airbnb[i][1] !== 'Pass Through Tot' &&
        airbnb[i][1] !== 'Payout' &&
        airbnb[i][1] !== 'Resolution Payout' &&
        unitsHash[airbnb[i][6]].office === 'Waikiki'
      ) {
        revenue += parseFloat(airbnb[i][10]);
      }
    }
  }

  if (vrbo !== undefined && vrbo.length > 0) {
    for (let i = 0; i < vrbo.length; i++) {
      if (unitsHash[vrbo[i][6]].office === 'Waikiki') {
        revenue += parseFloat(vrbo[i][13]);
      }
    }
  }

  res.send(
    'Hawaii Revenue for GE: $' +
      revenue * 1.04712 +
      'Hawaii Revenue for TAT: $' +
      revenue
  );
});

acct.get('/separateResAdjs', async (req, res) => {
  unitsHash = await createUnitsHash();
  const jwt = new google.auth.JWT(
    credentials.service_account.client_email,
    null,
    credentials.service_account.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
  );

  const vrbo = await getVRBOData();
  const airbnb = await getAirbnbData();
  let adjustments = [];

  if (airbnb !== undefined && airbnb.length > 0) {
    for (let i = 0; i < airbnb.length; i++) {
      if (
        airbnb[i][1] !== 'Payout' &&
        airbnb[i][1] !== 'Reservation' &&
        airbnb[i][1] !== 'Pass Through Tot'
      ) {
        adjustments.push(airbnb[i]);
      }
    }
  }

  if (vrbo !== undefined && vrbo.length > 0) {
    for (let i = 0; i < vrbo.length; i++) {
      if (vrbo[i][6] === 'Refund' || parseFloat(vrbo[i][13]) < 0) {
        let row = [];
        row.push(vrbo[i][10]);
        row.push('HomeAway');
        row.push(vrbo[i][3]);
        row.push(vrbo[i][7]);
        row.push(vrbo[i][9]);
        row.push(vrbo[i][4] + ' ' + vrbo[i][5]);
        row.push('321.' + vrbo[i][0] + '.' + vrbo[i][1]);
        row.push('');
        row.push('');
        row.push(vrbo[i][16]);
        row.push(vrbo[i][13]);

        adjustments.push(row);
      }
    }
  }

  const request = {
    // The ID of the spreadsheet to retrieve data from.
    spreadsheetId: '1G9KgXCYGKI_fbo2w3iRJH5BQ_HsZRyjhbuLgkI4Yt-Y', // TODO: Update placeholder value.

    // The A1 notation of the values to retrieve.
    range: 'Res. Adj. Worksheet!A2:N', // TODO: Update placeholder value.
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      majorDimension: 'ROWS',
      range: 'Res. Adj. Worksheet!A2:N',
      values: adjustments,
    },
    auth: jwt,
    key: credentials.api_key,
  };

  const sheets = google.sheets('v4');
  const updateRes = await sheets.spreadsheets.values.update(request);
  res.send(updateRes);
});

acct.get('/bookingData', async (req, res) => {
  res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
  unitsHash = await createUnitsHash();
  const { XeroClient, Invoices } = require('xero-node');
  const { TokenSet } = require('openid-client');
  const xero = new XeroClient({
    clientId: client_id,
    clientSecret: client_secret,
    redirectUris: [redirectUrl],
    scopes: scopes.split(' '),
  });

  const airbnb = [];
  const airbnValues = await getAirbnbData();
  for (let i = 0; i < airbnValues.length; i++) {
    if (airbnValues[i][1] === 'Reservation') {
      airbnb.push(airbnValues[i]);
    }
  }
  let airbnbInvoices = [];
  try {
    airbnbInvoices = await parseInvoiceData(airbnb);
  } catch (err) {
    console.log(err);
    res.send({
      'ERROR: Airbnb unit name does not have match in MGMT database, update name is database':
        err,
    });
  }

  let vrbo = [];
  const vrboValues = await getVRBOData();
  for (let i = 0; i < vrboValues.length; i++) {
    if (vrboValues[i][6] !== 'Refund' && parseFloat(vrboValues[i][13]) >= 0) {
      vrbo.push(vrboValues[i]);
    }
  }

  let vrboInvoices = {};
  try {
    vrboInvoices = await parseInvoiceData(vrbo);
  } catch (err) {
    console.log(err);
    res.send({
      'ERROR: VRBO Property ID does not have match in MGMT database': err,
    });
  }
  const resAdjs = await getResAdjustments();
  let resAdjInvoices = parseResAdjData(resAdjs);
  await xero.initialize();
  await xero.setTokenSet(new TokenSet(req.session.tokenSet));

  const tokenSet = await xero.readTokenSet();

  if (!tokenSet.expired()) {

    const invoices = airbnbInvoices.concat(vrboInvoices).concat(resAdjInvoices);

    try {
      const newInvoices = new Invoices();
      newInvoices.invoices = invoices;
      const response = await xero.accountingApi.createInvoices(
        xeroTenantId,
        newInvoices,
        false,
        4
      );
      res.send(response);
      //res.send(newInvoices)
    } catch (err) {
      console.log(err);
      const invoiceIndex = undefined;
      if(err.response.body.Message !== undefined){
         invoiceIndex = err.response.body.Message.split('[')
          .pop()
          .split(']')[0];
      }
      let invoiceString = '';
      if (invoiceIndex !== undefined) {
        const invoice = invoices[invoiceIndex];
        invoiceString = '<p>' + JSON.stringify(invoice) + '</p>';
        console.log(invoice);
      }

      res.send(
        "<p>Sorry, something went wrong in uploadInvoices, try reconnecting by <a href='https://us-central1-ghotels-production.cloudfunctions.net/acct/connect'>clicking here</a></p> <p>Response from server: " +
          err.response.body.Message +
          '</p>' +
          invoiceString
      );
    }
  } else {
    res.send(
      "Access to xero has expired, reconnect by <a href='https://us-central1-ghotels-production.cloudfunctions.net/acct/connect'>clicking here</a>"
    );
  }
});

function getVRBOData() {
  return new Promise(function (resolve, reject) {
    const jwt = new google.auth.JWT(
      credentials.service_account.client_email,
      null,
      credentials.service_account.private_key,
      ['https://www.googleapis.com/auth/spreadsheets']
    );

    const request = {
      // The ID of the spreadsheet to retrieve data from.
      spreadsheetId: '1G9KgXCYGKI_fbo2w3iRJH5BQ_HsZRyjhbuLgkI4Yt-Y', // TODO: Update placeholder value.

      // The A1 notation of the values to retrieve.
      range: 'VRBO Data!A3:Q', // TODO: Update placeholder value.
      auth: jwt,
      key: credentials.api_key,
    };

    const sheets = google.sheets('v4');
    sheets.spreadsheets.values.get(request, (err, res) => {
      if (err) {
        console.log('Rejecting because of error');
        reject(err);
      } else {
        console.log('Request successful');
        let reservations = [];
        const vrboData = res.data.values;

        if (vrboData !== undefined && vrboData.length > 0) {
          for (let i = 0; i < vrboData.length; i++) {
            if (
              vrboData[i][6] !== 'Refund' &&
              parseFloat(vrboData[i][13]) >= 0
            ) {
              let row = [];
              row.push(vrboData[i][10]);
              row.push('HomeAway');
              row.push(vrboData[i][3]);
              row.push(vrboData[i][7]);
              row.push(vrboData[i][9]);
              row.push(vrboData[i][4] + ' ' + vrboData[i][5]);
              row.push('321.' + vrboData[i][0] + '.' + vrboData[i][1]);
              row.push('');
              row.push('');
              row.push('');
              row.push(vrboData[i][13]);
              row.push('');
              row.push(vrboData[i][12]);
              row.push(
                vrboData[i][6] !== 'Reserve'
                  ? 0
                  : unitsHash[row[6]].cleaning_fee
              );
              row.push('vrbo');

              reservations.push(row);
            }
          }
          resolve(reservations);
        }
        resolve([]);
      }
    });
  });
}

function getAirbnbData() {
  return new Promise(function (resolve, reject) {
    const jwt = new google.auth.JWT(
      credentials.service_account.client_email,
      null,
      credentials.service_account.private_key,
      ['https://www.googleapis.com/auth/spreadsheets']
    );

    const request = {
      // The ID of the spreadsheet to retrieve data from.
      spreadsheetId: '1G9KgXCYGKI_fbo2w3iRJH5BQ_HsZRyjhbuLgkI4Yt-Y', // TODO: Update placeholder value.

      // The A1 notation of the values to retrieve.
      range: 'Airbnb Data!A3:Q', // TODO: Update placeholder value.
      auth: jwt,
      key: credentials.api_key,
    };

    const sheets = google.sheets('v4');
    sheets.spreadsheets.values.get(request, (err, res) => {
      if (err) {
        console.log('Rejecting because of error');
        reject(err);
      }
      console.log('Request successful');
      if (res.data.values !== undefined) {
        resolve(res.data.values);
      }

      resolve([]);
    });
  });
}

function getResAdjustments() {
  return new Promise(function (resolve, reject) {
    const jwt = new google.auth.JWT(
      credentials.service_account.client_email,
      null,
      credentials.service_account.private_key,
      ['https://www.googleapis.com/auth/spreadsheets']
    );

    const request = {
      // The ID of the spreadsheet to retrieve data from.
      spreadsheetId: '1G9KgXCYGKI_fbo2w3iRJH5BQ_HsZRyjhbuLgkI4Yt-Y', // TODO: Update placeholder value.

      // The A1 notation of the values to retrieve.
      range: 'Res. Adj. Worksheet!A2:M', // TODO: Update placeholder value.
      auth: jwt,
      key: credentials.api_key,
    };

    const sheets = google.sheets('v4');
    sheets.spreadsheets.values.get(request, (err, res) => {
      if (err) {
        console.log('Rejecting because of error');
        reject(err);
      }
      console.log('Request successful');

      if (res.data.values === undefined) {
        resolve([]);
      }
      resolve(res.data.values);
    });
  });
}

function parseResAdjData(data) {
  let jsonXeroData = [];

  for (let i = 0; i < data.length; i++) {
    const unit = unitsHash[data[i][6]];
    if(data[i][1] === "Tax Withholding for US Income") {
      jsonXeroData[i] = {
        type: 'ACCPAY',
        contact: {
          name: unit.name + ' Guest',
        },

        invoiceNumber: 'TAX-' + data[i][2],
        reference: makePlatformReference(data[i], unit),
        url: 'https://stinsonbeachpm.com',
        currencyCode: 'USD',
        status: 'DRAFT', //AUTHORISED
        lineAmountTypes: 'NoTax',
        date: moment(data[i][3]).format('YYYY-MM-DD'),
        dueDate: moment(data[i][0]).add(5, 'days').format('YYYY-MM-DD'),
        lineItems: [
          {
            item: "Tax Withholding for US Income",
            description: data[i][7],
            quantity: 1,
            unitAmount: data[i][10] >= 0 ? data[i][10] : data[i][10].substring(1),
            accountCode: '6660',
            tracking: [
              {
                name: 'Property',
                option: unit.name,
              },
              {
                name: 'Channel',
                option: data[i][1] === 'HomeAway' ? 'HomeAway' : 'Airbnb',
              },
            ],
          },
        ],
      };
    } else {
      jsonXeroData[i] = {
        type: data[i][10] >= 0 ? 'ACCREC' : 'ACCPAY',
        contact: {
          name: unit.name + ' Guest',
        },

        invoiceNumber: 'ADJ-' + data[i][2],
        reference: makePlatformReference(data[i], unit),
        url: 'https://stinsonbeachpm.com',
        currencyCode: 'USD',
        status: 'DRAFT', //AUTHORISED
        lineAmountTypes: 'NoTax',
        date: moment(data[i][3]).format('YYYY-MM-DD'),
        dueDate: moment(data[i][0]).add(5, 'days').format('YYYY-MM-DD'),
        lineItems: [
          {
            item: data[i][10] >= 0 ? 'Other Guest Fee' : 'Refund to Guest',
            description: data[i][7],
            quantity: 1,
            unitAmount: data[i][10] >= 0 ? data[i][10] : data[i][10].substring(1),
            accountCode: data[i][10] >= 0 ? '4300' : '4740',
            tracking: [
              {
                name: 'Property',
                option: unit.name,
              },
              {
                name: 'Channel',
                option: data[i][1] === 'HomeAway' ? 'HomeAway' : 'Airbnb',
              },
            ],
          },
        ],
      };
    }
  }

  return jsonXeroData;
}

function parseInvoiceData(data) {
  return new Promise(function (resolve, reject) {
    let jsonXeroData = [];

    for (let i = 0; i < data.length; i++) {
      const unit = unitsHash[data[i][6]];
      if (unit === undefined) {
        console.log('Hash Parse Failed ' + i);
        console.log(data[i]);
        reject(data[i]);
      }

      jsonXeroData[i] = {
        type: 'ACCREC',
        contact: {
          name: unit.name + ' Guest',
        },

        invoiceNumber: 'INV-' + data[i][2],
        reference: makePlatformReference(data[i], unit),
        url: 'https://stinsonbeachpm.com',
        currencyCode: 'USD',
        status: 'DRAFT', //AUTHORISED
        lineAmountTypes: 'NoTax',
        date: moment(data[i][0]).format('YYYY-MM-DD'),
        dueDate: moment(data[i][0]).add(5, 'days').format('YYYY-MM-DD'),
        lineItems: [
          {
            item: 'Rent',
            description: 'Rent',
            quantity: data[i][4],
            unitAmount: calcNightlyRent(data[i], unit),
            accountCode: '4000',
            tracking: [
              {
                name: 'Property',
                option: unit.name,
              },
              {
                name: 'Channel',
                option: data[i][1] === 'HomeAway' ? 'HomeAway' : 'Airbnb',
              },
            ],
          },
          {
            item: 'Cleaning Fee',
            description: 'Cleaning Fee',
            quantity: 1,
            unitAmount: data[i][13],
            accountCode: '4100',
            tracking: [
              {
                name: 'Property',
                option: unit.name,
              },
              {
                name: 'Channel',
                option: data[i][1] === 'HomeAway' ? 'HomeAway' : 'Airbnb',
              },
            ],
          },
          {
            item: 'Channel Fee',
            description: 'Channel Fee',
            quantity: 1,
            unitAmount: '-' + data[i][12],
            accountCode: '5000',
            tracking: [
              {
                name: 'Property',
                option: unit.name,
              },
              {
                name: 'Channel',
                option: data[i][1] === 'HomeAway' ? 'HomeAway' : 'Airbnb',
              },
            ],
          },
        ],
      };
      //console.log(unit.remit_taxes);
      if (unit.remit_taxes) {
        
        const provider = (data[i][1] === 'HomeAway' ? 'homeaway' : 'airbnb')
        console.log(provider)
        for(id in unit.listings) {
          const listing = unit.listings[id]
          console.log(listing)
            if(listing.provider === provider  && (listing.remit_taxes === true || listing.remit_taxes === "TRUE")) {
              let tax = getTaxAmount(data[i], unit);
              jsonXeroData[i].lineItems.push({
                item: 'Tax Due',
                description:
                  'Tax Due: ' +
                  (tax > 0 ? unit.tax_rate : '0.00%') +
                  ' of $' +
                  getTaxableRev(data[i], unit),
                quantity: 1,
                unitAmount: tax,
                accountCode: '2200',
                tracking: [
                  {
                    name: 'Property',
                    option: unit.name,
                  },
                  {
                    name: 'Channel',
                    option: data[i][1] === 'HomeAway' ? 'HomeAway' : 'Airbnb',
                  },
                ],
              });
            }
          
        }
      }
    }

    resolve(jsonXeroData);
  });
}

function makePlatformReference(resData, unit) {
  let str = '';
  str += resData[1] === 'HomeAway' ? 'HomeAway ' : 'Airbnb ';
  str += resData[5] + '; ';
  str += resData[3] + ' - ' + unit.name + ' Guest; ';
  str += unit.cleaning_fee + '; ' + resData[2];

  return str;
}

function calcNightlyRent(resData, unit) {
  let amount = resData[10] === '' ? 0 : resData[10];
  let hostFee = resData[12] === '' ? 0 : resData[12];
  let cleaningFee = resData[13] === '' ? 0 : resData[13];

  if (resData[1] === 'HomeAway') {
    // console.log(resData[5])
    // console.log((parseFloat(amount) + parseFloat(hostFee) - parseFloat(cleaningFee) - getTaxAmount(resData, unit)))
    // console.log(resData[4])
    // console.log((parseFloat(amount) + parseFloat(hostFee) - parseFloat(cleaningFee) - getTaxAmount(resData, unit)) / parseFloat(resData[4]))
    // console.log("")
    return (
      (parseFloat(amount) +
        parseFloat(hostFee) -
        parseFloat(cleaningFee) -
        getTaxAmount(resData, unit)) /
      parseFloat(resData[4])
    );
  }
  //let test = (parseFloat(amount) + parseFloat(hostFee) - parseFloat(cleaningFee)) / parseFloat(resData[4])
  return (
    (parseFloat(amount) + parseFloat(hostFee) - parseFloat(cleaningFee)) /
    parseFloat(resData[4])
  );
}

function getTaxableRev(resData, unit) {
  let amount = resData[10] === '' ? 0 : resData[10];
  let hostFee = resData[12] === '' ? 0 : resData[12];
  let gross = parseFloat(amount) + parseFloat(hostFee);
  let percent = 1 + parseFloat(unit.tax_rate);
  let tax = gross - gross / percent;
  let answer = 0;
  if (resData[1] !== 'HomeAway') {
    answer = parseFloat(amount) + parseFloat(hostFee);
  } else {
    answer =
      Math.round(
        ((parseFloat(amount) + parseFloat(hostFee)) /
          (1 + parseFloat(unit.tax_rate))) *
          100
      ) / 100;
  }

  let check = gross - answer;

  return answer;
}

function getTaxAmount(resData, unit) {
  //  Logger.log("getTaxAmount")
  //  Logger.log(unit.tax_rate)
  //  Logger.log(getTaxableRev(resData, unit))
  //  Logger.log(Math.floor(parseInt(unit.tax_rate))/100)
  return (
    getTaxableRev(resData, unit) *
    (unit.remit_taxes === true ? parseFloat(unit.tax_rate) : 0)
  );
}

function createUnitsHash() {
  return new Promise(function (resolve, reject) {
    db.collection('units')
      .get()
      .then((snapshot, err) => {
        if (err) {
          reject(err);
        }
        let data = [];
        const docs = snapshot.docs;
        for (let i = 0; i < docs.length; i++) {
          let docData = docs[i].data();

          for (const listingId in docData.listings) {
            const listing = docData.listings[listingId];
            if (listing.provider === 'airbnb') {
              data[listing.public_name] = docData;
            } else {
              data[listing.id] = docData;
            }
          }
        }

        resolve(data);
      });
  });
}

acct.get('/uploadMgmtInvoices', async (req, res) => {
  res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
  const { XeroClient, Invoices } = require('xero-node');
  const { TokenSet } = require('openid-client');
  const xero = new XeroClient({
    clientId: client_id,
    clientSecret: client_secret,
    redirectUris: [redirectUrl],
    scopes: scopes.split(' '),
  });
  console.log(req.session.tokenSet);

  await xero.initialize();
  await xero.setTokenSet(new TokenSet(req.session.tokenSet));

  const tokenSet = await xero.readTokenSet();

  if (!tokenSet.expired()) {
    try {
      const rawXeroData = await getXeroInvoiceData();
      const invoices = parseXeroData(rawXeroData);

      const newInvoices = new Invoices();
      newInvoices.invoices = invoices;

      const response = await xero.accountingApi.createInvoices(
        '15a0a407-e2d1-48e3-9255-f8d61cef5c93',
        newInvoices,
        false,
        4
      );
      res.send(response);
    } catch (err) {
      console.log(err);
      res.send(
        "Sorry, something went wrong in uploadInvoices, try reconnecting by <a href='https://us-central1-ghotels-production.cloudfunctions.net/acct/connect'>clicking here</a>"
      );
    }
  } else {
    res.send(
      "Access to xero has expired, reconnect by <a href='https://us-central1-ghotels-production.cloudfunctions.net/acct/connect'>clicking here</a>"
    );
  }
});

// Uploads invoices for reservations booked with units directly operated by Stinson Beach PM
acct.get('/uploadCompanyInvoices', async (req, res) => {
  res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
  const { XeroClient, Invoices } = require('xero-node');
  const { TokenSet } = require('openid-client');
  const xero = new XeroClient({
    clientId: client_id,
    clientSecret: client_secret,
    redirectUris: [redirectUrl],
    scopes: scopes.split(' '),
  });

  await xero.initialize();
  await xero.setTokenSet(new TokenSet(req.session.tokenSet));

  const tokenSet = await xero.readTokenSet();

  if (!tokenSet.expired()) {
    try {
      const rawXeroData = await getXeroInvoiceData();
      const invoices = parseXeroData(rawXeroData);

      const newInvoices = new Invoices();
      newInvoices.invoices = invoices;

      const response = await xero.accountingApi.createInvoices(
        xeroTenantId,
        newInvoices,
        false,
        4
      );
      res.send(response);
    } catch (err) {
      console.log(err);
      res.send(err);
      // res.send(
      //   "Sorry, something went wrong in uploadInvoices, try reconnecting by <a href='https://us-central1-ghotels-production.cloudfunctions.net/acct/connect'>clicking here</a>"
      // );
    }
  } else {
    res.send(
      "Access to xero has expired, reconnect by <a href='https://us-central1-ghotels-production.cloudfunctions.net/acct/connect'>clicking here</a>"
    );
  }
});

acct.get('/uploadAmazonBills', async (req, res) => {
  res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
  const { XeroClient, Invoices } = require('xero-node');
  const { TokenSet } = require('openid-client');
  const xero = new XeroClient({
    clientId: client_id,
    clientSecret: client_secret,
    redirectUris: [redirectUrl],
    scopes: scopes.split(' '),
  });

  await xero.initialize();
  await xero.setTokenSet(new TokenSet(req.session.tokenSet));

  const tokenSet = await xero.readTokenSet();

  if (!tokenSet.expired()) {
    try {
      const rawXeroData = await getXeroAmazonData();

      const invoices = parseAmazonBills(rawXeroData);

      const newInvoices = new Invoices();
      newInvoices.invoices = invoices;

      const inviocesRes = await xero.accountingApi.createInvoices(
        xeroTenantId,
        newInvoices,
        false,
        4
      );
      const xeroInvioces = inviocesRes.response.body.Invoices;
      console.log('invoice length');
      console.log(invoices.length);

      for (let i = 0; i < xeroInvioces.length; i++) {
        const invoiceId = xeroInvioces[i].InvoiceID;
        const lineItems = xeroInvioces[i].LineItems;

        for (let j = 0; j < lineItems.length; j++) {
          const unitName = lineItems[j].Tracking[0].Option;

          const snapshot = await db
            .collection('owners')
            .where('units.' + unitName + '.name', '==', unitName)
            .where('partnership', '==', true)
            .get();

          if (!snapshot.empty) {
            let data = [];
            snapshot.forEach((doc) => {
              data.push(doc.data());
            });
            const linkedRes = await xero.accountingApi.createLinkedTransaction(
              xeroTenantId,
              {
                sourceTransactionID: invoiceId,
                sourceLineItemID: lineItems[j].LineItemID,
                contactID: data[0].units[unitName].xero_id,
              }
            );
            //console.log("linkedRes", linkedRes.response.statusCode);
          }
        }
      }

      res.send(xeroInvioces);
    } catch (err) {
      console.log(err);
      res.send(err);
      // res.send(
      //   "Sorry, something went wrong in uploadInvoices, try reconnecting by <a href='https://us-central1-ghotels-production.cloudfunctions.net/acct/connect'>clicking here</a>"
      // );
    }
  } else {
    res.send(
      "Access to xero has expired, reconnect by <a href='https://us-central1-ghotels-production.cloudfunctions.net/acct/connect'>clicking here</a>"
    );
  }
});

function getXeroInvoiceData() {
  return new Promise(function (resolve, reject) {
    const jwt = new google.auth.JWT(
      credentials.service_account.client_email,
      null,
      credentials.service_account.private_key,
      ['https://www.googleapis.com/auth/spreadsheets']
    );

    const request = {
      // The ID of the spreadsheet to retrieve data from.
      spreadsheetId: '1G9KgXCYGKI_fbo2w3iRJH5BQ_HsZRyjhbuLgkI4Yt-Y', // TODO: Update placeholder value.

      // The A1 notation of the values to retrieve.
      range: 'Xero Export!A2:AA', // TODO: Update placeholder value.
      auth: jwt,
      key: credentials.api_key,
    };

    const sheets = google.sheets('v4');
    sheets.spreadsheets.values.get(request, (err, res) => {
      if (err) {
        console.log('Rejecting because of error');
        reject(err);
      } else {
        console.log('Request successful');
        resolve(res.data.values);
      }
    });
  });
}

function parseXeroData(data) {
  let checkExists = {};
  let jsonXeroData = [];
  for (let i = 0; i < data.length; i++) {
    if (checkExists[data[i][10]] === undefined) {
      checkExists[data[i][10]] = i;
      jsonXeroData[i] = {
        type: data[i][17] >= 0 ? 'ACCREC' : 'ACCPAY',
        contact: {
          name: data[i][0],
        },

        invoiceNumber: data[i][10],
        reference: data[i][11],
        url: 'https://stinsonbeachpm.com',
        currencyCode: 'USD',
        status: 'DRAFT', //AUTHORISED
        lineAmountTypes: 'NoTax',
        date: moment(data[i][12]).format('YYYY-MM-DD'),
        dueDate: moment(data[i][13]).format('YYYY-MM-DD'),
        lineItems: [
          {
            item: data[i][14],
            description: data[i][15],
            quantity: data[i][16],
            unitAmount:
              data[i][17] >= 0 ? data[i][17] : data[i][17].substring(1),
            accountCode: data[i][19],
            tracking: [
              {
                name: data[i][21],
                option: data[i][22],
              },
              {
                name: data[i][23],
                option: data[i][24],
              },
            ],
          },
        ],
      };
    } else {
      jsonXeroData[checkExists[data[i][10]]].lineItems.push({
        item: data[i][14],
        description: data[i][15],
        quantity: data[i][16],
        unitAmount: data[i][17],
        accountCode: data[i][19],
        tracking: [
          {
            name: data[i][21],
            option: data[i][22],
          },
          {
            name: data[i][23],
            option: data[i][24],
          },
        ],
      });
    }
  }

  return jsonXeroData;
}

function getXeroAmazonData() {
  return new Promise(function (resolve, reject) {
    const jwt = new google.auth.JWT(
      credentials.service_account.client_email,
      null,
      credentials.service_account.private_key,
      ['https://www.googleapis.com/auth/spreadsheets']
    );

    const request = {
      // The ID of the spreadsheet to retrieve data from.
      spreadsheetId: '1G9KgXCYGKI_fbo2w3iRJH5BQ_HsZRyjhbuLgkI4Yt-Y', // TODO: Update placeholder value.

      // The A1 notation of the values to retrieve.
      range: 'Amazon Data!A2:AA', // TODO: Update placeholder value.
      auth: jwt,
      key: credentials.api_key,
    };

    const sheets = google.sheets('v4');
    sheets.spreadsheets.values.get(request, (err, res) => {
      if (err) {
        console.log('Rejecting because of error');
        reject(err);
      } else {
        console.log('Request successful');
        resolve(res.data.values);
      }
    });
  });
}

function parseAmazonBills(data) {
  let checkExists = {};
  let jsonXeroData = [];
  for (let i = 0; i < data.length; i++) {
    if (
      data[i][10] !== '6782' &&
      data[i][10] !== '1252' &&
      data[i][6] !== 'Cancelled'
    ) {
      data[i][7] = 'AMZN-' + data[i][7].substring(0, 8);
      data[i][11] = getAmazonAccountCode(data[i][17], data[i][11]);
      if (checkExists[data[i][7]] === undefined) {
        checkExists[data[i][7]] = i;
        jsonXeroData[i] = {
          type: 'ACCPAY',
          contact: {
            name: 'Amazon',
          },

          invoiceNumber: data[i][7],
          reference: 'PO-' + data[i][2] + ' ' + data[i][17],
          url: 'https://stinsonbeachpm.com',
          currencyCode: 'USD',
          status: 'DRAFT', //AUTHORISED
          lineAmountTypes: 'NoTax',
          date: moment(data[i][0]).format('YYYY-MM-DD'),
          dueDate: moment(data[i][0]).add(15, 'days').format('YYYY-MM-DD'),
          lineItems: [
            {
              //item: data[i][14],
              description: data[i][12],
              quantity: data[i][14],
              unitAmount: parseFloat(data[i][16]) / parseInt(data[i][14]),
              accountCode: data[i][11],
              tracking: [
                {
                  name: 'Property',
                  option: data[i][18],
                },
                {
                  name: 'Channel',
                  option: data[i][19],
                },
              ],
            },
          ],
        };
      } else {
        jsonXeroData[checkExists[data[i][7]]].lineItems.push({
          // item: data[i][14],
          description: data[i][12],
          quantity: data[i][14],
          unitAmount: parseFloat(data[i][16]) / parseInt(data[i][14]),
          accountCode: data[i][11],
          tracking: [
            {
              name: 'Property',
              option: data[i][18],
            },
            {
              name: 'Channel',
              option: data[i][19],
            },
          ],
        });
      }
    }
  }

  return jsonXeroData;
}
function getAmazonAccountCode(property, unspsc) {
  if (
    property === '11 Sierra' ||
    property === 'Mouse Hole' ||
    property === 'Casita Azul'
  ) {
    return '5556';
  }
  return segmentCodes[unspsc.substring(0, 2)];
}

exports.acct = functions.https.onRequest(acct);
