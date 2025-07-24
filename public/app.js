import { auth, db, storage } from './firebase-init.js';
import { doc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js';
import {
  signInWithEmailAndPassword,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

let currentUser = null;

export async function loadPetProfile(tagId) {
  const snap = await getDoc(doc(db, 'pets', tagId));
  if (!snap.exists()) return console.warn("No pet found");

  const data = snap.data();
  const form = document.getElementById('profile-form');

  for (let [key, value] of Object.entries(data)) {
    if (form.elements[key]) form.elements[key].value = value;
  }

  if (data.photoURL) {
    document.getElementById('pet-photo').src = data.photoURL;
  }

  setDynamicEntries('medications-container', data.medications || []);
  setDynamicEntries('surgeries-container', data.surgeries || []);
}

export async function savePetProfile(tagId) {
  if (!currentUser) return alert("Please sign in to save.");

  const form = document.getElementById('profile-form');
  const data = Object.fromEntries(new FormData(form).entries());
  data.lastUpdated = new Date().toLocaleDateString();
  data.medications = getDynamicEntries('medications-container');
  data.surgeries = getDynamicEntries('surgeries-container');

  await setDoc(doc(db, 'pets', tagId), data, { merge: true });
  disableAllInputs();
  document.getElementById('save-btn').style.display = 'none';
  alert('Saved!');
}

export function initEditMode(tagId) {
  if (!currentUser) {
    promptForEmailPasswordSignIn();
    return;
  }

  document.querySelectorAll('input, textarea, select').forEach(el => el.disabled = false);
  document.getElementById('save-btn').style.display = 'block';
  enablePhotoUpload(tagId);
}

export function enablePhotoUpload(tagId) {
  const photoInput = document.getElementById('photo-upload');
  photoInput.style.display = 'block';

  photoInput.addEventListener('change', async e => {
    const file = e.target.files[0];
    if (!file) return;

    const photoRef = ref(storage, `petPhotos/${tagId}`);
    await uploadBytes(photoRef, file);
    const photoURL = await getDownloadURL(photoRef);
    document.getElementById('pet-photo').src = photoURL;

    await setDoc(doc(db, 'pets', tagId), { photoURL }, { merge: true });
  });
}

function disableAllInputs() {
  document.querySelectorAll('input, textarea, select').forEach(el => el.disabled = true);
}

function setDynamicEntries(containerId, items) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  items.forEach(([name, dosage]) => {
    const row = document.createElement('div');
    row.className = 'med-row';
    row.innerHTML = `<input type="text" value="${name}" /><input type="text" value="${dosage}" />`;
    container.appendChild(row);
  });
}

function getDynamicEntries(containerId) {
  return Array.from(document.getElementById(containerId).querySelectorAll('.med-row'))
    .map(row => Array.from(row.querySelectorAll('input')).map(input => input.value));
}

// 🔑 Prompt for email/password login
function promptForEmailPasswordSignIn() {
  const email = prompt("Enter your email:");
  const password = prompt("Enter your password:");
  if (!email || !password) return;

  signInWithEmailAndPassword(auth, email, password)
    .then(result => {
      currentUser = result.user;
      alert("Signed in! You can now edit.");
    })
    .catch(err => {
      console.error("Login failed:", err);
      alert("Failed to sign in. " + err.message);
    });
}

// 🔁 Track auth state
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    console.log("Signed in as:", user.email);
  }
});
