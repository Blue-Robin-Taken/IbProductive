export const MS_IN_DAY: number = 86400000;

/**
 *
 * @param month
 * @returns       The month as a string
 */
export function getMonthString(month: number) {
  const monthArr = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return monthArr[month];
}

/**
 *
 * @param index
 * @returns       The day as a string
 */
export function getDayString(index: number) {
  const dayArray = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return dayArray[index];
}

/**
 * Gets the number of days in a month.
 * @param year
 * @param month the number of month as an index in an array
 * @returns
 */
export function daysInMonth(year: number, month: number) {
  switch (month) {
    case 1:
      // leap year : not leap year
      return year % 4 == 0 ? 29 : 28;
    case 3:
      return 30;
    case 5:
      return 30;
    case 8:
      return 30;
    case 10:
      return 30;
    default:
      return 31;
  }
}

export function firstDayOnCal(year: number, month: number) {
  let dateOfFirst: Date = new Date(year, month, 1);
  let dayOfFirst: number = dateOfFirst.getDay(); // also doubles for how many offests are needed

  return dateOfFirst.getTime() - dayOfFirst * MS_IN_DAY;
}

export function lastDayOnCal(year: number, month: number) {
  let dateOfLast: Date = new Date(year, month, daysInMonth(year, month));
  let dayOfLast: number = dateOfLast.getDay();

  return dateOfLast.getTime() + (6 - dayOfLast) * MS_IN_DAY;
}
