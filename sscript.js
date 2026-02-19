import { collection, onSnapshot, doc, updateDoc } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const db = window.db;
const auth = window.auth;

let currentUser = null;

onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    console.log("Login แล้ว:", user.email);
  } else {
    console.log("ยังไม่ได้ login");
  }
});

const laptopContainer = document.getElementById("laptopContainer");

onSnapshot(collection(db, "laptops"), (snapshot) => {

  laptopContainer.innerHTML = "";

  snapshot.forEach((docSnap) => {

    const data = docSnap.data();
    const card = document.createElement("div");

    card.style.padding = "20px";
    card.style.margin = "10px";
    card.style.cursor = "pointer";
    card.style.color = "white";
    card.style.fontWeight = "bold";

    if (data.status === "available") {
      card.style.backgroundColor = "green";
    } else {
      card.style.backgroundColor = "red";
    }

    card.innerText = data.name;

    card.onclick = async () => {

      if (!currentUser) {
        alert("กรุณา Login ก่อน");
        return;
      }

      if (data.status !== "available") {
        alert("เครื่องนี้ถูกยืมแล้ว");
        return;
      }

      const docRef = doc(db, "laptops", docSnap.id);

      try {

        await updateDoc(docRef, {
          status: "borrowed",
          borrowedBy: currentUser.email,
          borrowDate: new Date().toLocaleString("th-TH")
        });

await fetch("https://script.google.com/macros/s/AKfycbzPKKbf67ESI7mS5dswb4-xcFBf8rQhvMbg5d1spRgVInagJgyONGB0g6jU9T3xmq9WLA/exec", {
  method: "POST",
  body: JSON.stringify({
    name: currentUser.displayName || "",
    email: currentUser.email,
    laptop: data.name,
    date: new Date().toLocaleString("th-TH")
  })
});


        const result = await response.text();
        console.log("Google Sheet:", result);

      } catch (error) {
        console.error("Error:", error);
      }
    };

    laptopContainer.appendChild(card);
  });
});
