const functions = require("firebase-functions");
const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const moment = require("moment-timezone");
const mgmt = express();
const cors = require("cors");
const { credentials } = require("./credentials");
const { v4: uuidv4 } = require("uuid");
const { db } = require("./admin");
const { google } = require("googleapis");
const { log } = require("console");
const SCOPES = [
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/documents",
  "https://mail.google.com/",
];

// const oauth2Client = new google.auth.OAuth2(
//   credentials.web.client_id,
//   credentials.web.client_secret,
//   credentials.web.redirect_uris[2]
// );
// oauth2Client.setCredentials({
//   refresh_token: credentials.refresh_token,
// });

mgmt.use(bodyParser.json());
mgmt.use(bodyParser.urlencoded({ extended: false }));

mgmt.use(cors({ origin: true }));

mgmt.post("/updateUnit", async (req, res) => {
  let data = req.body;

  try {
    if (data.id === "") {
      data.id = await getNextUnitId();
      fileVars = await (
        await db.collection("variables").doc("onboardingFiles").get()
      ).data();
      data = await setUnitFolder(data, fileVars.offices);
      const files = fileVars.files;
      const length = Object.keys(files).length;
      for (let i = 0; i < length; i++) {
        data = await setFile(data, files[i]);
      }
      data = await setPhotosFolder(data);
      //data = await setPhotosFolder(data);
    }
  } catch (err) {
    console.log(err);
  }

  if (data.owner[0] !== undefined) {
    data.owner = data.owner[0];
  }

  data.address.display = createDisplayAddress(data);

  try {
    await db.collection("units").doc(data.id).set(data, { merge: true });

    res.send({ id: data.id });
  } catch (err) {
    res.send(err);
  }
});

mgmt.get("/createOauth", async (req, res) => {
  const url = await oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });

  res.send({ url: url });
});

mgmt.get("/oauth2callback", async (req, res) => {
  const code = req.query.code;
  console.log(code);
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    console.log(tokens);

    res.send({ tokens });
  } catch (err) {
    res.send(err);
  }
});
mgmt.get("/getUnits", async (req, res) => {
  let snapshot = {};
  if (req.query.active !== undefined) {
    const active = req.query.active === "true";
    snapshot = await db.collection("units").where("active", "==", active).get();
  } else {
    snapshot = await db.collection("units").get();
  }

  let data = [];
  snapshot.forEach((doc) => {
    data.push(doc.data());
  });
  res.send(data);
});

mgmt.get("/getOwnerByUnitId", async (req, res) => {
  const unitName = req.body.query.unit_name;
  const snapshot = await db
    .collection("owners")
    .where("units." + unitName + ".name", "==", unitName)
    .where("partnership", "==", true)
    .get();

  let data = [];
  snapshot.forEach((doc) => {
    data.push(doc.data());
  });
  res.send(data);
});

mgmt.get("/getUnits/:unit_id", async (req, res) => {
  const id = req.params.unit_id;
  const doc = await db.collection("units").doc(id).get();

  res.send(doc.data());
});

mgmt.get("/getListings", async (req, res) => {
  if (req.query.available !== undefined) {
    const available = req.query.available === "true";
    const snapshot = await db
      .collection("listings")
      .where("available", "==", available)
      .get();
  } else {
    const snapshot = await db.collection("listings").get();
  }

  let data = [];
  snapshot.forEach((doc) => {
    data.push(doc.data());
  });
  res.send(data);
});

mgmt.get("/getListings/:listing_id", async (req, res) => {
  const id = req.params.listing_id;
  const doc = await db.collection("listings").doc(id).get();

  res.send(doc.data());
});

mgmt.post("/updateListing", async (req, res) => {
  const id = req.query.id;
  const data = req.query.data;
  const result = await db
    .collection("listings")
    .doc(id)
    .set(data, { merge: true });
  res.send(result);
});

mgmt.get("/getOwners", async (req, res) => {
  let snapshot = {};
  if (req.query.active !== undefined) {
    const active = req.query.active === "true";
    snapshot = await db
      .collection("owners")
      .where("active", "==", active)
      .get();
  } else {
    snapshot = await db.collection("owners").get();
  }

  let data = [];
  snapshot.forEach((doc) => {
    data.push(doc.data());
  });
  res.send(data);
});

