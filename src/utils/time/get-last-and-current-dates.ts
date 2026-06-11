import * as dateFns from "date-fns";

export const getLastAndCurrentDates = () => {
  const now = new Date();

  const currentMonthStart = dateFns.startOfMonth(now);
  const currentMonthEnd = dateFns.endOfMonth(now);
  const lastMonthStart = dateFns.startOfMonth(dateFns.subMonths(now, 1));
  const lastMonthEnd = dateFns.endOfMonth(dateFns.subMonths(now, 1));

  return {
    currentMonthStart,
    currentMonthEnd,
    lastMonthStart,
    lastMonthEnd
  };
};
