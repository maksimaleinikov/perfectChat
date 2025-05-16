import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB1MicF_IdfWEoCUk-fV_DMvqbFLFzoDCU",
  authDomain: "perfectchat-910aa.firebaseapp.com",
  projectId: "perfectchat-910aa",
  storageBucket: "perfectchat-910aa.firebasestorage.app",
  messagingSenderId: "781493450643",
  appId: "1:781493450643:web:485a412c8a77699cfc9a66",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
