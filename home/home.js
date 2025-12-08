/* ================ HOME (SAFE) ================ */
async function loadHome() {
  try {
    const res = await fetch("http://localhost:3000/home");
    const data = await res.json();

    console.log("Home data:", data);

    loadHighlight(data.highlight, data.recent);

    loadSectionTinTuc(data.tintuc);
    loadSectionTraiNghiem("section-trainghiem", data.trainghiem);
    loadSection("section-guongmat", data.guongmat);
    loadSectionAcademic("section-gochocthuat", data.gochocthuat);
    loadSection("section-multimedia", data.multimedia);

    const allPosts = [
      ...(data.tintuc || []),
      ...(data.trainghiem || []),
      ...(data.guongmat || []),
      ...(data.gochocthuat || []),
      ...(data.multimedia || [])
    ];

    renderTrendingWidget(allPosts);

    initBannerCarousel();
    initScrollAnimations();
    initStickyMenu();

  } catch (err) {
    console.error("Failed to load home:", err);
  }
}

/* ================ TIÊU ĐIỂM ================ */
function loadHighlight(highlight, recentList) {
  if (!highlight) return;

  // ⭐ FIX LỖI — không có highlight-img thì dừng, tránh lỗi null
  const highlightImgEl = document.getElementById("highlight-img");
  if (!highlightImgEl) return;

  highlightImgEl.src = highlight.thumbnail || "img/default-highlight.jpg";
  highlightImgEl.onclick = () => goPost(highlight._id);

  document.getElementById("highlight-title").innerText = highlight.title;
  document.getElementById("highlight-sapo").innerText = highlight.sapo;
  document.getElementById("highlight-author").innerText =
    `${highlight.author} · ${new Date(highlight.createdAt).toLocaleDateString("vi-VN")}`;

  const listRoot = document.getElementById("highlight-list");
  if (!listRoot) return;

  listRoot.innerHTML = (recentList || []).map(p => `
    <div class="highlight-small-item" onclick="goPost('${p._id}')">
      <img src="${p.thumbnail}">
      <div>
        <p>${p.title}</p>
        <small>${p.author}</small>
      </div>
    </div>
  `).join("");
}


/* ================ CÁC BLOCK CHUYÊN MỤC ================ */
function loadSection(rootId, list) {
  const root = document.getElementById(rootId);
  if (!root || !list || list.length === 0) return;

  const first = list[0];
  const rest = list.slice(1, 4);

  root.innerHTML = `
    <div class="news-big" onclick="goPost('${first._id}')">
      <img src="${first.thumbnail}">
      <p class="news-title">${first.title}</p>
      <p class="news-sapo">${first.sapo}</p>
      <p class="news-author">${first.author}</p>
    </div>

    <div class="news-small">
      ${rest.map(p => `
       <div class="news-small-item" onclick="goPost('${p._id}')">
          <img src="${p.thumbnail}">
          <div>
            <p class="news-title">${p.title}</p>
            <p class="news-author">${p.author}</p>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

function loadSectionTinTuc(list) {
  if (!list || list.length === 0) return;

  const big = document.getElementById("tintuc-big");
  const small = document.getElementById("tintuc-small");

  if (!big || !small) return; // ⭐ FIX QUAN TRỌNG – KHÔNG CÓ ELEMENT THÌ DỪNG

  const first = list[0];
  const rest = list.slice(1, 4);

  big.innerHTML = `
    <div class="tintuc-big" onclick="goPost('${first._id}')">
      <img src="${first.thumbnail}">
      <h3 class="tintuc-big-title">${first.title}</h3>
      <p class="tintuc-big-sapo">${first.sapo || ""}</p>
      <p class="news-author">${first.author || ""}</p>
    </div>
  `;

  small.innerHTML = rest.map(p => `
    <div class="tintuc-small-item" onclick="goPost('${p._id}')">
      <img src="${p.thumbnail}">
      <div>
        <p class="news-title">${p.title}</p>
        <p class="news-author">${p.author}</p>
      </div>
    </div>
  `).join("");
}



/* ========== LOAD SECTION 3 COLUMNS FOR "TRẢI NGHIỆM XANH" ========== */
function loadSectionTraiNghiem(rootId, list) {
  const root = document.getElementById(rootId);
  if (!root || !list || list.length === 0) return;

  const first = list[0];
  const rest = list.slice(1, 4);

  root.innerHTML = `
    <div class="tn-grid">

      <!-- CỘT TRÁI: WIDGET TÁI CHẾ -->
      <div class="recycle-widget">
        <h3>♻️ Tái chế gì hôm nay?</h3>
        <ul id="recycle-list"></ul>
      </div>

      <!-- CỘT GIỮA: BÀI TO -->
      <div class="tn-big" onclick="goPost('${first._id}')">
        <img src="${first.thumbnail}">
        <p class="news-title">${first.title}</p>
        <p class="news-sapo">${first.sapo}</p>
        <p class="news-author">${first.author}</p>
      </div>

      <!-- CỘT PHẢI: 3 BÀI NHỎ -->
      <div class="tn-small-list">
        ${rest.map(p => `
          <div class="tn-small-item" onclick="goPost('${p._id}')">
            <img src="${p.thumbnail}">
            <div>
              <p class="news-title">${p.title}</p>
              <p class="news-author">${p.author}</p>
            </div>
          </div>
        `).join("")}
      </div>

    </div>
  `;

  loadRecycleTip();
}

/* ========== LOAD SECTION 4 COLUMNS FOR "GÓC HỌC THUẬT" ========== */
function loadSectionAcademic(rootId, list) {
  const root = document.getElementById(rootId);
  if (!root || !list || list.length === 0) return;

  const items = list.slice(0, 4); // Chỉ lấy 4 bài

  root.innerHTML = `
    <div class="academic-grid">
      ${items.map(p => `
        <div class="academic-item" onclick="goPost('${p._id}')">
          <img src="${p.thumbnail}">
          <p class="academic-title">${p.title}</p>
        </div>
      `).join("")}
    </div>
  `;
}


/* ================ BACK TO TOP ================ */
const backToTop = document.getElementById("backToTop");
if (backToTop) {
  window.addEventListener("scroll", () => {
    backToTop.classList.toggle("show", window.scrollY > 300);
  });
  backToTop.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });
}

