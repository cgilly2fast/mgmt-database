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
    const connection = await axios.get(
      "http://localhost:5001/ghotels-development/us-central1/getConnections"
    );
    return connection.data;
  } catch (error) {
    return error;
  }
};