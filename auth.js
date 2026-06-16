import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCQFbd31OEMqqofGB_zIzs7dvnwOS1G2tU",
  authDomain: "restoma-79175.firebaseapp.com",
  projectId: "restoma-79175",
  storageBucket: "restoma-79175.firebasestorage.app",
  messagingSenderId: "1046503308690",
  appId: "1:1046503308690:web:8404d70f3d6d7ab5a3154b",
  measurementId: "G-SQHDM6W1MB"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

const provider = new GoogleAuthProvider();

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const userBox = document.getElementById("userBox");
const userName = document.getElementById("userName");

loginBtn.addEventListener("click", async () => {
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error(error);
    alert("로그인 실패");
  }
});

logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    loginBtn.classList.add("hidden");
    userBox.classList.remove("hidden");

    userName.textContent =
      user.displayName || user.email;
  } else {
    loginBtn.classList.remove("hidden");
    userBox.classList.add("hidden");
  }
});
