import { VISUAL_CROSSING_API_KEY } from "./env.js";
import {
  getLocalStorage,
  setLocalStorage,
  removeLocalStorage,
} from "./localstorage.js";
import { formatDate, lessThanOneHourAgo } from "./datehelpers.js";

const content = document.querySelector(".content");
const searchButton = document.querySelector(".search__button");
const searchInput = document.querySelector(".search__input");

// Page interactions
searchButton.addEventListener("click", () => {
  requestWeather(searchInput.value, new Date());
});

searchInput.addEventListener("keyup", (event) => {
  if (event.keyCode === 13) {
    requestWeather(searchInput.value, new Date());
  }
});

async function requestWeather(location, date) {
  const result = await getWeather(location, date);
  if (result.error) {
    console.log(result.error);
  } else {
    displayWeather(result, celsius);
  }
}

function displayWeather(data, units) {
  /* Build display and add it to content.
    [icon] Sunny 27deg
    Min 10
    Max 30
    Chance of any rain: 70%
    Possible rainfall: 3 mm
    Clear conditions throughout...
  */
  // const myDiv = document.createElement("div");
  // const myIcon = document.createElement("");
  console.table(parseWeatherData(data, units));
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
    precip: day.precip * 100,
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
