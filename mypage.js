import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

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
const provider = new GoogleAuthProvider();

const loginBtn = document.getElementById("loginBtn");
const mypageLoginBtn = document.getElementById("mypageLoginBtn");
const logoutBtn = document.getElementById("logoutBtn");

const userBox = document.getElementById("userBox");
const userName = document.getElementById("userName");

const loginRequired = document.getElementById("loginRequired");
const profileCard = document.getElementById("profileCard");

const profileImage = document.getElementById("profileImage");
const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const infoName = document.getElementById("infoName");
const infoEmail = document.getElementById("infoEmail");
const infoUid = document.getElementById("infoUid");

async function googleLogin() {
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error("로그인 오류:", error);
    alert(`로그인 실패: ${error.code}`);
  }
}

loginBtn.addEventListener("click", googleLogin);
mypageLoginBtn.addEventListener("click", googleLogin);

logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    loginBtn.classList.add("hidden");
    userBox.classList.remove("hidden");
    userName.textContent = user.displayName || user.email;

    loginRequired.classList.add("hidden");
    profileCard.classList.remove("hidden");

    profileImage.src = user.photoURL || "https://via.placeholder.com/120";
    profileName.textContent = user.displayName || "이름 정보 없음";
    profileEmail.textContent = user.email || "이메일 정보 없음";

    infoName.textContent = user.displayName || "이름 정보 없음";
    infoEmail.textContent = user.email || "이메일 정보 없음";
    infoUid.textContent = user.uid;
  } else {
    loginBtn.classList.remove("hidden");
    userBox.classList.add("hidden");
    userName.textContent = "";

    loginRequired.classList.remove("hidden");
    profileCard.classList.add("hidden");
  }
});
