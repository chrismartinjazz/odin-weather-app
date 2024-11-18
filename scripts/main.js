import { VISUAL_CROSSING_API_KEY } from "./env.js";

const location = "Sydney";
const date = new Date();
const formattedDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

// getWeatherFromApi("Sydney", formattedDate).then((weatherData) =>
//   setLocalStorage({ location, date, weatherData })
// );

const data = getLocalStorage();
console.table(parseWeatherData(data.weatherData, celsius));

async function getWeatherFromApi(location, date) {
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/${date}/?key=${VISUAL_CROSSING_API_KEY}`;

  const response = await fetch(url, { mode: "cors" });
  const data = await response.json();

  return data;
}

function setLocalStorage(data) {
  return localStorage.setItem("data", JSON.stringify(data));
}

function getLocalStorage() {
  return JSON.parse(localStorage.getItem("data"));
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

function celsius(temp) {
  return Math.round((((Number(temp) - 32) * 5) / 9) * 10) / 10;
}
