const functions = require("firebase-functions");
const fs = require("fs");
const { credentials } = require("./development_credentials");
const { v4: uuidv4 } = require("uuid");
const { db } = require("./admin");
const { google } = require("googleapis");
const cors = require("cors")({ origin: true });
const SCOPES = [
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/documents",
  "https://mail.google.com/",
];
const moment = require("moment-timezone");
// const corsHandler = cors({ origin: true });

exports.updateUnit = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
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
});

exports.createOauth = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    const url = await oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES,
    });

    res.send({ url: url });
  });
});

exports.getUnits = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    let snapshot = {};

    if (req.query.active !== undefined) {
      const active = req.query.active === "true";
      snapshot = await db
        .collection("units")
        .where("active", "==", active)
        .get();
    } else {
      snapshot = await db.collection("units").get();
    }

    let data = [];
    snapshot.forEach((doc) => {
      data.push(doc.data());
    });
    res.send(data);
  });
});

exports.getOwnerByUnitId = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
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
});

exports.getUnitsbyId = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    const id = req.query.unitId;
    if (id) {
      const doc = await db.collection("units").doc(id).get();
      res.send(doc.data());
      return;
    } else {
      res.send("Unit id missing!");
    }
  });
});

exports.getListings = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
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
});

exports.getListingsById = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    const id = req.quuery.listing_id;
    const doc = await db.collection("listings").doc(id).get();

    res.send(doc.data());
  });
});

exports.updateListing = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    const id = req.query.id;
    const data = req.query.data;
    const result = await db
      .collection("listings")
      .doc(id)
      .set(data, { merge: true });
    res.send(result);
  });
});

exports.getOwners = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
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
});

exports.getOwnersById = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    const id = req.query.owner_id;
    const doc = await db.collection("owners").doc(id).get();

    res.send(doc.data());
  });
});

exports.updateOwner = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
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
});

exports.getTeam = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    let snapshot = {};
    if (req.query.active !== undefined) {
      const active = req.query.active === "true";
      snapshot = await db
        .collection("team")
        .where("active", "==", active)
        .get();
    } else {
      snapshot = await db.collection("team").get();
    }

    let data = [];
    snapshot.forEach((doc) => {
      data.push(doc.data());
    });
    res.send(data);
  });
});

exports.getTeammateById = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    const id = req.query.teammate_id;
    const doc = await db.collection("team").doc(id).get();
    res.send(doc.data());
  });
});

exports.updateTeammate = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
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
});

exports.checkSignup = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
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
});

exports.getCalendar = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    let snapshot = {};
    const unit_id = req.query.unitId;
    if (unit_id) {
      const unitRef = await db.collection("units").doc(unit_id).get();
      snapshot = await db
        .collection("calendar")
        .where("unit_id", "==", unit_id)
        .get();
      let data = [];
      snapshot.forEach((doc) => {
        let arrayDate = [];
        const dateRef = Object.values(doc.data().days);
        dateRef.find((value) => {
          if (value.reservation.reservation_id) {
            arrayDate.push(value);
          }
        });

        const responce = arrayDate.reduce((res, obj) => {
          if (!res[obj.reservation.reservation_id])
            res[obj.reservation.reservation_id] = [];
          res[obj.reservation.reservation_id].push(obj);
          return res;
        }, {});

        const responce123 = Object.values(responce).map((res) => {
          const sortedData = res.sort((a, b) =>
            new Date(a.date).getTime() > new Date(b.date).getTime() ? 1 : -1
          );
          if (sortedData?.length) {
            return {
              ...sortedData[0],
              start_date: sortedData[0].date,
              end_date: moment(sortedData[sortedData.length - 1].date)
                .add(1, "d")
                .format("YYYY-MM-DD"),
            };
          }
        });

        data.push({
          ...doc.data(),
          id: doc.id,
          responce: responce123,
          unit: unitRef.data(),
        });
      });
      if (snapshot.size) {
        res.send(data[0]);
        return;
      } else {
        res.send("No record found");
        return;
      }
    } else {
      res.send("Unit Id is missing!");
    }
  });
});

exports.updateCalendar = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
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
            day: day,
            price: {
              price: price * 10,
              currency: currency,
            },
            status: { available: true },
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
      if (adCalendar.empty) {
        res.send("no record found");
        return;
      } else {
        if (
          adCalendar.size &&
          adCalendar.docs[0]?.id &&
          adCalendar.docs[0]?.data()
        ) {
          const daysData = Object.values(adCalendar?.docs[0]?.data()?.days);
          daysData.find((ele) => {
            if (ele.date === date) {
              db.collection("ad-calendar")
                .doc(adCalendar.docs[0]?.id)
                .set(adData, { merge: true });
              res.send({
                calendarId: calendarId,
                ad_calendar_uuid: adCalendar.docs[0]?.id,
              });
              return;
            }
          });
        } else {
          res.send("No record foundsss");
          return;
        }
      }
    } catch (error) {
      res.send(error);
    }
  });
});

