import React, { useState } from "react";
import "./tasks.css";
import TaskModal from "./TaskModal";
import "../calendar.css";

type TaskState = {
  isOpen: Boolean;
  data: TaskData;
};

export type TaskData = {
  id: number;
  dueDate: Date;
  name: String;
  description: String;
  checkboxes: TaskCheckbox[];
};

export type TaskCheckbox = {
  id: number;
  label: String;
  bool: Boolean;
};

class Task extends React.Component<{ dueDate: Date }, TaskState> {
  constructor(props: { dueDate: Date }) {
    super(props);

    this.state = {
      isOpen: false,
      data: {
        id: 1,
        dueDate: props.dueDate,
        name: "Test Task Name",
        description: "Test Task Description",
        checkboxes: [
          { id: 0, label: "a", bool: false },
          { id: 1, label: "b", bool: true },
        ],
      },
    };
  }

  render() {
    return (
      <div className="calendar-item">
        <button
          className={"task-label" + this.getTaskCSS()}
          onClick={() => {
            this.toggleOpen();
          }}
        >
          test
        </button>

        <TaskModal
          isOpen={this.state.isOpen}
          onClose={this.closeModal.bind(this)}
          data={this.state.data}
          date={this.props.dueDate}
          timeLeft={this.getTimeLeft()}
        />
      </div>
    );
  }
  /**
   * Toggles the state of the modal to be open or closed.
   */
  toggleOpen() {
    this.setState({
      isOpen: !this.state.isOpen,
      data: this.state.data,
    });
  }

  closeModal(description: String, checkboxes: TaskCheckbox[]) {
    this.setState({
      isOpen: false,
      data: {
        id: this.state.data.id,
        dueDate: this.state.data.dueDate,
        name: this.state.data.name,
        description: description,
        checkboxes: checkboxes,
      },
    });
  }

  getTimeLeft() {
    let now: Date = new Date();
    let diff: Date = new Date(
      this.state.data.dueDate.getTime() - now.getTime()
    );

    return diff;
  }

  /**
   * Returns addition CSS information based on time
   * @returns
   */
  getTaskCSS() {
    let timeLeft: Date = this.getTimeLeft();
    if (timeLeft.getUTCFullYear() - 1970 < 0) {
      return "-overdue";
    }

    return "";
  }
}

/**
 * Gets the tasks in a given day.
 * @param date
 * @param month
 * @param year
 * @returns
 */
export function getTasks(date: number, month: number, year: number) {
  // get tasks that match the date, number, and year, as well as the classes the user has
  // return <Task></Task>;
  /* Testing */
  return <Task dueDate={new Date(year, month, date, 17)} />;
}
