import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/performance';
import 'firebase/firestore';
import 'firebase/functions';  

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const app = firebase.initializeApp({
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  databaseURL: process.env.REACT_APP_DB,
  projectId: process.env.REACT_APP_PID,
  storageBucket: process.env.REACT_APP_SB,
  messagingSenderId: process.env.REACT_APP_SID,
  appId: process.env.REACT_APP_APPID,
  // measurementId: process.env.REACT_APP_MID,
});

export const perf = app.performance();
export const storage = app.storage();
export const auth = app.auth();
export const db = app.firestore();
export const functions = app.functions();
export default app;
// export { storage, firebase as default };