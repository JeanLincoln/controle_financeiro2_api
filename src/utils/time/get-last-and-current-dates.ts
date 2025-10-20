import * as dateFns from "date-fns";
import { handleUTCTime } from "@utils/time/handleUTCTime";

export const getLastAndCurrentDates = () => {
  const now = new Date();

  const currentMonthStart = handleUTCTime(dateFns.startOfMonth(now)).decreased;
  const currentMonthEnd = handleUTCTime(dateFns.endOfMonth(now)).decreased;
  const lastMonthStart = handleUTCTime(
    dateFns.startOfMonth(dateFns.subMonths(now, 1))
  ).decreased;
  const lastMonthEnd = handleUTCTime(
    dateFns.endOfMonth(dateFns.subMonths(now, 1))
  ).decreased;

  return {
    currentMonthStart,
    currentMonthEnd,
    lastMonthStart,
    lastMonthEnd
  };
};
