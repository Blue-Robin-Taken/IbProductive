import { Days_One } from "next/font/google";
import { json } from "stream/consumers";
import holidays from "./holidays.json" assert { type: "json" };

export default function CalendarPage() {
  return CalendarFrame();
}

//
// Front End
//
function CalendarFrame() {
  let date = new Date();
  let month = date.getMonth();
  let year = date.getFullYear();
  let days = daysInMonth(month, year);
  let frontOffset = firstWeekOffset(month, year);
  let lastOffset = lastWeekOffset(month, year);

  return (
    <div>
      <div className="text-black flex justify-center py-8 my-8 bg-red-300">
        <h1 className="text-7xl">{getMonth(month)}</h1>
      </div>
      <div className="grid grid-rows-1 grid-cols-7 gap-x-10 pb-8">
        {/* Date Labels */}
        {Array.from({ length: 7 }).map((_, index) => (
          <h2 className="flex bg-red-400 justify-center py-5" key={index}>
            {getDay(index)}
          </h2>
        ))}
      </div>
      <div className="justify-center grid grid-rows-6 grid-cols-7 gap-x-10 gap-y-10">
        {/* Spaces */}
        {CalendarGrids(month, year, frontOffset, lastOffset)}
      </div>
    </div>
  );
}

/* Inside the Calendar */
function CalendarGrids(
  month: number,
  year: number,
  frontOffset: number,
  lastOffset: number
) {
  /* Initializing variables */
  let arr = [];
  let daysInThisMonth = daysInMonth(month, year);

  /* Creating Boxes */
  for (let i = -frontOffset; i < daysInThisMonth + lastOffset; i++) {
    arr.push(CalendarBox(i + 1, month, year, daysInThisMonth));
  }
  return arr;
}

/**
 * Creates a box for each date.
 * @param date the date which is being created
 * @param month the current month
 * @param year the current year
 * @param daysInThisMonth how many days are in the current month
 * @returns HTML component
 */
function CalendarBox(
  date: number,
  month: number,
  year: number,
  daysInThisMonth: number
) {
  let keyValue = date;

  if (date <= 0) {
    /* Modify information */
    month--;
    if (month == -1) {
      month = 11;
      year--;
    }
    date += daysInMonth(month, year);

    return (
      <div key={keyValue} className="text-black bg-slate-500">
        <p>{date}</p>
        {getHolidays(date, month)}
        {getTasks(date, month, year)}
      </div>
    );
  } else if (date > daysInThisMonth) {
    /* Modify information */
    month++;
    if (month == 12) {
      month = 0;
      year++;
    }
    date -= daysInThisMonth;

    return (
      <div key={keyValue} className="text-black bg-slate-500">
        <p>{date}</p>
        {getHolidays(date, month)}
        {getTasks(date, month, year)}
      </div>
    );
  } else {
    return (
      <div
        key={keyValue}
        className="pt-1 pb-16 px-2 text-black color-black bg-slate-400"
      >
        <p>{date}</p>
        {getHolidays(date, month)}
        {getTasks(date, month, year)}
      </div>
    );
  }
}

function HolidayLabel() {
  return <div></div>;
}

function TaskLabel() {
  return <div>getTaskInfo()</div>;
}

//
// Back End
//
/**
 * Gets the tasks in a given day.
 * @param date
 * @param month
 * @param year
 * @returns
 */
function getTasks(date: number, month: number, year: number) {
  // get tasks that match the date, number, and year, as well as the classes the user has
  return <div></div>;
}

interface HolidayData {
  date: number;
  month: number;
  holiday: string;
}

function getHolidays(date: number, month: number) {
  let index;

  switch (month) {
    case 4:
      index = holidayIndexOfDate(date, holidays.may);
      console.log(date + ": " + index);
      if (index !== -1) {
        return (
          <div>
            <p>holidays.may[index]</p>
          </div>
        );
      }
      break;
    default:
      break;
  }

  return <div></div>;
}

function holidayIndexOfDate(date: number, array: object[]) {
  const dateAsString = date.toString();
  for (let i = 0; i < array.length; i++) {
    if (dateAsString === array[i].toString()) {
      return i;
    }
  }
  return -1;
}

function daysInMonth(month: number, year: number) {
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

/**
 * The number of boxes needed to make the first date appear on the correct day.
 * @param month
 * @param year
 * @returns
 * @param month
 * @param year
 * @returns
 */
function firstWeekOffset(month: number, year: number) {
  let tempDate = new Date(year, month, 1);
  console.log(tempDate.getDay());
  return tempDate.getDay(); // how many offsets are needed in the first week.
}

function lastWeekOffset(month: number, year: number) {
  let tempDate = new Date(year, month, daysInMonth(month, year));
  return 6 - tempDate.getDay(); // how many offsets are needed in the first week.
}

function getDay(index: number) {
  let dayArray = [
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

function getMonth(month: number) {
  let monthArr = [
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
