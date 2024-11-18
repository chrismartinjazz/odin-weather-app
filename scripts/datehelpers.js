export function formatDate(date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

export function lessThanOneHourAgo(date) {
  const currentDate = new Date();
  const difference = currentDate.getTime() - date.getTime();
  const millisecondsInHour = 1000 * 60 * 60;
  return Math.abs(difference) < millisecondsInHour ? true : false;
}
