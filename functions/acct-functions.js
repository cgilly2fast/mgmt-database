const functions = require("firebase-functions");
const moment = require("moment-timezone");
const { credentials } = require("./development_credentials");
const { google } = require("googleapis");
const segmentCodes = require("./segmentCodes");
const { db } = require("./admin");

const LOCAL = true;
let unitsHash = {};

const client_id = credentials.xero_client_id;
const client_secret = credentials.xero_client_secret;
const redirectUrl = LOCAL
  ? "http://localhost:5001/ghotels-development/us-central1/callback"
  : credentials.xero_redirect_uri;

const xeroTenantId = credentials.xero_tennat_id;
const scopes =
  "openid profile email accounting.contacts.read accounting.settings accounting.transactions offline_access";

  

exports.getAllXeroContacts  = functions.https.onRequest(async (req, res) => {
  
    const { XeroClient, Invoices } = require("xero-node");
    const { TokenSet } = require("openid-client");
    const xero = new XeroClient({
      clientId: client_id,
      clientSecret: client_secret,
      redirectUris: [redirectUrl],
      scopes: scopes.split(" "),
    });
  
    await xero.initialize();
    
    const sessionSnapshot = await db.collection("sessions").where("type","==", "xero").orderBy("created", "desc").limit(1).get()
    await xero.setTokenSet(new TokenSet(sessionSnapshot.docs[0].data().tokenSet));
    let tokenSet = await xero.readTokenSet();
  
    if (tokenSet.expired()) {
      const validTokenSet = await xero.refreshToken();
      await saveXeroToken(validTokenSet)
      tokenSet = validTokenSet
    } 
    try {
  
        // const teammateSnapshot = await db.collection('team').where("uuid", "==", req.query.teammate_id).get()
  
        // if (teammateSnapshot.empty) {
        //   res.send('No teammate for id');
        //   return;
        // }  
        // const teammate = teammateSnapshot.docs[0].data()
        // const teammateName = teammate.first_name + " " + teammate.last_name
  
        // const spreadsheetId = new RegExp("/spreadsheets/d/([a-zA-Z0-9-_]+)").exec(teammate.hours_sheet)[1]
        // const rawHours = await getUnpaidHoursSheetData(spreadsheetId)
        // const invoices = parseHoursBills(teammateName, rawHours, teammate.rate);
       // const invoices = parseHoursBills(teammateName, req.body.cleanings, ownerUnitsMap);
  
        // const newInvoices = new Invoices();
        // newInvoices.invoices = invoices;
  
        //const contactsRes = await xero.accountingApi.getContacts(xeroTenantId)
        const contactsRes = await xero.accountingApi.getLinkedTransactions(xeroTenantId)
        res.send(contactsRes);
        //res.send(invoices)
        
      } catch (err) {
        console.log(err);
        res.send(err);
      
      }
});

