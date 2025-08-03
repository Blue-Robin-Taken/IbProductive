"use client";

import React, { ReactElement } from "react";
import { getHolidays } from "./holidays/HolidayBackEnd";
import "./calendar.css";
import TaskForm from "./tasks/TaskForm";
import { ErrorModal } from "../generic/modals";
import Task, { TaskData, TaskCheckbox } from "./tasks/Task";

const MS_IN_DAY: number = 86400000;

type CalendarState = {
  month: number;
  year: number;
  now: Date;
  tasks: TaskData[];
  modal: React.ReactElement;
  actionsUp: boolean;
};

export default class Calendar extends React.Component<{}, CalendarState> {
  constructor(props: {}) {
    super(props);

    let date = new Date();
    this.state = {
      month: date.getMonth(),
      year: date.getFullYear(),
      now: date,
      tasks: [],
      modal: <div></div>,
      actionsUp: false,
    };
  }

  // runs when the component is added to the screen
  async componentDidMount() {
    this.setStateTasks();
  }

  async componentDidUpdate(
    prevProps: Readonly<{}>,
    prevState: Readonly<CalendarState>,
    snapshot?: any
  ) {
    if (prevState.month !== this.state.month) {
      this.setStateTasks();
    }
  }

  render() {
    return (
      <div>
        {this.state.modal}
        {this.TodayButton()}
        <div className="text-black flex justify-between px-5 py-5 my-3 bg-red-300">
          <button onClick={this.PrevMonth.bind(this)} className="w-24 h-12">
            Previous
          </button>
          <h1 className="text-6xl flex-start">
            {getMonth(this.state.month)} {this.state.year}
          </h1>
          <button onClick={this.NextMonth.bind(this)} className="w-24 h-12">
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
          {this.generateBoxes()}
        </div>

        {this.CalActions()}
      </div>
    );
  }

  setModal(elem: React.ReactElement) {
    this.setState((prev) => ({ ...prev, modal: elem }));
  }

  clearModal() {
    this.setModal(<div></div>);
  }

  ///
  /// Buttons
  ///
  /**
   * A useful button which sets the calendar to the current month.
   *
   * @returns a button if the month that the calendar shows is not the current month.
   */
  TodayButton() {
    let date = new Date();
    let currentMonth = date.getMonth();
    let currentYear = date.getFullYear();

    if (currentMonth === this.state.month && currentYear === this.state.year) {
      return <div></div>;
    }

    return (
      <div className="text-black flex justify-between px-5 py-5 my-3 bg-red-300">
        <button onClick={this.CurrMonth.bind(this)}>Today</button>
      </div>
    );
  }

  /**
   * Sets the month that the calendar shows to the current month.
   */
  CurrMonth() {
    let date = new Date();
    this.setState((prev) => ({
      ...prev,
      month: date.getMonth(),
      year: date.getFullYear(),
    }));
  }

  /**
   * Moves the month that the calendar shows to the previous month.
   */
  PrevMonth() {
    var newMonth: number = this.state.month - 1;
    var newYear: number = this.state.year;

    if (newMonth === -1) {
      newMonth = 11;
      newYear--;
    }

    this.setState((prev) => ({
      ...prev,
      month: newMonth,
      year: newYear,
    }));
  }

  /**
   * Moves the month that the calendar showss to the next month.
   */
  NextMonth() {
    var newMonth: number = this.state.month + 1;
    var newYear: number = this.state.year;

    if (newMonth === 12) {
      newMonth = 0;
      newYear++;
    }

    this.setState((prev) => ({
      ...prev,
      month: newMonth,
      year: newYear,
    }));
  }

  CalActions() {
    const toggleMenu = () => {
      this.setState((prev) => ({ ...prev, actionsUp: !prev.actionsUp }));
    };
    const setModal = (elem: ReactElement) => {
      toggleMenu();
      this.setState((prev) => ({ ...prev, modal: elem }));
    };
    const clearModal = () => {
      setModal(<div></div>);
    };

    const AddTask: React.ReactElement = (
      <TaskForm
        data={{
          id: "",
          dueDate: new Date(),
          name: "New Task",
          description: "",
          checkboxes: [],
          editables: {
            nameEditable: true,
            descEditable: true,
            dueEditable: true,
            deletable: false,
          },
        }}
        onClose={clearModal}
        onSubmit={this.createTask.bind(this)}
        onDelete={() => {}}
      />
    );

    return (
      <div className="z-5 sticky bottom-10 left-10">
        {!this.state.actionsUp ? null : (
          <div className="relative">
            <button
              onClick={() => {
                setModal(AddTask);
              }}
            >
              {" Add Task "}
            </button>
          </div>
        )}
        <button onClick={toggleMenu}>+</button>
      </div>
    );
  }

