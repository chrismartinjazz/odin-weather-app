export function setLocalStorage(data) {
  return localStorage.setItem("data", JSON.stringify(data));
}

export function getLocalStorage() {
  return JSON.parse(localStorage.getItem("data"));
}