mgmt.get("/getOwners/:owner_id", async (req, res) => {
  const id = req.params.owner_id;
  const doc = await db.collection("owners").doc(id).get();

  res.send(doc.data());
});

mgmt.post("/updateOwner", async (req, res) => {
  let data = req.body;
  if (data.uuid === "") {
    data.uuid = uuid4();
  }

  let newUnits = {};
  for (let i = 0; i < data.units.length; i++) {
    newUnits[data.units[i]] = data.units[i];
  }
  data.units = newUnits;

  try {
    await db.collection("owners").doc(data.uuid).set(data, { merge: true });
    res.send({ uuid: data.uuid });
  } catch (err) {
    res.send(err);
  }
});

mgmt.get("/getTeam", async (req, res) => {
  let snapshot = {};
  if (req.query.active !== undefined) {
    const active = req.query.active === "true";
    snapshot = await db.collection("team").where("active", "==", active).get();
  } else {
    snapshot = await db.collection("team").get();
  }

  let data = [];
  snapshot.forEach((doc) => {
    data.push(doc.data());
  });
  res.send(data);
});

mgmt.get("/getTeam/:teammate_id", async (req, res) => {
  const id = req.params.teammate_id;
  const doc = await db.collection("team").doc(id).get();
  res.send(doc.data());
});

mgmt.post("/updateTeammate", async (req, res) => {
  let data = req.body;
  if (data.uuid === "") {
    data.uuid = uuidv4();
  }

  data.address.display = createDisplayAddress(data);
  try {
    await db.collection("team").doc(data.uuid).set(data, { merge: true });
    res.send({ uuid: data.uuid });
  } catch (err) {
    res.send(err);
  }
});

mgmt.post("/checkSignup", async (req, res) => {
  let data = req.body;

  try {
    const snapshot = await db
      .collection("team")
      .where("email", "==", data.email)
      .get();

    res.send({ allowed: !snapshot.empty });
  } catch (err) {
    res.send(err);
  }
});

mgmt.get("/getCalendar/:unitId", async (req, res) => {
  let snapshot = {};
  const unitId = req.params.unitId;
  snapshot = await db
    .collection("calendar")
    .where("unitId", "==", unitId)
    .get();
  let data = [];
  snapshot.forEach((doc) => {
    data.push({ ...doc.data(), id: doc.id });
  });
  if (snapshot.size) {
    res.send(data[0]);
    return;
  } else {
    res.send("No record found");
    return;
  }
});

mgmt.post("/updateCalendar", async (req, res) => {
  const { id, date, min_stay, price, currency, calendarId, day, reason } =
    req.body;
  const data = {
    days: {
      [date && date]: {
        date: date,
        day: day,
        min_stay: min_stay,
        price: {
          currency: currency,
          price: price * 10,
        },
        status: {
          reason: reason,
        },
      },
    },
  };
  try {
    const adData = {
      days: {
        [date && date]: {
          date: date,
          min_stay: min_stay,
          price: {
            amount: price * 10, 
            currency: currency,
          },
        },
      },
    };
    const adCalendar = await db
      .collection("ad-calendar")
      .where("unit_id", "==", id)
      .get();
    let adCalendarData = [];
    let daysData = [];
    adCalendar.forEach((docs) =>
      adCalendarData.push({ ...docs.data(), id: docs.id })
    );
    adCalendarData.map((item) => {
      if (item?.days) {
        daysData = Object.values(item.days);
        daysData.map((ele) => {
          if (ele.date === date) {
            db.collection("calendar")
              .doc(calendarId)
              .set(data, { merge: true });
            db.collection("ad-calendar")
              .doc(item?.id)
              .set(adData, { merge: true });
            res.send("Update record");
            return;
          } else {
            res.send("No record found");
            return;
          }
        });
        return;
      }
    });
  } catch (error) {
    res.send(error);
  }
});

