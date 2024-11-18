export function setLocalStorage(data) {
  return localStorage.setItem("data", JSON.stringify(data));
}

export function getLocalStorage() {
  if (localStorage.getItem("data")) {
    return JSON.parse(localStorage.getItem("data"));
  } else {
    return null;
  }
}

export function removeLocalStorage() {
  return localStorage.removeItem("data");
}
