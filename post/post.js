async function main() {
  const params = new URLSearchParams(window.location.search);
  const postId = params.get("id");

  if (!postId) {
    document.getElementById("post-title").innerText = "❌ Không tìm thấy bài viết";
    console.error("❌ postId is null");
    return;
  }

  loadPost(postId);
}

main();

/* ============================================
   LOAD BÀI VIẾT
============================================ */
async function loadPost(postId) {
  const res = await fetch(`https://dulichxanh-backend.onrender.com/public/posts/${postId}`);
  if (!res.ok) {
    const err = await res.json().catch(()=>({error:"Server error"}));
    console.error("LOAD POST ERROR:", err);
    document.getElementById("post-title").innerText = "❌ Không thể tải bài viết";
    document.getElementById("post-content").innerHTML = `<p style="color:#999">Lỗi: ${err.error || "Server error"}</p>`;
    return;
  }

  const post = await res.json();

  // Gán thông tin cơ bản
  document.getElementById("post-title").innerText = post.title;
  document.getElementById("post-author").innerText = post.author;
  document.getElementById("post-date").innerText =
    new Date(post.createdAt).toLocaleDateString("vi-VN");
  document.getElementById("post-sapo").innerText = post.sapo;

  const contentBox = document.getElementById("post-content");

  // ============================
  //        E - MAGAZINE
  // ============================
if (post.type === "emagazine") {

    if (post.emagPage) {
      contentBox.innerHTML = `
        <div style="padding:20px; text-align:center; color:#0b8457;">
            <b>📄 Đây là bài E-magazine</b>
            <p style="font-size:14px; color:#555;">
                Bấm nút bên dưới để mở trang E-magazine trên Canva Website
            </p>
            <a href="${post.emagPage}" target="_blank" 
               style="display:inline-block; padding:12px 20px; background:#0b8457; color:white; border-radius:8px; text-decoration:none; margin-top:12px;">
               🔗 Mở E-magazine
            </a>
        </div>`;
    } else {
      contentBox.innerHTML = `<p style="color:#999">(Chưa có link E-magazine)</p>`;
    }

    return; // tránh render nội dung bài viết thường
}

  // ============================
  //        BÀI VIẾT THƯỜNG
  // ============================
  else {
    contentBox.innerHTML = post.content;
  }

  // Load trending, related...
  loadTrending(post.category || []);
  loadRelated(post.category || [], post._id);

  // Tăng lượt xem
  increaseView(postId);
}

/* ============================================
   LƯỢT XEM
============================================ */
function increaseView(id) {
  const raw = localStorage.getItem("post_views_v1");
  const map = raw ? JSON.parse(raw) : {};

  map[id] = (map[id] || 0) + 1;

  localStorage.setItem("post_views_v1", JSON.stringify(map));
}

