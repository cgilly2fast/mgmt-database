import axios from "axios";
import ApiUrl from "../../globalVariables";

export const getUnits = () => {
  return (dispatch) => {
    return axios
      .get(ApiUrl + "/getUnits")
      .then((response) => {
        console.log(response.data);
        dispatch({ type: "GET_UNITS_SUCCESS", res_data: response.data });
      })
      .catch((err) => {
        dispatch({ type: "GET_UNITS_ERROR", err });
      });
  };
};

export const getUnitById = (unitId) => {
  return (dispatch) => {
    return axios
      .get(ApiUrl + "/getUnits/" + unitId)
      .then((response) => {
        console.log(response.data);
        dispatch({ type: "GET_UNIT_SUCCESS", res_data: response.data });
      })
      .catch((err) => {
        dispatch({ type: "GET_UNIT_ERROR", err });
      });
  };
};

export const getActiveUnits = () => {
  return (dispatch) => {
    return axios
      .get(ApiUrl + "/getUnits?active=true")
      .then((response) => {
        dispatch({ type: "GET_ACTIVE_UNITS_SUCCESS", res_data: response.data });
      })
      .catch((err) => {
        dispatch({ type: "GET_ACTIVE_UNITS_ERROR", err });
      });
  };
};

export const getOwners = () => {
  return (dispatch) => {
    return axios
      .get(ApiUrl + "/getOwners")
      .then((response) => {
        console.log(response.data);
        dispatch({ type: "GET_OWNERS_SUCCESS", res_data: response.data });
      })
      .catch((err) => {
        dispatch({ type: "GET_OWNERS_ERROR", err });
      });
  };
};

export const getCalendar = (unitId) => {
  return (dispatch) => {
    dispatch({
      type: "GET_CALENDAR_LOADING",
      res_data: { loading: true, data: null },
    });
    return axios
      .get(ApiUrl + "/getCalendar/" + unitId)
      .then((response) => {
        dispatch({
          type: "GET_CALENDAR_SUCCESS",
          res_data: { loading: false, data: response.data },
        });
      })
      .catch((err) => {
        dispatch({ type: "GET_CALENDAR_ERROR", err });
      });
  };
};

export const getReservations = (unitId) => {
  return (dispatch) => {
    dispatch({
      type: "GET_RESERVATIONS_LOADING",
      res_data: { loading: true, data: null },
    });
    return axios
      .get(ApiUrl + "/getReservations/" + unitId)
      .then((response) => {
        dispatch({
          type: "GET_RESERVATIONS_SUCCESS",
          res_data: { loading: false, data: response.data },
        });
      })
      .catch((err) => {
        dispatch({ type: "GET_RESERVATIONS_ERROR", err });
      });
  };
};

export const getOwnerById = (ownerId) => {
  return (dispatch) => {
    return axios
      .get(ApiUrl + "/getOwners/" + ownerId)
      .then((response) => {
        console.log(response.data);
        dispatch({ type: "GET_OWNER_SUCCESS", res_data: response.data });
      })
      .catch((err) => {
        dispatch({ type: "GET_OWNER_ERROR", err });
      });
  };
};

export const getTeam = () => {
  return (dispatch) => {
    return axios
      .get(ApiUrl + "/getTeam")
      .then((response) => {
        console.log(response.data);
        dispatch({ type: "GET_TEAM_SUCCESS", res_data: response.data });
      })
      .catch((err) => {
        dispatch({ type: "GET_TEAM_ERROR", err });
      });
  };
};

export const getTeammateById = (teammateId) => {
  return (dispatch) => {
    return axios
      .get(ApiUrl + "/getTeam/" + teammateId)
      .then((response) => {
        console.log(response.data);
        dispatch({ type: "GET_TEAMMATE_SUCCESS", res_data: response.data });
      })
      .catch((err) => {
        dispatch({ type: "GET_TEAMMATE_ERROR", err });
      });
  };
};
export const updateTeammate = (data) => {
  return (dispatch) => {
    return axios
      .post(ApiUrl + "/updateTeammate", data)
      .then((response) => {
        console.log(response.data);
        dispatch({ type: "UPDATE_TEAMMATE_SUCCESS", res_data: response.data });
      })
      .catch((err) => {
        dispatch({ type: "UPDATE_TEAMMATE_ERROR", err });
      });
  };
};

export const updateCalendar = (data, reloadCalendar) => {
  return (dispatch) => {
    return axios
      .post(ApiUrl + "/updateCalendar", data)
      .then((response) => {
        reloadCalendar();
        dispatch({ type: "UPDATE_CALENDAR_SUCCESS", res_data: response.data });
      })
      .catch((err) => {
        dispatch({ type: "UPDATE_CALENDAR_ERROR", err });
      });
  };
};

export const updateOwner = (data) => {
  return (dispatch) => {
    return axios
      .post(ApiUrl + "/updateOwner", data)
      .then((response) => {
        console.log(response.data);
        dispatch({ type: "UPDATE_OWNER_SUCCESS", res_data: response.data });
      })
      .catch((err) => {
        dispatch({ type: "UPDATE_OWNER_ERROR", err });
      });
  };
};
