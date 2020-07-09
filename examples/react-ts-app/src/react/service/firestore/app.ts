import firebase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

console.log(firebaseConfig);

const app = firebase.initializeApp(firebaseConfig);

// console.log('kkk : initializing firestore ')

const fdb: firebase.firestore.Firestore = firebase.firestore(app);
fdb.settings({
  cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED,
});

const serverTime = firebase.firestore.FieldValue.serverTimestamp;
const Timestamp = firebase.firestore.Timestamp;
const { increment } = firebase.firestore.FieldValue;

fdb.enablePersistence().catch(function (err) {
  if (err.code === "failed-precondition") {
    // console.log('kkk : ERROR- failed to Multiple tabs open, persistence can only be enabled in one tab at a a time. ')
    // Multiple tabs open, persistence can only be enabled
    // in one tab at a a time.
    // ...
  } else if (err.code === "unimplemented") {
    // console.log('kkk : The current browser does not support all of the features required to enable persistence ')
    // The current browser does not support all of the
    // features required to enable persistence
    // ...
  }
});

type IFireDB = firebase.firestore.Firestore;

export default app;
export { fdb, serverTime, increment, IFireDB, Timestamp };
