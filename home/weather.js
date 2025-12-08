/* ======================================================
   WEATHER POPUP — chạy an toàn ở mọi trang
====================================================== */

function initWeatherPopup() {
  // Tìm icon sau khi layout đã load xong
  const icon = document.querySelector(".weather-icon");
  if (!icon) {
    console.warn("weather-icon chưa load, sẽ thử lại sau...");
    setTimeout(initWeatherPopup, 300);
    return;
  }

  console.log("Weather icon found — popup ready!");

  icon.addEventListener("click", () => {
    document.getElementById("weather-popup").classList.remove("hidden");

    fetch("https://api.open-meteo.com/v1/forecast?latitude=21.0278&longitude=105.8342&current_weather=true")
      .then((res) => res.json())
      .then((data) => {
        const w = data.current_weather;
        document.getElementById("weather-status").innerHTML = `
          ⛅ Nhiệt độ: <b>${w.temperature}°C</b><br>
          💨 Gió: ${w.windspeed} km/h<br>
          🕒 ${w.time.replace("T", " ")}
        `;
      });
  });
}

// Nút đóng
function closeWeatherPopup() {
  document.getElementById("weather-popup").classList.add("hidden");
}
initWeatherPopup();
