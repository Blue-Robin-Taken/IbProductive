"use client";

import React, { ReactElement } from "react";
import { getHolidays } from "./holidays/HolidayBackEnd";
import "./calendar.css";
import { AddClassTask, AddClientTask } from "./tasks/TaskForm";
import Task, { TaskData, TaskCheckbox } from "./tasks/Task";
import {
  firstDayOnCal,
  getDayString,
  getMonthString,
  lastDayOnCal,
} from "../generic/time/time";
import { ClassData } from "@/db/classes/class";

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
    /* Sets the tasks */
    this.setStateTasks();

    /* Class Data Cache */
    let locClasses: string = String(localStorage.getItem("classesList"));
    let allClassesParams = new URLSearchParams({ name: "all" });
    let allClassesRes = await fetch("/api/classes?" + allClassesParams);
    let allClassesResJson: { arr: ClassData[] } = await allClassesRes.json();
    if (
      locClasses == "null" ||
      locClasses !== JSON.stringify(allClassesResJson)
    ) {
      localStorage.setItem("classesList", JSON.stringify(allClassesResJson));
    }
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
            {getMonthString(this.state.month)} {this.state.year}
          </h1>
          <button onClick={this.NextMonth.bind(this)} className="w-24 h-12">
            Next
          </button>
        </div>
        <div className="grid grid-rows-1 grid-cols-7 gap-x-8 pb-4 sticky">
          {/* Date Labels */}
          {Array.from({ length: 7 }).map((_, index) => (
            <h2 className="flex bg-red-400 justify-center py-2" key={index}>
              {getDayString(index)}
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

    const setModal = (elem: React.ReactElement) => {
      toggleMenu();
      this.setState((prev) => ({ ...prev, modal: elem }));
    };

    return (
      <div className="z-5 relative bottom-10 left-10">
        {!this.state.actionsUp ? null : (
          <div className="relative">
            <button
              onClick={() =>
                setModal(
                  <AddClientTask
                    setModal={this.setModal.bind(this)}
                    setStateTasks={this.setStateTasks.bind(this)}
                  />
                )
              }
            >
              {" Add Task "}
            </button>
            <button
              onClick={() =>
                setModal(
                  <AddClassTask
                    setModal={this.setModal.bind(this)}
                    setStateTasks={this.setStateTasks.bind(this)}
                  />
                )
              }
            >
              Add Class Task
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
    /* Fetches Tasks */
    const start: number = firstDayOnCal(this.state.year, this.state.month);
    const end: number = lastDayOnCal(this.state.year, this.state.month);

    let params = new URLSearchParams({
      start: String(start),
      end: String(end),
    });

    let res = await fetch("/api/calendar/tasks?" + params);
    let json = await res.json();
    let data: TaskData[] = json["taskArr" as keyof typeof json];

    /* Updates Tasks */
    this.setState((prev) => ({ ...prev, tasks: data }));
  }
}
