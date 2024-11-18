import { VISUAL_CROSSING_API_KEY } from "./env.js";
import { getLocalStorage, setLocalStorage } from "./localstorage.js";

const content = document.querySelector(".content");
const searchButton = document.querySelector(".search__button");
const searchInput = document.querySelector(".search__input");

// Page interactions
searchButton.addEventListener("click", () => {
  displayWeather(searchInput.value, new Date());
});

searchInput.addEventListener("keyup", (event) => {
  if (event.keyCode === 13) {
    displayWeather(searchInput.value, new Date());
  }
});

// Date functions
function formatDate(date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function lessThanOneHourAgo(date) {
  const currentDate = new Date();
  const difference = currentDate.getTime() - date.getTime();
  const millisecondsInHour = 1000 * 60 * 60;
  return Math.abs(difference) < millisecondsInHour ? true : false;
}

// Get, parse, display weather data.
function displayWeather(location, date) {
  getWeather(location, date).then((data) =>
    console.table(parseWeatherData(data, celsius))
  );
}

async function getWeather(location, date) {
  // Retrieve locally stored weather data (last queried).
  const localData = getLocalStorage();
  const localDate = new Date(localData.date);
  // Compare the query to locally stored data. If it is for the same location
  // and the current time is less than one hour after stored data, return the data from localStorage.
  // Otherwise, query the API, update local storage and return API data.
  if (localData.location === location && lessThanOneHourAgo(localDate)) {
    console.log("LOCAL STORAGE RETURNED");
    return localData.weatherData;
  } else {
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/${formatDate(
      date
    )}/?key=${VISUAL_CROSSING_API_KEY}`;
    const response = await fetch(url, { mode: "cors" });
    const weatherData = await response.json();
    console.log("API QUERIED");
    setLocalStorage({ location, date, weatherData });
    return weatherData;
  }
}

function parseWeatherData(
  data,
  units = (temp) => {
    return temp;
  }
) {
  const day = data.days[0];

  // Return the simplified data for the first day in the weather dataset.
  // Default units are Fahrenheit, for different units pass a unit conversion
  // function in as second parameter. Use camelCase version of api's key, list
  // in alphabetical order.
  return {
    conditions: day.conditions,
    description: day.description,
    dateTime: day.datetime,
    feelsLike: units(day.feelslike),
    humidity: day.humidity,
    icon: day.icon,
    precipitationType: day.preciptype[0],
    precipitationProb: day.precipprob,
    resolvedAddress: data.resolvedAddress,
    temp: units(day.temp),
    tempMax: units(day.tempmax),
    tempMin: units(day.tempmin),
  };
}

// Unit conversion helper
function celsius(temp) {
  return Math.round((((Number(temp) - 32) * 5) / 9) * 10) / 10;
}
