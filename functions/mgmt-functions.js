const functions = require("firebase-functions");
const fs = require("fs");
const { credentials } = require("./development_credentials");
const { v4: uuidv4 } = require("uuid");
const { db } = require("./admin");
const { google } = require("googleapis");
const SCOPES = [
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/documents",
  "https://mail.google.com/",
];

exports.updateUnit = functions.https.onRequest( async (req, res) => {
  let data = req.body;
  // try {
  //   if (data.id === "") {
  //     data.id = await getNextUnitId();
  //     fileVars = await (
  //       await db.collection("variables").doc("onboardingFiles").get()
  //     ).data();
  //     data = await setUnitFolder(data, fileVars.offices);
  //     const files = fileVars.files;
  //     const length = Object.keys(files).length;
  //     for (let i = 0; i < length; i++) {
  //       data = await setFile(data, files[i]);
  //     }
  //     data = await setPhotosFolder(data);
  //     //data = await setPhotosFolder(data);
  //   }
  // } catch (err) {
  //   console.log(err);
  // }

  // if (data.owner[0] !== undefined) {
  //   data.owner = data.owner[0];
  // }

  // data.address.display = createDisplayAddress(data);

  try {
    // await db.collection("units").doc(data.id).set(data, { merge: true });
    await db.collection("units").doc(data.id).set(data);

    res.send({ id: data.id });
  } catch (err) {
    res.send(err);
  }
});
exports.createOauth = functions.https.onRequest( async (req, res) => {
  const url = await oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });

  res.send({ url: url });
});

exports.getUnits = functions.https.onRequest(async (req, res) => {
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

exports.getOwnerByUnitId = functions.https.onRequest( async (req, res) => {
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

exports.getUnitsbyId = functions.https.onRequest(async (req, res) => {
  const id = req.query.unit_id;
  const doc = await db.collection("units").doc(id).get();

  res.send(doc.data());
});

exports.getListings = functions.https.onRequest( async (req, res) => {
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

exports.getListingsById = functions.https.onRequest(async (req, res) => {
  const id = req.quuery.listing_id;
  const doc = await db.collection("listings").doc(id).get();

  res.send(doc.data());
});

exports.updateListing = functions.https.onRequest( async (req, res) => {
  const id = req.query.id;
  const data = req.query.data;
  const result = await db
    .collection("listings")
    .doc(id)
    .set(data, { merge: true });
  res.send(result);
});

exports.getOwners = functions.https.onRequest( async (req, res) => {
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

exports.getOwnersById = functions.https.onRequest( async (req, res) => {
  const id = req.query.owner_id;
  const doc = await db.collection("owners").doc(id).get();

  res.send(doc.data());
});

exports.updateOwner = functions.https.onRequest( async (req, res) => {
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

exports.getTeam = functions.https.onRequest( async (req, res) => {
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

exports.getTeammateById = functions.https.onRequest(async (req, res) => {
  const id = req.query.teammate_id;
  const doc = await db.collection("team").doc(id).get();
  res.send(doc.data());
});

exports.updateTeammate = functions.https.onRequest( async (req, res) => {
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

exports.checkSignup = functions.https.onRequest(async (req, res) => {
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

exports.getCalendar = functions.https.onRequest( async (req, res) => {
  let snapshot = {};
  const unit_id = req.params.unit_id;
  snapshot = await db
    .collection("calendar")
    .where("unit_id", "==", unit_id)
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

exports.updateCalendar = functions.https.onRequest( async (req, res) => {
  const { id, date, min_stay, price, currency, calendarId, day, reason } =
    req.body;
  try {
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
    const getCalendar = await db.collection("calendar").doc(calendarId).get();
    if (getCalendar.exists) {
      db.collection("calendar").doc(calendarId).set(data, { merge: true });
    }
    const adCalendar = await db
      .collection("ad-calendar")
      .where("unit_id", "==", id)
      .get();
    let adCalendarData = [];
    let daysData = [];
    if (adCalendar.empty) {
      res.send("no record found");
      return;
    } else {
      adCalendar.forEach((docs) =>
        adCalendarData.push({ ...docs.data(), id: docs.id })
      );
      if (adCalendarData) {
        adCalendarData.map((item) => {
          if (item?.days) {
            daysData = Object.values(item.days);
            daysData.map((ele) => {
              if (ele.date === date) {
                db.collection("ad-calendar")
                  .doc(item?.id)
                  .set(adData, { merge: true });
                res.send({
                  calendarId: calendarId,
                  ad_calendar_uuid: item?.id,
                });
                return;
              } else {
                res.send("No record found");
                return;
              }
            });
          }
        });
      } else {
        res.send("No record found");
        return;
      }
    }
  } catch (error) {
    res.send(error);
  }
});

// exports.blockDate = functions.https.onRequest( async (req, res) => {
//   const { id } = req.body;
//   console.log("req", id);
// });

exports.getReservationsByUnit = functions.https.onRequest( async (req, res) => {
  let snapshot = {};
  const unit_id = req.query.unit_id;
  snapshot = await db
    .collection("my-stays")
    .where("unit_id", "==", unit_id)
    .get();
  let data = [];
  snapshot.forEach((docs) => {
    data.push({ ...docs.data(), id: docs.id });
  });
  if (snapshot.size) {
    res.send(data);
    return;
  } else {
    res.send("No record found");
    return;
  }
});

exports.getReservationsDetail = functions.https.onRequest( async (req, res) => {
  let snapshot = {};
  const reservation_id = req.query.reservation_id;
  snapshot = await db.collection("my-stays").doc(reservation_id).get();
  if (snapshot.exists) {
    res.send(snapshot.data());
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
          reject(err);
        }
        resolve(file);
      }
    );
  });
}


