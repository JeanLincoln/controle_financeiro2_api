import * as dateFns from "date-fns";
import { handleUTCTime } from "./handleUTCTime";

export const getLastAndCurrentDates = () => {
  const now = new Date();

  const currentMonthStart = handleUTCTime(dateFns.startOfMonth(now));
  const currentMonthEnd = handleUTCTime(dateFns.endOfMonth(now));
  const lastMonthStart = handleUTCTime(
    dateFns.startOfMonth(dateFns.subMonths(now, 1))
  );
  const lastMonthEnd = handleUTCTime(
    dateFns.endOfMonth(dateFns.subMonths(now, 1))
  );

  return {
    currentMonthStart,
    currentMonthEnd,
    lastMonthStart,
    lastMonthEnd
  };
};
