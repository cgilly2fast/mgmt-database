const functions = require("firebase-functions");
const moment = require("moment-timezone");
const { credentials } = require("./development_credentials");
const { google } = require("googleapis");

const { db } = require("./admin");
const BigNumber = require('bignumber.js');
const { composer } = require("googleapis/build/src/apis/composer");
const { link } = require("fs/promises");

const LOCAL = true;
let unitsHash = {};

const client_id = credentials.xero_client_id;
const client_secret = credentials.xero_client_secret;
const redirectUrl = LOCAL
  ? "http://localhost:5001/ghotels-development/us-central1/callback"
  : credentials.xero_redirect_uri;

const xeroTenantId = credentials.xero_tennat_id;
const scopes =
  "openid profile email accounting.contacts.read accounting.settings accounting.transactions offline_access accounting.reports.read";

  

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
  
        const contactsRes = await xero.accountingApi.getContacts(xeroTenantId)
        //const contactsRes = await xero.accountingApi.getReportsList(xeroTenantId)
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
      const rawXeroData = await getXeroAmazonBillData();

      const invoices = parseAmazonBills(rawXeroData);
      
      
      const newInvoices = new Invoices();
      newInvoices.invoices = invoices;

      // const inviocesRes = await xero.accountingApi.createInvoices(
      //   xeroTenantId,
      //   newInvoices,
      //   false,
      //   4
      // );
      // const xeroInvioces = inviocesRes.response.body.Invoices;
      // console.log("invoice length");
      // console.log(invoices.length);

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

      res.send(rawXeroData);
    } catch (err) {
      console.log(err);
      res.send(err);
      // res.send(
      //   "Sorry, something went wrong in uploadInvoices, try reconnecting by <a href='https://us-central1-ghotels-production.cloudfunctions.net/acct/connect'>clicking here</a>"
      // );
    }
  
});

