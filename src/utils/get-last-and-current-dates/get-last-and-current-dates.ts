import * as dateFns from "date-fns";

const aMinuteInMilliseconds = 60000;

const handleDateDiff = (date: Date) => {
  const parsedDate = new Date(date);
  const timezoneOffset = parsedDate.getTimezoneOffset();
  const dateTime = parsedDate.getTime();

  return new Date(dateTime - timezoneOffset * aMinuteInMilliseconds);
};

export const getLastAndCurrentDates = () => {
  const now = new Date();

  const currentMonthStart = handleDateDiff(dateFns.startOfMonth(now));
  const currentMonthEnd = handleDateDiff(dateFns.endOfMonth(now));
  const lastMonthStart = handleDateDiff(
    dateFns.startOfMonth(dateFns.subMonths(now, 1))
  );
  const lastMonthEnd = handleDateDiff(
    dateFns.endOfMonth(dateFns.subMonths(now, 1))
  );

  return {
    currentMonthStart,
    currentMonthEnd,
    lastMonthStart,
    lastMonthEnd
  };
};
