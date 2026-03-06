import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBQWzQJqzojY7JORXlpVZsQ8vJBoVyhRZ8",
    authDomain: "nexus-gym-pablo.firebaseapp.com",
    projectId: "nexus-gym-pablo",
    storageBucket: "nexus-gym-pablo.firebasestorage.app",
    messagingSenderId: "964105467682",
    appId: "1:964105467682:web:704bf576d27a07007f977b"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };
