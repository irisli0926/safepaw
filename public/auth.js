import { auth } from './firebase-init.js';
import {
  getAuth,
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  signInWithEmailAndPassword,

  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

export async function loginWithPassword(email, password) {
  const auth = getAuth();
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    localStorage.setItem("loginComplete", "true");
    console.log("✅ Signed in as:", result.user.email);
    return result.user;
  } catch (err) {
    alert("Login failed: " + err.message);
    return null;
  }
}

export function checkAuth() {
  const auth = getAuth();
  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      resolve(user);
    });
  });
}