  ///
  /// Boxes
  ///
  CalendarBox(timeInMS: number) {
    let css: string = "";
    let timeAsDate: Date = new Date(timeInMS);

    if (timeAsDate.getMonth() !== this.state.month) {
      // prev month or next month
      css = "other-month";
    } else {
      // current month
      css = "current-month";
    }

    if (
      timeAsDate.getFullYear() === this.state.now.getFullYear() &&
      timeAsDate.getMonth() === this.state.now.getMonth() &&
      timeAsDate.getDate() === this.state.now.getDate()
    ) {
      css += "-today";
    }
    return (
      <div key={timeInMS} className={css}>
        <p className="inline-block px-1 mr-2 text-xl">{timeAsDate.getDate()}</p>
        {getHolidays(timeAsDate)}
        {this.taskComps(timeAsDate)}
      </div>
    );
  }

  taskComps(date: Date) {
    let taskArr = this.state.tasks.filter((task) => {
      let due: Date = new Date(task.dueDate);

      return (
        due.getFullYear() == date.getFullYear() &&
        due.getMonth() == date.getMonth() &&
        due.getDate() == date.getDate()
      );
    });

    let compArr = [];
    for (const task of taskArr) {
      compArr.push(
        <Task
          key={task.id}
          data={task}
          setModal={this.setModal.bind(this)}
          clearModal={this.clearModal.bind(this)}
          setStateTasks={this.setStateTasks.bind(this)}
        />
      );
    }

    return compArr;
  }

  generateBoxes() {
    let arr = [];

    for (
      let i = firstDayOnCal(this.state.year, this.state.month);
      i <= lastDayOnCal(this.state.year, this.state.month);
      i += MS_IN_DAY
    ) {
      arr.push(this.CalendarBox(i));
    }

    return arr;
  }

  async setStateTasks() {
    // Fetches Tasks
    const start: number = firstDayOnCal(this.state.year, this.state.month);
    const end: number = lastDayOnCal(this.state.year, this.state.month);

    let params = new URLSearchParams({
      start: String(start),
      end: String(end),
    });

    let res = await fetch("/api/calendar/tasks?" + params);
    let json = await res.json();
    let data: TaskData[] = json["taskArr" as keyof typeof json];
    // console.log(data);

    // Update Tasks
    this.setState((prev) => ({ ...prev, tasks: data }));
  }

  async createTask(
    name: string,
    description: string,
    dueDate: Date,
    checkboxes: TaskCheckbox[]
  ) {
    let res = await fetch("/api/calendar/tasks", {
      method: "POST",
      body: JSON.stringify({
        id: "",
        name: name,
        description: description,
        dueDate: dueDate,
        checkboxes: checkboxes,
      }),
    });

    if (res.status == 200) {
      // successful create
      this.setStateTasks();
    } else {
      this.setModal(
        <ErrorModal
          header={"Error " + res.status}
          body={'There was an issue with creating "' + name + '".'}
          onClose={this.clearModal.bind(this)}
        />
      );
    }
  }
}
/**
 * Gets the number of days in a month.
 * @param month the number of month as an index in an array
 * @param year
 * @returns
 */
function daysInMonth(year: number, month: number) {
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
 *
 * @param index
 * @returns       The day as a string
 */
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

/**
 *
 * @param month
 * @returns       The month as a string
 */
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

function firstDayOnCal(year: number, month: number) {
  let dateOfFirst: Date = new Date(year, month, 1);
  let dayOfFirst: number = dateOfFirst.getDay(); // also doubles for how many offests are needed

  return dateOfFirst.getTime() - dayOfFirst * MS_IN_DAY;
}

function lastDayOnCal(year: number, month: number) {
  let dateOfLast: Date = new Date(year, month, daysInMonth(year, month));
  let dayOfLast: number = dateOfLast.getDay();

  return dateOfLast.getTime() + (6 - dayOfLast) * MS_IN_DAY + (MS_IN_DAY - 1); // ms_in_day - 1 for 11:59pm
}
