function updateTopbarTime() {
  const now = new Date();

  const weekdays = [
    "Chủ nhật",
    "Thứ hai",
    "Thứ ba",
    "Thứ tư",
    "Thứ năm",
    "Thứ sáu",
    "Thứ bảy"
  ];

  const dayName = weekdays[now.getDay()];
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  const dateEl = document.getElementById("topbar-date");
  const timeEl = document.getElementById("topbar-time");

  if (!dateEl || !timeEl) return; // ⭐ QUAN TRỌNG

  dateEl.innerText = `${dayName}, ${day}/${month}/${year}`;
  timeEl.innerText = `${hours}:${minutes} GMT+7`;
}

function startTopbarClock() {
  updateTopbarTime();
  setInterval(updateTopbarTime, 60 * 1000);
}
