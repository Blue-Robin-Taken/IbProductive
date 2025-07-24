import React, { useState } from "react";
import {
  TaskData,
  TaskState,
  editTask,
  TaskCheckbox,
  TaskModalProps,
} from "./TaskBackEnd";
import "./tasks.css";
import "../calendar.css";
import TaskDueCountdown from "./due/TaskDueDate";

export default class ClientTask extends React.Component<
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
      await editTask(this.state.data);
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

        <ViewClientTaskModal
          isOpen={this.state.isOpen}
          onClose={this.closeModal.bind(this)}
          data={this.state.data}
        />
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

  closeModal(name: string, description: string, checkboxes: TaskCheckbox[]) {
    this.setState((prev) => ({
      isOpen: false,
      data: {
        id: prev.data.id,
        dueDate: prev.data.dueDate,
        name: name,
        description: description,
        checkboxes: checkboxes,
      },
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
}

function ViewClientTaskModal(props: TaskModalProps) {
  const [checkboxes, setCheckboxes] = useState(props.data.checkboxes);
  const [desc, setDesc] = useState(props.data.description);
  const [name, setName] = useState(props.data.name);
  let nextId: number =
    checkboxes.length === 0 ? 1 : checkboxes[checkboxes.length - 1].id + 1; // get the last used id and add one
  const close = () => props.onClose(name, desc, checkboxes);

  if (props.isOpen == false) return null;

  return (
    <div className="modal-bg">
      {/* TODO: what if the checklist is too big so you need to scroll? */}
      <form
        id="taskForm"
        className=""
        onKeyDown={(e) => {
          if (e.key === "enter" || e.key === "escape") {
            e.preventDefault();
            close();
          }
        }}
      >
        <div className="task-modal-header">
          <input
            className="task-input m-3 w-full"
            type="text"
            id="name"
            name="name"
            defaultValue={String(name)}
            placeholder="Task Name"
            onChange={(e) => {
              e.preventDefault();
              setName(e.currentTarget.value);
            }}
          />
          <button
            // flex none prevents from growing/shrinking
            className="m-5 px-4 text-3xl flex-none"
            onClick={(e) => {
              e.preventDefault();
              close();
            }}
          >
            Close
          </button>
        </div>
        <TaskDueCountdown due={props.data.dueDate} />
        <div className="grid grid-cols-[10%_auto] gap-y-5">
          {/* Description */}
          <label className="task-form-label">Description:</label>
          <input
            className="task-input"
            type="text"
            id="description"
            name="description"
            defaultValue={String(desc)}
            placeholder="No Description"
            onChange={(e) => {
              e.preventDefault();
              setDesc(e.currentTarget.value);
            }}
          />

          {/* Checklist */}
          <label className="task-form-label">Checklist:</label>
          <div>
            {checkboxes.map((i) => (
              <div key={String(i.id)}>
                <input
                  id={i.id + "-box"}
                  type="checkbox"
                  defaultChecked={Boolean(i.bool)}
                  onChange={() => (i.bool = !i.bool)}
                />
                <input
                  id={i.id + "-label"}
                  className="mx-4"
                  type="text"
                  defaultValue={String(i.label)}
                  placeholder="New Checkbox"
                  onChange={(e) => {
                    // e.preventDefault();
                    i.label = e.currentTarget.value;
                  }}
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setCheckboxes(checkboxes.filter((j) => j.id !== i.id));
                    // filters the checkboxes to add all that do not have the same label
                  }}
                >
                  - Remove Checkbox
                </button>
              </div>
            ))}

            {/* Add Checkbox */}
            <button
              className="my-3"
              key={"add-checkbox"}
              onClick={(e) => {
                e.preventDefault();
                setCheckboxes((prev) => [
                  ...prev,
                  { id: nextId, label: "New Checkbox", bool: false },
                ]);
                nextId++;
              }}
            >
              + Add New Checkbox
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
