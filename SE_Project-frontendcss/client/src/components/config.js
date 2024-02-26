// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB1za7mtlLuRKZhS-kUvYMa03wroYqC4vQ",
  authDomain: "signin-c2c80.firebaseapp.com",
  projectId: "signin-c2c80",
  storageBucket: "signin-c2c80.appspot.com",
  messagingSenderId: "130720841485",
  appId: "1:130720841485:web:55f77e19d96e1cf6cffa44",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
const auth = getAuth(app);
export { auth, provider };
