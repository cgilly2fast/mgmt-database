import { combineReducers } from "redux";
import dbReducer from "./dbReducer";
// import sendMessageReducer from "./sendMessageReducer";
// import googleMapReducer from "./googleMapReducer";

const rootReducer = combineReducers({
  db: dbReducer,
//   sendMessage: sendMessageReducer,
//   googleMap: googleMapReducer,
});

export default rootReducer;
