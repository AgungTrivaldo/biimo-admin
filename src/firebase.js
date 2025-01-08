// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth'; // Firebase Authentication
import { getFirestore } from 'firebase/firestore';
import { getDatabase, ref, set, get, child, onValue } from 'firebase/database';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAsnCKMlANxDALfnJWsgVJK4ASvyezQOLY",
  authDomain: "biimodatabase.firebaseapp.com",
  databaseURL: "https://biimodatabase-default-rtdb.firebaseio.com",
  projectId: "biimodatabase",
  storageBucket: "biimodatabase.firebasestorage.app",
  messagingSenderId: "774275317114",
  appId: "1:774275317114:web:529c5418c170400406eac3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);
export const auth = getAuth(app);

export { db, ref, set, get, child, onValue };