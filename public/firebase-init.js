// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";


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

// export function initializeFirebase() {
//   const app = initializeApp(firebaseConfig);
//   return {
//     auth: getAuth(app),
//     db: getFirestore(app),
//     storage: getStorage(app),
//     analytics: getAnalytics(app)
//   };
// }

// export { db, auth, analytics };

// ✅ Initialize Firebase once
const app = initializeApp(firebaseConfig);

// ✅ Create SDK instances once
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

// ✅ Function that returns all instances
export function initializeFirebase() {
  return { auth, db, storage, analytics };
}

// ✅ Also export individual instances
export { auth, db, storage, analytics };