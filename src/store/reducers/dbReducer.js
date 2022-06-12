const initState = {
  units: [],
  unit: {},
  listing: {},
  team: [],
  teammate: {},
  owners: [],
  owner: {},
};

const dbReducer = (state = initState, action) => {
  switch (action.type) {
    case "GET_UNITS_SUCCESS":
      return {
        ...state,
        units: action.res_data,
      };
    case "GET_UNITS_ERROR":
      return state;

    case "GET_ACTIVE_UNITS_SUCCESS":
      return {
        ...state,
        units: action.res_data,
      };
    case "GET_ACTIVE_UNITS_ERROR":
      return state;

    case "GET_OWNERS_SUCCESS":
      return {
        ...state,
        owners: action.res_data,
      };
    case "GET_OWNERS_ERROR":
      return state;

    case "GET_OWNER_SUCCESS":
      return {
        ...state,
        owner: action.res_data,
      };
    case "GET_OWNER_ERROR":
      return state;

    case "GET_UNIT_SUCCESS":
      return {
        ...state,
        unit: action.res_data,
      };
    case "GET_UNIT_ERROR":
      return state;

    case "GET_TEAM_SUCCESS":
      return {
        ...state,
        team: action.res_data,
      };
    case "GET_TEAM_ERROR":
      return state;

    case "GET_TEAMMATE_SUCCESS":
      return {
        ...state,
        teammate: action.res_data,
      };
    case "GET_TEAMMATE_ERROR":
      return state;

    //   case "SET_TOTAL_GUESTS":
    //     return {
    //       ...state,
    //       totalGuests: action.playload
    //     }

    //   case "OPEN_MODAL":
    //     return {
    //       ...state,
    //       modalState: true
    //     }

    //   case "CLOSE_MODAL":
    //     return {
    //       ...state,
    //       modalState: false
    //     }

    //   case "SET_DATES":
    //     return {
    //       ...state,
    //       dates: action.playload
    //     }
    //   case "CLEAR_DATES":
    //     return {
    //       ...state,
    //       dates: {}
    //     }

    //   case "GET_OWNER_INFO_BY_LISTING_ERROR":

    //     return state;

    //   case "GET_BLOCKED_DAYS_SUCCESS":
    //     return {
    //       ...state,
    //       blockedDays: action.res_data
    //     };

    //   case "GET_BLOCKED_DAYS_ERROR":

    //     return state;

    //   case "GET_UNIT_AMENITIES_SUCCESS":
    //     return {
    //       ...state,
    //       amenities: action.res_data
    //     };

    //   case "GET_UNIT_AMENITIES_ERROR":
    //     return state;

    //   case "GET_ALL_UNITS_IMGS_SUCCESS":
    //     return {
    //       ...state,
    //       allImgs: action.res_data
    //     };

    //   case "GET_ALL_UNITS_IMGS_ERROR":
    //     return state;

    //   case "GET_ROOM_HEADER_IMGS_SUCCESS":
    //     return {
    //       ...state,
    //       roomImgs: action.res_data
    //     };

    //   case "GET_ROOM_HEADER_IMGS_ERROR":
    //     return state;

    //   case "GET_UNIT_HEADER_IMGS_SUCCESS":
    //     return {
    //       ...state,
    //       headerImgs: action.res_data
    //     };
    //   case "GET_UNIT_HEADER_IMGS_ERROR":
    //     return state;

    //   case "GET_UNIT_REVIEW_SUCCESS":
    //     return {
    //       ...state,
    //       reviews: action.res_data
    //     };
    //   case "GET_UNIT_REVIEW_ERROR":
    //     return state;

    //   case "GET_UNIT_SUCCESS":
    //     return {
    //       ...state,
    //       listing: action.res_data[0]
    //     };
    //   case "GET_UNIT_ERROR":
    //     return state;

    default:
      return state;
  }
};

export default dbReducer;
