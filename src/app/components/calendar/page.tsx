'use client';

import React, { useEffect, useState } from 'react';
import { getHolidays } from './holidays/HolidayBackEnd';
import './calendar.css';
import { AddClassTask, AddClientTask } from './tasks/TaskForm';
import { TaskData, ClientTask, ClassTask } from './tasks/Task';
import {
  firstDayOnCal,
  getDayString,
  getMonthString,
  lastDayOnCal,
} from '../../generic/time/time';
import { ClassData } from '@/db/classes/class';

const MS_IN_DAY: number = 86400000;

export default function Calender() {
  const now: Date = new Date();
  const [month, setMonth] = useState<number>(now.getMonth());
  const [year, setYear] = useState<number>(now.getFullYear());
  const [tasks, setTasks] = useState<TaskData[]>([]);

  /* Caching */
  useEffect(() => {
    const locClasses: string = String(localStorage.getItem('classesList'));
    const allClassesParams = new URLSearchParams({ name: 'all' });
    fetch('/api/classes?' + allClassesParams)
      .then((res) => {
        return res.json();
      })
      .then((json: { arr: ClassData[] }) => {
        if (locClasses == 'null' || locClasses != JSON.stringify(json)) {
          localStorage.setItem('classesList', JSON.stringify(json));
        }
      });
  }, []);

  async function setStateTasks() {
    /* Fetches Tasks */
    const start: number = firstDayOnCal(year, month);
    const end: number = lastDayOnCal(year, month);

    const params = new URLSearchParams({
      start: String(start),
      end: String(end),
    });

    const res = await fetch('/api/calendar/tasks?' + params);
    const json = await res.json();
    const data: TaskData[] = json['taskArr' as keyof typeof json];

    /* Updates Tasks */
    setTasks(data);
  }

  // get tasks everytime month changes
  useEffect(() => {
    setStateTasks();
  }, [month]);

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
    let css: string = '';
    const timeAsDate: Date = new Date(timeInMS);

    if (timeAsDate.getMonth() !== month) {
      // prev month or next month
      css = 'other-month';
    } else {
      // current month
      css = 'current-month';
    }

    if (
      timeAsDate.getFullYear() === now.getFullYear() &&
      timeAsDate.getMonth() === now.getMonth() &&
      timeAsDate.getDate() === now.getDate()
    ) {
      css += '-today';
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
    const taskArr = tasks.filter((task) => {
      const due: Date = new Date(task.dueDate);

      return (
        due.getFullYear() == date.getFullYear() &&
        due.getMonth() == date.getMonth() &&
        due.getDate() == date.getDate()
      );
    });

    const compArr = [];
    for (const task of taskArr) {
      if (task.classId == null) {
        compArr.push(
          <ClientTask key={task.id} data={task} setStateTasks={setStateTasks} />
        );
      } else {
        compArr.push(
          <ClassTask key={task.id} data={task} setStateTasks={setStateTasks} />
        );
      }
    }

    return compArr;
  }

  function genBoxes() {
    const arr = [];

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
      <button className="btn" onClick={() => AddClientTask(setStateTasks)}>
        Add Personal Task
      </button>
      <button className="btn" onClick={() => AddClassTask(setStateTasks)}>
        Add Class Task
      </button>
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
