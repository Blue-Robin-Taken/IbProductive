import "../calendar.css";
import { TaskData, TaskCheckbox } from "./Task";
import "./tasks.css";
import { useEffect, useRef, useState } from "react";
import { ClassData } from "@/db/classes/class";
import { ErrorModal } from "../../generic/modals";
import TaskDueCountdown from "./TaskDueDate";
import { dateAsDateTimeLocalValue } from "../../generic/time/time";

export type TaskFormEditable = {
  nameEditable: boolean;
  descEditable: boolean;
  dueEditable: boolean;
  deletable: boolean;
};

type TaskFormProps = {
  data: TaskData;
  type: TaskFormType;
  onClose: Function;
  onSubmit: Function; // name, desc, dueDate, checklists, classId (sometimes), oldName (sometimes)
  onDelete: Function;
};

export enum TaskFormType {
  CLIENT_CREATE,
  CLIENT_EDIT,

  ADMIN_CREATE,
  ADMIN_EDIT,
}

export default function TaskForm(props: TaskFormProps) {
  function submit() {
    let nameVal = nameRef.current?.value;
    let descVal = descRef.current?.value;

    props.onSubmit(
      nameVal,
      descVal,
      dueDate,
      checkboxes,
      Number(classId),
      props.data.name
    );
  }

  const isAdminType: boolean = checkIfAdminType(props.type);
  const [isUserAdmin, setUserAdmin] = useState<boolean>(false);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const descRef = useRef<HTMLInputElement | null>(null);
  const [dueDate, setDueDate] = useState<Date>(props.data.dueDate);
  const [checkboxes, setCheckboxes] = useState<TaskCheckbox[]>(
    props.data.checkboxes
  );
  const [classId, setClassId] = useState<string>(String(props.data.classId));
  const [className, setClassName] = useState<string>("Loading...");
  const [classes, setClasses] = useState<React.ReactElement[]>();

  useEffect(() => {
    fetch("/api/auth/admin?")
      .then((res) => {
        return res.json();
      })
      .then((resJson: { isAdmin: boolean }) => {
        setUserAdmin(resJson.isAdmin);
      });

    /* Get from cache if exists */
    let locClasses: string = String(localStorage.getItem("classesList"));
    if (locClasses != "null") {
      setClasses(
        JSON.parse(locClasses).arr.map((i: ClassData) => {
          if (i.id == props.data.classId) {
            setClassName(i.name);
          }
          return (
            <option key={i.id} value={i.id}>
              {i.name}
            </option>
          );
        })
      );
    }

    return () => {};
  }, []);

  let nextId: number =
    checkboxes.length === 0 ? 1 : checkboxes[checkboxes.length - 1].id + 1;

  return (
    <div className="modal-box max-w-full">
      {/* TODO: what if the checklist is too big so you need to scroll? */}
      <form
        id="taskform"
        onKeyDown={(e) => {
          if (e.key === "enter") {
            e.preventDefault();
            submit();
            props.onClose();
          }
        }}
      >
        {/* Name */}
        {(isAdminType && isUserAdmin) || props.data.editables.nameEditable ? (
          <input
            className="input input-xl"
            type="text"
            id="nombre"
            name="nombre"
            defaultValue={props.data.name}
            placeholder="Task Name"
            ref={nameRef}
            required
          />
        ) : (
          <h1>{props.data.name}</h1>
        )}

        <div className="grid grid-cols-[15%_auto] gap-y-5 my-5">
          {/* Due Date */}
          <label className="task-form-label">Due Date:</label>
          <div className="inline-flex">
            {(isAdminType && isUserAdmin) ||
            props.data.editables.dueEditable ? (
              <input
                className="input input-xl"
                type="datetime-local"
                id="dueDate"
                defaultValue={dateAsDateTimeLocalValue(props.data.dueDate)}
                onChange={(e) => {
                  e.preventDefault();
                  setDueDate(new Date(e.currentTarget.value));
                }}
              />
            ) : null}
            {isCreatingType(props.type) ? null : (
              <TaskDueCountdown due={dueDate} />
            )}
          </div>

          {/* Class */}
          {isAdminType ? (
            <label className="task-form-label">Class:</label>
          ) : null}
          {isAdminType && isUserAdmin ? (
            <select
              className="select select-xl"
              defaultValue={props.data.classId ? props.data.classId : "none"}
              onChange={(e) => {
                e.preventDefault();
                setClassId(e.currentTarget.value);
              }}
            >
              <option value="none">None</option>
              {classes}
            </select>
          ) : null}
          {isAdminType && !isUserAdmin ? <p>{className}</p> : null}

          {/* Description */}
          <label className="task-form-label">Description:</label>
          {(isAdminType && isUserAdmin) || props.data.editables.descEditable ? (
            <input
              className="input input-xl"
              type="text"
              id="description"
              name="description"
              defaultValue={props.data.description}
              placeholder="No Description"
              ref={descRef}
            />
          ) : (
            <p>
              {props.data.description === ""
                ? "No description provided"
                : props.data.description}
            </p>
          )}

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
      <form
        method="dialog"
        onSubmit={() => props.onClose()}
        className="modal-action"
      >
        <button className="btn">Close</button>
        {deleteComponent(
          isAdminType,
          isUserAdmin,
          props.type,
          props.data.editables.deletable,
          props.onDelete
        )}
        <button className="btn" onClick={submit}>
          Submit
        </button>
      </form>
    </div>
  );
}

