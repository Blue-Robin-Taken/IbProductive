import React from "react";
import { TaskForm } from "./TaskForm";

export type TaskCheckbox = {
  id: number;
  label: string;
  bool: boolean;
};

export type TaskData = {
  id: string;
  dueDate: Date;
  name: string;
  description: string;
  checkboxes: TaskCheckbox[];
};

export type TaskState = {
  isOpen: boolean;
  data: TaskData;
};

export default class Task extends React.Component<
  { data: TaskData },
  TaskState
> {
  constructor(props: { data: TaskData }) {
    super(props);

    // Ensure that the dueDate is type of Date
    let dueDate: Date = new Date(props.data.dueDate);

    this.state = {
      isOpen: false,
      data: {
        ...props.data,
        dueDate: dueDate,
      },
    };
  }

  async componentDidUpdate(
    prevProps: Readonly<{ data: TaskData }>,
    prevState: Readonly<TaskState>,
    snapshot?: any
  ) {
    if (prevState.data != this.state.data) {
      this.editTask();
    }
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
          {this.state.data.name}
        </button>

        {this.state.isOpen ? (
          <TaskForm
            data={this.state.data}
            editable={{
              nameEditable: false,
              descEditable: false,
              dueEditable: false,
              deletable: true,
            }}
            onClose={this.toggleOpen.bind(this)}
            onSubmit={this.editTask.bind(this)}
          />
        ) : null}
      </div>
    );
  }

  /**
   * Toggles the state of the modal to be open or closed.
   */
  toggleOpen() {
    this.setState((prev) => ({
      ...prev,
      isOpen: !prev.isOpen,
    }));
  }

  getTimeLeft() {
    let now: Date = new Date();
    let diff: Date = new Date(
      new Date(this.state.data.dueDate).getTime() - now.getTime()
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

  editTask() {
    fetch("/api/calendar/tasks", {
      method: "POST",
      body: JSON.stringify({
        id: this.state.data.id,
        name: this.state.data.name,
        description: this.state.data.description,
        dueDate: this.state.data.dueDate,
        checkboxes: this.state.data.checkboxes,
      }), // would this work?
    });
  }
}

// move this component to the page.tsx
