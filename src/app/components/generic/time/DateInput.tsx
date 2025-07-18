import React from "react";
import { firstDayOnCal, getMonthString, lastDayOnCal, MS_IN_DAY } from "./time";

type InputProps = {
  outputFunction: Function;
};

type InputState = {
  outputFunction: Function;
  selectedDate: number;
  displayMonth: number;
  displayYear: number;
  firstDayOnCal: number;
  lastDayOnCal: number;
};

export default class DateInput extends React.Component<InputProps, InputState> {
  constructor(props: InputProps) {
    super(props);

    const now: Date = new Date();
    const month: number = now.getMonth();
    const year: number = now.getFullYear();

    this.state = {
      outputFunction: props.outputFunction,
      selectedDate: now.getTime(),
      displayMonth: month,
      displayYear: year,
      firstDayOnCal: firstDayOnCal(year, month),
      lastDayOnCal: lastDayOnCal(year, month),
    };
  }

  render() {
    const submit = () => {};

    return (
      <div className="relative w-1/6">
        <form
          onKeyDown={(e) => {
            if (e.key === "enter") {
              e.preventDefault();
              submit();
            }
          }}
        >
          {/* Header */}
          <div className="flex justify-between px-5 py-2 my-3 bg-red-200">
            {this.BackButton()}
            {this.MonthLabel()}
            {this.NextButton()}
          </div>
          {/* Grids */}
          {/* {this.DateGrid()} */}
          {DateGrid(
            this.state.firstDayOnCal,
            this.state.lastDayOnCal,
            (dateAsMS: number) => {
              this.setState((prev) => ({ ...prev, selectedDate: dateAsMS }));
            }
          )}{" "}
        </form>
      </div>
    );
  }

  BackButton() {
    return (
      <button
        onClick={(e) => {
          e.preventDefault();
          this.setState((prev) => ({
            ...prev,
            displayMonth: prev.displayMonth == 0 ? 11 : prev.displayMonth - 1,
            displayYear:
              prev.displayMonth == 0 ? prev.displayYear - 1 : prev.displayYear,
          }));
        }}
      >
        {"<-"}
      </button>
    );
  }

  MonthLabel() {
    return (
      <label>
        {getMonthString(this.state.displayMonth) + " " + this.state.displayYear}
      </label>
    );
  }

  NextButton() {
    return (
      <button
        onClick={(e) => {
          e.preventDefault();
          this.setState((prev) => ({
            ...prev,
            displayMonth: prev.displayMonth == 11 ? 0 : prev.displayMonth + 1,
            displayYear:
              prev.displayMonth == 11 ? prev.displayYear + 1 : prev.displayYear,
          }));
        }}
      >
        {"->"}
      </button>
    );
  }
}

function DateGrid(firstDay: number, lastDay: number, onClick: Function) {
  let arr = [];
  for (let i = firstDay; i <= lastDay; i += MS_IN_DAY) {
    const date: Date = new Date(i);
    console.log(date);
    arr.push(
      <button key={String(i)} className="" onClick={onClick(i)}>
        {date.getDate()}
      </button>
    );
  }

  return arr;
}
