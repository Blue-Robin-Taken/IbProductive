import React from "react";
import TaskForm, { TaskFormEditable, TaskFormType } from "./TaskForm";
import { createInfoModal } from "../../generic/overlays/modals";
import {
  createToastEvent,
  ToastAlertType,
} from "../../generic/overlays/toasts";

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
  classId: number | null;
};

export type TaskState = {
  data: TaskData;
};

type TaskProps = {
  data: TaskData;
  toggleModal: Function;
  setModal: Function;
  setStateTasks: Function;
};

// TODO: turn this into a functional component and fix the non-admin editing of a class task :P
export default class Task extends React.Component<TaskProps, TaskState> {
  constructor(props: TaskProps) {
    super(props);

    // Ensure that the dueDate is type of Date
    let dueDate: Date = new Date(props.data.dueDate);

    this.state = {
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
    const classTaskChange: boolean =
      prevState.data.name != this.state.data.name ||
      prevState.data.description != this.state.data.description ||
      prevState.data.dueDate != this.state.data.dueDate;

    if (this.props.data.classId != null && classTaskChange) {
      let res = await fetch("/api/classes/tasks", {
        method: "POST",
        body: JSON.stringify({
          taskId: this.state.data.id,
          oldName: prevState.data.name,
          newName: this.state.data.name,
          description: this.state.data.description,
          dueDate: this.state.data.dueDate,
          checkboxes: this.state.data.checkboxes,
        }),
      });

      const resText = await res.text();
      if (res.status != 200 || resText !== "") {
        createInfoModal(
          "Error " + res.status + ": " + resText,
          <p>
            {'There was an issue with editing "' +
              this.state.data.name +
              '" for the class.'}
          </p>
        );
      } else {
        createToastEvent(
          ToastAlertType.SUCCESS,
          '"' +
            this.state.data.name +
            '" was successfully edited for the class.'
        );
        this.props.setStateTasks();
      }

      if (prevState.data.checkboxes != this.state.data.checkboxes) {
        this.updateClientTask();
      }
    } else if (prevState.data != this.state.data) {
      /* Edits the data on the db */
      this.updateClientTask();
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
                key={this.state.data.id}
                data={this.state.data}
                type={
                  this.props.data.classId != null
                    ? TaskFormType.ADMIN_EDIT
                    : TaskFormType.CLIENT_EDIT
                }
                onClose={() => this.props.toggleModal()}
                onSubmit={this.setStateData.bind(this)}
                onDelete={async () => {
                  let res =
                    this.state.data.classId == null
                      ? await fetch("/api/calendar/tasks", {
                          method: "DELETE",
                          body: JSON.stringify({ id: this.state.data.id }),
                        })
                      : await fetch("/api/classes/tasks", {
                          method: "DELETE",
                          body: JSON.stringify({
                            classId: this.state.data.classId,
                            taskName: this.state.data.name,
                          }),
                        });

                  let resText = await res.text();
                  if (res.status != 200 || resText !== "") {
                    createInfoModal(
                      "Error " + res.status + ": " + resText,
                      <p>
                        {'There was an issue with deleting "' +
                          this.state.data.name +
                          '".'}
                      </p>
                    );
                  } else {
                    createToastEvent(
                      ToastAlertType.SUCCESS,
                      '"' + this.state.data.name + '" was successfully deleted.'
                    );
                    this.props.setStateTasks();
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

  async updateClientTask() {
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

    let resText = await res.text();
    if (res.status != 200 || resText !== "") {
      createInfoModal(
        "Error " + res.status + ": " + resText,
        <p>
          {'There was an issue with editing "' + this.state.data.name + '".'}
        </p>
      );
    } else {
      createToastEvent(
        ToastAlertType.SUCCESS,
        '"' + this.state.data.name + '" was successfully edited.'
      );
      this.props.setStateTasks();
    }
  }
}
