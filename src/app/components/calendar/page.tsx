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
  let frontOffset = firstWeekOffset(month, year);
  let lastOffset = lastWeekOffset(month, year);

  return (
    <div>
      <div className="text-black flex justify-center py-5 my-3 bg-red-300">
        <h1 className="text-6xl">{getMonth(month)}</h1>
      </div>
      <div className="grid grid-rows-1 grid-cols-7 gap-x-8 pb-4">
        {/* Date Labels */}
        {Array.from({ length: 7 }).map((_, index) => (
          <h2 className="flex bg-red-400 justify-center py-2" key={index}>
            {getDay(index)}
          </h2>
        ))}
      </div>
      <div className="justify-center grid grid-rows-6 grid-cols-7 gap-x-8 gap-y-4">
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
 * @param day the date which is being created
 * @param month the current month
 * @param year the current year
 * @param daysInThisMonth how many days are in the current month
 * @returns HTML component
 */
function CalendarBox(
  day: number,
  month: number,
  year: number,
  daysInThisMonth: number
) {
  let keyValue = day;
  let date: Date = new Date();
  let today: number = date.getDay() + 1;
  let currentMonth: number = date.getMonth();

  if (day <= 0) {
    // previous month
    /* Modify information */
    month--;
    if (month == -1) {
      month = 11;
      year--;
    }
    day += daysInMonth(month, year);

    /* CSS Info */
    let todayCSS = "bg-slate-500";
    if (day === today && month === currentMonth) {
      todayCSS = "bg-red-400";
    }
    return (
      <div
        key={keyValue}
        className={`pt-1 pb-16 px-2 text-black text-xm ${todayCSS}`}
      >
        <p className="inline-block px-1 mr-2 text-xm">{day}</p>
        {getHolidays(day, month)}
        {getTasks(day, month, year)}
      </div>
    );
  } else if (day > daysInThisMonth) {
    // next month
    /* Modify information */
    month++;
    if (month == 12) {
      month = 0;
      year++;
    }
    day -= daysInThisMonth;

    /* CSS Info */
    let todayCSS = "bg-slate-500";
    if (day === today && month === currentMonth) {
      todayCSS = "bg-red-400";
    }

    return (
      <div key={keyValue} className={`pt-1 pb-16 px-2 text-black ${todayCSS}`}>
        <p className="inline-block px-1 mr-2 text-xm">{day}</p>
        {getHolidays(day, month)}
        {getTasks(day, month, year)}
      </div>
    );
  } else {
    // current month
    let todayCSS = "bg-slate-400";
    if (day === today && month === currentMonth) {
      todayCSS = "bg-red-300";
    }

    return (
      <div key={keyValue} className={`pt-1 pb-16 px-2 text-black ${todayCSS}`}>
        <p className="inline-block px-1 mr-2 text-xl">{day}</p>
        {getHolidays(day, month)}
        {getTasks(day, month, year)}
      </div>
    );
  }
}

function TaskLabel() {
  return <div>getTaskInfo()</div>;
}

function HolidayLabel(holiday: String) {
  const cssArray = holidays["holiday_css"];
  const holidayCSS = cssArray[String(holiday) as keyof typeof cssArray];

  return (
    <div className="justify-left inline-block mb-1">
      <p
        className={`px-4 py-1 border-double border-4 rounded-3xl text-xs ${holidayCSS}`}
      >
        {String(holiday)}
      </p>
    </div>
  );
}

//
// Back End
//
/**
 * Gets the tasks in a given day.
 * @param day
 * @param month
 * @param year
 * @returns
 */
function getTasks(day: number, month: number, year: number) {
  // get tasks that match the date, number, and year, as well as the classes the user has
  return <div></div>;
}

function getHolidays(day: number, month: number) {
  if (!(String(month) in holidays)) {
    return <div></div>;
  }

  const holidayArray = holidays[String(month) as keyof typeof holidays];
  if (!(String(day) in holidayArray)) {
    return <div></div>;
  }
  const holiday: String[] =
    holidayArray[String(day) as keyof typeof holidayArray];

  let arr = [];
  for (let i = 0; i < holiday.length; i++) {
    arr.push(HolidayLabel(holiday[i]));
  }
  return arr;
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