// exports.blockDate = functions.https.onRequest( async (req, res) => {
//   const { id } = req.body;
//   console.log("req", id);
// });

exports.getReservationsByUnit = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    const unit_id = req.query.unit_id;
    const querysnapshot = db.collection("units").doc(unit_id);
    await querysnapshot.get().then(async (doc) => {
      if (doc.exists) {
        const reservationRef = await db
          .collection("reservations")
          .where("hospitable_id", "==", doc?.data()?.hospitable_id)
          .get();
        let data = [];
        reservationRef.forEach((docs) => {
          data.push({ ...docs.data() });
        });

        if (reservationRef.size) {
          res.send(data);
          return;
        } else {
          res.send("No Record found");
          return;
        }
      }
    });
  });
});

exports.getReservationsDetail = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    const reservation_id = req.query.reservation_id;
    const snapshot = await db
      .collection("reservations")
      .doc(reservation_id)
      .get();
    if (snapshot.exists) {
      res.send({ reservation: snapshot.data() });
      return;
    } else {
      res.send("No record found");
      return;
    }
  });
});

// exports.midnightSchedule = functions.https.onRequest(async (req, res) => {
exports.midnightSchedule = functions.pubsub
  .schedule("0 0 * * *")
  .onRun(async (context) => {
    await db
      .collection("calendar")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach(async (doc) => {
          const data = doc.data().days;
          let list = Object.entries(data).reduce((acc, cuu) => {
            const values = {
              ...cuu[1],
              status: {
                note: "",
                reason:
                  cuu?.[1]?.date < moment(new Date()).format("YYYY-MM-DD")
                    ? "BLOCKED"
                    : cuu?.[1]?.status?.reason,
                available:
                  cuu?.[1]?.date < moment(new Date()).format("YYYY-MM-DD")
                    ? false
                    : cuu?.[1]?.status?.available,
              },
            };
            acc[cuu[0]] = values;
            return acc;
          }, {});
          // if (doc.id == "NRPEH61xmiEZpOFQGmfI") {
          await db.collection("calendar").doc(doc.id).set(
            {
              days: list,
            },
            { merge: true }
          );
          // }
        });
      });
    adCalendarCollection();
    // res.send("set suucess");
    return "set suucess";
  });

const adCalendarCollection = async () => {
  let adCalendarRef = [];
  await db
    .collection("ad-calendar")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let changedDate = [];
        const dateList = Object.values(doc.data().days);
        dateList.map((values) => {
          if (values.date < moment(new Date()).format("YYYY-MM-DD")) {
            changedDate.push({
              day: values?.day,
              date: values?.date,
              price: {
                price: values?.price.price,
                currency: values?.price.currency,
              },
              status: {
                available: false,
              },
            });
          }
        });
        adCalendarRef.push({ id: doc.id, days: changedDate });
      });
      let temprecord = {};
      adCalendarRef.map(async (item) => {
        item.days.map((e) => (temprecord[e.date] = e));
        await db.collection("ad-calendar").doc(item.id).set(
          {
            days: temprecord,
          },
          { merge: true }
        );
      });
    });
};

exports.staticData = functions.https.onRequest(async (req, res) => {
  const id = req.query.id;
  const tempRecord = [];
  const adCalendarRef = await db.collection("ad-calendar").doc(id).get();
  if (adCalendarRef.exists) {
    const calendarRef = await db
      .collection("calendar")
      .where("unit_id", "==", adCalendarRef.data().unit_id)
      .get();

    // const dateList = Object.values(adCalendarRef.data().days);
    // dateList.map((item) => {
    //   tempRecord.push({
    //     reservation: {
    //       first_name: "",
    //       picture: "",
    //       last_name: "",
    //       reservation_id: "",
    //     },
    //     min_stay: 2,
    //     day: item?.day,
    //     date: item?.date,
    //     price: {
    //       price: 10000,
    //       currency: item?.price?.currency,
    //     },
    //     status: {
    //       note: "",
    //       reason: "AVAILABLE",
    //       available: true,
    //     },
    //   });
    // });
    const data = adCalendarRef.data().days;
    let list = Object.entries(data).reduce((acc, cuu) => {
      const values = {
        ...cuu[1],
        reservation: {
          first_name: "",
          picture: "",
          last_name: "",
          reservation_id: "",
        },
        status: {
          note: "",
          reason: "AVAILABLE",
          available: true,
        },
        min_stay: 2,
      };
      acc[cuu[0]] = values;
      return acc;
    }, {});
    console.log("ID: ", calendarRef?.docs[0]?.id);
    await db.collection("calendar").doc(calendarRef?.docs[0]?.id).set(
      {
        days: list,
      },
      { merge: true }
    );
  }
  // let temp = {};
  // tempRecord.map(async (item) => {
  //   item.days.map((e) => (temp[e.date] = e));

  // });
  // tempRecord.push(docs.data().days);
  res.send(adCalendarRef.data());
});

