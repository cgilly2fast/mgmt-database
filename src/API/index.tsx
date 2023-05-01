import axios from "axios";
import ApiUrl from "../globalVariables";
import firebase from "firebase/app";
import moment from "moment";
import messageRules from "../MessageRules/messageRules.json";
import { db } from "../config/firebase";
import { v4 } from "uuid";
import {
  OwnerType,
  UnitsType,
  addownerstype,
  calendertype,
  eventsListtype,
  teamtype,
  tempDatatype,
  threadByIdtype,
} from "./Types";

export const getOwners = async () => {
  return new Promise(async function (resolve, reject) {
    try {
      const snapshot = await db
        .collection("owners")
        .where("active", "==", true)
        .get();
      let data: addownerstype[] = [];
      snapshot.forEach((doc) => {
        const values = doc.data() as addownerstype;
        return data.push({ ...values, id: doc.id });
      });
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
};

export const getActiveUnits = async () => {
  return new Promise(async function (resolve, reject) {
    try {
      const snapshot = await db
        .collection("units")
        .where("active", "==", true)
        .get();
      let data: UnitsType[] = [];
      snapshot.forEach((doc) => {
        const values = doc.data() as UnitsType;
        return data.push({ ...values, id: doc.id });
      });
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
};

export const getTeammateById = async (id) => {
  return new Promise(async function (resolve, reject) {
    try {
      const doc = await db.collection("team").doc(id).get();
      if (!doc.exists) {
        reject("No document for id");
      }
      resolve(doc.data());
    } catch (error) {
      reject(error);
    }
  });
};

export const getUnitById = async (id) => {
  return new Promise(async function (resolve, reject) {
    try {
      const doc = await db.collection("units").doc(id).get();
      if (!doc.exists) {
        reject("No document for id");
      }
      resolve({ ...doc.data(), id: doc.id });
    } catch (error) {
      reject(error);
    }
  });
};

export const getTeam = async () => {
  return new Promise(async function (resolve, reject) {
    try {
      const snapshot = await db
        .collection("team")
        .where("active", "==", true)
        .get();
      let data: teamtype[] = [];
      snapshot.forEach((doc) => {
        const values = doc.data() as teamtype;
        return data.push({ ...values });
      });
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
};

export const getUnits = async () => {
  return new Promise(async function (resolve, reject) {
    try {
      const snapshot = await db
        .collection("units")
        .where("active", "==", true)
        .get();
      let data: OwnerType[] = [];
      snapshot.forEach((doc) => {
        const values = doc.data() as OwnerType;
        return data.push({ ...values });
      });
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
};

export const getOwnerById = async (id) => {
  return new Promise(async function (resolve, reject) {
    try {
      const doc = await db.collection("owners").doc(id).get();
      if (!doc.exists) {
        reject("No document for id");
      }
      resolve(doc.data());
    } catch (error) {
      reject(error);
    }
  });
};

export const getCalendar = async (unit_id, setLoading) => {
  return new Promise(async function (resolve, reject) {
    try {
      if (unit_id) {
        const unitRef = await db.collection("units").doc(unit_id).get();
        const calendarRef = await db
          .collection("calendar")
          .doc(unit_id + "_CURRENT")
          .get();
        const calendarDoc = calendarRef?.data();
        if (!calendarDoc?.days) {
          setLoading(false);
          reject("No record found");
        } else {
          const dateRef = Object.values(calendarDoc?.days);

          let data: calendertype[] = [];
          let arrayDate: calendertype[] = [];

          dateRef?.find((value: any) => {
            if (value.reservation.reservation_id) {
              arrayDate.push(value);
            }
          });

          const reservationDates = arrayDate.reduce((res, obj) => {
            if (!res[obj.reservation.reservation_id])
              res[obj.reservation.reservation_id] = [];
            res[obj.reservation.reservation_id].push(obj);
            return res;
          }, {});
          // Use better variable names
          const response = Object.values(reservationDates).map((res: any) => {
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

          const values = calendarDoc as calendertype;
          data.push({ ...values, id: calendarRef?.id });

          if (calendarRef?.exists) {
            setLoading(false);
            resolve(data[0]);
          }
        }
      } else {
        reject("Unit Id is missing!");
      }
    } catch (error) {
      reject(error);
    }
  });
};

export const getAllCalendar = async () => {
  return new Promise(async function (resolve, reject) {
    try {
      let snapshot;
      snapshot = await db.collection("calendar").get();
      let data: calendertype[] = [];
      snapshot?.docs?.forEach(async (item) => {
        let arrayDate: calendertype[] = [];
        const dateRef = Object.values(item.data()?.days);
        dateRef.find((value: any) => {
          if (value?.reservation?.reservation_id) {
            arrayDate.push(value);
          }
        });

        const reservationDatesBooked = arrayDate.reduce((res, obj) => {
          if (!res[obj.reservation.reservation_id])
            res[obj.reservation.reservation_id] = [];
          res[obj.reservation.reservation_id].push(obj);
          return res;
        }, {});

        const sortReservationStartandEndDate: any = Object.values(
          reservationDatesBooked
        ).map((res: any) => {
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

        data.push(sortReservationStartandEndDate);
      });
      if (snapshot.size) {
        resolve(data);
      } else {
        reject("No record found");
      }
    } catch (error) {
      reject(error);
    }
  });
};

export const getAllCalendarWithPrice = async () => {
  return new Promise(async function (resolve, reject) {
    try {
      let snapshot;
      snapshot = await db.collection("calendar").get();
      let data: calendertype[] = [];
      snapshot?.docs?.forEach(async (item) => {
        let arrayDate: calendertype[] = [];
        const dateRef = Object.values(item.data().days);
        dateRef.find((value: any) => {
          if (value.reservation.reservation_id) {
            arrayDate.push(value);
          }
        });

        const reservationDatesBooked = arrayDate.reduce((res, obj) => {
          if (!res[obj.reservation.reservation_id])
            res[obj.reservation.reservation_id] = [];
          res[obj.reservation.reservation_id].push(obj);
          return res;
        }, {});

        const sortReservationStartandEndDate = Object.values(
          reservationDatesBooked
        ).map((res: any) => {
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
              unit_id: item?.data()?.unit_id,
            };
          }
        });

        const values = item.data() as calendertype;
        data.push({
          ...values,
          unit_id: item?.data()?.unit_id,
          response: sortReservationStartandEndDate,
        });
      });
      if (snapshot.size) {
        resolve(data);
      } else {
        reject("No record found");
      }
    } catch (error) {
      reject(error);
    }
  });
};

export const getUnitsByHospitableId = async (id) => {
  return new Promise(async function (resolve, reject) {
    try {
      const snapshot = await db
        .collection("units")
        .where("hospitable_id", "==", id)
        .get();
      resolve({ ...snapshot?.docs[0]?.data(), id: snapshot?.docs[0]?.id });
    } catch (error) {
      reject(error);
    }
  });
};

export const getReservationsDetail = async (id) => {
  return new Promise(async function (resolve, reject) {
    try {
      const snapshot = await db.collection("reservations").doc(id).get();
      // let data = [];
      // snapshot.forEach(doc => {
      //   data.push({ ...doc.data(), id: doc.id });
      // });
      resolve({ ...snapshot.data(), id: snapshot.id });
    } catch (error) {
      reject(error);
    }
  });
};

export const getConnections = async () => {
  return new Promise(async function (resolve, reject) {
    try {
      const snapshot = await db.collection("accounts").get();
      let data: tempDatatype[] = [];
      snapshot.forEach((doc) => {
        const values = doc.data() as tempDatatype;
        return data.push({ ...values });
      });
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
};

export const getAmenities = async (id) => {
  return new Promise(async function (resolve, reject) {
    try {
      const snapshot = await db.collection("amenities").doc(id).get();
      resolve(snapshot.data());
    } catch (error) {
      reject(error);
    }
  });
};

export const updateCalendar = async (data, reloadCalendar) => {
  return new Promise(async function (resolve, reject) {
    try {
      const updateCalendarData = await axios.post(
        ApiUrl + "/mgmt-updateCalendar",
        data
      );
      reloadCalendar();
      resolve(updateCalendarData.data);
    } catch (error) {
      reject(error);
    }
  });
};

export const setUnits = async (data, amenitiesList) => {
  return new Promise(async function (resolve, reject) {
    try {
      const unitRef = await db
        .collection("units")
        .where("active", "==", true)
        .orderBy(firebase.firestore.FieldPath.documentId())
        .limitToLast(1)
        .get();
      const unitlastId = unitRef.docs[0].id;
      const addedUnitId = Number(unitlastId) + 1;
      const addedUnitIdString = String(addedUnitId).padStart(6, "0");
      const res = await db.collection("units").doc(addedUnitIdString).set(data);
      let temprecord = {};
      await amenitiesList?.map(async (item) => {
        const name = (item?.name).toLowerCase().replaceAll(" ", "_");
        temprecord[name] = item;
        await db
          .collection("amenities")
          .doc(addedUnitIdString)
          .set(
            {
              amenities: temprecord,
              hospitable_id: "",
              picture: data?.picture,
              rules: {
                additional_rules: "",
                parties: false,
                smoking: false,
              },
              unit_id: addedUnitIdString,
              unit_name: data?.name,
            },
            { merge: true }
          );
      });
      resolve(addedUnitIdString);
    } catch (error) {
      reject(error);
    }
  });
};

export const getPhotosRoom = async (id) => {
  return new Promise(async function (resolve, reject) {
    try {
      const photosRef = await db.collection("photos").doc(id).get();
      resolve(photosRef.data());
    } catch (error) {
      reject(error);
    }
  });
};

export const setRoom = async (id, data) => {
  return new Promise(async function (resolve, reject) {
    try {
      await data.map(async (item) => {
        const tempData = {
          [v4()]: {
            title: item?.title,
            list_name: item?.name,
            have_bed: item?.isbedroom,
            bed_type: [],
            room_feature: [],
            photos: [],
          },
        };
        await db.collection("photos").doc(id).set(tempData, { merge: true });
      });
      resolve({ id: id });
    } catch (error) {
      reject(error);
    }
  });
};

export const setCoverImages = async (id) => {
  return new Promise(async function (resolve, reject) {
    try {
      const tempData = {
        [v4()]: {
          title: "Cover Image",
          list_name: "cover_image",
          have_bed: false,
          bed_type: [],
          room_feature: [],
          photos: [],
        },
      };
      await db.collection("photos").doc(id).set(tempData, { merge: true });
      resolve({ id: id });
    } catch (error) {
      reject(error);
    }
  });
};

export const setRoomFetures = async (id, roomId, roomFeature) => {
  return new Promise(async function (resolve, reject) {
    try {
      const data = {
        [roomId && roomId]: {
          room_feature: firebase.firestore.FieldValue.arrayUnion(roomFeature),
        },
      };
      await db.collection("photos").doc(id).set(data, { merge: true });
      resolve({ id: id });
    } catch (error) {
      reject(error);
    }
  });
};

export const setRoomBedFetures = async (id, roomId, roomBedFeature) => {
  return new Promise(async function (resolve, reject) {
    try {
      const data = {
        [roomId && roomId]: {
          bed_type: firebase.firestore.FieldValue.arrayUnion(roomBedFeature),
        },
      };
      await db.collection("photos").doc(id).set(data, { merge: true });
      resolve({ id: id });
    } catch (error) {
      reject(error);
    }
  });
};

export const removeRoomFetures = async (id, roomId, roomFeature) => {
  return new Promise(async function (resolve, reject) {
    try {
      const data = {
        [roomId && roomId]: {
          room_feature: firebase.firestore.FieldValue.arrayRemove(roomFeature),
        },
      };
      await db.collection("photos").doc(id).set(data, { merge: true });
      resolve({ id: id });
    } catch (error) {
      reject(error);
    }
  });
};

export const removeRoomBedFetures = async (id, roomId, roomBedFeature) => {
  return new Promise(async function (resolve, reject) {
    try {
      const data = {
        [roomId && roomId]: {
          bed_type: firebase.firestore.FieldValue.arrayRemove(roomBedFeature),
        },
      };
      await db.collection("photos").doc(id).set(data, { merge: true });
      resolve({ id: id });
    } catch (error) {
      reject(error);
    }
  });
};

export const removeRoom = async (id, removeDataId, reloadPage, data) => {
  return new Promise(async function (resolve, reject) {
    try {
      if (data?.photos.length) {
        const storageBucket = await firebase.storage().ref();
        await data?.photos.map(async (obj) => {
          await Promise.all(
            await Object.entries(obj).map(async (item: any) => {
              if (item[0] !== "location") {
                const location = await item[1]
                  .split("%2F")
                  .slice(-1)[0]
                  .split("?")
                  .slice()[0];
                const unit_id = await item[1].split("%2F").slice()[1];
                const removeImage = await storageBucket.child(
                  `properties/${unit_id}/${location}`
                );
                await removeImage.delete();
              }
            })
          );
        });
      }
      await db
        .collection("photos")
        .doc(id)
        .update({
          [removeDataId]: firebase.firestore.FieldValue.delete(),
        });
      resolve("Remove Success");
      reloadPage();
    } catch (error) {
      console.log("error", error);
      reject(error);
    }
  });
};

export const updateUnits = async (id, data) => {
  return new Promise(async function (resolve, reject) {
    try {
      await db.collection("units").doc(id).set(data, { merge: true });
      resolve(id);
    } catch (error) {
      reject(error);
    }
  });
};

export const UpdateAmenities = async (id, amenitiesList) => {
  return new Promise(async function (resolve, reject) {
    try {
      let temprecord = {};
      await amenitiesList?.map(async (item) => {
        const name = (item?.name).toLowerCase().replaceAll(" ", "_");
        temprecord[name] = item;
        await db.collection("amenities").doc(id).set(
          {
            amenities: temprecord,
          },
          { merge: true }
        );
      });
      resolve(id);
    } catch (error) {
      reject(error);
    }
  });
};

export const uploadImages = async (id, images, roomId, reloadPage) => {
  return new Promise(async function (resolve, reject) {
    try {
      if (id) {
        const unitRef = await db.collection("units").doc(id).get();
        const metadata: any = {
          name: "Image-1",
        };
        const storageBucket = await firebase.storage().ref();
        await Promise.all(
          await images?.map(async (item) => {
            const type = await item[1].type.split("/").slice(-1);
            const propertiesRef = await storageBucket
              .child(
                `properties/${id}/${unitRef?.data()?.name}-${Date.now()}.${
                  type[0]
                }`
              )
              .put(item[1], metadata);
            const downloadUrl = await propertiesRef.ref.getDownloadURL();
            const storageLocation = await propertiesRef.ref.toString();
            if (id && downloadUrl && storageLocation) {
              const data = {
                [roomId && roomId]: {
                  photos: firebase.firestore.FieldValue.arrayUnion({
                    original: downloadUrl,
                    "1200X800": downloadUrl
                      .split("&")
                      .slice()[0]
                      .split(`.${type[0]}`)
                      .slice()[0]
                      .concat("_1200x800.webp?alt=media"),
                    "960X640": downloadUrl
                      .split("&")
                      .slice()[0]
                      .split(`.${type[0]}`)
                      .slice()[0]
                      .concat("_960x640.webp?alt=media"),
                    "720X480": downloadUrl
                      .split("&")
                      .slice()[0]
                      .split(`.${type[0]}`)
                      .slice()[0]
                      .concat("_720x480.webp?alt=media"),
                    "480X320": downloadUrl
                      .split("&")
                      .slice()[0]
                      .split(`.${type[0]}`)
                      .slice()[0]
                      .concat("_480x320.webp?alt=media"),
                    "320X213": downloadUrl
                      .split("&")
                      .slice()[0]
                      .split(`.${type[0]}`)
                      .slice()[0]
                      .concat("_320x213.webp?alt=media"),
                    "240X160": downloadUrl
                      .split("&")
                      .slice()[0]
                      .split(`.${type[0]}`)
                      .slice()[0]
                      .concat("_240x160.webp?alt=media"),
                    location: storageLocation,
                  }),
                },
              };
              await db.collection("photos").doc(id).set(data, { merge: true });
            }
          })
        );
        resolve("Successfully Upload!");
        await reloadPage();
      } else {
        alert("Somthing went wrong with unit ID");
        return;
      }
    } catch (error) {
      reject(error);
    }
  });
};

export const uploadCoverImages = async (
  id,
  images,
  reloadPage,
  handleClose,
  setUploadLoading
) => {
  return new Promise(async function (resolve, reject) {
    try {
      if (id) {
        const unitRef = await db.collection("units").doc(id).get();
        const metadata: any = {
          name: "Image-1",
        };
        const storageBucket = await firebase.storage().ref();
        await Promise.all(
          await images?.map(async (item) => {
            const type = await item[1].type.split("/").slice(-1);
            const propertiesRef = await storageBucket
              .child(
                `properties/${id}/${unitRef?.data()?.name}-${Date.now()}.${
                  type[0]
                }`
              )
              .put(item[1], metadata);
            const downloadUrl = await propertiesRef.ref.getDownloadURL();
            const storageLocation = await propertiesRef.ref.toString();
            if (id && downloadUrl && storageLocation) {
              const data = {
                picture: firebase.firestore.FieldValue.arrayUnion({
                  original: downloadUrl,
                  "1200X800": downloadUrl
                    .split("&")
                    .slice()[0]
                    .split(`.${type[0]}`)
                    .slice()[0]
                    .concat("_1200x800.webp?alt=media"),
                  "960X640": downloadUrl
                    .split("&")
                    .slice()[0]
                    .split(`.${type[0]}`)
                    .slice()[0]
                    .concat("_960x640.webp?alt=media"),
                  "720X480": downloadUrl
                    .split("&")
                    .slice()[0]
                    .split(`.${type[0]}`)
                    .slice()[0]
                    .concat("_720x480.webp?alt=media"),
                  "480X320": downloadUrl
                    .split("&")
                    .slice()[0]
                    .split(`.${type[0]}`)
                    .slice()[0]
                    .concat("_480x320.webp?alt=media"),
                  "320X213": downloadUrl
                    .split("&")
                    .slice()[0]
                    .split(`.${type[0]}`)
                    .slice()[0]
                    .concat("_320x213.webp?alt=media"),
                  "240X160": downloadUrl
                    .split("&")
                    .slice()[0]
                    .split(`.${type[0]}`)
                    .slice()[0]
                    .concat("_240x160.webp?alt=media"),
                  location: storageLocation,
                  isCurrent:
                    unitRef?.data()?.picture?.length === 0 ? true : false,
                }),
              };
              await db.collection("units").doc(id).set(data, { merge: true });
            }
          })
        );
        resolve("Successfully Upload!");
        setUploadLoading(false);
        handleClose();
        await reloadPage();
      } else {
        alert("Somthing went wrong with unit ID");
        return;
      }
    } catch (error) {
      reject(error);
    }
  });
};

export const editPhoto = async (id, data, reloadPhotos) => {
  return new Promise<void>(async function (resolve, reject) {
    try {
      await db
        .collection("photos")
        .doc(id)
        .set(
          {
            [data.index]: {
              description: data.description,
              url: data.url,
              location: data.location,
              type: data.type,
            },
          },
          { merge: true }
        );
      resolve();
      reloadPhotos();
    } catch (error) {
      reject(error);
    }
  });
};

export const updateCoverImage = async (id, data, reloadPhotos, oldIndex) => {
  return new Promise(async function (resolve, reject) {
    try {
      await db
        .collection("photos")
        .doc(id)
        .set(
          {
            [oldIndex && oldIndex]: {
              type: "",
            },
            [data?.index && data?.index]: {
              type: "cover",
            },
          },
          { merge: true }
        );

      resolve("update Success");
      reloadPhotos();
    } catch (error) {
      reject(error);
    }
  });
};

export const makeIsCurrent = async (id, data, imageId, reloadPage) => {
  return new Promise(async function (resolve, reject) {
    try {
      const changeData = await data.map((item, i) => {
        return {
          ...item,
          isCurrent: i === imageId,
        };
      });
      const newData = {
        picture: changeData,
      };
      await db.collection("units").doc(id).set(newData, { merge: true });
      resolve("success");
      reloadPage();
    } catch (error) {
      reject(error);
    }
  });
};

export const removePhoto = async (id, roomId, reloadPhotos, ele) => {
  return new Promise(async function (resolve, reject) {
    try {
      const storageBucket = await firebase.storage().ref();
      const response = await Promise.all(
        await Object.entries(ele).map(async (item: any) => {
          if (item[0] !== "location") {
            const location = await item[1]
              .split("%2F")
              .slice(-1)[0]
              .split("?")
              .slice()[0];
            const unit_id = await item[1].split("%2F").slice()[1];
            const removeImage = await storageBucket.child(
              `properties/${unit_id}/${location}`
            );
            await removeImage.delete();
            return "Success";
          }
        })
      );
      if (response.length) {
        const data = {
          [roomId && roomId]: {
            photos: firebase.firestore.FieldValue.arrayRemove(ele),
          },
        };
        await db.collection("photos").doc(id).set(data, { merge: true });
      }
      resolve("delete Success");
      reloadPhotos();
    } catch (error) {
      reject(error);
    }
  });
};

export const removeCoverPhoto = async (id, reloadPhotos, ele) => {
  return new Promise(async function (resolve, reject) {
    try {
      const storageBucket = await firebase.storage().ref();
      const response = await Promise.all(
        await Object.entries(ele).map(async (item: any) => {
          if (item[0] !== "location" && item[0] !== "isCurrent") {
            console.log("item", item[1].split("%2F"));
            const location = await item[1]
              .split("%2F")
              .slice(-1)[0]
              .split("?")
              .slice()[0];
            const unit_id = await item[1].split("%2F").slice()[1];
            const removeImage = await storageBucket.child(
              `properties/${unit_id}/${location.replaceAll("%20", " ")}`
            );
            await removeImage.delete();
            return "Success";
          }
        })
      );
      if (response.length) {
        const data = {
          picture: firebase.firestore.FieldValue.arrayRemove(ele),
        };
        await db.collection("units").doc(id).set(data, { merge: true });
      }
      resolve("delete Success");
      reloadPhotos();
    } catch (error) {
      reject(error);
    }
  });
};

export const removePhotos = async (id, data, reloadPhotos, location) => {
  return new Promise(async function (resolve, reject) {
    try {
      const storageBucket = await firebase.storage().ref();
      const name = await location.split("m/").slice(-1);
      const removeImage = await storageBucket.child(name[0]);
      await removeImage.delete();

      await db
        .collection("photos")
        .doc(id)
        .update({ [data && data]: firebase.firestore.FieldValue.delete() });

      resolve("delete Success");
      reloadPhotos();
    } catch (error) {
      reject(error);
    }
  });
};

export const getPhotos = async (id) => {
  return new Promise(async function (resolve, reject) {
    try {
      const photoRef = await db.collection("photos").doc(id).get();
      resolve(photoRef.data());
    } catch (error) {
      reject(error);
    }
  });
};

export const addMessages = async (data, resetForm) => {
  return new Promise(async function (resolve, reject) {
    try {
      const { id, message, currentUserId } = data;
      await db
        .collection("threads")
        .doc(id)
        .set(
          {
            last_message: {
              content: message,
              created_at: firebase.firestore.FieldValue.serverTimestamp(),
              user_id: currentUserId,
            },
          },
          { merge: true }
        );
      await db.collection("threads").doc(id).collection("messages").add({
        content: message,
        created_at: firebase.firestore.FieldValue.serverTimestamp(),
        user_id: currentUserId,
      });
      resetForm();
      // reloadCalendar();
      resolve("Message add Successfully");
    } catch (error) {
      reject(error);
    }
  });
};

export const getThread = async () => {
  return new Promise(async function (resolve, reject) {
    try {
      const snapshot = await db.collection("threads").get();
      let data: threadByIdtype[] = [];
      snapshot.forEach((doc) => {
        const values = doc.data() as threadByIdtype;
        return data.push({ ...values });
      });
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
};

export const getThreadById = async (id) => {
  return new Promise(async function (resolve, reject) {
    try {
      const doc = await db.collection("threads").doc(id).get();
      if (!doc.exists) {
        reject("No document for id");
      }
      resolve(doc.data());
    } catch (error) {
      reject(error);
    }
  });
};

export const getMessageRules = async () => {
  return new Promise(async function (resolve, reject) {
    try {
      resolve(messageRules);
    } catch (error) {
      reject(error);
    }
  });
};

export const getSyncObject = async (id) => {
  return new Promise(async function (resolve, reject) {
    try {
      const snapshot = await db
        .collection("sync")
        .where("rule_id", "==", id)
        .orderBy("created_at", "desc")
        .get();
      let data: any = [];
      snapshot.forEach((doc) => {
        data.push({ ...doc.data(), id: doc.id });
      });
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
};

export const rollBackAccountingRule = async (id) => {
  return new Promise(async function (resolve, reject) {
    try {
      const sync = await axios.get(
        ApiUrl + "/accounting-rollBackAccountingRule?sync_id=" + id
      );
      resolve(sync.data);
    } catch (error) {
      reject(error);
    }
  });
};

export const executeAccountingRule = async (id) => {
  return new Promise(async function (resolve, reject) {
    try {
      const rule = await axios.get(
        ApiUrl + "/accounting-executeAccountingRule?rule_id=" + id
      );
      resolve(rule.data);
    } catch (error) {
      reject(error);
    }
  });
};

export const updateOwner = async (data) => {
  return new Promise(async function (resolve, reject) {
    try {
      if (data.uuid === "") {
        data.uuid = v4();
      }

      let newUnits = {};
      for (let i = 0; i < data.units.length; i++) {
        newUnits[data.units[i]] = data.units[i];
      }
      data.units = newUnits;
      await db.collection("owners").doc(data.uuid).set(data, { merge: true });
      resolve({ uuid: data.uuid });
    } catch (error) {
      reject(error);
    }
  });
};

export const updateTeammate = async (data) => {
  return new Promise(async function (resolve, reject) {
    try {
      if (data.uuid === "") {
        data.uuid = v4();
      }

      data.address.display = createDisplayAddress(data);
      await db.collection("team").doc(data.uuid).set(data, { merge: true });
      resolve({ uuid: data.uuid });
    } catch (error) {
      reject(error);
    }
  });
};

function createDisplayAddress(data) {
  let displayAddress = "";
  displayAddress += data.address.street + ", ";
  displayAddress += data.address.number + ", ";
  displayAddress += data.address.city + " ";
  displayAddress += data.address.state + ", ";
  displayAddress += data.address.postcode;
  return displayAddress;
}

export const updateUnit = async (data) => {
  return new Promise(async function (resolve, reject) {
    try {
      await db.collection("units").doc(data.id).set(data);
      resolve("done");
    } catch (error) {
      reject(error);
    }
  });
};

export const updatePONumber = async (data, getPONumber) => {
  return new Promise(async function (resolve, reject) {
    try {
      await db
        .collection("variables")
        .doc("po_number")
        .set({ current: data }, { merge: true });
      await getPONumber();
      resolve("done");
    } catch (error) {
      reject(error);
    }
  });
};
