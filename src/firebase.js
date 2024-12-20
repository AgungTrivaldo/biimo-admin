// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAXsGk2lhP5gszhAxVR23iwfdd4WSiI04U",
  authDomain: "biimo-483be.firebaseapp.com",
  projectId: "biimo-483be",
  storageBucket: "biimo-483be.firebasestorage.app",
  messagingSenderId: "195165751295",
  appId: "1:195165751295:web:27887ef0f797b9153289ca",
  measurementId: "G-6J16HYX5NW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };