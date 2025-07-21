import * as dateFns from "date-fns";

export const getLastAndCurrentDates = () => {
  const currentMonthStart = dateFns.startOfMonth(new Date());
  const currentMonthEnd = dateFns.endOfMonth(new Date());
  const lastMonthStart = dateFns.startOfMonth(dateFns.subMonths(new Date(), 1));
  const lastMonthEnd = dateFns.endOfMonth(dateFns.subMonths(new Date(), 1));

  return {
    currentMonthStart,
    currentMonthEnd,
    lastMonthStart,
    lastMonthEnd
  };
};
