const functions = require("firebase-functions");
const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const moment = require("moment-timezone");
const format = express();
const cors = require("cors");
const { credentials } = require("./development_credentials");
const { google } = require("googleapis");
const session = require("express-session");
const FirestoreStore = require("firestore-store")(session);
const segmentCodes = require("./segmentCodes");

const { db } = require("./admin");
let unitsHash = {};

format.use(bodyParser.json());
format.use(bodyParser.urlencoded({ extended: false }));
format.use(cors({ origin: true }));

const client_id = credentials.xero_client_id;
const client_secret = credentials.xero_client_secret;
// const redirectUrl = credentials.xero_redirect_uri;
//uncomment for local testing.
const redirectUrl =
  "http://localhost:5000/stinsonbeachpm/us-central1/format/callback";
const xeroTenantId = credentials.xero_tennat_id;
const scopes =
  "openid profile email accounting.contacts.read accounting.settings accounting.transactions offline_access";

const authenticationData = (req, res) => {
  return {
    decodedIdToken: req.session.decodedIdToken,
    decodedAccessToken: req.session.decodedAccessToken,
    tokenSet: req.session.tokenSet,
    allTenants: req.session.allTenants,
    activeTenant: req.session.activeTenant,
  };
};

format.use(
  session({
    store: new FirestoreStore({
      database: db,
    }),

    name: "__session", // ← required for Cloud Functions / Cloud Run
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
  })
);

