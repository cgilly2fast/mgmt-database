import axios from "axios";
import ApiUrl from "../globalVariables";

export const getOwners = async () => {
  return new Promise(async function (resolve, reject) {
    try {
      const owners = await axios.get(ApiUrl + "/getOwners");
      resolve(owners.data);
    } catch (error) {
      reject(error);
    }
  })
};

export const getActiveUnits = async () => {
  return new Promise(async function (resolve, reject) {
    try {
      const activeUnits = await axios.get(ApiUrl + "/getUnits?active=true");
      resolve(activeUnits.data);
    } catch (error) {
      reject(error);
    }
  })
};

export const getTeammateById = async (teammateId) => {
  return new Promise(async function (resolve, reject) {
    try {
      const teammatedata = await axios.get(
        ApiUrl + "/getTeammateById?teammate_id=" + teammateId
      );
      resolve(teammatedata.data);
    } catch (error) {
      reject(error);
    }
  })
};

export const getUnitById = async (unitId) => {
  return new Promise(async function (resolve, reject) {
    try {
      const unitById = await axios.get(ApiUrl + "/getUnitsbyId?unitId=" + unitId);
      resolve(unitById.data);
    } catch (error) {
      reject(error);
    }
  })
};

export const getTeam = async () => {
  return new Promise(async function (resolve, reject) {
    try {
      const team = await axios.get(ApiUrl + "/getTeam");
      resolve(team.data);
    } catch (error) {
      reject(error);
    }
  })
};

export const getUnits = async () => {
  return new Promise(async function (resolve, reject) {
    try {
      const units = await axios.get(ApiUrl + "/getUnits");
      resolve(units.data);
    } catch (error) {
      reject(error);
    }
  })
};

export const getOwnerById = async (ownerId) => {
  return new Promise(async function (resolve, reject) {
    try {
      const ownerByID = await axios.get(
        ApiUrl + "/getOwnersById?owner_id=" + ownerId,
        {
          owner_id: ownerId,
        }
      );
      resolve(ownerByID.data);
    } catch (error) {
      reject(error);
    }
  })
};

export const getCalendar = async (unitId) => {
  return new Promise(async function (resolve, reject) {
    try {
      const calendar = await axios.get(ApiUrl + "/getCalendar?unitId=" + unitId);
      resolve(calendar.data);
    } catch (error) {
      reject(error);
    }
  })
};

export const getReservationsDetail = async (id) => {
  return new Promise(async function (resolve, reject) {
    try {
      const reservationDetail = await axios.get(
        ApiUrl + "/getReservationsDetail?reservation_id=" + id
      );
      resolve(reservationDetail.data);
    } catch (error) {
      reject(error);
    }
  })
};

export const getConnections = async () => {
  return new Promise(async function (resolve, reject) {
    try {
      const connection = await axios.get(ApiUrl + "/getConnections");
      resolve(connection.data);
    } catch (error) {
      reject(error);
    }
  })
};

export const updateCalendar = async (data, reloadCalendar) => {
  return new Promise(async function (resolve, reject) {
    try {
      const updateCalendarData = await axios.post(
        ApiUrl + "/updateCalendar",
        data
      );
      reloadCalendar();
      resolve(updateCalendarData.data);
    } catch (error) {
      reject(error);
    }
  })
};

export const addMessages = async (data, reloadCalendar) => {
  return new Promise(async function (resolve, reject) {
    try {
      const addMessagesData = await axios.post(ApiUrl + "/addMessages", data);
      reloadCalendar();
      resolve(addMessagesData.data);
    } catch (error) {
      reject(error);
    }
})
};

export const getThread = async () => {
  return new Promise(async function (resolve, reject) {
    try {
      const connection = await axios.get(ApiUrl + "/getThread");
      resolve(connection.data);
    } catch (error) {
      reject(error);
    }
  })
};

export const getThreadById = async (id) => {
  return new Promise(async function (resolve, reject) {
    try {
      const reservationDetail = await axios.get(
        ApiUrl + "/getThreadById?id=" + id
      );
      resolve(reservationDetail.data);
    } catch (error) {
      reject(error);
    }
  })
};

export const executeAccountingRule = async (id) => {
  return new Promise(async function (resolve, reject) {
    try {
      const rule = await axios.get(ApiUrl + "/executeAccountingRule?rule_id="+ id);
      resolve(rule.data);
    } catch (error) {
      reject(error);
    }
  })
};

export const getSyncObject = async (id) => {
  return new Promise(async function (resolve, reject) {
    try {
      const syncObjs = await axios.get(ApiUrl + "/getSyncObject?rule_id="+ id);
      resolve(syncObjs.data);
    } catch (error) {
      reject(error);
    }
  })
};