function deleteComponent(
  isAdminType: boolean,
  isUserAdmin: boolean,
  type: TaskFormType,
  isDeletable: boolean,
  onDelete: Function
) {
  if (isCreatingType(type)) {
    return null;
  } else if ((isAdminType && isUserAdmin) || isDeletable) {
    return (
      <button className="btn" onClick={() => onDelete()}>
        Delete Task
      </button>
    );
  } else {
    return <p>This task is not deletable.</p>;
  }
}

function isCreatingType(type: TaskFormType): boolean {
  return (
    type == TaskFormType.ADMIN_CREATE || type == TaskFormType.CLIENT_CREATE
  );
}

function checkIfAdminType(type: TaskFormType): boolean {
  return type == TaskFormType.ADMIN_CREATE || type == TaskFormType.ADMIN_EDIT;
}

export function AddClientTask(props: {
  toggleModal: Function;
  setModalBox: Function;
  setStateTasks: Function;
}) {
  async function submit(
    name: string,
    desc: string,
    dueDate: Date,
    checkboxes: TaskCheckbox[]
  ) {
    /* Create the task */
    let res = await fetch("/api/calendar/tasks", {
      method: "POST",
      body: JSON.stringify({
        id: "",
        name: name,
        description: desc,
        dueDate: dueDate,
        checkboxes: checkboxes,
      }),
    });

    /* Response Handling */
    if (res.status == 200) {
      // successful create
      props.setStateTasks();
    } else {
      props.setModalBox(
        <ErrorModal
          header={"Error " + res.status}
          body={'There was an issue with creating "' + name + '".'}
          onClose={() => props.toggleModal()}
        />
      );
    }
  }

  return (
    <TaskForm
      data={{
        id: "",
        dueDate: new Date(),
        name: "New Task",
        description: "",
        checkboxes: [],
        editables: {
          nameEditable: true,
          descEditable: true,
          dueEditable: true,
          deletable: false,
        },
        classId: null,
      }}
      type={TaskFormType.CLIENT_CREATE}
      onClose={() => props.toggleModal()}
      onSubmit={submit}
      onDelete={() => {}}
    />
  );
}

export function AddClassTask(props: {
  toggleModal: Function;
  setModalBox: Function;
  setStateTasks: Function;
}) {
  const confirm = async (
    name: string,
    desc: string,
    dueDate: Date,
    checkboxes: TaskCheckbox[],
    classId: number
  ) => {
    let res = await fetch("/api/classes/tasks", {
      method: "POST",
      body: JSON.stringify({
        taskId: "",
        classId: classId,
        oldName: "",
        newName: name,
        description: desc,
        dueDate: dueDate,
        checkboxes: checkboxes,
      }),
    });

    const resText = await res.text();
    if (res.status != 200 || resText !== "") {
      props.setModalBox(
        <ErrorModal
          header={"Error " + res.status}
          body={
            'There was a problem with creating "' +
            name +
            '" for the class.  Error Message: ' +
            resText
          }
          onClose={() => props.toggleModal()}
        />
      );
    } else {
      props.setStateTasks();
    }
  };

  const submit = (
    name: string,
    desc: string,
    dueDate: Date,
    checkboxes: TaskCheckbox[],
    classId: number
  ) => {
    confirm(name, desc, dueDate, checkboxes, classId);
    // props.setModal(
    //   <ConfirmModal
    //     body={
    //       "You are about to create a task for a class, meaning that this task will also be created for users.  Do you wish to continue?"
    //     }
    //     onConfirm={() => confirm(name, desc, dueDate, checkboxes, classId)}
    //     onCancel={() => {}}
    //     onClose={() => props.setModal(<div></div>)}
    //   />
    // );
  };

  return (
    <TaskForm
      data={{
        id: "",
        dueDate: new Date(),
        name: "New Task",
        description: "",
        checkboxes: [],
        editables: {
          nameEditable: true,
          descEditable: true,
          dueEditable: true,
          deletable: false,
        },
        classId: null,
      }}
      type={TaskFormType.ADMIN_CREATE}
      onClose={() => props.toggleModal()}
      onSubmit={submit}
      onDelete={() => {}}
    />
  );
}
