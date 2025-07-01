import React from "react";
import "./tasks.css";
import ViewTaskModal from "./ViewTaskModal";
import "../calendar.css";

type TaskState = {
  isOpen: Boolean;
  data: TaskData;
};

export type TaskData = {
  id: String;
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

class Task extends React.Component<{ data: TaskData }, TaskState> {
  constructor(props: { data: TaskData }) {
    super(props);

    this.state = {
      isOpen: false,
      data: props.data,
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

        <ViewTaskModal
          isOpen={this.state.isOpen}
          onClose={this.closeModal.bind(this)}
          data={this.state.data}
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

export function getTasks(date: Date) {
  let params = new URLSearchParams({
    date:
      date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
  });

  return fetch("/api/calendar/tasks?" + params)
    .then((response) => response.json())
    .then((json) => json["tasks" as keyof typeof json])
    .then((data) => {
      console.log("fetch: " + data);
      return data;
    });
}

export function taskComps(data: TaskData[], date: Date) {
  let taskArr = data.filter(
    (task) =>
      task.dueDate.getFullYear() === date.getFullYear() &&
      task.dueDate.getMonth() === date.getMonth() &&
      task.dueDate.getDate() === date.getDate()
  );

  let compArr = [];
  for (const task of taskArr) {
    compArr.push(<Task data={task} />);
  }

  return compArr;
}
