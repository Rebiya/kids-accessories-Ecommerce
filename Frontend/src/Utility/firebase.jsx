// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import { getAuth } from "firebase/auth";
import "firebase/compat/firestore";
import "firebase/compat/auth";

// TODO: Add SDKs for Firebase `  products that you want to use

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBJvQ37cQLJwggv77k9CQw2JlMh2RxnjeA",
  authDomain: "kids-accessories-7f0aa.firebaseapp.com",
  projectId: "kids-accessories-7f0aa",
  storageBucket: "kids-accessories-7f0aa.firebasestorage.app",
  messagingSenderId: "950929334526",
  appId: "1:950929334526:web:1d41f8adcdf3a452ae85af"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);


export const auth = getAuth(app);
export const db = app.firestore();
// https://firebase.google.com/docs/web/setup#available-libraries
//some commands needed
// firebase login
// firebase init
// firebase deploy
