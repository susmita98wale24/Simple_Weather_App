const apiKey = "f855e2c5feebd62955335e2d3226ef4a"; // replace with your OpenWeatherMap key

// 🔹 Fetch weather by city name
async function getWeather() {
  const city = document.getElementById("cityInput").value;
  const weatherResult = document.getElementById("weatherResult");

  if (city === "") {
    weatherResult.innerHTML = "<p>Please enter a city name</p>";
    return;
  }

  // Show loading spinner
  weatherResult.innerHTML = `<div class="loader"></div>`;

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("City not found");

    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    weatherResult.innerHTML = `<p>${error.message}</p>`;
  }
}

// 🔹 Fetch weather by GPS location
function getLocationWeather() {
  const weatherResult = document.getElementById("weatherResult");
  weatherResult.innerHTML = `<div class="loader"></div>`;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Unable to fetch location weather");

        const data = await response.json();
        displayWeather(data);
      } catch (error) {
        weatherResult.innerHTML = `<p>${error.message}</p>`;
      }
    }, () => {
      weatherResult.innerHTML = `<p>Location access denied</p>`;
    });
  } else {
    weatherResult.innerHTML = `<p>Geolocation not supported</p>`;
  }
}

// 🔹 Display weather details
function displayWeather(data) {
  const weatherResult = document.getElementById("weatherResult");

  weatherResult.innerHTML = `
    <h2>${data.name}, ${data.sys.country}</h2>
    <h3>${data.main.temp}°C</h3>
    <p>${data.weather[0].description}</p>
    <p>🌡️ Feels like: ${data.main.feels_like}°C</p>
    <p>💧 Humidity: ${data.main.humidity}%</p>
    <p>💨 Wind: ${data.wind.speed} m/s</p>
    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">
  `;
}

// 🔹 Support Enter key search
document.getElementById("cityInput").addEventListener("keyup", function(event) {
  if (event.key === "Enter") {
    getWeather();
  }
});