format.get("/connect", async (req, res) => {
  res.set("Cache-Control", "public, max-age=300, s-maxage=600");
  const { XeroClient } = require("xero-node");

  const xero = new XeroClient({
    clientId: client_id,
    clientSecret: client_secret,
    redirectUris: [redirectUrl],
    scopes: scopes.split(" "),
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
    res.send("Sorry, something went wrong in connect");
  }
});

format.get("/callback", async (req, res) => {
  const jwtDecode = require("jwt-decode");
  const { XeroClient, BankTransaction } = require("xero-node");
  const xero = new XeroClient({
    clientId: client_id,
    clientSecret: client_secret,
    redirectUris: [redirectUrl],
    scopes: scopes.split(" "),
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
    res.send("Connected to Xero!");
  } catch (err) {
    console.log(err);
    res.send("Sorry, something went wrong in callback");
  }
});

format.get("/seperateResAdjs", async (req, res) => {
  unitsHash = await createUnitsHash();
  const jwt = new google.auth.JWT(
    credentials.service_account.client_email,
    null,
    credentials.service_account.private_key,
    ["https://www.googleapis.com/auth/spreadsheets"]
  );

  const vrbo = await getVRBOData();
  const airbnb = await getAirbnbData();
  let adjustments = [];

  if (airbnb !== undefined && airbnb.length > 0) {
    for (let i = 0; i < airbnb.length; i++) {
      if (
        airbnb[i][1] !== "Payout" &&
        airbnb[i][1] !== "Reservation" &&
        airbnb[i][1] !== "Pass Through Tot"
      ) {
        adjustments.push(airbnb[i]);
      }
    }
  }

  if (vrbo !== undefined && vrbo.length > 0) {
    for (let i = 0; i < vrbo.length; i++) {
      if (vrbo[i][6] == "Refund" || parseFloat(vrbo[i][13]) < 0) {
        let row = [];
        row.push(vrbo[i][10]);
        row.push("HomeAway");
        row.push(vrbo[i][3]);
        row.push(vrbo[i][7]);
        row.push(vrbo[i][9]);
        row.push(vrbo[i][4] + " " + vrbo[i][5]);
        row.push("321." + vrbo[i][0] + "." + vrbo[i][1]);
        row.push("");
        row.push("");
        row.push(vrbo[i][16]);
        row.push(vrbo[i][13]);

        adjustments.push(row);
      }
    }
  }

  const request = {
    // The ID of the spreadsheet to retrieve data from.
    spreadsheetId: "1G9KgXCYGKI_fbo2w3iRJH5BQ_HsZRyjhbuLgkI4Yt-Y", // TODO: Update placeholder value.

    // The A1 notation of the values to retrieve.
    range: "Res. Adj. Worksheet!A2:M", // TODO: Update placeholder value.
    valueInputOption: "USER_ENTERED",
    requestBody: {
      majorDimension: "ROWS",
      range: "Res. Adj. Worksheet!A2:M",
      values: adjustments,
    },
    auth: jwt,
    key: credentials.api_key,
  };

  const sheets = google.sheets("v4");
  const updateRes = await sheets.spreadsheets.values.update(request);
  res.send(updateRes);
});

format.get("/bookingData", async (req, res) => {
  res.set("Cache-Control", "public, max-age=300, s-maxage=600");
  unitsHash = await createUnitsHash();
  const { XeroClient, Invoices } = require("xero-node");
  const { TokenSet } = require("openid-client");
  const xero = new XeroClient({
    clientId: client_id,
    clientSecret: client_secret,
    redirectUris: [redirectUrl],
    scopes: scopes.split(" "),
  });

  const airbnb = [];
  const airbnValues = await getAirbnbData();
  for (let i = 0; i < airbnValues.length; i++) {
    if (airbnValues[i][1] === "Reservation") {
      airbnb.push(airbnValues[i]);
    }
  }
  let airbnbInvoices = parseInvoiceData(airbnb);

  let vrbo = [];
  const vrboValues = await getVRBOData();
  for (let i = 0; i < vrboValues.length; i++) {
    if (vrboValues[i][6] !== "Refund" && parseFloat(vrboValues[i][13]) >= 0) {
      vrbo.push(vrboValues[i]);
    }
  }
  let vrboInvoices = parseInvoiceData(vrbo);

  const resAdjs = await getResAdjustments();
  let resAdjInvoices = parseResAdjData(resAdjs);
  await xero.initialize();
  await xero.setTokenSet(new TokenSet(req.session.tokenSet));

  const tokenSet = await xero.readTokenSet();

  if (!tokenSet.expired()) {
    try {
      const invoices = airbnbInvoices
        .concat(vrboInvoices)
        .concat(resAdjInvoices);

      const newInvoices = new Invoices();
      newInvoices.invoices = invoices;

      const response = await xero.accountingApi.createInvoices(
        "15a0a407-e2d1-48e3-9255-f8d61cef5c93",
        newInvoices,
        false,
        4
      );
      res.send(response);
    } catch (err) {
      console.log(err);
      res.send(
        "Sorry, something went wrong in uploadInvoices, try reconnecting by <a href='https://us-central1-stinsonbeachpm.cloudfunctions.net/format/connect'>clicking here</a>"
      );
    }
  } else {
    res.send(
      "Access to xero has expired, reconnect by <a href='https://us-central1-stinsonbeachpm.cloudfunctions.net/format/connect'>clicking here</a>"
    );
  }
});

function getVRBOData() {
  return new Promise(function (resolve, reject) {
    const jwt = new google.auth.JWT(
      credentials.service_account.client_email,
      null,
      credentials.service_account.private_key,
      ["https://www.googleapis.com/auth/spreadsheets"]
    );

    const request = {
      // The ID of the spreadsheet to retrieve data from.
      spreadsheetId: "1G9KgXCYGKI_fbo2w3iRJH5BQ_HsZRyjhbuLgkI4Yt-Y", // TODO: Update placeholder value.

      // The A1 notation of the values to retrieve.
      range: "VRBO Data!A3:Q", // TODO: Update placeholder value.
      auth: jwt,
      key: credentials.api_key,
    };

    const sheets = google.sheets("v4");
    sheets.spreadsheets.values.get(request, (err, res) => {
      if (err) {
        console.log("Rejecting because of error");
        reject(err);
      } else {
        console.log("Request successful");
        let reservations = [];
        const vrboData = res.data.values;

        if (vrboData !== undefined && vrboData.length > 0) {
          for (let i = 0; i < vrboData.length; i++) {
            if (
              vrboData[i][6] != "Refund" &&
              parseFloat(vrboData[i][13]) >= 0
            ) {
              let row = [];
              row.push(vrboData[i][10]);
              row.push("HomeAway");
              row.push(vrboData[i][3]);
              row.push(vrboData[i][7]);
              row.push(vrboData[i][9]);
              row.push(vrboData[i][4] + " " + vrboData[i][5]);
              row.push("321." + vrboData[i][0] + "." + vrboData[i][1]);
              row.push("");
              row.push("");
              row.push("");
              row.push(vrboData[i][13]);
              row.push("");
              row.push(vrboData[i][12]);
              row.push(
                vrboData[i][6] != "Reserve" ? 0 : unitsHash[row[6]].cleaning_fee
              );
              row.push("vrbo");

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
      ["https://www.googleapis.com/auth/spreadsheets"]
    );

    const request = {
      // The ID of the spreadsheet to retrieve data from.
      spreadsheetId: "1G9KgXCYGKI_fbo2w3iRJH5BQ_HsZRyjhbuLgkI4Yt-Y", // TODO: Update placeholder value.

      // The A1 notation of the values to retrieve.
      range: "Airbnb Data!A3:Q", // TODO: Update placeholder value.
      auth: jwt,
      key: credentials.api_key,
    };

    const sheets = google.sheets("v4");
    sheets.spreadsheets.values.get(request, (err, res) => {
      if (err) {
        console.log("Rejecting because of error");
        reject(err);
      }
      console.log("Request successful");
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
      ["https://www.googleapis.com/auth/spreadsheets"]
    );

    const request = {
      // The ID of the spreadsheet to retrieve data from.
      spreadsheetId: "1G9KgXCYGKI_fbo2w3iRJH5BQ_HsZRyjhbuLgkI4Yt-Y", // TODO: Update placeholder value.

      // The A1 notation of the values to retrieve.
      range: "Res. Adj. Worksheet!A2:M", // TODO: Update placeholder value.
      auth: jwt,
      key: credentials.api_key,
    };

    const sheets = google.sheets("v4");
    sheets.spreadsheets.values.get(request, (err, res) => {
      if (err) {
        console.log("Rejecting because of error");
        reject(err);
      }
      console.log("Request successful");

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

    jsonXeroData[i] = {
      type: data[i][10] >= 0 ? "ACCREC" : "ACCPAY",
      contact: {
        name: unit.name + " Guest",
      },

      invoiceNumber: "ADJ-" + data[i][2],
      reference: makePlatformReference(data[i], unit),
      url: "https://stinsonbeachpm.com",
      currencyCode: "USD",
      status: "DRAFT", //AUTHORISED
      lineAmountTypes: "NoTax",
      date: moment(data[i][3]).format("YYYY-MM-DD"),
      dueDate: moment(data[i][0]).add(5, "days").format("YYYY-MM-DD"),
      lineItems: [
        {
          item: data[i][10] >= 0 ? "Other Guest Fee" : "Refund to Guest",
          description: data[i][7],
          quantity: 1,
          unitAmount: data[i][10],
          accountCode: data[i][10] >= 0 ? "4300" : "4740",
          tracking: [
            {
              name: "Property",
              option: unit.name,
            },
            {
              name: "Channel",
              option: data[i][1] == "HomeAway" ? "HomeAway" : "Airbnb",
            },
          ],
        },
      ],
    };
  }

  return jsonXeroData;
}

function parseInvoiceData(data) {
  let jsonXeroData = [];

  for (let i = 0; i < data.length; i++) {
    const unit = unitsHash[data[i][6]];

    jsonXeroData[i] = {
      type: "ACCREC",
      contact: {
        name: unit.name + " Guest",
      },

      invoiceNumber: "INV-" + data[i][2],
      reference: makePlatformReference(data[i], unit),
      url: "https://stinsonbeachpm.com",
      currencyCode: "USD",
      status: "DRAFT", //AUTHORISED
      lineAmountTypes: "NoTax",
      date: moment(data[i][0]).format("YYYY-MM-DD"),
      dueDate: moment(data[i][0]).add(5, "days").format("YYYY-MM-DD"),
      lineItems: [
        {
          item: "Rent",
          description: "Rent",
          quantity: data[i][5],
          unitAmount: calcNightlyRent(data[i], unit),
          accountCode: "4000",
          tracking: [
            {
              name: "Property",
              option: unit.name,
            },
            {
              name: "Channel",
              option: data[i][1] == "HomeAway" ? "HomeAway" : "Airbnb",
            },
          ],
        },
        {
          item: "Cleaning Fee",
          description: "Cleaning Fee",
          quantity: 1,
          unitAmount: data[i][13],
          accountCode: "4100",
          tracking: [
            {
              name: "Property",
              option: unit.name,
            },
            {
              name: "Channel",
              option: data[i][1] == "HomeAway" ? "HomeAway" : "Airbnb",
            },
          ],
        },
        {
          item: "Channel Fee",
          description: "Channel Fee",
          quantity: 1,
          unitAmount: "-" + data[i][12],
          accountCode: "5000",
          tracking: [
            {
              name: "Property",
              option: unit.name,
            },
            {
              name: "Channel",
              option: data[i][1] == "HomeAway" ? "HomeAway" : "Airbnb",
            },
          ],
        },
      ],
    };
    if (unit.remit_taxes) {
      let tax = getTaxAmount(data[i], unitData);
      jsonXeroData[i].lineItems.push({
        item: "Tax Due",
        description:
          "Tax Due: " +
          (tax > 0 ? unit.tax_rate : "0.00%") +
          " of $" +
          getTaxableRev(data[i], unit),
        quantity: 1,
        unitAmount: tax,
        accountCode: "2200",
        tracking: [
          {
            name: "Property",
            option: unit.name,
          },
          {
            name: "Channel",
            option: data[i][1] == "HomeAway" ? "HomeAway" : "Airbnb",
          },
        ],
      });
    }
  }

  return jsonXeroData;
}

function makePlatformReference(resData, unit) {
  let str = "";
  str += resData[1] == "HomeAway" ? "HomeAway " : "Airbnb ";
  str += resData[5] + "; ";
  str += resData[3] + " - " + unit.name + " Guest; ";
  str += unit.cleaning_fee + "; " + resData[2];

  return str;
}

function calcNightlyRent(resData, unit) {
  let amount = resData[10] == "" ? 0 : resData[10];
  let hostFee = resData[12] == "" ? 0 : resData[12];
  let cleaningFee = resData[13] == "" ? 0 : resData[13];

  if (resData[1] == "HomeAway") {
    // console.log(resData[5])
    // console.log((parseFloat(amount) + parseFloat(hostFee) - parseFloat(cleaningFee) - getTaxAmount(resData, unitData)))
    // console.log(resData[4])
    // console.log((parseFloat(amount) + parseFloat(hostFee) - parseFloat(cleaningFee) - getTaxAmount(resData, unitData)) / parseFloat(resData[4]))
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
  let amount = resData[10] == "" ? 0 : resData[10];
  let hostFee = resData[12] == "" ? 0 : resData[12];
  let gross = parseFloat(amount) + parseFloat(hostFee);
  let percent = 1 + parseFloat(unit.tax_rate);
  let tax = gross - gross / percent;
  let answer = 0;
  if (resData[1] !== "HomeAway") {
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
    (unit.remit_taxes == "YES" ? parseFloat(unit.tax_rate) : 0)
  );
}

function createUnitsHash() {
  return new Promise(function (resolve, reject) {
    db.collection("units")
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
            if (listing.provider === "airbnb") {
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

exports.format = functions.https.onRequest(format);
