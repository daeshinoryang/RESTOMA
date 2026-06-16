import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";

import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
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

let currentUser = null;

onAuthStateChanged(auth, (user) => {
  currentUser = user;
});

const scentMap = {
  lemon: { name: "레몬", drop: 2 },
  bergamot: { name: "베르가못", drop: 2 },
  rosemary: { name: "로즈마리", drop: 2 },
  marjoram: { name: "마조람", drop: 2 },
  peppermint: { name: "페퍼민트", drop: 2 },
  eucalyptus: { name: "유칼립투스", drop: 2 },
};

document.getElementById("scentForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const form = new FormData(e.target);
  const blend = {};

  function addScent(name, drop) {
    blend[name] = (blend[name] || 0) + drop;
  }

  const q1 = form.get("q1");
  const q2 = form.get("q2");
  const q3 = form.get("q3");
  const q4 = form.get("q4");
  const q5 = form.get("q5");

  addScent(scentMap[q1].name, 2);

  if (q2 === "cinnamon_lemon") {
    addScent("시나몬", 1);
    addScent("레몬", 1);
  } else {
    addScent(scentMap[q2].name, 2);
  }

  if (q3 === "rosemary") addScent("로즈마리", 1);
  if (q3 === "peppermint") addScent("페퍼민트", 1);
  if (q3 === "bergamot") addScent("베르가못", 1);

  let strengthText = "";
  if (q5 === "soft") strengthText = "은은한 강도의";
  if (q5 === "normal") strengthText = "균형 잡힌 강도의";
  if (q5 === "strong") strengthText = "선명하고 진한 강도의";

  let blendName = "CALM FOCUS";
  let feature = "차분함과 집중감이 조화를 이루는 향";
  let effect = "스트레스 완화, 집중력 향상, 긴장 완화";
  let comment = "RESTOMA는 사용자의 정신 상태, 신체 증상, 사용 공간을 종합하여 맞춤형 향료 배합을 설계했습니다.";

  if (q4 === "fresh") {
    blendName = "FRESH RESET";
    feature = `${strengthText} 상큼하고 산뜻한 시트러스 계열 향`;
  } else if (q4 === "wood") {
    blendName = "FOREST CALM";
    feature = `${strengthText} 숲속처럼 편안하고 안정적인 향`;
  } else if (q4 === "floral") {
    blendName = "SOFT BLOOM";
    feature = `${strengthText} 부드럽고 포근한 플로럴 무드의 향`;
  } else if (q4 === "cool") {
    blendName = "CLEAR MIND";
    feature = `${strengthText} 깔끔하고 시원한 느낌의 향`;
  }

  const blendList = document.getElementById("blendList");
  blendList.innerHTML = "";

  Object.entries(blend).forEach(([name, drop]) => {
    const li = document.createElement("li");
    li.textContent = `${name} ${drop}방울`;
    blendList.appendChild(li);
  });

  document.getElementById("blendName").textContent = blendName;
  document.getElementById("scentFeature").textContent = feature;
  document.getElementById("effectText").textContent = effect;
  document.getElementById("commentText").textContent = comment;

  document.getElementById("resultBox").classList.remove("hidden");
  document.getElementById("resultBox").scrollIntoView({ behavior: "smooth" });

  if (!currentUser) {
    alert("로그인하면 추천 결과를 마이페이지에 저장할 수 있습니다.");
    return;
  }

  try {
    await addDoc(collection(db, "users", currentUser.uid, "recommendations"), {
      userId: currentUser.uid,
      userName: currentUser.displayName || "",
      userEmail: currentUser.email || "",
      blendName,
      blend,
      feature,
      effect,
      comment,
      answers: {
        q1,
        q2,
        q3,
        q4,
        q5
      },
      createdAt: serverTimestamp()
    });

    alert("추천 결과가 마이페이지에 저장되었습니다.");
  } catch (error) {
    console.error("저장 오류:", error);
    alert(`추천 결과 저장 실패: ${error.code}`);
  }
});
