// app.js
import { auth, db } from './firebase-init.js';
import {
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
  signInWithEmailLink
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import {
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// Get tagId from URL
const urlParams = new URLSearchParams(window.location.search);
const tagId = urlParams.get("tag");

// DOM references
const editBtn = document.getElementById('edit-btn');
const saveBtn = document.getElementById('save-btn');
const claimForm = document.getElementById('claim-form');

// Enable or disable edit mode
function setEditMode(on) {
  document.querySelectorAll('input, textarea, select').forEach(el => {
    el.disabled = !on;
  });
  saveBtn.style.display = on ? 'block' : 'none';
  editBtn.style.display = !on ? 'block' : 'none';
}

// Load pet data from Firestore
async function loadPetProfile(tagId) {
  const ref = doc(db, "pets", tagId);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    populateFields(snap.data());
  }
}

// Save pet data to Firestore
// async function savePetProfile(tagId) {
//   const data = {
//     name: document.querySelector('input[name="name"]').value,
//     breed: document.querySelector('input[name="breed"]').value,
//     gender: document.querySelector('select[name="gender"]').value,
//     chipped: document.querySelector('select[name="chipped"]').value,
//     age: document.querySelector('input[name="age"]').value,
//     blood: document.querySelector('input[name="blood"]').value,
//     weight: document.querySelector('input[name="weight"]').value,
//     color: document.querySelector('input[name="color"]').value,
//     about: document.querySelector('textarea[name="about"]').value,
//     allergies: document.querySelector('textarea[name="allergies"]').value,
//     redMeds: document.querySelector('textarea[name="redMeds"]').value,
//     medications: [
//       {
//         name: document.querySelector('input[name="med1-name"]').value,
//         amount: document.querySelector('input[name="med1-amount"]').value
//       },
//       {
//         name: document.querySelector('input[name="med2-name"]').value,
//         amount: document.querySelector('input[name="med2-amount"]').value
//       }
//     ],
//     surgeries: [
//       {
//         name: document.querySelector('input[name="surgery-name"]').value,
//         date: document.querySelector('input[name="surgery-date"]').value
//       }
//     ],
//     conditions: document.querySelector('textarea[name="conditions"]').value,
//     shots: document.querySelector('input[name="shots"]').value,
//     lastUpdated: new Date().toISOString().split('T')[0]
//   };
//   await setDoc(doc(db, "pets", tagId), data, { merge: true });
//   setEditMode(false);
//   await loadPetProfile(tagId);
// }

function savePetProfile(tagId) {
  const meds = [];
  const medRows = document.querySelectorAll('#medications-container .med-row');
  medRows.forEach(row => {
    const inputs = row.querySelectorAll('input');
    meds.push({
      name: inputs[0].value,
      amount: inputs[1].value
    });
  });

  const surgeries = [];
  const surgRows = document.querySelectorAll('#surgeries-container .med-row');
  surgRows.forEach(row => {
    const inputs = row.querySelectorAll('input');
    surgeries.push({
      name: inputs[0].value,
      date: inputs[1].value
    });
  });

  const data = {
    name: document.querySelector('input[name="name"]').value,
    breed: document.querySelector('input[name="breed"]').value,
    gender: document.querySelector('select[name="gender"]').value,
    chipped: document.querySelector('select[name="chipped"]').value,
    age: document.querySelector('input[name="age"]').value,
    blood: document.querySelector('input[name="blood"]').value,
    weight: document.querySelector('input[name="weight"]').value,
    color: document.querySelector('input[name="color"]').value,
    about: document.querySelector('textarea[name="about"]').value,
    allergies: document.querySelector('textarea[name="allergies"]')?.value || '',
    redMeds: document.querySelector('textarea[name="redMeds"]')?.value || '',
    medications: meds,
    surgeries: surgeries,
    conditions: document.querySelector('textarea[name="conditions"]').value,
    shots: document.querySelector('input[name="shots"]').value,
    lastUpdated: new Date().toISOString().split('T')[0]
  };

  return setDoc(doc(db, "pets", tagId), data, { merge: true }).then(() => {
    setEditMode(false);
    loadPetProfile(tagId);
  });
}




function populateFields(data) {
  // Basic fields
  document.querySelector('input[name="name"]').value = data.name || '';
  document.querySelector('input[name="breed"]').value = data.breed || '';
  document.querySelector('select[name="gender"]').value = data.gender || '';
  document.querySelector('select[name="chipped"]').value = data.chipped || '';
  document.querySelector('input[name="age"]').value = data.age || '';
  document.querySelector('input[name="blood"]').value = data.blood || '';
  document.querySelector('input[name="weight"]').value = data.weight || '';
  document.querySelector('input[name="color"]').value = data.color || '';
  document.querySelector('textarea[name="about"]').value = data.about || '';
  document.querySelector('textarea[name="allergies"]').value = data.allergies || '';
  document.querySelector('textarea[name="redMeds"]').value = data.redMeds || '';
//   document.querySelector('input[name="med1-name"]').value = data.medications?.[0]?.name || '';
//   document.querySelector('input[name="med1-amount"]').value = data.medications?.[0]?.amount || '';
//   document.querySelector('input[name="med2-name"]').value = data.medications?.[1]?.name || '';
//   document.querySelector('input[name="med2-amount"]').value = data.medications?.[1]?.amount || '';
//   document.querySelector('input[name="surgery-name"]').value = data.surgeries?.[0]?.name || '';
//   document.querySelector('input[name="surgery-date"]').value = data.surgeries?.[0]?.date || '';
  document.querySelector('textarea[name="conditions"]').value = data.conditions || '';
  document.querySelector('input[name="shots"]').value = data.shots || '';
  document.getElementById('last-updated').innerText = data.lastUpdated || '';


  // 🧪 Dynamically populate medications
  const medsContainer = document.getElementById('medications-container');
  medsContainer.innerHTML = ''; // clear old entries
  (data.medications || []).forEach((med, i) => {
    const row = document.createElement('div');
    row.className = 'med-row';
    row.innerHTML = `
      <input name="med-name-${i}" value="${med.name || ''}" disabled>
      <input name="med-amount-${i}" value="${med.amount || ''}" disabled>
    `;
    medsContainer.appendChild(row);
  });

  // 💉 Dynamically populate surgeries
  const surgContainer = document.getElementById('surgeries-container');
  surgContainer.innerHTML = '';
  (data.surgeries || []).forEach((surg, i) => {
    const row = document.createElement('div');
    row.className = 'med-row';
    row.innerHTML = `
      <input name="surg-name-${i}" value="${surg.name || ''}" disabled>
      <input name="surg-date-${i}" value="${surg.date || ''}" disabled>
    `;
    surgContainer.appendChild(row);
  });

  // ✅ Optional: allergies as bullets
//   const allergyList = document.getElementById('allergies-list');
//   if (allergyList) {
//     allergyList.innerHTML = '';
//     (data.allergies?.split(',') || []).forEach(item => {
//       const li = document.createElement('li');
//       li.textContent = item.trim();
//       allergyList.appendChild(li);
//     });
//   }

  document.querySelector('textarea[name="conditions"]').value = data.conditions || '';
  document.querySelector('input[name="shots"]').value = data.shots || '';
}



// Claim form
if (claimForm) {
  claimForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const settings = {
      url: location.href + "?edit=true&tag=" + tagId,
      handleCodeInApp: true
    };
    await sendSignInLinkToEmail(auth, email, settings);
    alert("Magic link sent to your email.");
    localStorage.setItem('claimEmail', email);
  });
}

// Auth logic on load
window.addEventListener('load', async () => {
  if (tagId) await loadPetProfile(tagId);

  if (isSignInWithEmailLink(auth, window.location.href)) {
    let email = localStorage.getItem('claimEmail') || prompt("Enter your email to complete setup:");
    await signInWithEmailLink(auth, email, window.location.href);
    localStorage.removeItem('claimEmail');
    setEditMode(true);
  } else if (new URLSearchParams(location.search).get("edit") === "true") {
    const user = auth.currentUser;
    if (user) setEditMode(true);
  }
});

// Button wiring
if (editBtn) editBtn.addEventListener("click", () => setEditMode(true));
if (saveBtn) saveBtn.addEventListener("click", () => savePetProfile(tagId));

// Export for testing or reuse
export { loadPetProfile, savePetProfile, setEditMode };
