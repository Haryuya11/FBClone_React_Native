import * as firebase from "firebase";
import "firebase/firestore";

const configuration = {
  apiKey: "AIzaSyDgL5BCrBOSCXvZDCFKh4TxjiXbeE-nPvo",
  authDomain: "fb-clone-be04d.firebaseapp.com",
  databaseURL:
    "https://fb-clone-be04d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "fb-clone-be04d",
  storageBucket: "fb-clone-be04d.firebasestorage.app",
  messagingSenderId: "411572980810",
  appId: "1:411572980810:web:53a263c35eb2ca3c5aaab3",
  measurementId: "G-GM68F9WQDF",
};

firebase.initializeApp(configuration);

const firestore_app = firebase.firestore();
const firebase_auth = firebase.auth();

export { firestore_app, firebase_auth };
