// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDKGHFIn5uiCgsT2d3r49pDM7HdXUI_wrc",
  authDomain: "safepaw-82db9.firebaseapp.com",
  projectId: "safepaw-82db9",
  storageBucket: "safepaw-82db9.firebasestorage.app",
  messagingSenderId: "414587212013",
  appId: "1:414587212013:web:b42d326a44f54d85d5fce4",
  measurementId: "G-TL1J2EQ8L7"
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// const auth = getAuth(app);
// const db = getFirestore(app);

export function initializeFirebase() {
  const app = initializeApp(firebaseConfig);
  return {
    auth: getAuth(app),
    db: getFirestore(app),
    storage: getStorage(app),
    analytics: getAnalytics(app)
  };
}

// export { db, auth, analytics };
