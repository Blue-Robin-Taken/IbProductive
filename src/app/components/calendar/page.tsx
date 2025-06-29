"use client";

import React from "react";
import { Days_One } from "next/font/google";
import { json } from "stream/consumers";
import { getHolidays } from "./holidays/HolidayBackEnd";
import { getTasks } from "./tasks/TaskBackEnd";
import "./calendar.css";

type CalendarState = {
  month: number;
  year: number;
  frontOffset: number;
  lastOffset: number;
};
class Calendar extends React.Component<{}, CalendarState> {
  constructor(props: {}) {
    super(props);
    let date = new Date();
    this.state = {
      month: date.getMonth(),
      year: date.getFullYear(),
      frontOffset: firstWeekOffset(date.getMonth(), date.getFullYear()),
      lastOffset: lastWeekOffset(date.getMonth(), date.getFullYear()),
    };
  }

  render() {
    return (
      <div>
        {this.todayButton()}
        <div className="text-black flex justify-between px-5 py-5 my-3 bg-red-300">
          <button onClick={this.previousMonth.bind(this)} className="w-24 h-12">
            Previous
          </button>
          <h1 className="text-6xl flex-start">
            {getMonth(this.state.month)} {this.state.year}
          </h1>
          <button onClick={this.nextMonth.bind(this)} className="w-24 h-12">
            Next
          </button>
        </div>
        <div className="grid grid-rows-1 grid-cols-7 gap-x-8 pb-4 sticky">
          {/* Date Labels */}
          {Array.from({ length: 7 }).map((_, index) => (
            <h2 className="flex bg-red-400 justify-center py-2" key={index}>
              {getDay(index)}
            </h2>
          ))}
        </div>
        <div className="justify-center grid grid-rows-6 grid-cols-7 gap-x-8 gap-y-4">
          {/* Spaces */}
          {CalendarGrids(
            this.state.month,
            this.state.year,
            this.state.frontOffset,
            this.state.lastOffset
          )}
        </div>
      </div>
    );
  }

  todayButton() {
    let date = new Date();
    let currentMonth = date.getMonth();
    let currentYear = date.getFullYear();

    if (currentMonth === this.state.month && currentYear === this.state.year) {
      return <div></div>;
    }

    return (
      <div className="text-black flex justify-between px-5 py-5 my-3 bg-red-300">
        <button onClick={this.currentMonth.bind(this)}>Today</button>
      </div>
    );
  }

  currentMonth() {
    let date = new Date();
    this.setState({
      month: date.getMonth(),
      year: date.getFullYear(),
      frontOffset: firstWeekOffset(date.getMonth(), date.getFullYear()),
      lastOffset: lastWeekOffset(date.getMonth(), date.getFullYear()),
    });
  }

  previousMonth() {
    var newMonth: number = this.state.month - 1;
    var newYear: number = this.state.year;

    if (newMonth === -1) {
      newMonth = 11;
      newYear--;
    }

    this.setState({
      month: newMonth,
      year: newYear,
      frontOffset: firstWeekOffset(newMonth, newYear),
      lastOffset: lastWeekOffset(newMonth, newYear),
    });
  }

  nextMonth() {
    var newMonth: number = this.state.month + 1;
    var newYear: number = this.state.year;

    if (newMonth === 12) {
      newMonth = 0;
      newYear++;
    }

    this.setState({
      month: newMonth,
      year: newYear,
      frontOffset: firstWeekOffset(newMonth, newYear),
      lastOffset: lastWeekOffset(newMonth, newYear),
    });
  }
}

export default Calendar;

//
// Front End
//
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
  let currentYear: number = date.getFullYear();
  let todayCSS = "";

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
    todayCSS = "other-month";
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
    todayCSS = "other-month";
  } else {
    // current month
    todayCSS = "current-month";
  }

  if (day === today && month === currentMonth && year === currentYear) {
    todayCSS += "-today";
  }

  return (
    <div key={keyValue} className={todayCSS}>
      <p className="inline-block px-1 mr-2 text-xl">{day}</p>
      {getHolidays(day, month, year)}
      {getTasks(day, month, year)}
    </div>
  );
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

function getHolidays(day: number, month: number) {
    let index;
    if (String(month) in holidays) {
        const holidayArray = holidays[String(month) as keyof typeof holidays];
        if (String(day) in holidayArray) {
            console.log(day);
            const holiday =
                holidayArray[String(day) as keyof typeof holidayArray];
            console.log(holiday);
            return <div>{String(holiday)}</div>;
        }
        console.log(holidayArray);
        return <div></div>;
    } else {
        return <div></div>;
    }
}

function holidayIndexOfDate(date: number, array: object[]) {
    const dateAsString = date.toString();
    console.log(array);
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