function initScrollAnimations() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  });

  document.querySelectorAll('.anim-in').forEach(el => obs.observe(el));
}

/* ================ SLIDER ================ */
function initBannerCarousel() {
  const root = document.querySelector(".banner-carousel");
  if (!root) return;

  const slides = root.querySelectorAll(".banner-slide");
  let i = 0;

  slides[i].classList.add("active");
  setInterval(() => {
    slides[i].classList.remove("active");
    i = (i + 1) % slides.length;
    slides[i].classList.add("active");
  }, 4500);
}

/* ================ TRENDING ================ */
function renderTrendingWidget(allPosts) {
  const root = document.getElementById("trending-list");
  if (!root) return;

  const views = JSON.parse(localStorage.getItem("post_views_v1") || "{}");

  const ranked = allPosts
    .map(p => ({ ...p, views: views[p._id] || 0 }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 3);

  root.innerHTML = ranked.map(
    p => `
    <div class="trending-item" onclick="goPost('${p._id}')">
      <img src="${p.thumbnail}">
      <div>
        <strong>${p.title}</strong>
        <small>${p.views} lượt xem</small>
      </div>
    </div>`
  ).join("");
}

/* ================ STICKY MENU ================ */
function initStickyMenu() {
  const menu = document.querySelector(".menu");
  if (!menu) return;

  window.addEventListener("scroll", () => {
    menu.classList.toggle("stuck", window.scrollY > 120);
  });
}

/* ================ MỞ BÀI VIẾT ================ */
function goPost(id) {
  window.location.href = `/post/post.html?id=${id}`;
}

/* ================ START ================ */
document.addEventListener("DOMContentLoaded", () => {
  loadHome();
});


/* ===================== ECO WIDGET — Chỉ số xanh hôm nay ===================== */
async function loadEcoWidget() {
  try {
    // API thời tiết
    const weatherRes = await fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=21.028&longitude=105.834&current_weather=true&daily=uv_index_max"
    );
    const weatherData = await weatherRes.json();
    const w = weatherData.current_weather;

    document.getElementById("eco-temp").innerText =
      `🌡️ Nhiệt độ: ${w.temperature}°C`;

    document.getElementById("eco-uv").innerText =
      `🔆 Chỉ số UV: ${weatherData.daily.uv_index_max[0]}`;

    // API AQI Hà Nội
    const aqiRes = await fetch("https://api.waqi.info/feed/hanoi/?token=demo");
    const aqiData = await aqiRes.json();

    if (aqiData.status === "ok") {
      document.getElementById("eco-aqi").innerText =
        `💨 AQI: ${aqiData.data.aqi}`;
    }

  } catch (err) {
    console.log("Eco widget error:", err);
  }
}

loadEcoWidget();

/* ========== WIDGET TÁI CHẾ GỢI Ý NGẪU NHIÊN ========== */
const recycleTips = [
  "Rửa sạch chai nhựa và nén lại trước khi bỏ vào thùng tái chế.",
  "Tái sử dụng lọ thủy tinh làm hộp đựng gia vị.",
  "Dùng báo cũ để gói đồ dễ vỡ khi di chuyển.",
  "Biến vỏ lon thành chậu cây mini.",
  "Tận dụng quần áo cũ làm khăn lau thay cho khăn giấy.",
  "Đừng quên phân loại pin thải riêng và đem đến điểm thu gom."
];

function loadRecycleTip() {
  const list = document.getElementById("recycle-list");
  if (!list) return;

  // Lấy ngẫu nhiên 3 tips
  const shuffled = recycleTips.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 3);

  list.innerHTML = selected
    .map(tip => `<li class="recycle-item">• ${tip}</li>`)
    .join("");
}

/* ================== CLICK CATEGORY TITLE -> GO TO CATEGORY PAGE ================== */
document.querySelectorAll(".category-link").forEach(el => {
  el.style.cursor = "pointer";

  el.addEventListener("click", () => {
    const cat = el.getAttribute("data-cat");
    if (cat) {
      window.location.href = `/category/category.html?cat=${cat}`;
    }
  });
});

