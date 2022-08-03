import axios from "axios";
import ApiUrl from "../globalVariables";

export const getOwners = async () => {
  try {
    const owners = await axios.get(ApiUrl + "/getOwners");
    return owners.data;
  } catch (error) {
    return error;
  }
};

export const getActiveUnits = async () => {
  try {
    const activeUnits = await axios.get(ApiUrl + "/getUnits?active=true");
    return activeUnits.data;
  } catch (error) {
    return error;
  }
};

export const getTeammateById = async (teammateId) => {
  try {
    const teammatedata = await axios.get(
      ApiUrl + "/getTeammateById?teammate_id=" + teammateId
    );
    return teammatedata.data;
  } catch (error) {
    return error;
  }
};

export const getUnitById = async (unitId) => {
  try {
    const unitById = await axios.get(ApiUrl + "/getUnitsbyId?unitId=" + unitId);
    return unitById.data;
  } catch (error) {
    return error;
  }
};

export const getTeam = async () => {
  try {
    const team = await axios.get(ApiUrl + "/getTeam");
    return team.data;
  } catch (error) {
    return error;
  }
};

export const getUnits = async () => {
  try {
    const units = await axios.get(ApiUrl + "/getUnits");
    return units.data;
  } catch (error) {
    return error;
  }
};

export const getOwnerById = async (ownerId) => {
  try {
    const ownerByID = await axios.get(
      ApiUrl + "/getOwnersById?owner_id=" + ownerId,
      {
        owner_id: ownerId,
      }
    );
    return ownerByID.data;
  } catch (error) {
    return error;
  }
};

export const getCalendar = async (unitId) => {
  try {
    const calendar = await axios.get(ApiUrl + "/getCalendar?unitId=" + unitId);
    return calendar.data;
  } catch (error) {
    return error;
  }
};

export const getReservationsDetail = async (id) => {
  try {
    const reservationDetail = await axios.get(
      ApiUrl + "/getReservationsDetail?reservation_id=" + id
    );
    return reservationDetail.data;
  } catch (error) {
    return error;
  }
};

export const getConnections = async () => {
  try {
    const connection = await axios.get(ApiUrl + "/getConnections");
    return connection.data;
  } catch (error) {
    return error;
  }
};

export const updateCalendar = async (data, reloadCalendar) => {
  try {
    const updateCalendarData = await axios.post(
      ApiUrl + "/updateCalendar",
      data
    );
    reloadCalendar();
    return updateCalendarData.data;
  } catch (error) {
    return error;
  }
};

export const addMessages = async (data, reloadCalendar) => {
  try {
    const addMessagesData = await axios.post(ApiUrl + "/addMessages", data);
    reloadCalendar();
    return addMessagesData.data;
  } catch (error) {
    return error;
  }
};

export const getThread = async () => {
  try {
    const connection = await axios.get(ApiUrl + "/getThread");
    return connection.data;
  } catch (error) {
    return error;
  }
};

export const getThreadById = async (id) => {
  try {
    const reservationDetail = await axios.get(
      ApiUrl + "/getThreadById?id=" + id
    );
    return reservationDetail.data;
  } catch (error) {
    return error;
  }
};

// export const getConnections = async () => {
//   try {
//     const connection = await axios.get(ApiUrl + "/getConnections");
//     return connection.data;
//   } catch (error) {
//     return error;
//   }
// };
