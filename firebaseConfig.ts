
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAWyja0H-Ml34U-Ke0REeGd4y8bejTFCKk",
  authDomain: "tamkenn-app.firebaseapp.com",
  projectId: "tamkenn-app",
  storageBucket: "tamkenn-app.appspot.com", // Fixed typo in storage bucket URL
  messagingSenderId: "435780479360",
  appId: "1:435780479360:web:364db3ecc6f83b1b8ef965",
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
