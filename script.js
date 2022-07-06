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

function showWeather(response) {
  console.log(response);
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
  document.querySelector("#feels-like").innerHTML = Math.round(
    response.data.main.feels_like
  );
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
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
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
}

function displayCelsiusUnits(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector(".temperature-now-span");
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}

let celsiusTemperature = null;

let submitCity = document.querySelector("#city-search");
submitCity.addEventListener("submit", searchCity);

let currentLocationButton = document.querySelector(".location-btn");
currentLocationButton.addEventListener("click", getCurrentPosition);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitUnits);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusUnits);

searchCityDefault("Prague");
