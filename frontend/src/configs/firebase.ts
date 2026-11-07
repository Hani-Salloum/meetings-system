import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAoQ90JgW1cc_EeC3jCjptLkpndgVVEXSA",
  authDomain: "notifications-71b46.firebaseapp.com",
  projectId: "notifications-71b46",
  storageBucket: "notifications-71b46.firebasestorage.app",
  messagingSenderId: "338996953323",
  appId: "1:338996953323:web:01e254f5b1eb212d99beae",
  measurementId: "G-KCEF9F9MT6",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;
