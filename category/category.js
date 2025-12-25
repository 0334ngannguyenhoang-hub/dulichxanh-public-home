// ===============================================
// Lấy cat & sub
// ===============================================
const params = new URLSearchParams(window.location.search);
const cat = params.get("cat");
const sub = params.get("sub") || "";

// ===============================================
// Bảng tên có dấu
// ===============================================
const CATEGORY_NAME_VN = {
  "tin-tuc": "Tin tức",
  "trai-nghiem-xanh": "Trải nghiệm xanh",
  "guong-mat-sinh-thai": "Gương mặt sinh thái",
  "goc-hoc-thuat": "Góc học thuật",
  "multimedia": "Multimedia",
};

const SUBCATEGORY_NAME_VN = {
  "tin-trong-nuoc": "Tin trong nước",
  "tin-the-gioi": "Tin thế giới",
  "am-thuc": "Ẩm thực",
  "diem-den": "Điểm đến",
  "ba-lo-du-lich": "Ba lô du lịch",
  "di-chuyen-xanh": "Di chuyển xanh",
  "nguoi-dan-xanh": "Người dân xanh",
  "su-gia-van-hoa": "Sứ giả văn hóa",
  "doanh-nghiep-xanh": "Doanh nghiệp xanh",
  "cong-nghe-xanh": "Công nghệ xanh",
  "tri-thuc-ben-vung": "Tri thức bền vững",
  "du-lieu-chinh-sach": "Dữ liệu & chính sách",
  "anh": "Ảnh",
  "video": "Video",
  "infographic": "Infographic",
  "emagazine": "E-magazine",
};

// ===============================================
// Map subcategory
// ===============================================
const CATEGORY_MAP = {
  "tin-tuc": ["tin-trong-nuoc", "tin-the-gioi"],
  "trai-nghiem-xanh": ["am-thuc", "diem-den", "ba-lo-du-lich", "di-chuyen-xanh"],
  "guong-mat-sinh-thai": ["nguoi-dan-xanh", "su-gia-van-hoa", "doanh-nghiep-xanh"],
  "goc-hoc-thuat": ["cong-nghe-xanh", "tri-thuc-ben-vung", "du-lieu-chinh-sach"],
  "multimedia": ["anh", "video", "infographic", "emagazine"],
};

// ===============================================
// Tiêu đề
// ===============================================
document.getElementById("cat-title").innerText = CATEGORY_NAME_VN[cat];

// Click vào tiêu đề → quay về category lớn
document.getElementById("cat-title").onclick = () => {
  window.location.search = `?cat=${cat}`;
};

// ===============================================
// Render nút sub
// ===============================================
function renderSubButtons() {
  const root = document.getElementById("cat-sub");
  const list = CATEGORY_MAP[cat] || [];

  root.innerHTML = list
    .map(
      (s) => `
      <button class="${sub === s ? "active" : ""}" onclick="filterSub('${s}')">
        ${SUBCATEGORY_NAME_VN[s] || s}
      </button>`
    )
    .join("");
}

function filterSub(s) {
  window.location.search = `?cat=${cat}&sub=${s}`;
}

renderSubButtons();

// ===============================================
// Load dữ liệu
// ===============================================
async function loadCategory() {
  try {
    let posts = [];

    // ✅ Nếu đang ở subcategory → gọi thẳng
    if (sub) {
      const res = await fetch(
        `https://dulichxanh-backend.onrender.com/public/category/${sub}`
      );
      posts = await res.json();
    }

    // ✅ Nếu ở chuyên mục to → gộp tất cả sub
    else {
      const subList = CATEGORY_MAP[cat] || [];

      const requests = subList.map(s =>
        fetch(`https://dulichxanh-backend.onrender.com/public/category/${s}`)
          .then(res => res.json())
          .catch(() => [])
      );

      const results = await Promise.all(requests);

      // Gộp + loại trùng bài
      const map = {};
      results.flat().forEach(p => {
        map[p._id] = p;
      });

      posts = Object.values(map);
    }

    renderCategory(posts);

  } catch (err) {
    console.error("Load category error:", err);
    document.getElementById("cat-main").innerHTML =
      "<p>Không thể tải bài viết.</p>";
  }
}



loadCategory();

// ===============================================
// Render giao diện
// ===============================================
function renderCategory(list) {
  const main = document.getElementById("cat-main");
  const trendingRoot = document.getElementById("cat-trending");

  if (!list.length) {
    main.innerHTML = `<p>Không có bài viết nào.</p>`;
    return;
  }

  const first = list[0];
  const rest = list.slice(1);

  main.innerHTML = `
    <div class="big-article" onclick="goPost('${first._id}')">
      <img src="${first.thumbnail}">
      <h2 class="big-title">${first.title}</h2>
      <p>${first.sapo}</p>
      <p>${first.author}</p>
    </div>

    <div class="small-list">
      ${rest
        .map(
          (p) => `
        <div class="small-item" onclick="goPost('${p._id}')">
          <img src="${p.thumbnail}">
          <div>
            <p class="small-title">${p.title}</p>
            <p class="small-sapo">${p.sapo}</p>
            <p class="small-author">${p.author}</p>
          </div>
        </div>`
        )
        .join("")}
    </div>
  `;

  const views = JSON.parse(localStorage.getItem("post_views_v1") || "{}");

  const sorted = list
    .map((p) => ({ ...p, views: views[p._id] || 0 }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  trendingRoot.innerHTML = sorted
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

function goPost(id) {
  window.location.href = `/post/post.html?id=${id}`;
}

