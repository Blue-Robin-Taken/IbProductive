import "../calendar.css";
import { TaskData, TaskCheckbox } from "./Task";
import "./tasks.css";
import {
  FormEvent,
  ReactElement,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  createConfirmModal,
  createInfoModal,
} from "../../../generic/overlays/modals";
import TaskDueCountdown from "./TaskDueDate";
import { dateAsDateTimeLocalValue } from "../../../generic/time/time";
import {
  createToastEvent,
  ToastAlertType,
} from "../../../generic/overlays/toasts";

type TaskFormProps = {
  data: TaskData;
  onClose: Function;
  // function with these parameters that outputs boolean
  onSubmit: (
    nameRef: RefObject<HTMLInputElement | null>,
    descRef: RefObject<HTMLInputElement | null>,
    dueDate: Date,
    checklist: TaskCheckbox[]
  ) => Promise<boolean>;
  // Runnable method: no parameters and void output
  onDelete: () => void;
};

export default function TaskForm(props: TaskFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const descRef = useRef<HTMLInputElement | null>(null);
  const dueRef = useRef<HTMLInputElement | null>(null);
  const [dueDate, setDueDate] = useState<Date>(props.data.dueDate);
  const [checkboxes, setCheckboxes] = useState<TaskCheckbox[]>(
    props.data.checkboxes
  );

  function submit(e: FormEvent) {
    e.preventDefault();
    e.stopPropagation();

    props
      .onSubmit(nameRef, descRef, dueDate, checkboxes)
      .then((validSubmit: boolean) => {
        if (validSubmit) {
          document.dispatchEvent(new Event("close-modal"));
        }
      });
  }

  let nextId: number =
    checkboxes.length === 0 ? 1 : checkboxes[checkboxes.length - 1].id + 1;

  return (
    <div
      className="modal-box max-w-full"
      onKeyDown={(e) => {
        if (e.key == "Enter") {
          e.preventDefault();
          formRef.current?.requestSubmit();
        }
      }}
    >
      <form ref={formRef} id="taskform" onSubmit={submit}>
        <input
          className="input input-xl validator"
          type="text"
          id="taskName"
          name="taskName"
          defaultValue={props.data.name}
          placeholder="Task Name"
          minLength={1}
          ref={nameRef}
          required
        />
        <p className="validator-hint">Please name your task.</p>

        <div className="grid grid-cols-[15%_auto] gap-y-5 my-5">
          {/* Due Date */}
          <label className="task-form-label">Due Date:</label>
          <div className="inline-flex">
            <input
              className="input input-xl"
              type="datetime-local"
              id="dueDate"
              defaultValue={dateAsDateTimeLocalValue(props.data.dueDate)}
              onChange={(e) => {
                e.preventDefault();
                setDueDate(new Date(e.currentTarget.value));
              }}
              required
            />
          </div>

          {/* Description */}
          <label className="task-form-label">Description:</label>
          <input
            className="input input-xl"
            type="text"
            id="description"
            name="description"
            defaultValue={props.data.description}
            placeholder="No Description"
            ref={descRef}
          />

          {/* Checklist */}
          <label className="task-form-label">Checklist:</label>
          <div>
            {checkboxes.map((i) => (
              <div className="my-2" key={String(i.id)}>
                <input
                  className="checkbox mr-3"
                  id={i.id + "-box"}
                  type="checkbox"
                  defaultChecked={Boolean(i.bool)}
                  onChange={() => (i.bool = !i.bool)}
                />
                <input
                  id={i.id + "-label"}
                  className="input mr-3"
                  type="text"
                  defaultValue={String(i.label)}
                  placeholder="New Checkbox"
                  onChange={(e) => {
                    // e.preventDefault();
                    i.label = e.currentTarget.value;
                  }}
                />
                <button
                  className="btn"
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
              className="btn"
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

      <form method="dialog" className="modal-action">
        <button className="btn">Close</button>
        <button
          className="btn"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            formRef.current?.requestSubmit();
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export function AddClientTask(setStateTasks: Function) {
  async function handleSubmit(
    nameRef: RefObject<HTMLInputElement | null>,
    descRef: RefObject<HTMLInputElement | null>,
    dueDate: Date,
    checkboxes: TaskCheckbox[]
  ): Promise<boolean> {
    const name = nameRef.current?.value;
    const description = descRef.current?.value;

    if (name == "") {
      return false;
    }

    /* Create the task */
    let res = await fetch("/api/calendar/tasks", {
      method: "POST",
      body: JSON.stringify({
        id: "",
        name: name,
        description: description,
        dueDate: dueDate,
        checkboxes: checkboxes,
      }),
    });

    /* Response Handling */
    let resText = await res.text();
    if (res.status != 200 || resText !== "") {
      createInfoModal(
        "Error " + res.status + ": " + resText,
        <p>{'There was an issue with creating "' + name + '."'}</p>
      );
    } else {
      // successful create
      createToastEvent(
        ToastAlertType.SUCCESS,
        '"' + name + '" successfully created.'
      );
      setStateTasks();
    }
    return true;
  }

  const event = new CustomEvent("add-modal", {
    detail: {
      body: (
        <TaskForm
          data={{
            id: "",
            dueDate: new Date(),
            name: "New Task",
            description: "",
            checkboxes: [],
          }}
          onClose={() => {}}
          onSubmit={handleSubmit}
          onDelete={() => {}}
        />
      ),
    },
  });
  document.dispatchEvent(event);
}

export function AddClassTask(setStateTasks: Function) {
  async function confirm(
    name: string,
    desc: string,
    dueDate: Date,
    checkboxes: TaskCheckbox[]
  ): Promise<boolean> {
    if (name == "") {
      return false;
    }

    let res = await fetch("/api/classes/tasks", {
      method: "POST",
      body: JSON.stringify({
        taskId: "",
        oldName: "",
        newName: name,
        description: desc,
        dueDate: dueDate,
        checkboxes: checkboxes,
      }),
    });

    const resText = await res.text();
    if (res.status != 200 || resText !== "") {
      createInfoModal(
        "Error " + res.status + ": " + resText,
        <p>
          {'There was a problem with creating "' + name + '" for the class.'}
        </p>
      );
    } else {
      // successful create
      createToastEvent(
        ToastAlertType.SUCCESS,
        '"' + name + '" successfully created for the class.'
      );
      setStateTasks();
    }
    return true;
  }

  async function handleSubmit(
    nameRef: RefObject<HTMLInputElement | null>,
    descRef: RefObject<HTMLInputElement | null>,
    dueDate: Date,
    checklist: TaskCheckbox[]
  ): Promise<boolean> {
    const name = nameRef.current?.value;
    const description = descRef.current?.value;

    // checks if the submit can be processed
    if (
      name === "" ||
      typeof name == "undefined" ||
      typeof description == "undefined"
    ) {
      return false;
    }

    createConfirmModal(
      <p>
        {'You are about to create "' +
          name +
          '" for a class, meaning that this task will also be created for users.  Do you wish to continue?'}
      </p>,
      () => confirm(name, description, dueDate, checklist)
    );
    return true;
  }

  const event = new CustomEvent("add-modal", {
    detail: {
      body: (
        <TaskForm
          data={{
            id: "",
            dueDate: new Date(),
            name: "New Task",
            description: "",
            checkboxes: [],
          }}
          onClose={() => {}}
          onSubmit={handleSubmit}
          onDelete={() => {}}
        />
      ),
    },
  });
  document.dispatchEvent(event);
}
