
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBI1Mz_yhxRxbIZ8FGso1SF8b8KvNoHTRU",
  authDomain: "tamkeen-af067.firebaseapp.com",
  projectId: "tamkeen-af067",
  storageBucket: "tamkeen-af067.firebasestorage.app",
  messagingSenderId: "757508494834",
  appId: "1:757508494834:web:79dc2d0db505677557476b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
