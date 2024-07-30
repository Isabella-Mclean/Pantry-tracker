// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAZ0Qt-QPLk-2lIDR9_JUxgeBqWn-FjZdE",
  authDomain: "pantryapp-9c375.firebaseapp.com",
  projectId: "pantryapp-9c375",
  storageBucket: "pantryapp-9c375.appspot.com",
  messagingSenderId: "805104784021",
  appId: "1:805104784021:web:9c8e1802745ecb4864819c",
  measurementId: "G-RZR2Z01S68"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app)
export {app, firestore}