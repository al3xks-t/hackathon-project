// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDvnP_X3O9LZ2hPjMp3BaPzolCsFMkUYBE",
    authDomain: "hackathon-youth-hub.firebaseapp.com",
    projectId: "hackathon-youth-hub",
    storageBucket: "hackathon-youth-hub.firebasestorage.app",
    messagingSenderId: "464621964744",
    appId: "1:464621964744:web:0d349b35cbf641e56fc4fd"
  };

console.log("FIREBASE CONFIG CHECK:", firebaseConfig);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export const auth = getAuth();
export const provider = new GoogleAuthProvider();
export { db, storage };
export { app };