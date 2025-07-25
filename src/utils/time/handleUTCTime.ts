import { MILLISECONDS_IN_A_MINUTE } from "./milliseconds";

export const handleUTCTime = (date: Date) => {
  const parsedDate = new Date(date);
  const timezoneOffset = parsedDate.getTimezoneOffset();
  const dateTime = parsedDate.getTime();

  return new Date(dateTime - timezoneOffset * MILLISECONDS_IN_A_MINUTE);
};
