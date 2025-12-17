function initTopbarSearch() {
  const input = document.getElementById("searchInput");
  const btn = document.getElementById("searchBtn");

  if (!input || !btn) return;

  function doSearch() {
    const q = input.value.trim();
    if (!q) return;

    window.location.href =
      `/search/search.html?q=${encodeURIComponent(q)}`;
  }

  btn.addEventListener("click", doSearch);

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") doSearch();
  });
}

document.addEventListener("DOMContentLoaded", initTopbarSearch);
