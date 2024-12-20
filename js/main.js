const wrongInput = document.getElementById("wrong-input");
const cityInput = document.getElementById("city-input");
const todayCard = document.getElementById("weather-today");
const tomorrowCard = document.getElementById("weather-tomorrow");
const dayAfterCard = document.getElementById("weather-day-after");

const apiKey = "54e634a2784247ddbb9133015241512";
const apiUrl = `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=`;

window.addEventListener("load", async () => {
  const lastCity = localStorage.getItem("lastCity");
  if (lastCity) {
    const data = await getCityData(lastCity);
    if (data && data[0]) {
      const cityName = data[0].name;
      const lat = data[0].lat;
      const lon = data[0].lon;
      await getWeather(cityName, lat, lon);
    } else {
      wrongInput.innerHTML = "<p>City not found!</p>";
    }
  } else {
    await getWeather("Cairo", 30.0444, 31.2357);
  }
});

function clear() {
  wrongInput.innerHTML = "";
}

cityInput.addEventListener("input", async function (event) {
  const city = event.target.value;
  clear();

  if (city) {
    const data = await getCityData(city);
    if (data && data[0]) {
      const cityName = data[0].name;
      const lat = data[0].lat;
      const lon = data[0].lon;
      localStorage.setItem("lastCity", cityName);

      await getWeather(cityName, lat, lon);
    } else {
      wrongInput.innerHTML = "<p>City not found!</p>";
    }
  } else {
    await getWeather("Cairo", 30.0444, 31.2357);
  }
});

async function getCityData(city) {
  try {
    const response = await fetch(apiUrl + city);
    const data = await response.json();
    if (data.length === 0) {
      throw new Error("City not found");
    }
    return data;
  } catch (error) {
    console.error("Error fetching city data:", error);
    wrongInput.innerHTML =
      "<p>Error fetching city data. Please try again later.</p>";
  }
}

async function getWeather(city, lat, lon) {
  const weatherUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=3`;
  try {
    const response = await fetch(weatherUrl);
    const data = await response.json();

    if (data && data.forecast) {
      displayWeather(data.forecast.forecastday, city);
    } else {
      wrongInput.innerHTML = "<p>Weather data not available!</p>";
    }
  } catch (error) {
    console.error("Error fetching weather data:", error);
    wrongInput.innerHTML =
      "<p>Weather data not available. Please try again later.</p>";
  }
}

function displayWeather(forecast, city) {
  // today
  const today = forecast[0];
  const todayHTML = `
        <div class="weather-card">
            <div class="d-flex justify-content-between"> <p>${today.date}</p> <p>today</p></div>
            <h3 class="text-secondary m-0 mt-2">${city}</h3>
            <h2 class="m-0">${today.day.avgtemp_c}°C</h2>
            <img src="https:${today.day.condition.icon}" alt="Weather icon">
            <p class="mb-4">${today.day.condition.text}</p>
            <div class="m-2 d-flex">
                <p><img class="me-2" src="imges/icon-umberella.png" alt=""> 20%</p> 
                <p><img class="me-2 ms-3" src="imges/icon-wind.png" alt=""> 18km/h </p> 
                <p><img class="me-2 ms-3" src="imges/icon-compass.png" alt=""> East</p>
            </div>
        </div>
    `;
  todayCard.innerHTML = todayHTML;

  // second day
  const tomorrow = forecast[1];
  const tomorrowHTML = `
        <div class="weather-card">
            <p class="mb-5">${tomorrow.date}</p>
            <h2 class="m-0">${tomorrow.day.avgtemp_c}°C</h2>
            <img src="https:${tomorrow.day.condition.icon}" alt="Weather icon">
            <p class="mb-5">${tomorrow.day.condition.text}</p>
        </div>
    `;
  tomorrowCard.innerHTML = tomorrowHTML;

  // third day
  const dayAfter = forecast[2];
  const dayAfterHTML = `
        <div class="weather-card">
            <p class="mb-5">${dayAfter.date}</p>
            <h2 class="m-0">${dayAfter.day.avgtemp_c}°C</h2>
            <img src="https:${dayAfter.day.condition.icon}" alt="Weather icon">
            <p class="mb-5">${dayAfter.day.condition.text}</p>
        </div>
    `;
  dayAfterCard.innerHTML = dayAfterHTML;

  clear();
}
