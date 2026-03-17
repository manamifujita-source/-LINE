const LIFF_ID = "2009202315-CpSIZ4ec";

const WORKSHOP_GAS_URL =
  "https://script.google.com/macros/s/AKfycbzcbW9sTWFjM7f8dqbfa0IvK1Wjx7Rh9c1Ph_rS-VUQrNssFMcLXfzUjtTzcEwztVvOpg/exec";
const RESIDENT_GAS_URL =
  "https://script.google.com/macros/s/AKfycbxM22sCEZnNvTouDBWyDaE7WRn4LgNdtd6nqxs-xfggoNRpZzVbvAmTDagbXUtJyaZv/exec";

async function main() {
  try {
    await liff.init({ liffId: LIFF_ID });
    if (liff.isLoggedIn()) {
      const profile = await liff.getProfile();
      document.getElementById("line-name").innerText =
        profile.displayName + " 様";
    }
  } catch (err) {
    console.log("LIFF初期化エラー");
  }

  // 住民票データの取得
  fetch(RESIDENT_GAS_URL)
    .then((res) => res.json())
    .then((data) => {
      const list = Array.isArray(data) ? data : data.rows ? data.rows : [];
      if (list.length > 0) {
        const r = list[0];
        document.getElementById("user-title").innerText = r.title || "---";
        const s = parseInt(r.stars) || 0;
        document.getElementById("star-display").innerText =
          "★".repeat(s) + "☆".repeat(Math.max(0, 5 - s));
        document.getElementById("level-description").innerText =
          r.description || "";
      }
    })
    .catch((e) => {
      document.getElementById("level-description").innerText = "住民票読込失敗";
    });

  // ワークショップデータの取得
  fetch(WORKSHOP_GAS_URL)
    .then((res) => res.json())
    .then((data) => {
      const list = Array.isArray(data) ? data : data.rows ? data.rows : [];
      const container = document.getElementById("content-list");
      container.innerHTML = "";

      list.forEach((item) => {
        if (!item.title) return;

        const imageHtml = item.image
          ? `<img src="${item.image}" alt="${item.title}" class="card-image" />`
          : "";

        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <div class="title">${item.title}</div>
            ${imageHtml}
            <div class="description">${item.description || ""}</div>
            <div class="time-fee-container">
              <div class="info-badge">${item.time || "---"}</div>
              <div class="info-badge">${item.status || "---"}</div>
            </div>
        `;

        // ★クリックされたら、データを一時保存して detail.html へ移動する
        card.onclick = () => {
          sessionStorage.setItem("selectedWorkshop", JSON.stringify(item));
          window.location.href = "detail.html";
        };

        container.appendChild(card);
      });
    })
    .catch((e) => {
      document.getElementById("content-list").innerHTML = "<p>一覧読込失敗</p>";
    });
}

main();
