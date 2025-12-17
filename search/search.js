async function loadSearch() {
  const params = new URLSearchParams(window.location.search);
  const q = params.get("q");

  if (!q) return;

  document.getElementById("search-title").innerText =
    `Kết quả tìm kiếm cho: "${q}"`;

 const res = await fetch(
  `https://dulichxanh-backend.onrender.com/public/search?q=${encodeURIComponent(q)}`
);
  const data = await res.json();

const root = document.getElementById("search-result");

if (!data.length) {
  root.innerHTML = "<p>Không tìm thấy kết quả phù hợp.</p>";
  return;
}

root.innerHTML = data.map(p => `
  <div class="search-item" onclick="goPost('${p._id}')">
    <img src="${p.thumbnail}">
    <div class="search-info">
      <h3 class="search-title">${p.title}</h3>
      <p class="search-sapo">${p.sapo || ""}</p>
      <p class="search-meta">
        ${p.author} · ${new Date(p.publishedAt || p.createdAt).toLocaleDateString("vi-VN")}
      </p>
    </div>
  </div>
`).join("");
}

function goPost(id) {
  window.location.href = `/post/post.html?id=${id}`;
}

loadSearch();
