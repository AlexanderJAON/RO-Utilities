// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics"
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCnDCFYhVr4Em0sMvggzjJV7QJeyXuccA4",
  authDomain: "ro-utilities-ingredion.firebaseapp.com",
  projectId: "ro-utilities-ingredion",
  storageBucket: "ro-utilities-ingredion.firebasestorage.app",
  messagingSenderId: "1002574036290",
  appId: "1:1002574036290:web:3127c3a26adad5c2b05cdb",
  measurementId: "G-Y5RMEM6H2N"
};

// Initialize Firebase


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const db = getFirestore(app);


export {auth, db};