// function setUnitFolder(data, offices) {
//   return new Promise(function (resolve, reject) {
//     const jwt = new google.auth.JWT(
//       credentials.service_account.client_email,
//       null,
//       credentials.service_account.private_key,
//       SCOPES
//     );
//     const drive = google.drive({ version: "v3" });

//     drive.files.create(
//       {
//         requestBody: {
//           name: "- " + data.name,
//           mimeType: "application/vnd.google-apps.folder",
//           parents: [offices[data.office]],
//         },
//         fields: "id",
//         auth: jwt,
//         key: credentials.api_key,
//       },
//       (err, file) => {
//         if (err) {
//           reject(err);
//         }
//         data.unit_folder =
//           "https://drive.google.com/drive/u/0/folders/" + file.data.id;
//         resolve(data);
//       }
//     );
//   });
// }
// function setPhotosFolder(data) {
//   return new Promise(function (resolve, reject) {
//     const jwt = new google.auth.JWT(
//       credentials.service_account.client_email,
//       null,
//       credentials.service_account.private_key,
//       SCOPES
//     );

//     const drive = google.drive({ version: "v3" });

//     drive.files.create(
//       {
//         requestBody: {
//           name: "Photos - " + data.name,
//           mimeType: "application/vnd.google-apps.folder",
//           parents: data.unit_folder.match(/([^\/]+$)/g),
//         },
//         fields: "id",
//         auth: jwt,
//         key: credentials.api_key,
//       },
//       (err, file) => {
//         if (err) {
//           reject(err);
//         }
//         data.unit_folder =
//           "https://drive.google.com/drive/u/0/folders/" + file.data.id;
//         resolve(data);
//       }
//     );
//   });
// }

// function setFile(data, file) {
//   return new Promise(function (resolve, reject) {
//     const jwt = new google.auth.JWT(
//       credentials.service_account.client_email,
//       null,
//       credentials.service_account.private_key,
//       SCOPES
//     );
//     const drive = google.drive({ version: "v3" });

//     const request = {
//       fileId: file.fileId,
//       requestBody: {
//         name: file.fileName + data.name,
//         parents: data.unit_folder.match(/([^\/]+$)/g),
//       },
//       auth: jwt,
//       key: credentials.api_key,
//     };

//     drive.files.copy(request, (err, res) => {
//       if (err) {
//         reject(err);
//       }
//       if (file.url !== undefined) {
//         data[file.property] = file.url + res.data.id + "/edit";
//         resolve(data);
//       }
//       resolve(data);
//     });
//   });
// }

// function createDisplayAddress(data) {
//   let displayAddress = "";
//   displayAddress += data.address.street + ", ";
//   displayAddress += data.address.number + ", ";
//   displayAddress += data.address.city + " ";
//   displayAddress += data.address.state + ", ";
//   displayAddress += data.address.postcode;
//   return displayAddress;
// }

// function getNextUnitId() {
//   return new Promise(function (resolve, reject) {
//     db.collection("units")
//       .orderBy("id", "desc")
//       .limit(1)
//       .get()
//       .then((res, err) => {
//         if (err) {
//           reject(err);
//         }
//         let strId = "";
//         res.forEach((doc) => {
//           strId = (parseInt(doc.data().id) + 1).toString();
//           while (strId.length < 6) strId = "0" + strId;
//         });
//         resolve(strId);
//       });
//   });
// }

// function test(data, auth) {
//   return new Promise(function (resolve, reject) {
//     const drive = google.drive({ version: "v3" });

//     drive.files.create(
//       {
//         requestBody: {
//           name: "-  + data.name",
//           mimeType: "application/vnd.google-apps.folder",
//           parents: ["1ea_YNLcyqQ0aDTDEcodfyeB76em0l4Vz"],
//         },
//         fields: "id",
//         auth: jwt,
//         key: credentials.api_key,
//       },
//       (err, file) => {
//         if (err) {
//           reject(err);
//         }
//         resolve(file);
//       }
//     );
//   });
// }
// mgmt.get("/test", async (req, res) => {});