exports.connect = functions.https.onRequest(async (req, res) => {
  res.set("Cache-Control", "public, max-age=300, s-maxage=600");
  const { XeroClient } = require("xero-node");
  console.log(redirectUrl)
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

exports.callback  = functions.https.onRequest(async (req, res) => {
  
  const jwtDecode = require("jwt-decode");
  const { XeroClient } = require("xero-node");
  const xero = new XeroClient({
    clientId: client_id,
    clientSecret: client_secret,
    redirectUris: [redirectUrl],
    scopes: scopes.split(" "),
  });
  await xero.initialize();
  try {
    const tokenSet = await xero.apiCallback(req.url);
    await xero.updateTenants();

    const decodedIdToken = jwtDecode(tokenSet.id_token);
    const decodedAccessToken = jwtDecode(tokenSet.access_token);

    const xeroSession = {
      type: "xero",
      created: Date.now(),
      decodedIdToken: decodedIdToken,
      decodedAccessToken: decodedAccessToken,
      tokenSet: JSON.parse(JSON.stringify(tokenSet)),
      //allTenants: JSON.parse(JSON.stringify(xero.tenants)),
      // // XeroClient is sorting tenants behind the scenes so that most recent / active connection is at index 0
      // activeTenant: JSON.parse(JSON.stringify(xero.tenants[0]))
    }

    await db.collection("sessions").add(xeroSession)
    
    res.send(xeroSession);
  } catch (err) {
    console.log(err);
    res.send("Sorry, something went wrong in callback");
  }
});

exports.uploadAmazonBills  = functions.https.onRequest(async (req, res) => {
  res.set("Cache-Control", "public, max-age=300, s-maxage=600");
  const { XeroClient, Invoices } = require("xero-node");
  const { TokenSet } = require("openid-client");
  const xero = new XeroClient({
    clientId: client_id,
    clientSecret: client_secret,
    redirectUris: [redirectUrl],
    scopes: scopes.split(" "),
  });

  await xero.initialize();
  
  const sessionSnapshot = await db.collection("sessions").where("type","==", "xero").orderBy("created", "desc").limit(1).get()
  await xero.setTokenSet(new TokenSet(sessionSnapshot.docs[0].data().tokenSet));
  let tokenSet = await xero.readTokenSet();

  if (tokenSet.expired()) {
    const validTokenSet = await xero.refreshToken();
    await saveXeroToken(validTokenSet)
    tokenSet = validTokenSet
  } 
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
      console.log("invoice length");
      console.log(invoices.length);

      for (let i = 0; i < xeroInvioces.length; i++) {
        const invoiceId = xeroInvioces[i].InvoiceID;
        const lineItems = xeroInvioces[i].LineItems;

        for (let j = 0; j < lineItems.length; j++) {
          const unitName = lineItems[j].Tracking[0].Option;

          const snapshot = await db
            .collection("owners")
            .where("units." + unitName + ".name", "==", unitName)
            .where("partnership", "==", true)
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
  
});

function getXeroInvoiceData() {
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
      range: "Xero Export!A2:AA", // TODO: Update placeholder value.
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
        type: data[i][17] >= 0 ? "ACCREC" : "ACCPAY",
        contact: {
          name: data[i][0],
        },

        invoiceNumber: data[i][10],
        reference: data[i][11],
        url: "https://stinsonbeachpm.com",
        currencyCode: "USD",
        status: "DRAFT", //AUTHORISED
        lineAmountTypes: "NoTax",
        date: moment(data[i][12]).format("YYYY-MM-DD"),
        dueDate: moment(data[i][13]).format("YYYY-MM-DD"),
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
      ["https://www.googleapis.com/auth/spreadsheets"]
    );

    const request = {
      // The ID of the spreadsheet to retrieve data from.
      spreadsheetId: "1G9KgXCYGKI_fbo2w3iRJH5BQ_HsZRyjhbuLgkI4Yt-Y", // TODO: Update placeholder value.

      // The A1 notation of the values to retrieve.
      range: "Amazon Data!A2:AA", // TODO: Update placeholder value.
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
      data[i][10] !== "6782" &&
      data[i][10] !== "1252" &&
      data[i][6] !== "Cancelled"
    ) {
      data[i][7] = "AMZN-" + data[i][7].substring(0, 8);
      data[i][11] = getAmazonAccountCode(data[i][17], data[i][11]);
      if (checkExists[data[i][7]] === undefined) {
        checkExists[data[i][7]] = i;
        jsonXeroData[i] = {
          type: "ACCPAY",
          contact: {
            name: "Amazon",
          },

          invoiceNumber: data[i][7],
          reference: "PO-" + data[i][2] + " " + data[i][17],
          url: "https://stinsonbeachpm.com",
          currencyCode: "USD",
          status: "DRAFT", //AUTHORISED
          lineAmountTypes: "NoTax",
          date: moment(data[i][0]).format("YYYY-MM-DD"),
          dueDate: moment(data[i][0]).add(15, "days").format("YYYY-MM-DD"),
          lineItems: [
            {
              //item: data[i][14],
              description: data[i][12],
              quantity: data[i][14],
              unitAmount: parseFloat(data[i][16]) / parseInt(data[i][14]),
              accountCode: data[i][11],
              tracking: [
                {
                  name: "Property",
                  option: data[i][18],
                },
                {
                  name: "Channel",
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
              name: "Property",
              option: data[i][18],
            },
            {
              name: "Channel",
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
    property === "11 Sierra" ||
    property === "Mouse Hole" ||
    property === "Casita Azul"
  ) {
    return "5556";
  }
  return segmentCodes[unspsc.substring(0, 2)];
}

exports.uploadCleaningBills  = functions.https.onRequest(async (req, res) => {
  res.set("Cache-Control", "public, max-age=300, s-maxage=600");
  const { XeroClient, Invoices } = require("xero-node");
  const { TokenSet } = require("openid-client");
  const xero = new XeroClient({
    clientId: client_id,
    clientSecret: client_secret,
    redirectUris: [redirectUrl],
    scopes: scopes.split(" "),
  });

  await xero.initialize();
  
  const sessionSnapshot = await db.collection("sessions").where("type","==", "xero").orderBy("created", "desc").get()
  // sessionSnapshot.forEach(doc => {
  //   console.log(doc.id, '=>', doc.data().created);
  // });
  
  await xero.setTokenSet(new TokenSet(sessionSnapshot.docs[0].data().tokenSet));
  let tokenSet = await xero.readTokenSet();

  if (tokenSet.expired()) {
    const validTokenSet = await xero.refreshToken();
    await saveXeroToken(validTokenSet)
    tokenSet = validTokenSet
  } 
  try {
      const ownerSnapshot = await db.collection("owners").where("mgmt_take_cleaning_fee", "==", false).get() 
      
      let ownerUnitsMap = {};
      ownerSnapshot.forEach(doc => {
        const owner = doc.data()
        ownerUnitsMap = {...ownerUnitsMap, ...owner.units}
      });

      const cleanerSnapshot = await db.collection('team').where("uuid", "==", req.query.cleaner_id).get()

      if (cleanerSnapshot.empty) {
        res.send('No cleaner for id');
        return;
      }  
      const cleaner = cleanerSnapshot.docs[0].data()
      const cleanerName = cleaner.first_name + " " + cleaner.last_name

      const rawCleanings = await getUnpaidCleaningSheetData(cleaner.hours_sheet)
      const invoices = parseCleaningBills(cleanerName, rawCleanings, ownerUnitsMap);
     // const invoices = parseCleaningBills(cleanerName, req.body.cleanings, ownerUnitsMap);

      const newInvoices = new Invoices();
      newInvoices.invoices = invoices;

      const inviocesRes = await xero.accountingApi.createInvoices(
        xeroTenantId,
        newInvoices,
        false,
        4
      );
      const xeroInvioces = inviocesRes.response.body.Invoices;
      // // console.log("invoice length");
      // // console.log(invoices.length);
      

      for (let i = 0; i < xeroInvioces.length; i++) {
        const invoiceId = xeroInvioces[i].InvoiceID;
        const lineItems = xeroInvioces[i].LineItems;

        for (let j = 0; j < lineItems.length; j++) {
          const unitName = lineItems[j].Tracking[0].Option;

          if (ownerUnitsMap[unitName] !== undefined) {
    
            const linkedRes = await xero.accountingApi.createLinkedTransaction(
              xeroTenantId,
              {
                sourceTransactionID: invoiceId,
                sourceLineItemID: lineItems[j].LineItemID,
                contactID: ownerUnitsMap[unitName].xero_id,
              }
            );
            //console.log("linkedRes", linkedRes.response.statusCode);
          }
        }
      }

      res.send(inviocesRes);
      //res.send(invoices)
      
    } catch (err) {
      console.log(err);
      res.send(err);
    
    }
  
});

exports.getCleaningSheetById = functions.https.onRequest(async (req, res) => {
  const cleanerSnapshot = await db.collection('team').where("uuid", "==", req.query).get()

  if (cleanerSnapshot.empty) {
    res.send('No cleaner for id');
    return;
  }  
  const cleaner = cleanerSnapshot.docs[0].data()
  
  const rawCleanings = await getCleaningSheetData(cleaner.hours_sheet)
  res.send(rawCleanings)
})

function getCleaningSheetData(hours_sheet) {
  return new Promise(function (resolve, reject) {
    const spreadsheetId = new RegExp("/spreadsheets/d/([a-zA-Z0-9-_]+)").exec(hours_sheet)[1]
    const jwt = new google.auth.JWT(
      credentials.service_account.client_email,
      null,
      credentials.service_account.private_key,
      ["https://www.googleapis.com/auth/spreadsheets"]
    );

    const request = {
      // The ID of the spreadsheet to retrieve data from.
      spreadsheetId: spreadsheetId, // TODO: Update placeholder value.

      // The A1 notation of the values to retrieve.
      range: "Completed Cleanings!A2:F", // TODO: Update placeholder value.
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
        resolve(res.data.values);
      }
    });
  });
}

function getUnpaidCleaningSheetData(hours_sheet) {
  return new Promise(function (resolve, reject) {
    const spreadsheetId = new RegExp("/spreadsheets/d/([a-zA-Z0-9-_]+)").exec(hours_sheet)[1]
    const jwt = new google.auth.JWT(
      credentials.service_account.client_email,
      null,
      credentials.service_account.private_key,
      ["https://www.googleapis.com/auth/spreadsheets"]
    );

    const request = {
      // The ID of the spreadsheet to retrieve data from.
      spreadsheetId: spreadsheetId, // TODO: Update placeholder value.

      // The A1 notation of the values to retrieve.
      range: "Completed Cleanings!A2:F", // TODO: Update placeholder value.
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
        let data = []; 
        for (let i = 0; i < res.data.values.length; i++) {
          if(res.data.values[i][5] === undefined) {
            data.push(res.data.values[i])
          }
        }
        resolve(data);
      }
    });
  });
}

function parseCleaningBills(cleanerName, data, ownerUnitsMap) {
  let jsonXeroData =  {
    type: "ACCPAY",
    contact: {
      name: cleanerName,
    },
    invoiceNumber: "Cleaner PMT: " + cleanerName + " on " + moment(data[data.length -1][1]).format("YYYY-MM-DD"),
    url: "https://stinsonbeachpm.com",
    currencyCode: "USD",
    status: "AUTHORISED", //DRAFT
    lineAmountTypes: "NoTax",
    date: moment(data[data.length -1][1]).format("YYYY-MM-DD"),
    dueDate: moment(data[data.length -1][1]).add(15, "days").format("YYYY-MM-DD"),
    lineItems: [
    ],
  };
  
  for (let i = 0; i < data.length; i++) {
      
    jsonXeroData.lineItems.push({
      // item: data[i][14],
      
      description: "Cleaning on " + data[i][1] + " at " + data[i][2] ,
      quantity: 1,
      unitAmount: parseInt(data[i][3]),
      accountCode: ownerUnitsMap[data[i][2]] == undefined? "5010": "5555",
      tracking: [
        {
          name: "Property",
          option: data[i][2],
        },
        {
          name: "Channel",
          option: "Operation Expense",
        },
      ],
    });
      
    
  }

  return [jsonXeroData];
}

exports.uploadHoursBills  = functions.https.onRequest(async (req, res) => {
  
  const { XeroClient, Invoices } = require("xero-node");
  const { TokenSet } = require("openid-client");
  const xero = new XeroClient({
    clientId: client_id,
    clientSecret: client_secret,
    redirectUris: [redirectUrl],
    scopes: scopes.split(" "),
  });

  await xero.initialize();
  
  const sessionSnapshot = await db.collection("sessions").where("type","==", "xero").orderBy("created", "desc").limit(1).get()
  await xero.setTokenSet(new TokenSet(sessionSnapshot.docs[0].data().tokenSet));
  let tokenSet = await xero.readTokenSet();

  if (tokenSet.expired()) {
    const validTokenSet = await xero.refreshToken();
    await saveXeroToken(validTokenSet)
    tokenSet = validTokenSet
  } 
  try {

      const teammateSnapshot = await db.collection('team').where("uuid", "==", req.query.teammate_id).get()

      if (teammateSnapshot.empty) {
        res.send('No teammate for id');
        return;
      }  
      const teammate = teammateSnapshot.docs[0].data()
      const teammateName = teammate.first_name + " " + teammate.last_name

      
      const rawHours = await getUnpaidHoursSheetData(teammate.hours_sheet)
      const invoices = parseHoursBills(teammateName, rawHours, teammate.rate);
     // const invoices = parseHoursBills(teammateName, req.body.cleanings, ownerUnitsMap);

      const newInvoices = new Invoices();
      newInvoices.invoices = invoices;

      const inviocesRes = await xero.accountingApi.createInvoices(
        xeroTenantId,
        newInvoices,
        false,
        4
      );
      const xeroInvioces = inviocesRes.response.body.Invoices;
      // // console.log("invoice length");
      // // console.log(invoices.length);
      

      // for (let i = 0; i < xeroInvioces.length; i++) {
      //   const invoiceId = xeroInvioces[i].InvoiceID;
      //   const lineItems = xeroInvioces[i].LineItems;

      //   for (let j = 0; j < lineItems.length; j++) {
      //     const unitName = lineItems[j].Tracking[0].Option;

      //     if (ownerUnitsMap[unitName] !== undefined) {
    
      //       const linkedRes = await xero.accountingApi.createLinkedTransaction(
      //         xeroTenantId,
      //         {
      //           sourceTransactionID: invoiceId,
      //           sourceLineItemID: lineItems[j].LineItemID,
      //           contactID: ownerUnitsMap[unitName].xero_id,
      //         }
      //       );
      //       //console.log("linkedRes", linkedRes.response.statusCode);
      //     }
      //   }
      // }

      res.send(inviocesRes);
      //res.send(invoices)
      
    } catch (err) {
      console.log(err);
      res.send(err);
    
    }
  
});

exports.getHoursSheetById = functions.https.onRequest(async (req, res) => {
  const teammateSnapshot = await db.collection('team').where("uuid", "==", req.query.cleaner_id).get()

  if (teammateSnapshot.empty) {
    res.send('No cleaner for id');
    return;
  }  
  const teammate = teammateSnapshot.docs[0].data()
  const rawHours = await getHoursSheetData(teammate.hours_sheet)
  res.send(rawHours)
})

function getHoursSheetData(hoursSheet) {
  return new Promise(function (resolve, reject) {
    const spreadsheetId = new RegExp("/spreadsheets/d/([a-zA-Z0-9-_]+)").exec(hoursSheet)[1]
    const jwt = new google.auth.JWT(
      credentials.service_account.client_email,
      null,
      credentials.service_account.private_key,
      ["https://www.googleapis.com/auth/spreadsheets"]
    );

    const request = {
      // The ID of the spreadsheet to retrieve data from.
      spreadsheetId: spreadsheetId, // TODO: Update placeholder value.

      // The A1 notation of the values to retrieve.
      range: "Hours Log!A3:I", // TODO: Update placeholder value.
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
        resolve(res.data.values);
      }
    });
  });
}


function getUnpaidHoursSheetData(hoursSheet) {
  return new Promise(function (resolve, reject) {
    const spreadsheetId = new RegExp("/spreadsheets/d/([a-zA-Z0-9-_]+)").exec(hoursSheet)[1]
    const jwt = new google.auth.JWT(
      credentials.service_account.client_email,
      null,
      credentials.service_account.private_key,
      ["https://www.googleapis.com/auth/spreadsheets"]
    );

    const request = {
      // The ID of the spreadsheet to retrieve data from.
      spreadsheetId: spreadsheetId, // TODO: Update placeholder value.

      // The A1 notation of the values to retrieve.
      range: "Hours Log!A3:I", // TODO: Update placeholder value.
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
        let data = []; 
        for (let i = 0; i < res.data.values.length; i++) {
          if(res.data.values[i].length > 0 && res.data.values[i][0] !== "" && res.data.values[i][1] !== "" && res.data.values[i][2] !== "" && res.data.values[i][8] === undefined) {
            data.push(res.data.values[i])
          }
        }
        resolve(data);
      }
    });
  });
}

function parseHoursBills(teammateName, data, rate) {
  let jsonXeroData =  {
    type: "ACCPAY",
    contact: {
      name: teammateName,
    },

    invoiceNumber: "Contractor PMT: " + teammateName + " on " + moment(data[data.length -1][2]).format("YYYY-MM-DD"),
    url: "https://stinsonbeachpm.com",
    currencyCode: "USD",
    status: "AUTHORISED", //DRAFT
    lineAmountTypes: "NoTax",
    date: moment(data[data.length -1][2]).format("YYYY-MM-DD"),
    dueDate: moment(data[data.length -1][2]).add(15, "days").format("YYYY-MM-DD"),
    lineItems: [
    ],
  };
  
  for (let i = 0; i < data.length; i++) {
      
    jsonXeroData.lineItems.push({
      // item: data[i][14],
      
      description: teammateName + " on " + data[i][2] + ": " + data[i][1] ,
      quantity: data[i][6],
      unitAmount: (parseFloat(data[i][7])*100/parseFloat(data[i][6])*100)/10000, //GET FROM DATABASE
      accountCode: "6110",
      tracking: [
        {
          name: "Property",
          option: "General",
        },
        {
          name: "Channel",
          option: "Operation Expense",
        },
      ],
    });
      
    
  }

  return [jsonXeroData];
}

exports.refreshXeroConnection = functions.https.onRequest(async (req, res) => {
  
  const { XeroClient } = require("xero-node");
  const { TokenSet } = require("openid-client");
  const xero = new XeroClient({
    clientId: client_id,
    clientSecret: client_secret,
    redirectUris: [redirectUrl],
    scopes: scopes.split(" "),
  });

  await xero.initialize();
  
  const sessionSnapshot = await db.collection("sessions").where("type","==", "xero").orderBy("created", "desc").limit(1).get()
  // sessionSnapshot.forEach(doc => {
  //   console.log(doc.id, '=>', doc.data().created);
  // });
  
  await xero.setTokenSet(new TokenSet(sessionSnapshot.docs[0].data().tokenSet));
  const tokenSet = await xero.readTokenSet();
  
  if (tokenSet.expired()) {
    const validTokenSet = await xero.refreshToken();
    await saveXeroToken(xero, validTokenSet)
    res.send("Xero Connection Refreshed")
  } else {
    res.send("Xero token not expired. Expires at: " + moment(tokenSet.expires_at *1000).utcOffset("-0700").toString() + " (PST)")
  }
})

function saveXeroToken(xeroToken) {
  return new Promise(function (resolve, reject) {
    const jwtDecode = require("jwt-decode");
    
    const decodedIdToken = jwtDecode(xeroToken.id_token);
    const decodedAccessToken = jwtDecode(xeroToken.access_token);
    const xeroSession = {
      type: "xero",
      created: Date.now(),
      decodedIdToken: decodedIdToken,
      decodedAccessToken: decodedAccessToken,
      tokenSet: JSON.parse(JSON.stringify(xeroToken))}

    db.collection("sessions").add(xeroSession).then((response) => {
      resolve(response)
    })
  })
}

// exports.executeAccountingRule - functions.https.onRequest(async (req, res) =>{
//   const { XeroClient } = require("xero-node");
//   const { TokenSet } = require("openid-client");
//   const xero = new XeroClient({
//     clientId: client_id,
//     clientSecret: client_secret,
//     redirectUris: [redirectUrl],
//     scopes: scopes.split(" "),
//   });

//   await xero.initialize();
  
//   const sessionSnapshot = await db.collection("sessions").where("type","==", "xero").orderBy("created", "desc").limit(1).get()
//   // sessionSnapshot.forEach(doc => {
//   //   console.log(doc.id, '=>', doc.data().created);
//   // });
  
//   await xero.setTokenSet(new TokenSet(sessionSnapshot.docs[0].data().tokenSet));
//   const tokenSet = await xero.readTokenSet();
  
//   if (tokenSet.expired()) {
//     const validTokenSet = await xero.refreshToken();
//     await saveXeroToken(validTokenSet)
//     tokenSet = validTokenSet
//   } 
//   try {
//     const rule = req.query
//     let xeroInvioceResponse = {}
//     let invoices = {}
//     if(rule.type === "HOURS"){
//       const rawHours = await getUnpaidHoursSheetData(spreadsheetId)
//       invoices = parseHoursBills(teammateName, rawHours, teammate.rate);

//     } else if(rule.type === "CLEANING") {
//       const rawCleanings = await getUnpaidCleaningSheetData(cleaner.hours_sheet)
//       invoices = parseCleaningBills(cleanerName, rawCleanings, ownerUnitsMap);

//     }

//     const newInvoices = new Invoices();
//     newInvoices.invoices = invoices;

//     const inviocesRes = await xero.accountingApi.createInvoices(
//       xeroTenantId,
//       newInvoices,
//       false,
//       4
//     );
//     xeroInvioceResponse = inviocesRes.response.body.Invoices;
//       // get source data
//       // parse invoice(data, AccountingRule)
//       //send invoice to xero
    
//     // if billable create linked transactions in invoice

//     // else if mirror 
//       // create mirror transactions

//     // if email reciept
//       // create email receipt
//   } catch (e) {
    
//   }
// })

function parseAccountingRuleInvoices(rule, data, rate) {
  //const teammateSnapshot = await db.collection('team').where("uuid", "==", rule.invoice.contact.id).get()

  if (teammateSnapshot.empty) {
    res.send('No teammember for id');
    return;
  }  
  const teammate = teammateSnapshot.docs[0].data()
  
  let jsonXeroData =  {
    type: rule.invoice.type,
    contact: {
      name: rule.invoice.contact.name,
    },
    currencyCode: rule.invioce.currency,
    status: "AUTHORISED", //DRAFT
    lineAmountTypes: "NoTax",
    date: parseTemplate(rule.invoice.date),
    dueDate: parseTemplate(rule.invoice.dueDate),
    lineItems: [
    ],
  };
  if(rule.type === "ACCPAY") {
    jsonXeroData.invoiceNumber = parseTemplate(rule.invoice.reference)
  } else {
    jsonXeroData.reference = parseTemplate(rule.invoice.reference)
  }

  for (let i = 0; i < data.length; i++) {
      
    jsonXeroData.lineItems.push({
      // item: data[i][14],
      
      description: parseTemplate(rule.invoice.line_items.description) ,
      quantity: data[i][6],
      unitAmount: (parseFloat(data[i][7])*100/parseFloat(data[i][6])*100)/10000, //GET FROM DATABASE
      accountCode: "6110",
      tracking: [
        {
          name: "Property",
          option: "General",
        },
        {
          name: "Channel",
          option: "Operation Expense",
        },
      ],
    });
      
    
  }

  return [jsonXeroData];
}
// async function getXeroInvoiceData() {
//   return new Promise(function (resolve, reject) {
    
    
//   });
// }

// helper template function(tupleData, template, contactInfo, )

exports.createBillableExpenseInvoice  = functions.https.onRequest(async (req, res) => {
  
  const { XeroClient, Invoices } = require("xero-node");
  const { TokenSet } = require("openid-client");
  const xero = new XeroClient({
    clientId: client_id,
    clientSecret: client_secret,
    redirectUris: [redirectUrl],
    scopes: scopes.split(" "),
  });

  await xero.initialize();
  
  const sessionSnapshot = await db.collection("sessions").where("type","==", "xero").orderBy("created", "desc").limit(1).get()
  await xero.setTokenSet(new TokenSet(sessionSnapshot.docs[0].data().tokenSet));
  let tokenSet = await xero.readTokenSet();

  if (tokenSet.expired()) {
    const validTokenSet = await xero.refreshToken();
    await saveXeroToken(validTokenSet)
    tokenSet = validTokenSet
  } 
  try {
      
      const ownerSnapshot = await db.collection('owners').where("uuid", "==", req.query.owner_id).get()

      if (ownerSnapshot.empty) {
        res.send('No owner for id');
        return;
      }  
      const owner = ownerSnapshot.docs[0].data()
      
      //const ownerName = owner.first_name + " " + owner.last_name
      let linkedTxnsResponse = await xero.accountingApi.getLinkedTransactions(xeroTenantId, undefined, undefined, undefined,owner.xero_id)
      
      const linkedInvoicesIds = listUniqueInvoicesIds(linkedTxnsResponse.body.linkedTransactions)

      const getInvoicesResponse = await xero.accountingApi.getInvoices(xeroTenantId, undefined, undefined, undefined, linkedInvoicesIds)

      const linkedLineItems = listLinkedLineItems(getInvoicesResponse.body.invoices,linkedTxnsResponse.body.linkedTransactions )
      //const rawHours = await getUnpaidHoursSheetData(teammate.hours_sheet)
      //const invoices = parseHoursBills(teammateName, rawHours, teammate.rate);
     // const invoices = parseHoursBills(teammateName, req.body.cleanings, ownerUnitsMap);

      // const newInvoices = new Invoices();
      // newInvoices.invoices = invoices;

      // const inviocesRes = await xero.accountingApi.createInvoices(
      //   xeroTenantId,
      //   newInvoices,
      //   false,
      //   4
      // );
      // const xeroInvioces = inviocesRes.response.body.Invoices;
      // // console.log("invoice length");
      // // console.log(invoices.length);
      

      // for (let i = 0; i < xeroInvioces.length; i++) {
      //   const invoiceId = xeroInvioces[i].InvoiceID;
      //   const lineItems = xeroInvioces[i].LineItems;

      //   for (let j = 0; j < lineItems.length; j++) {
      //     const unitName = lineItems[j].Tracking[0].Option;

      //     if (ownerUnitsMap[unitName] !== undefined) {
    
      //       const linkedRes = await xero.accountingApi.createLinkedTransaction(
      //         xeroTenantId,
      //         {
      //           sourceTransactionID: invoiceId,
      //           sourceLineItemID: lineItems[j].LineItemID,
      //           contactID: ownerUnitsMap[unitName].xero_id,
      //         }
      //       );
      //       //console.log("linkedRes", linkedRes.response.statusCode);
      //     }
      //   }
      // }

      res.send(response.body);
      //res.send(invoices)
      
    } catch (err) {
      console.log(err);
      res.send(err);
    
    }
  
});

function listUniqueInvoicesIds(linkedTxns){
  let LinkedInvoices = []
  let LinkedInvoicesIds = []
  for( let i =0; i < linkedTxns.length; i++) {
    if(LinkedInvoices[linkedTxns[i].sourceTransactionID] === undefined) {
      LinkedInvoices[linkedTxns[i].sourceTransactionID] = linkedTxns[i]
      LinkedInvoicesIds.push(linkedTxns[i].sourceTransactionID)
    }
  }
  return LinkedInvoicesIds
}

listLinkedLineItems = async function() {

}