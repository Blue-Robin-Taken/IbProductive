import React, { useState } from "react";
import "./tasks.css";
import TaskModal from "./TaskModal";

type TaskState = {
  isOpen: Boolean;
  data: TaskData;
};

export type TaskData = {
  name: String;
  description: String;
  checkboxes: TaskCheckbox[];
};

export type TaskCheckbox = {
  label: String;
  bool: Boolean;
};

class Task extends React.Component<{}, TaskState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      isOpen: false,
      data: {
        name: "Test Task Name",
        description: "Test Task Description",
        checkboxes: [
          { label: "a", bool: false },
          { label: "b", bool: true },
        ],
      },
    };
  }

  render() {
    return (
      <div>
        <button
          onClick={() => {
            this.toggleOpen();
          }}
        >
          test
        </button>

        <TaskModal
          isOpen={this.state.isOpen}
          onClose={this.toggleOpen.bind(this)}
          data={{
            name: "Test Task Name",
            description: "Test Task Description",
            checkboxes: [
              { label: "a", bool: false },
              { label: "b", bool: true },
            ],
          }}
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

  getFormData(event: React.FormEvent<HTMLFormElement>) {}
}

/**
 * Gets the tasks in a given day.
 * @param day
 * @param month
 * @param year
 * @returns
 */
export function getTasks(day: number, month: number, year: number) {
  // get tasks that match the date, number, and year, as well as the classes the user has
  return <Task></Task>;
}
