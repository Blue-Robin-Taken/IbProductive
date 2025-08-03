import React from "react";
import TaskForm, { TaskFormEditable } from "./TaskForm";
import { ErrorModal } from "../../generic/modals";

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
  editables: TaskFormEditable;
};

export type TaskState = {
  isOpen: boolean;
  data: TaskData;
};

type TaskProps = {
  data: TaskData;
  setModal: Function;
  clearModal: Function;
  setStateTasks: Function;
};

export default class Task extends React.Component<TaskProps, TaskState> {
  constructor(props: TaskProps) {
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
      /* Edits the data on the db */
      let res = await fetch("/api/calendar/tasks", {
        method: "POST",
        body: JSON.stringify({
          id: this.state.data.id,
          name: this.state.data.name,
          description: this.state.data.description,
          dueDate: this.state.data.dueDate,
          checkboxes: this.state.data.checkboxes,
        }),
      });

      if (res.status != 200) {
        this.props.setModal(
          <ErrorModal
            header={"Error " + res.status}
            body={
              'There was an issue with editing "' + this.state.data.name + '".'
            }
            onClose={this.props.clearModal.bind(this)}
          />
        );
      }
    }
  }

  render() {
    return (
      <div className="calendar-item">
        <button
          className={"task-label" + this.getTaskCSS()}
          onClick={() => {
            this.props.setModal(
              <TaskForm
                data={this.state.data}
                onClose={this.props.clearModal}
                onSubmit={this.setStateData.bind(this)}
                onDelete={async () => {
                  let res = await fetch("/api/calendar/tasks", {
                    method: "DELETE",
                    body: JSON.stringify({ id: this.state.data.id }),
                  });

                  this.props.clearModal();
                  if (res.status == 200) {
                    this.props.setStateTasks();
                  } else {
                    this.props.setModal(
                      <ErrorModal
                        header={"Error " + res.status}
                        body={
                          'There was an issue with deleting "' +
                          this.state.data.name +
                          '".'
                        }
                        onClose={this.props.clearModal.bind(this)}
                      />
                    );
                  }
                }}
              />
            );
          }}
        >
          {this.state.data.name}
        </button>
      </div>
    );
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

  setStateData(
    name: string,
    desc: string,
    dueDate: Date,
    checkboxes: TaskCheckbox[]
  ) {
    this.setState((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        name: name,
        description: desc,
        dueDate: dueDate,
        checkboxes: checkboxes,
      },
    }));
  }
}

// move this component to the page.tsx
