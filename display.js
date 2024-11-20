const displayWeatherDiv = document.querySelector(".display-weather");
const displayErrorDiv = document.querySelector(".display-error");
const displayErrorText = document.querySelector(".display-error__text");

export function displayError(error) {
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

export function displayWeather(data) {
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