function getXeroAmazonBillData() {
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
      range: "Amazon Bill Data!A2:AA", // TODO: Update placeholder value.
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

function getXeroAmazonRefundData() {
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
      range: "Amazon Refund Data!A2:AO", // TODO: Update placeholder value.
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

function getXeroAmazonRefundDataByUnits(unitsMap) {
  return new Promise(async function (resolve, reject) {
    let result = []
    try {
      const refundData = await getXeroAmazonRefundData()
      for(let i = 0; i < refundData.length; i++) {
        if(unitsMap[refundData[i][36]]) {
          result.push(refundData[i])
        }
      }
      resolve(result)
    } catch (err) {
      reject(err)
    
    }
  });
}

function parseAmazonBills(rule, data) {
  const TemplateEngine = require("./template-engine")
  const templateEngine = new TemplateEngine(rule)

  let checkExists = {};
  let jsonXeroData = [];
  
  for (let i = 0; i < data.length; i++) {
    if (
      data[i][10] !== "6782" &&
      data[i][10] !== "1252" &&
      data[i][6] !== "Cancelled"
    ) {
      
      
      if (checkExists[data[i][7]] === undefined) {
        checkExists[data[i][7]] = i;
        jsonXeroData[i] = {
          type: rule.invoice.type,
          contact: {
            name: "Amazon",
          },

          
          invoiceNumber: templateEngine.exec(rule.invoice.reference, data[i]),
          url: "https://stinsonbeachpm.com",
          currencyCode: "USD",
          status: "DRAFT", //AUTHORISED
          lineAmountTypes: "NoTax",
          date: templateEngine.exec(rule.invoice.date, data[i]),
          dueDate: templateEngine.exec(rule.invoice.due_date, data[i]),
          lineItems: [
            {
              description: templateEngine.exec(rule.invoice.line_items.description, data[i]) ,
              quantity: templateEngine.exec(rule.invoice.line_items.quantity, data[i]),
              unitAmount: templateEngine.exec(rule.invoice.line_items.unit_amount, data[i]), //GET FROM DATABASE
              accountCode: templateEngine.exec(rule.invoice.line_items.account_code, data[i]),
              tracking: [
                {
                  name: rule.invoice.line_items.tracking[0].name,
                  option: templateEngine.exec(rule.invoice.line_items.tracking[0].option),
                },
                {
                  name: rule.invoice.line_items.tracking[1].name,
                  option: templateEngine.exec(rule.invoice.line_items.tracking[1].option),
                },
              ]
            }
          ],
        };
      } else {
        jsonXeroData[checkExists[data[i][7]]].lineItems.push({
          description: templateEngine.exec(rule.invoice.line_items.description, data[i]) ,
          quantity: templateEngine.exec(rule.invoice.line_items.quantity, data[i]),
          unitAmount: templateEngine.exec(rule.invoice.line_items.unit_amount, data[i]), //GET FROM DATABASE
          accountCode: templateEngine.exec(rule.invoice.line_items.account_code, data[i]),
          tracking: [
            {
              name: rule.invoice.line_items.tracking[0].name,
              option: templateEngine.exec(rule.invoice.line_items.tracking[0].option),
            },
            {
              name: rule.invoice.line_items.tracking[1].name,
              option: templateEngine.exec(rule.invoice.line_items.tracking[1].option),
            },
          ]
        });
      }
    }
  }

  return jsonXeroData;
}

function parseAmazonRefunds(rule, data) {
  const TemplateEngine = require("./template-engine")
  const templateEngine = new TemplateEngine(rule)

  let checkExists = {};
  let jsonXeroData = [];
  
  for (let i = 0; i < data.length; i++) {
      
      if (checkExists[data[i][13]] === undefined) {
        checkExists[data[i][13]] = i;
        jsonXeroData[i] = {
          type: rule.invoice.type,
          contact: {
            name: "Amazon",
          },

          
          reference: templateEngine.exec(rule.invoice.reference, data[i]),
          url: "https://stinsonbeachpm.com",
          currencyCode: "USD",
          status: "DRAFT", //AUTHORISED
          lineAmountTypes: "NoTax",
          date: templateEngine.exec(rule.invoice.date, data[i]),
          dueDate: templateEngine.exec(rule.invoice.due_date, data[i]),
          lineItems: [
            {
              description: templateEngine.exec(rule.invoice.line_items.description, data[i]) ,
              quantity: templateEngine.exec(rule.invoice.line_items.quantity, data[i]),
              unitAmount: templateEngine.exec(rule.invoice.line_items.unit_amount, data[i]), //GET FROM DATABASE
              accountCode: templateEngine.exec(rule.invoice.line_items.account_code, data[i]),
              tracking: [
                {
                  name: rule.invoice.line_items.tracking[0].name,
                  option: templateEngine.exec(rule.invoice.line_items.tracking[0].option),
                },
                {
                  name: rule.invoice.line_items.tracking[1].name,
                  option: templateEngine.exec(rule.invoice.line_items.tracking[1].option),
                },
              ]
            }
          ],
        };
      } else {
        jsonXeroData[checkExists[data[i][13]]].lineItems.push({
          description: templateEngine.exec(rule.invoice.line_items.description, data[i]) ,
          quantity: templateEngine.exec(rule.invoice.line_items.quantity, data[i]),
          unitAmount: templateEngine.exec(rule.invoice.line_items.unit_amount, data[i]), //GET FROM DATABASE
          accountCode: templateEngine.exec(rule.invoice.line_items.account_code, data[i]),
          tracking: [
            {
              name: rule.invoice.line_items.tracking[0].name,
              option: templateEngine.exec(rule.invoice.line_items.tracking[0].option),
            },
            {
              name: rule.invoice.line_items.tracking[1].name,
              option: templateEngine.exec(rule.invoice.line_items.tracking[1].option),
            },
          ]
        });
      }
    
  }

  return jsonXeroData;
}

function parseAmazonLineItems(data) {
  const rule = {
    "type":"AMAZON_REFUNDS",
    "invoice":{
    "line_items": {
    "unit_amount": "<%unit_amount%>",
    "account_code": "4900",
    "quantity": 1,
    "tracking": [
        {
            "name": "Property",
            "option": "<%unit_name%>"
        },
        {
            "option": "<%channel_option%>",
            "name": "Channel"
        }
    ],
    "description": "Refund: <%item_description%>"
}}}
  const TemplateEngine = require("./template-engine")
  const templateEngine = new TemplateEngine(rule)

  
  let jsonXeroData = [];
  
  for (let i = 0; i < data.length; i++) {
    jsonXeroData.push({
      description: templateEngine.exec(rule.invoice.line_items.description, data[i]) ,
      quantity: templateEngine.exec(rule.invoice.line_items.quantity, data[i]),
      unitAmount: templateEngine.exec(rule.invoice.line_items.unit_amount, data[i]), //GET FROM DATABASE
      accountCode: templateEngine.exec(rule.invoice.line_items.account_code, data[i]),
      tracking: [
        {
          name: rule.invoice.line_items.tracking[0].name,
          option: templateEngine.exec(rule.invoice.line_items.tracking[0].option),
        },
        {
          name: rule.invoice.line_items.tracking[1].name,
          option: templateEngine.exec(rule.invoice.line_items.tracking[1].option),
        },
      ]
    });
  }
  return jsonXeroData
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

exports.executeAccountingRule = functions.https.onRequest(async (req, res) =>{
  const { XeroClient, Invoices } = require("xero-node");
  const { TokenSet } = require("openid-client");
  const xero = new XeroClient({
    clientId: client_id,
    clientSecret: client_secret,
    redirectUris: [redirectUrl],
    scopes: scopes.split(" "),
  });
  let rule  = {}
  try {
    await xero.initialize();
    
    const sessionSnapshot = await db.collection("sessions").where("type","==", "xero").orderBy("created", "desc").limit(1).get()
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

    const rulesDoc = await db.collection('accounting-rules').doc(req.query.rule_id).get()
    if (!rulesDoc.exists) {
      res.send('No rule for id');
      return;
    }  
    rule = rulesDoc.data()
  } catch(e) {
    console.log("Fail in init", e)
    res.send(e)
  }
  let invoices = {}
  let linkedTxnsIds = {}
  let linkedLineItems = {}
  try {
    if(rule.type === "HOURS"){

        const rawHours = await getUnpaidHoursSheetData(rule.source_data)
        invoices = parseAccountingRuleInvoices(rule, rawHours);
    } else if(rule.type === "CLEANING") {

        const rawCleanings = await getUnpaidCleaningSheetData(rule.source_data)
        invoices = parseAccountingRuleInvoices(rule, rawCleanings);
      
      
    } else if( rule.type === "BILLABLE_EXPENSE") {
      
        let linkedTxnsResponse = await xero.accountingApi.getLinkedTransactions(rule.account.account_id, undefined, undefined, undefined, rule.invoice.contact.xero_id, 'APPROVED')
        const linkedTxns = linkedTxnsResponse.body.linkedTransactions
        
        const linkedTxnIds = listUniqueInvoicesIds(linkedTxnsResponse.body.linkedTransactions)
        const getBankTxnsResponse = await getBankTxns(linkedTxnIds.bankTxnIds, rule.account.account_id, xero)
        const getInvoicesResponse = await xero.accountingApi.getInvoices(rule.account.account_id, undefined, undefined, undefined, linkedTxnIds.invoicesIds)
        
        const txnLineItems = getBankTxnsResponse.concat(getInvoicesResponse.body.invoices)
        linkedLineItems = listLinkedLineItems(txnLineItems, linkedTxns)
        invoices = parseAccountingRuleInvoices(rule, linkedLineItems)
      
        for(let i = 0; i < linkedTxns.length; i++) {
          if(linkedTxnsIds[linkedTxns[i].sourceLineItemID] === undefined) {
            linkedTxnsIds[linkedTxns[i].sourceLineItemID] = linkedTxns[i]
          }
        }

        const amazon_refunds = await getXeroAmazonRefundDataByUnits(rule.units_filter)
        const amazonLineItems = parseAmazonLineItems(amazon_refunds)
        invoices[0].lineItems = amazonLineItems.concat(invoices[0].lineItems)
        
      } else if(rule.type === "COMMISSION") {
        const parsedReports = await getCommissionData(rule, xero)
        invoices = parseAccountingRuleInvoices(rule, parsedReports)
      } else if(rule.type === "AMAZON_BILLS") {
        const rawAmazonData = await getXeroAmazonBillData();
        invoices = parseAmazonBills(rule, rawAmazonData);
      } else if(rule.type === "AMAZON_REFUNDS") {
        const rawAmazonData = await getXeroAmazonRefundData();
        invoices = parseAmazonRefunds(rule, rawAmazonData);
      } else if(rule.type === "CLEANING_FEES_TO_MANAGER"){
        const parsedReports = await getCleaningRevenue(rule, xero)
        invoices = parseAccountingRuleInvoices(rule, parsedReports)
      } else if(rule.type === "OWNER_PAYOUT") {
        const parsedReports = await getOnwerGrossProfit(rule, xero)
        invoices = parseAccountingRuleInvoices(rule, parsedReports)
      }
  } catch (e) {
    console.log("Fail in invoice parse", e)
    res.send(e)
  }
  
  try {
  
    const newInvoices = new Invoices();
    newInvoices.invoices = invoices;

    const inviocesRes = await xero.accountingApi.createInvoices(
      rule.account.account_id,
      newInvoices,
      false,
      4
      );
    xeroInvioces = inviocesRes.response.body.Invoices;
    res.send(xeroInvioces);
    
  } catch (e) {
    console.log("fail in creating invoice", e)
    res.send(e)
  }
  return
  if(rule.billable && rule.type !== "AMAZON_REFUNDS") {
    
    for (let i = 0; i < xeroInvioces.length; i++) {
      const invoiceId = xeroInvioces[i].InvoiceID;
      const lineItems = xeroInvioces[i].LineItems;

      for (let j = 0; j < lineItems.length; j++) {
        const unitName = lineItems[j].Tracking[0].Option;

        if (rule.billable_units[unitName] !== undefined) {
          try {
            const linkedRes = await xero.accountingApi.createLinkedTransaction(
              rule.account.account_id,
              {
                sourceTransactionID: invoiceId,
                sourceLineItemID: lineItems[j].LineItemID,
                contactID: rule.billable_units[unitName].bill_to,
              }
            );
          } catch (e) {
            console.log("Fail in billing line item",e)
            res.send(e)
          }
          //console.log("linkedRes", linkedRes.response.statusCode);
        }
      }
    }
  } else if( rule.type === "BILLABLE_EXPENSE") {
    for (let k = 0; k < xeroInvioces.length; k++) {
      for (let j = 0; j < xeroInvioces[k].LineItems.length; j++) {    
        for (let i = 0; i < linkedLineItems.length; i++) {
          if(linkedLineItems[i].description === xeroInvioces[k].LineItems[j].Description 
            && linkedLineItems[i].quantity === xeroInvioces[k].LineItems[j].Quantity 
            && linkedLineItems[i].unitAmount === xeroInvioces[k].LineItems[j].UnitAmount) {
              const linkedTransactions = [{
                targetTransactionID: xeroInvioces[k].InvoiceID,
                targetLineItemID: xeroInvioces[k].LineItems[j].LineItemID}]
                try {
                 
                  const linkedRes = await xero.accountingApi.updateLinkedTransaction(
                    xeroTenantId,
                    linkedTxnsIds[linkedLineItems[i].lineItemID].linkedTransactionID,
                    {linkedTransactions:linkedTransactions}
                  );
                  
                  
                } catch (e) {
                  //console.log(e.response.body.Elements[0].ValidationErrors)
                  console.log("Fail in connecting billable expense target",e)
                  res.send(e)
                }
          }
        }
      }
    }
  }
  
    if(rule.mirror) {
      let mirror_invoice = []
      
      try {
        if( rule.type === "BILLABLE_EXPENSE") {
        
          mirror_invoice = parseMirrorInvoices(rule, linkedLineItems)
          console.log(mirror_invoice)
            
        } else {
          
          mirror_invoice = parseMirrorInvoices(rule, invoices[0].lineItems )
        }
        
        const newMirrorInvoices = new Invoices();
        newMirrorInvoices.invoices = mirror_invoice;
        
        const mirrorInviocesRes = await xero.accountingApi.createInvoices(
          rule.mirror_account.account_id,
          newMirrorInvoices,
          false,
          4
        );
        xeroInvioces = mirrorInviocesRes.response.body.Invoices;
        res.send(mirrorInviocesRes)
      } catch (e) {
        if(e.response !== undefined) {
          console.log(e.response.body);
        }else {
          console.log(e)
        }
        
        res.send(e)
      }
    } 
    
    res.send("complete")
    //   create mirror transactions

    // if email reciept
    //   create email receipt
      
  
    //   res.send(rule) 
})

function parseAccountingRuleInvoices(rule, data) {
  const TemplateEngine = require("./template-engine")
  const templateEngine = new TemplateEngine(rule)
  

  let jsonXeroData =  {
    type: rule.invoice.type,
    contact: {
      name: rule.invoice.contact.name,
    },
    currencyCode: rule.invoice.currency,
    status: "AUTHORISED", //DRAFT
    lineAmountTypes: "NoTax",
    date: templateEngine.exec(rule.invoice.date),
    dueDate: templateEngine.exec(rule.invoice.due_date),
    lineItems: [
    ],
  };
  if(rule.invoice.type === "ACCPAY") {
    jsonXeroData.invoiceNumber = templateEngine.exec(rule.invoice.reference)
  } else {
    jsonXeroData.reference = templateEngine.exec(rule.invoice.reference)
  }
  
  for (let i = 0; i < data.length; i++) {
    const unit_name = templateEngine.exec("<%unit_name%>", data[i])
  
    if( !rule.filter || (rule.filter && rule.units_filter[unit_name] !== undefined) ) {
      let accountCode = ""
      if(rule.billable && rule.billable_units[unit_name] !== undefined) {
        accountCode = rule.billable_units[unit_name].account_code
      } else {
        accountCode = rule.invoice.line_items.account_code
      }
      jsonXeroData.lineItems.push({
        
        description: templateEngine.exec(rule.invoice.line_items.description, data[i]) ,
        quantity: templateEngine.exec(rule.invoice.line_items.quantity, data[i]),
        unitAmount: templateEngine.exec(rule.invoice.line_items.unit_amount, data[i]), //GET FROM DATABASE
        accountCode: accountCode,
        tracking: [
          {
            name: rule.invoice.line_items.tracking[0].name,
            option: templateEngine.exec(rule.invoice.line_items.tracking[0].option),
          },
          {
            name: rule.invoice.line_items.tracking[1].name,
            option: templateEngine.exec(rule.invoice.line_items.tracking[1].option),
          },
        ]
      });
    }
    
  }

  return [jsonXeroData];
}

function parseMirrorInvoices(rule, data) {
  const TemplateEngine = require("./template-engine")
  const templateEngine = new TemplateEngine(rule)

  let jsonXeroData =  {
    type: rule.mirror_invoice.type,
    contact: {
      name: rule.mirror_invoice.contact.name,
    },
    currencyCode: rule.mirror_invoice.currency,
    status: "AUTHORISED", //DRAFT
    lineAmountTypes: "NoTax",
    date: templateEngine.exec(rule.mirror_invoice.date),
    dueDate: templateEngine.exec(rule.mirror_invoice.due_date),
    lineItems: [
    ],
  };
  if(rule.mirror_invoice.type === "ACCPAY") {
    jsonXeroData.invoiceNumber = templateEngine.exec(rule.mirror_invoice.reference)
  } else {
    jsonXeroData.reference = templateEngine.exec(rule.mirror_invoice.reference)
  }

  for (let i = 0; i < data.length; i++) {      
      jsonXeroData.lineItems.push({
        // item: data[i][14],
        
        description: templateEngine.exec(rule.mirror_invoice.line_items.description, data[i]) ,
        quantity: templateEngine.exec(rule.mirror_invoice.line_items.quantity, data[i]),
        unitAmount: templateEngine.exec(rule.mirror_invoice.line_items.unit_amount, data[i]), //GET FROM DATABASE
        accountCode: templateEngine.exec(rule.mirror_invoice.line_items.account_code, data[i]),
        tracking: [
          {
            name: rule.mirror_invoice.line_items.tracking[0].name,
            option: templateEngine.exec(rule.mirror_invoice.line_items.tracking[0].option),
          },
          {
            name: rule.mirror_invoice.line_items.tracking[1].name,
            option: templateEngine.exec(rule.mirror_invoice.line_items.tracking[1].option),
          },
        ],
      });
    //}
    
  }

  return [jsonXeroData];
}

function listUniqueInvoicesIds(linkedTxns){
  let LinkedInvoices = []
  let LinkedTxnIds = {
    invoicesIds: [],
    bankTxnIds: []
  }
  for( let i =0; i < linkedTxns.length; i++) {
    if(LinkedInvoices[linkedTxns[i].sourceTransactionID] === undefined) {
      if(linkedTxns[i].sourceTransactionTypeCode === "ACCPAY"){
        LinkedTxnIds.invoicesIds.push(linkedTxns[i].sourceTransactionID)
      } else {
        LinkedTxnIds.bankTxnIds.push(linkedTxns[i].sourceTransactionID)
      }
      LinkedInvoices[linkedTxns[i].sourceTransactionID] = linkedTxns[i]
    } 
  }
  return LinkedTxnIds
}

const listLinkedLineItems = function(invoices, linkedTxns) {
  let lineItems = []
  let linkedTxnsIds = {}

  for(let i = 0; i < linkedTxns.length; i++) {
    if(linkedTxnsIds[linkedTxns[i].sourceLineItemID] === undefined) {
      linkedTxnsIds[linkedTxns[i].sourceLineItemID] = true
    } 
  }

  for(let i = 0; i < invoices.length; i++) {
    for(let j = 0; j < invoices[i].lineItems.length;j++){
      let curId = invoices[i].lineItems[j].lineItemID
      if(linkedTxnsIds[curId]){
        lineItems.push(invoices[i].lineItems[j])
      }
    }
  }
  return lineItems
}

exports.templatingTest = functions.https.onRequest(async (req, res) => {
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
  let tokenSet = await xero.readTokenSet();
  if (tokenSet.expired()) {
    const validTokenSet = await xero.refreshToken();
    await saveXeroToken(validTokenSet)
    tokenSet = validTokenSet
  } 

  const rulesDoc = await db.collection('accounting-rules').doc(req.query.rule_id).get()
    if (!rulesDoc.exists) {
      res.send('No rule for id');
      return;
    }  
    rule = rulesDoc.data()
    res.send(rule)
})

function getOnwerGrossProfit(rule, xero){
  return new Promise(async function (resolve, reject) {
    let trackingCatagoriesResponse = {}
    try {
      trackingCatagoriesResponse = await xero.accountingApi.getTrackingCategories(rule.account.account_id)
    } catch(err) {
      console.log(err)
      reject("Error: getOnwerGrossProfit(): can not get tracking catagories")
    }
    const trackingCatagories = trackingCatagoriesResponse.body.trackingCategories
    let searchCatagories = []
    let catagoryId =""

      for(let i = 0; i < trackingCatagories.length; i++){
        if(trackingCatagories[i].name === "Property") {
          catagoryId = trackingCatagories[i].trackingCategoryID
          for(let j =0; j < trackingCatagories[i].options.length; j++) {
            if(rule.units_filter[trackingCatagories[i].options[j].name] !== undefined){
              searchCatagories.push(trackingCatagories[i].options[j])
            }
          }
        }
      }
      
      let reports = []
      for(let i = 0; i < searchCatagories.length; i++) {
        try {
          
          const plResponse = await xero.accountingApi.getReportProfitAndLoss(rule.account.account_id, moment().subtract(1,'months').startOf('month').format('YYYY-MM-DD'), moment().subtract(1,'months').endOf('month').format('YYYY-MM-DD'), undefined, undefined, catagoryId, undefined, searchCatagories[i].trackingOptionID);
          plResponse.body.reports[0].unit_name = searchCatagories[i].name
          reports.push(plResponse.body.reports[0])
        } catch (err) {
          console.log(err)
          reject("Error: getOnwerGrossProfit(): cannot get profit and loss report")
        }
       
      }

      let parsedReports = []
      for(let i = 0; i < reports.length; i++) {
        let summary ={unit_name: reports[i].unit_name,
                      }
        for(let j = 0; j <reports[i].rows.length; j++){
          let subRow1 = reports[i].rows[j]
          if(subRow1.rowType === "Section") {
            for(let k = 0; k < subRow1.rows.length; k++){
              let subRow2 = subRow1.rows[k]
              if( subRow2.cells[0].value === "Net Income") {
                summary.profit = subRow2.cells[1].value
              }
            }
            
          }
            
        }
        parsedReports.push(summary) 
      }
      resolve(parsedReports)
    })

}

function getCleaningRevenue(rule, xero){
  return new Promise(async function (resolve, reject) {
    let trackingCatagoriesResponse = {}
    try {
      trackingCatagoriesResponse = await xero.accountingApi.getTrackingCategories(rule.account.account_id)
    } catch(err) {
      console.log(err)
      reject("Error: getCommisionData(): can not get tracking catagories")
    }
    const trackingCatagories = trackingCatagoriesResponse.body.trackingCategories
    let searchCatagories = []
    let catagoryId =""

      for(let i = 0; i < trackingCatagories.length; i++){
        if(trackingCatagories[i].name === "Property") {
          catagoryId = trackingCatagories[i].trackingCategoryID
          for(let j =0; j < trackingCatagories[i].options.length; j++) {
            if(rule.units_filter[trackingCatagories[i].options[j].name] !== undefined){
              searchCatagories.push(trackingCatagories[i].options[j])
            }
          }
        }
      }
      
      let reports = []
      for(let i = 0; i < searchCatagories.length; i++) {
        try {
          
          const plResponse = await xero.accountingApi.getReportProfitAndLoss(rule.account.account_id, moment().subtract(1,'months').startOf('month').format('YYYY-MM-DD'), moment().subtract(1,'months').endOf('month').format('YYYY-MM-DD'), undefined, undefined, catagoryId, undefined, searchCatagories[i].trackingOptionID);
          plResponse.body.reports[0].unit_name = searchCatagories[i].name
          reports.push(plResponse.body.reports[0])
        } catch (err) {
          console.log(err)
          reject("Error: getCommisionData(): cannot get profit and loss report")
        }
       
      }

      let parsedReports = []
      for(let i = 0; i < reports.length; i++) {
        let summary ={unit_name: reports[i].unit_name,
                      cleaning_revenue: "0"}
        for(let j = 0; j <reports[i].rows.length; j++){
          let subRow1 = reports[i].rows[j]
          if(subRow1.rowType === "Section" && subRow1.title === "Revenue") {
            for(let k = 0; k < subRow1.rows.length; k++){
              let subRow2 = subRow1.rows[k]
              if( subRow2.cells[0].value === "Cleaning Fee Revenue") {
                summary.cleaning_revenue = subRow2.cells[1].value
              }
            }
            
          }
            
        }
        parsedReports.push(summary)
        
      }
      // for(let i = 0; i < parsedReports.length; i++){
      //   parsedReports[i].payout = BigNumber(parsedReports[i].revenue).minus(parsedReports[i].costs)
      //   parsedReports[i].commission = BigNumber(parsedReports[i].payout).times(rule.commission_rate).decimalPlaces(2, 4)
      // }
      resolve(parsedReports)
    })

}

function getCommissionData(rule, xero) {
  return new Promise(async function (resolve, reject) {
    let trackingCatagoriesResponse = {}
    try {
      trackingCatagoriesResponse = await xero.accountingApi.getTrackingCategories(rule.account.account_id)
    } catch(err) {
      console.log(err)
      reject("Error: getCommisionData(): can not get tracking catagories")
    }
    const trackingCatagories = trackingCatagoriesResponse.body.trackingCategories
    let searchCatagories = []
    let catagoryId =""

      for(let i = 0; i < trackingCatagories.length; i++){
        if(trackingCatagories[i].name === "Property") {
          catagoryId = trackingCatagories[i].trackingCategoryID
          for(let j =0; j < trackingCatagories[i].options.length; j++) {
            if(rule.units_filter[trackingCatagories[i].options[j].name] !== undefined){
              searchCatagories.push(trackingCatagories[i].options[j])
            }
          }
        }
      }
      
      let reports = []
      for(let i = 0; i < searchCatagories.length; i++) {
        try {
          
          const plResponse = await xero.accountingApi.getReportProfitAndLoss(rule.account.account_id, moment().subtract(1,'months').startOf('month').format('YYYY-MM-DD'), moment().subtract(1,'months').endOf('month').format('YYYY-MM-DD'), undefined, undefined, catagoryId, undefined, searchCatagories[i].trackingOptionID);
          plResponse.body.reports[0].unit_name = searchCatagories[i].name
          reports.push(plResponse.body.reports[0])
        } catch (err) {
          console.log(err)
          reject("Error: getCommisionData(): cannot get profit and loss report")
        }
       
      }

      let parsedReports = []
      for(let i = 0; i < reports.length; i++) {
        let summary ={unit_name: reports[i].unit_name,
                      revenue: "0",
                      costs: "0"}
        for(let j = 0; j <reports[i].rows.length; j++){
          let subRow1 = reports[i].rows[j]
          if(subRow1.rowType === "Section" && subRow1.title === "Revenue") {
            summary.revenue = subRow1.rows[subRow1.rows.length-1].cells[1].value
          }
          if(subRow1.rowType === "Section" && subRow1.title === "Less Cost of Sales") {
            for(let k = 0; k < subRow1.rows.length; k++){
              let subRow2 = subRow1.rows[k]
              if( subRow2.cells[0].value === "Rental Costs - Airbnb Service Fee") {
                summary.costs = BigNumber(summary.costs).plus(subRow2.cells[1].value).toString()
              }
              // if( subRow2.cells[0].value === "Rental Costs - Vrbo Base Commission Fee") {
              //   summary.costs = BigNumber(summary.costs).plus(subRow2.cells[1].value).toString()
              // }
              if( subRow2.cells[0].value === "Rental Costs - Vrbo Payment Processor Fee") {
                summary.costs = BigNumber(summary.costs).plus(subRow2.cells[1].value).toString()
              }
              if( subRow2.cells[0].value === "Payment Processing Fees") {
                summary.costs = BigNumber(summary.costs).plus(subRow2.cells[1].value).toString()
              }
            }
            
          }
        }
        parsedReports.push(summary)
        
      }
      for(let i = 0; i < parsedReports.length; i++){
        parsedReports[i].payout = BigNumber(parsedReports[i].revenue).minus(parsedReports[i].costs)
        parsedReports[i].commission = BigNumber(parsedReports[i].payout).times(rule.commission_rate).decimalPlaces(2, 4)
      }
      resolve(parsedReports)
    })

}

function getBankTxns(bankTxnIds, tennat_id, xero) {
  return new Promise(async function (resolve, reject) {
      let sourceTxns = []
      for(let i = 0; i < bankTxnIds.length; i++) {
        try {
          
          const getBankTransactionResponse = await xero.accountingApi.getBankTransaction(tennat_id, bankTxnIds[i])
          
          sourceTxns.push(getBankTransactionResponse.body.bankTransactions[0])
        } catch (err) {
          console.log(err)
          reject("Error: getBankTxns(): cannot get bank transaction")
        }
       
      }

      
      resolve(sourceTxns)
    })
}