import React from "react";
import "./tasks.css";
import ViewTaskModal from "./ViewTaskModal";
import "../calendar.css";
import AddTaskModal from "./AddTaskModal";
import { createTask } from "./TaskBackEnd";

type TaskState = {
  isOpen: Boolean;
  data: TaskData;
};

export type TaskData = {
  id: string;
  dueDate: Date;
  name: string;
  description: string;
  checkboxes: TaskCheckbox[];
};

export type TaskCheckbox = {
  id: number;
  label: string;
  bool: boolean;
};

export class AddTask extends React.Component<{}, { isOpen: Boolean }> {
  constructor(props: {}) {
    super(props);
    this.state = { isOpen: false };
  }

  render() {
    return (
      <div>
        <button onClick={() => this.toggleOpen()}>Add Task</button>
        <AddTaskModal
          isOpen={this.state.isOpen}
          onClose={this.toggleOpen.bind(this)}
          onCreate={this.addTask.bind(this)}
        />
      </div>
    );
  }

  toggleOpen() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  addTask(
    name: string,
    description: string,
    dueDate: Date,
    checkboxes: TaskCheckbox[]
  ) {
    createTask(name, description, dueDate, checkboxes);
    this.toggleOpen();
  }
}

export class Task extends React.Component<{ data: TaskData }, TaskState> {
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
          {this.state.data.name}
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

  closeModal(description: string, checkboxes: TaskCheckbox[]) {
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
}

export function TaskFromDataArr(data: TaskData[]) {
  let outArr = [];
  for (const task of data) {
    outArr.push(<Task key={task.id} data={task} />);
  }
  return outArr;
}
