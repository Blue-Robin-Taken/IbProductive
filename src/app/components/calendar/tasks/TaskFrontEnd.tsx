import React from "react";
import "./tasks.css";
import "../calendar.css";
import AddTaskModal from "./AddTaskModal";
import { createTask, TaskCheckbox } from "./TaskBackEnd";

export class AddTask extends React.Component<{}, { isOpen: boolean }> {
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