mgmt.get("/getReservations/:unitId", async (req, res) => {
  let snapshot = {};
  const unitId = req.params.unitId;
  snapshot = await db
    .collection("reservations")
    .where("explore.unitId", "==", unitId)
    .get();
  let data = [];
  snapshot.forEach((doc) => {
    data.push(doc.data());
  });
  if (snapshot.size) {
    res.send(data);
    return;
  } else {
    res.send("No record found");
    return;
  }
});

function setUnitFolder(data, offices) {
  return new Promise(function (resolve, reject) {
    const jwt = new google.auth.JWT(
      credentials.service_account.client_email,
      null,
      credentials.service_account.private_key,
      SCOPES
    );
    const drive = google.drive({ version: "v3" });

    drive.files.create(
      {
        requestBody: {
          name: "- " + data.name,
          mimeType: "application/vnd.google-apps.folder",
          parents: [offices[data.office]],
        },
        fields: "id",
        auth: jwt,
        key: credentials.api_key,
      },
      (err, file) => {
        if (err) {
          reject(err);
        }
        data.unit_folder =
          "https://drive.google.com/drive/u/0/folders/" + file.data.id;
        resolve(data);
      }
    );
  });
}
function setPhotosFolder(data) {
  return new Promise(function (resolve, reject) {
    const jwt = new google.auth.JWT(
      credentials.service_account.client_email,
      null,
      credentials.service_account.private_key,
      SCOPES
    );

    const drive = google.drive({ version: "v3" });

    drive.files.create(
      {
        requestBody: {
          name: "Photos - " + data.name,
          mimeType: "application/vnd.google-apps.folder",
          parents: data.unit_folder.match(/([^\/]+$)/g),
        },
        fields: "id",
        auth: jwt,
        key: credentials.api_key,
      },
      (err, file) => {
        if (err) {
          reject(err);
        }
        data.unit_folder =
          "https://drive.google.com/drive/u/0/folders/" + file.data.id;
        resolve(data);
      }
    );
  });
}

function setFile(data, file) {
  return new Promise(function (resolve, reject) {
    const jwt = new google.auth.JWT(
      credentials.service_account.client_email,
      null,
      credentials.service_account.private_key,
      SCOPES
    );
    const drive = google.drive({ version: "v3" });

    const request = {
      fileId: file.fileId,
      requestBody: {
        name: file.fileName + data.name,
        parents: data.unit_folder.match(/([^\/]+$)/g),
      },
      auth: jwt,
      key: credentials.api_key,
    };

    drive.files.copy(request, (err, res) => {
      if (err) {
        console.log("Rejecting because of error");
        reject(err);
      }
      if (file.url !== undefined) {
        data[file.property] = file.url + res.data.id + "/edit";
        resolve(data);
      }
      resolve(data);
    });
  });
}

function createDisplayAddress(data) {
  let displayAddress = "";
  displayAddress += data.address.street + ", ";
  displayAddress += data.address.number + ", ";
  displayAddress += data.address.city + " ";
  displayAddress += data.address.state + ", ";
  displayAddress += data.address.postcode;
  return displayAddress;
}

function getNextUnitId() {
  return new Promise(function (resolve, reject) {
    db.collection("units")
      .orderBy("id", "desc")
      .limit(1)
      .get()
      .then((res, err) => {
        if (err) {
          reject(err);
        }
        let strId = "";
        res.forEach((doc) => {
          strId = (parseInt(doc.data().id) + 1).toString();
          while (strId.length < 6) strId = "0" + strId;
        });
        resolve(strId);
      });
  });
}

function test(data, auth) {
  return new Promise(function (resolve, reject) {
    const drive = google.drive({ version: "v3" });

    drive.files.create(
      {
        requestBody: {
          name: "-  + data.name",
          mimeType: "application/vnd.google-apps.folder",
          parents: ["1ea_YNLcyqQ0aDTDEcodfyeB76em0l4Vz"],
        },
        fields: "id",
        auth: jwt,
        key: credentials.api_key,
      },
      (err, file) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        console.log(file);
        resolve(file);
      }
    );
  });
}
mgmt.get("/test", async (req, res) => {});

exports.mgmt = functions.https.onRequest(mgmt);
