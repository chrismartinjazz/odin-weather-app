# odin-weather-app

Uses Visual Crossing's weather API to display "current" weather for a location on search.

## Features

- Centigrade / Fahrenheit selector
- Icon changes based on API return using Visual Crossing icon set 1
- Background color / theme changes based on temperature - cold, mid, hot
- Failed API requests handled by displaying an informative error
- Loading animation displays while waiting for API call
- Caches the most recent search in localStorage. If next search has matching search string and is less than one hour after previous string, returns from cache rather than API.
