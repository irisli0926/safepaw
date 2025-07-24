import { auth } from './firebase-init.js';
import {
  getAuth,
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

export async function checkAuth() {
  // const auth = getAuth();
  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      resolve(user);
    });
  });
}





export function sendMagicLink(email, tagId) {
  // const auth = getAuth();
  const actionCodeSettings = {
  url: `${window.location.origin}${window.location.pathname}`,
  handleCodeInApp: true,
  };
  return sendSignInLinkToEmail(auth, email, actionCodeSettings).then(() => {
    window.localStorage.setItem("emailForSignIn", email);
    alert("Check your email for the login link.");
  });
}

export function completeSignIn() {
  const auth = getAuth();
  const href = window.location.href;

  if (!isSignInWithEmailLink(auth, href)) return;

  let email = localStorage.getItem("emailForSignIn") || prompt("Enter your email:");

  return signInWithEmailLink(auth, email, href)
    .then((result) => {
      localStorage.removeItem("emailForSignIn");
      localStorage.setItem("loginComplete", "true");

      const tag = new URLSearchParams(location.search).get("tag");
      if (tag) localStorage.setItem("tagForLogin", tag);

      console.log("✅ Signed in as:", result.user.email);

      // ✅ Clean up the URL
      const cleanedUrl = new URL(window.location.origin + window.location.pathname);
      if (tag) cleanedUrl.searchParams.set("tag", tag);
      window.history.replaceState({}, document.title, cleanedUrl.toString());
    })
    .catch((err) => {
      console.error("❌ Sign-in error:", err);
      alert("This link has expired or is invalid. Please request a new one.");
      localStorage.removeItem("emailForSignIn");
      localStorage.removeItem("loginComplete");
    });
}







// // auth.js
// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
// import {
//   getAuth,
//   isSignInWithEmailLink,
//   sendSignInLinkToEmail,
//   signInWithEmailLink
// } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// const firebaseConfig = {
//   apiKey: "YOUR_API_KEY",
//   authDomain: "yourproject.firebaseapp.com",
//   projectId: "yourproject-id",
//   appId: "YOUR_APP_ID"
// };

// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);

// // Call this on your edit page to start auth
// export async function requestEmailLogin(email, petId) {
//   const actionCodeSettings = {
//     url: `${window.location.origin}/edit.html?id=${petId}`, // After verification, go back to edit page
//     handleCodeInApp: true
//   };

//   await sendSignInLinkToEmail(auth, email, actionCodeSettings);
//   window.localStorage.setItem('emailForSignIn', email);
//   window.localStorage.setItem('currentPetId', petId);
//   alert("Check your email to continue editing your pet profile.");
// }

// // Call this in edit.html on load
// export async function completeEmailLogin() {
//   if (isSignInWithEmailLink(auth, window.location.href)) {
//     const email = window.localStorage.getItem('emailForSignIn');
//     const petId = new URLSearchParams(window.location.search).get("id");

//     if (!email) {
//       const promptEmail = window.prompt("Confirm your email:");
//       if (!promptEmail) throw new Error("No email provided");
//       await signInWithEmailLink(auth, promptEmail, window.location.href);
//       window.localStorage.setItem('emailForSignIn', promptEmail);
//     } else {
//       await signInWithEmailLink(auth, email, window.location.href);
//     }

//     window.localStorage.setItem('isVerified', 'true');
//     window.localStorage.setItem('currentPetId', petId);
//   }
// }
