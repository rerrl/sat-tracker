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
