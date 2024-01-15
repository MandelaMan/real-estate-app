// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_GOOGLE_AUTH_API_KEY,
  authDomain: "realestate-app-6639c.firebaseapp.com",
  projectId: "realestate-app-6639c",
  storageBucket: "realestate-app-6639c.appspot.com",
  messagingSenderId: "615865521191",
  appId: "1:615865521191:web:142ccf2be7ffc690d4ea02",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
