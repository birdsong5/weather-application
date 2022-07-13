let now = new Date();
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let day = days[now.getDay()];

let months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
let month = months[now.getMonth()];
let date = now.getDate();

let today = document.querySelector(".day-today");
today.innerHTML = `${day}, ${month} ${date}`;

let hourNow = now.getHours();
if (hourNow < 10) {
  hourNow = `0${hourNow}`;
}
let minutesNow = now.getMinutes();
if (minutesNow < 10) {
  minutesNow = `0${minutesNow}`;
}
let timeNow = document.querySelector(".time-now");
timeNow.innerHTML = `${hourNow}:${minutesNow}`;

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[day];
}

function showForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `
        <div class="col">
          <div class="card" style="width: 9rem">
            <div class="card-body">
              <h5 class="card-title" id="weather-forecast-date">${formatDay(
                forecastDay.dt
              )}</h5>
              <h6 class="card-subtitle mb-2" id="weather-description">${
                forecastDay.weather[0].description
              }</h6>
              <img 
              src="http://openweathermap.org/img/wn/${
                forecastDay.weather[0].icon
              }@2x.png"
              alt=""
              width="76"
              />
              <div class="weather-forecast-temperatures">
                <span class="weather-forecast-max-temp">${Math.round(
                  forecastDay.temp.max
                )}°C</span> /
                <span class="weather-forecast-min-temp">${Math.round(
                  forecastDay.temp.min
                )}°C</span>
              </div>
            </div>
          </div>
        </div>`;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "468253ff0d2c7b9f49a43bcd7fd91cbf";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(showForecast);
}

function showWeather(response) {
  document.querySelector("h1").innerHTML = response.data.name;
  let iconElement = document.querySelector("#icon");
  celsiusTemperature = response.data.main.temp;
  document.querySelector(".temperature-now-span").innerHTML =
    Math.round(celsiusTemperature);
  document.querySelector("h4").innerHTML = response.data.weather[0].description;
  document.querySelector(
    "#humidity"
  ).innerHTML = `${response.data.main.humidity}%`;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  celsiusTemperatureFeelsLike = response.data.main.feels_like;

  document.querySelector("#feels-like").innerHTML = Math.round(
    celsiusTemperatureFeelsLike
  );
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
  getForecast(response.data.coord);
}

function searchCityDefault(city) {
  let apiKey = "468253ff0d2c7b9f49a43bcd7fd91cbf";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showWeather);
}

function searchCity(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;
  let apiKey = "468253ff0d2c7b9f49a43bcd7fd91cbf";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showWeather);
  searchCityDefault(city);
}

function searchLocation(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = "468253ff0d2c7b9f49a43bcd7fd91cbf";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showWeather);
}

function getCurrentPosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

function displayFahrenheitUnits(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector(".temperature-now-span");
  let feelsLikeTemp = document.querySelector("#feels-like");
  let feelsLikeUnit = document.querySelector("#feels-like-unit");
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  let fahrenheitTemperatureFeelsLike =
    (celsiusTemperatureFeelsLike * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
  feelsLikeTemp.innerHTML = Math.round(fahrenheitTemperatureFeelsLike);
  feelsLikeUnit.innerHTML = "°F";
}

function displayCelsiusUnits(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector(".temperature-now-span");
  let feelsLikeTemp = document.querySelector("#feels-like");
  let feelsLikeUnit = document.querySelector("#feels-like-unit");
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  feelsLikeTemp.innerHTML = Math.round(celsiusTemperatureFeelsLike);
  feelsLikeUnit.innerHTML = "°C";
}

let celsiusTemperature = null;
let celsiusTemperatureFeelsLike = null;

let submitCity = document.querySelector("#city-search");
submitCity.addEventListener("submit", searchCity);

let currentLocationButton = document.querySelector(".location-btn");
currentLocationButton.addEventListener("click", getCurrentPosition);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitUnits);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusUnits);

searchCityDefault("Prague");
