import { VISUAL_CROSSING_API_KEY } from "./env.js";
import {
  getLocalStorage,
  setLocalStorage,
  removeLocalStorage,
} from "./localstorage.js";
import { formatDate, lessThanOneHourAgo } from "./datehelpers.js";
import { setColors } from "./setcolors.js";

const displayErrorDiv = document.querySelector(".display-error");
const displayWeatherDiv = document.querySelector(".display-weather");
const displayErrorText = document.querySelector(".display-error__text");
const unitsCelsiusFahrenheit = document.querySelector(
  "#units-celsius-fahrenheit"
);
const loader = document.querySelector(".loader");

// Initialize search
const searchButton = document.querySelector(".search__button");
searchButton.addEventListener("click", () => {
  requestWeather(searchInput.value, new Date());
});

const searchInput = document.querySelector(".search__input");
searchInput.addEventListener("keyup", (event) => {
  if (event.keyCode === 13) {
    requestWeather(searchInput.value, new Date());
  }
});

async function requestWeather(location, date) {
  // Disable the buttons and show the loader
  searchButton.disabled = true;
  searchInput.disabled = true;
  loader.style.display = "inline-block";

  const result = await getWeather(location, date);
  if (result.error) {
    displayError(result.error);
  } else {
    setColors(Number(result.days[0].temp));
    unitsCelsiusFahrenheit.checked
      ? displayWeather(parseWeatherData(result))
      : displayWeather(parseWeatherData(result, celsius));
  }

  searchButton.disabled = false;
  searchInput.disabled = false;
  loader.style.display = "none";
}

async function getWeather(location, date) {
  /* Compare the query to locally stored data. If there is local data, it is 
     for the same location search string and the current time is less than one
     hour after stored data, return the data from localStorage.
  */

  const localData = getLocalStorage();
  if (localData) {
    const localDate = new Date(localData.date);
    if (localData.location === location && lessThanOneHourAgo(localDate)) {
      console.log("LOCAL STORAGE RETURNED");
      return localData.weatherData;
    }
  }

  // Otherwise, query the API, update local storage and return API data.
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/${formatDate(
    date
  )}/?key=${VISUAL_CROSSING_API_KEY}`;
  try {
    const response = await fetch(url, { mode: "cors" });
    if (response.ok) {
      const weatherData = await response.json();
      console.log("API QUERIED");
      setLocalStorage({ location, date, weatherData });
      return weatherData;
    } else if (response.status === 400) {
      return { error: "Location not found" };
    } else {
      return { error: `Unexpected error: ${response.status}` };
    }
  } catch (error) {
    return { error: "Network error or API unreachable" };
  }
}

function displayError(error) {
  displayErrorText.innerHTML = "";
  displayErrorDiv.classList.add("active");
  displayWeatherDiv.classList.remove("active");

  if (error === "Location not found") {
    displayErrorText.innerHTML = `
      <p><strong>Location not found</strong></p>
      <p>You can try:</p>
      <li>Checking the spelling</li>
      <li>Adding the country</li>
    `;
  } else {
    displayErrorText.innerHTML = error;
  }
}

function displayWeather(data) {
  displayErrorDiv.classList.remove("active");

  const display = {
    ".resolved-address": data.resolvedAddress,
    ".temp": `${data.temp}&deg;`,
    ".feels-like.data": `${data.feelsLike}&deg;`,
    ".temp-min.data": `${data.tempMin}&deg;`,
    ".temp-max.data": `${data.tempMax}&deg;`,
    ".humidity.data": `${data.humidity}%`,
    ".precip-prob.data": `${data.precipProb}%`,
    ".precip.data": `0 to ${data.precip}mm`,
    ".description.row": data.description,
  };

  for (const [key, value] of Object.entries(display)) {
    const element = document.querySelector(key);
    element.innerHTML = value;
  }

  // Update the icon to match weather data
  const icon = document.querySelector(".icon");
  icon.setAttribute("src", `./icons/${data.icon}.svg`);
  icon.setAttribute("alt", data.icon);

  // Display the weather div
  displayWeatherDiv.classList.add("active");
}

function parseWeatherData(
  data,
  units = (temp) => {
    return temp;
  }
) {
  const day = data.days[0];

  // Return the simplified data for the first day in the weather dataset.
  // Default units are Fahrenheit. For different units pass a unit conversion
  // function in as second parameter. Use camelCase version of api's key, list
  // in alphabetical order.
  return {
    conditions: day.conditions,
    description: day.description,
    dateTime: day.datetime,
    feelsLike: units(day.feelslike),
    humidity: day.humidity,
    icon: day.icon,
    precip: Math.ceil(day.precip * 100),
    precipType: day.preciptype ? day.preciptype[0] : null,
    precipProb: day.precipprob,
    resolvedAddress: data.resolvedAddress,
    temp: units(day.temp),
    tempMax: units(day.tempmax),
    tempMin: units(day.tempmin),
  };
}

// Unit conversion helper
function celsius(temp) {
  if (isNaN(temp) || temp === null) {
    return null;
  }
  return Math.round((((Number(temp) - 32) * 5) / 9) * 10) / 10;
}
