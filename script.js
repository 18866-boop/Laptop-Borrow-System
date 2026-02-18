import { collection, onSnapshot } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const laptopContainer = document.getElementById("laptopContainer");

onSnapshot(collection(db, "laptops"), (snapshot) => {
  laptopContainer.innerHTML = ""; // ล้างก่อนทุกครั้ง

  snapshot.forEach((doc) => {
    const data = doc.data();

    const card = document.createElement("div");
    card.className = "laptop-card";

    if (data.status === "available") {
      card.style.backgroundColor = "green";
    } else {
      card.style.backgroundColor = "red";
    }

    card.innerText = data.name;

    laptopContainer.appendChild(card);
  });
});
