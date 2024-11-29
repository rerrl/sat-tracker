export const formatUsd = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};

export const formatSats = (valueSats: number) => {
  // add commas to the number and drop the decimal
  return valueSats.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const addCommas = (value: number | string) => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const dropDecimal = (value: number | string) => {
  return value.toString().split(".")[0];
};

const getLocaleDateString = (date: Date) => {
  const localeDate = date.toLocaleDateString().split("/").join("-");
  const [month, day, year] = localeDate.split("-");

  const formattedMonth = month.length === 1 ? `0${month}` : month;
  const formattedDay = day.length === 1 ? `0${day}` : day;

  return `${year}-${formattedMonth}-${formattedDay}`;
};

const getLocalTimeString = (date: Date) => {
  // get local time in 24 hour format
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const formattedHours = hours < 10 ? `0${hours}` : hours;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${formattedHours}:${formattedMinutes}`;
};

export const formatToLocalDateTime = (date: Date): string => {
  const localDate = getLocaleDateString(date);
  const localTime = getLocalTimeString(date);
  return `${localDate}T${localTime}`;
};