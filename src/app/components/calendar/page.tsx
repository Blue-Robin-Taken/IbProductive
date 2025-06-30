'use client';

import React from 'react';
import { Days_One } from 'next/font/google';
import { json } from 'stream/consumers';
import { getHolidays } from './holidays/HolidayBackEnd';
import { getTasks } from './tasks/TaskBackEnd';
import './calendar.css';

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
                    <button
                        onClick={this.previousMonth.bind(this)}
                        className="w-24 h-12"
                    >
                        Previous
                    </button>
                    <h1 className="text-6xl flex-start">
                        {getMonth(this.state.month)} {this.state.year}
                    </h1>
                    <button
                        onClick={this.nextMonth.bind(this)}
                        className="w-24 h-12"
                    >
                        Next
                    </button>
                </div>
                <div className="grid grid-rows-1 grid-cols-7 gap-x-8 pb-4 sticky">
                    {/* Date Labels */}
                    {Array.from({ length: 7 }).map((_, index) => (
                        <h2
                            className="flex bg-red-400 justify-center py-2"
                            key={index}
                        >
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

    /**
     * A useful button which sets the calendar to the current month.
     *
     * @returns a button if the month that the calendar shows is not the current month.
     */
    todayButton() {
        let date = new Date();
        let currentMonth = date.getMonth();
        let currentYear = date.getFullYear();

        if (
            currentMonth === this.state.month &&
            currentYear === this.state.year
        ) {
            return <div></div>;
        }

        return (
            <div className="text-black flex justify-between px-5 py-5 my-3 bg-red-300">
                <button onClick={this.currentMonth.bind(this)}>Today</button>
            </div>
        );
    }

    /**
     * Sets the month that the calendar shows to the current month.
     */
    currentMonth() {
        let date = new Date();
        this.setState({
            month: date.getMonth(),
            year: date.getFullYear(),
            frontOffset: firstWeekOffset(date.getMonth(), date.getFullYear()),
            lastOffset: lastWeekOffset(date.getMonth(), date.getFullYear()),
        });
    }

    /**
     * Moves the month that the calendar shows to the previous month.
     */
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

    /**
     * Moves the month that the calendar showss to the next month.
     */
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
/**
 * Creates the grid of calendar boxes for the calendar
 * @param month
 * @param year
 * @param frontOffset
 * @param lastOffset
 * @returns
 */
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
 * @param date               the date which is being created
 * @param month             the current month
 * @param year              the current year
 * @param daysInThisMonth   how many days are in the current month
 * @returns                 HTML component
 */
function CalendarBox(
    date: number,
    month: number,
    year: number,
    daysInThisMonth: number
) {
    let keyValue = date;
    let now: Date = new Date();
    let today: number = now.getUTCDate();
    let nowMonth: number = now.getUTCMonth();
    let nowYear: number = now.getUTCFullYear();
    let todayCSS = '';

    if (date <= 0) {
        // previous month

        /* Modify information */
        month--;
        if (month == -1) {
            month = 11;
            year--;
        }
        date += daysInMonth(month, year);

        /* CSS Info */
        todayCSS = 'other-month';
    } else if (date > daysInThisMonth) {
        // next month

        /* Modify information */
        month++;
        if (month == 12) {
            month = 0;
            year++;
        }
        date -= daysInThisMonth;

        /* CSS Info */
        todayCSS = 'other-month';
    } else {
        // current month

        /* CSS Info */
        todayCSS = 'current-month';
    }

    if (date === today && month === nowMonth && year === nowYear) {
        todayCSS += '-today';
    }
    return (
        <div key={keyValue} className={todayCSS}>
            <p className="inline-block px-1 mr-2 text-xl">
                {date}, {month}, {year}
            </p>
            {getHolidays(date, month, year)}
            {getTasks(date, month, year)}
        </div>
    );
}

///
/// Back End
///
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
 * @returns     the number of boxes needed in the first week.
 */
function firstWeekOffset(month: number, year: number) {
    let tempDate = new Date(year, month, 1);
    return tempDate.getDay(); // how many offsets are needed in the first week.
}

/**
 * @param month
 * @param year
 * @returns       the number of boxes needed in the last week
 */
function lastWeekOffset(month: number, year: number) {
    let tempDate = new Date(year, month, daysInMonth(month, year));
    return 6 - tempDate.getDay(); // how many offsets are needed in the first week.
}

/**
 *
 * @param index
 * @returns       The day as a string
 */
function getDay(index: number) {
    let dayArray = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
    ];
    return dayArray[index];
}

/**
 *
 * @param month
 * @returns       The month as a string
 */
function getMonth(month: number) {
    let monthArr = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];
    return monthArr[month];
}