/* ============================================
   BÀI ĐỌC NHIỀU
============================================ */
async function loadTrending(categories = []) {
  const res = await fetch("https://dulichxanh-backend.onrender.com/public/posts");
  const all = await res.json();
  const views = JSON.parse(localStorage.getItem("post_views_v1") || "{}");

  const same = all.filter(
    (p) => p.category.some((c) => categories.includes(c))
  );

  const sorted = same
    .map((p) => ({ ...p, views: views[p._id] || 0 }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  document.getElementById("post-trending").innerHTML = sorted
    .map(
      (p) => `
    <div class="trend-item" onclick="goPost('${p._id}')">
      <img src="${p.thumbnail}">
      <div>
        <strong>${p.title}</strong>
        <small>${p.views} lượt xem</small>
      </div>
    </div>`
    )
    .join("");
}

/* ============================================
   CÙNG CHỦ ĐỀ
============================================ */
async function loadRelated(categories = [], currentId) {
  const res = await fetch("https://dulichxanh-backend.onrender.com/public/posts");
  const all = await res.json();

  const related = all
    .filter(
      (p) =>
        p._id !== currentId &&
        p.category.some((c) => categories.includes(c))
    )
    .slice(0, 4);

  document.getElementById("related-list").innerHTML = related
    .map(
      (p) => `
    <div class="related-item" onclick="goPost('${p._id}')">
      <img src="${p.thumbnail}">
      <h4>${p.title}</h4>
      <p>${p.author}</p>
    </div>`
    )
    .join("");
}

/* ============================================
   CLICK CHUYỂN TRANG
============================================ */
function goPost(id) {
  window.location.href = `/post/post.html?id=${id}`;
}

document.addEventListener("DOMContentLoaded", () => {
  const content = document.querySelector(".post-content");

  let currentSize = 18;

  // Tăng cỡ chữ
  document.getElementById("fontInc").onclick = () => {
    currentSize += 2;
    content.style.fontSize = currentSize + "px";
  };

  // Giảm cỡ chữ
  document.getElementById("fontDec").onclick = () => {
    currentSize -= 2;
    if (currentSize < 12) currentSize = 12;
    content.style.fontSize = currentSize + "px";
  };

  // Đổi font chữ
  document.getElementById("fontSelect").onchange = (e) => {
    content.style.fontFamily = e.target.value;
  };
});

/* ======================================
   DESTINATION SLIDER (ALBUM DỌC)
====================================== */

document.addEventListener("DOMContentLoaded", () => {

  // Danh sách địa điểm xanh
  const destinations = [
    {
      name: "Hồ Ba Bể",
      province: "Bắc Kạn",
      desc: "Hồ nước tự nhiên lớn nhất Việt Nam.",
      img: "ho-ba-be.jpg",
      url: "https://dulichhobabe.com/vn/vietnam/travel-blog/mrlinh-adventures/1074-su-tich-ho-ba-be--truyen-thuyet-bi-an-cua-nguoi-tay.aspx"
    },
    {
      name: "Vườn Quốc gia Cúc Phương",
      province: "Ninh Bình",
      desc: "Khu rừng già cổ nhất Việt Nam.",
      img: "vuon-quoc-gia.jpg",
      url: "http://cucphuongtourism.com.vn/index.php/vi.html"
    },
    {
      name: "Hang Én",
      province: "Quảng Bình",
      desc: "Một trong ba hang động đẹp nhất thế giới.",
      img: "hang-en.jpg",
      url: "https://oxalisadventure.com/vi/cave/hang-en/"
    }
  ];

  const list = destinations;

  if (!list || list.length === 0) {
    console.warn("Destination slider: không có destinations để hiển thị.");
    return;
  }

  // Lấy phần tử DOM
  const imgEl = document.getElementById("dest-img");
  const nameEl = document.getElementById("dest-name");
  const provEl = document.getElementById("dest-province");
  const descEl = document.getElementById("dest-desc");
  const indexEl = document.getElementById("dest-index");
  const prevBtn = document.getElementById("dest-prev");
  const nextBtn = document.getElementById("dest-next");

  if (!imgEl || !nameEl || !provEl || !descEl || !indexEl) {
    console.error(
      "Destination slider: thiếu phần tử HTML. Cần các id: dest-img, dest-name, dest-province, dest-desc, dest-index"
    );
    return;
  }

  let destIndex = 0;

  function renderDestination() {
    const d = list[destIndex];

    imgEl.src = d.img || "";
    nameEl.innerText = d.name || "";
    provEl.innerText = d.province || "";
    descEl.innerText = d.desc || "";
    indexEl.innerText = `${destIndex + 1} / ${list.length}`;

    // Click vào ảnh → mở website địa điểm
    imgEl.style.cursor = "pointer";
    imgEl.onclick = () => {
      if (d.url) window.open(d.url, "_blank");
    };
  }

  // Prev
  if (prevBtn) {
    prevBtn.addEventListener("click", (e) => {
      e.preventDefault();
      destIndex = (destIndex - 1 + list.length) % list.length;
      renderDestination();
    });
  }

  // Next
  if (nextBtn) {
    nextBtn.addEventListener("click", (e) => {
      e.preventDefault();
      destIndex = (destIndex + 1) % list.length;
      renderDestination();
    });
  }

  // Khởi tạo
  renderDestination();
});

