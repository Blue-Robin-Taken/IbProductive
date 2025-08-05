"use client";

import React, { ReactElement, useEffect, useRef, useState } from "react";
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

export default function Calender() {
  let now: Date = new Date();
  const [month, setMonth] = useState<number>(now.getMonth());
  const [year, setYear] = useState<number>(now.getFullYear());
  const [tasks, setTasks] = useState<TaskData[]>([]);

  async function setStateTasks() {
    /* Fetches Tasks */
    const start: number = firstDayOnCal(year, month);
    const end: number = lastDayOnCal(year, month);

    let params = new URLSearchParams({
      start: String(start),
      end: String(end),
    });

    let res = await fetch("/api/calendar/tasks?" + params);
    let json = await res.json();
    let data: TaskData[] = json["taskArr" as keyof typeof json];

    /* Updates Tasks */
    setTasks(data);
  }

  // get tasks everytime month changes
  useEffect(() => {
    setStateTasks();
  }, [month]);

  /* Modal */
  let modalRef = useRef<HTMLDialogElement | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalBox, setModalBox] = useState<ReactElement | null>();
  useEffect(() => {
    if (!showModal) return;
    modalRef.current?.showModal();
  }, [showModal]);

  function prevMonth() {
    if (month == 0) {
      setMonth(11);
      setYear((prev) => prev - 1);
    } else {
      setMonth((prev) => prev - 1);
    }
  }

  function nextMonth() {
    if (month == 11) {
      setMonth(0);
      setYear((prev) => prev + 1);
    } else {
      setMonth((prev) => prev + 1);
    }
  }

  function CalendarBox(timeInMS: number) {
    let css: string = "";
    let timeAsDate: Date = new Date(timeInMS);

    if (timeAsDate.getMonth() !== month) {
      // prev month or next month
      css = "other-month";
    } else {
      // current month
      css = "current-month";
    }

    if (
      timeAsDate.getFullYear() === now.getFullYear() &&
      timeAsDate.getMonth() === now.getMonth() &&
      timeAsDate.getDate() === now.getDate()
    ) {
      css += "-today";
    }
    return (
      <div key={timeInMS} className={css}>
        <p className="inline-block px-1 mr-2 text-xl">{timeAsDate.getDate()}</p>
        {getHolidays(timeAsDate)}
        {taskComps(timeAsDate)}
      </div>
    );
  }

  function taskComps(date: Date) {
    let taskArr = tasks.filter((task) => {
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
          toggleModal={() => setShowModal((prev) => !prev)}
          setModal={(elem: ReactElement) => setModalBox(elem)}
          setStateTasks={() => {}}
        />
      );
    }

    return compArr;
  }

  function genBoxes() {
    let arr = [];

    for (
      let i = firstDayOnCal(year, month);
      i <= lastDayOnCal(year, month);
      i += MS_IN_DAY
    ) {
      arr.push(CalendarBox(i));
    }

    return arr;
  }

  return (
    <div>
      <button className="btn" onClick={() => setShowModal((prev) => !prev)}>
        Show modal 🤪
      </button>
      <dialog className="modal" ref={modalRef}>
        {modalBox}
      </dialog>
      <div className="text-secondary-content flex justify-between p-5 my-3 bg-secondary">
        <button className="btn" onClick={prevMonth}>
          Previous
        </button>
        <h1 className="text-6xl flex-start">
          {getMonthString(month)} {year}
        </h1>
        <button className="btn" onClick={nextMonth}>
          Next
        </button>
      </div>
      <div className="grid grid-rows-1 grid-cols-7 gap-x-8 pb-4 sticky">
        {Array.from({ length: 7 }).map((_, index) => (
          <h2 className="flex justify-center py-2 bg-secondary" key={index}>
            {getDayString(index)}
          </h2>
        ))}
      </div>
      <div className="justify-center grid grid-rows6 grid-cols-7 gap-x-8 gap-y-4">
        {genBoxes()}
      </div>
    </div>
  );
}
