import { deleteClientTask } from "@/db/tasks/client_task";
import "../calendar.css";
import { TaskData, TaskCheckbox } from "./Task";
import "./tasks.css";
import { useEffect, useState } from "react";
import {
  ClassData,
  createTaskForClass,
  getAllClasses,
} from "@/db/classes/class";

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
  onSubmit: Function; // name, desc, dueDate, checklists
  onDelete: Function;
};

export enum TaskFormType {
  CLIENT_CREATE,
  CLIENT_EDIT,

  ADMIN_CREATE,
  ADMIN_EDIT,
}

export default function TaskForm(props: TaskFormProps) {
  const close = () => {
    props.onClose();
  };
  const submit = () => {
    if (isAdminType(props.type) && classId == "none") {
    } else {
      props.onSubmit(
        name,
        desc,
        props.data.dueDate,
        checkboxes,
        Number(classId)
      );
      close();
    }
    // if (props.type == TaskFormType.ADMIN_CREATE && classId !== "none") {
    //   createTaskForClass(
    //     Number.parseInt(classId),
    //     name,
    //     desc,
    //     props.data.dueDate,
    //     checkboxes
    //   );
    // } else {
    // }
  };

  const [name, setName] = useState<string>(props.data.name);
  const [desc, setDesc] = useState<string>(props.data.description);
  const [checkboxes, setCheckboxes] = useState<TaskCheckbox[]>(
    props.data.checkboxes
  );
  const [classId, setClassId] = useState<string>("none");
  const [classes, setClasses] = useState<React.ReactElement[]>();

  useEffect(() => {
    if (isAdminType(props.type)) {
      let params = new URLSearchParams({ name: "all" });
      fetch("/api/classes?" + params)
        .then((res) => {
          return res.json();
        })
        .then((val) => {
          let arr: ClassData[] = val.arr;
          setClasses(
            arr.map((i: ClassData) => {
              return (
                <option key={i.id} value={i.id}>
                  {i.name}
                </option>
              );
            })
          );
        });
    }

    return () => {};
  }, []);

  let nextId: number =
    checkboxes.length === 0 ? 1 : checkboxes[checkboxes.length - 1].id + 1;

  return (
    <div className="modal-bg">
      {/* TODO: what if the checklist is too big so you need to scroll? */}
      <form
        id="taskform"
        onSubmit={submit}
        onKeyDown={(e) => {
          if (e.key === "escape") {
            e.preventDefault();
            close();
          } else if (e.key === "enter") {
            e.preventDefault();
            submit();
          }
        }}
      >
        <div className="modal-header">
          {props.data.editables.nameEditable ? (
            <input
              className="task-input"
              type="text"
              id="nombre"
              name="nombre"
              defaultValue={name}
              placeholder="Task Name"
              onChange={(e) => {
                e.preventDefault();
                setName(e.currentTarget.value);
              }}
            />
          ) : (
            <h1>{name}</h1>
          )}
          <h1></h1>
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
        <div className="grid grid-cols-[10%_auto] gap-y-5">
          {/* Class */}
          {isAdminType(props.type) ? (
            <label className="task-form-label">Class:</label>
          ) : null}
          {isAdminType(props.type) ? (
            <select
              defaultValue={"none"}
              onChange={(e) => {
                e.preventDefault();
                setClassId(e.currentTarget.value);
              }}
            >
              <option value="none">None</option>
              {classes}
            </select>
          ) : null}

          {/* Description */}
          <label className="task-form-label">Description:</label>
          {props.data.editables.descEditable ? (
            <input
              className="task-input"
              type="text"
              id="description"
              name="description"
              defaultValue={desc}
              placeholder="No Description"
              onChange={(e) => {
                e.preventDefault();
                setDesc(e.currentTarget.value);
              }}
            />
          ) : (
            <p>{desc === "" ? "No description provided" : desc}</p>
          )}

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

          {/* Deletable */}
          {deleteComponent(
            props.type,
            props.data.editables.deletable,
            props.onDelete
          )}
          <input type="submit" value="submit" />
        </div>
      </form>
    </div>
  );
}

function deleteComponent(
  type: TaskFormType,
  isDeletable: boolean,
  onDelete: Function
) {
  if (isCreatingType(type)) {
    return null;
  } else if (isDeletable) {
    return (
      <button
        onClick={(e) => {
          e.preventDefault();
          onDelete();
        }}
      >
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

function isAdminType(type: TaskFormType): boolean {
  return type == TaskFormType.ADMIN_CREATE || type == TaskFormType.ADMIN_EDIT;
}

export function AddClientTask(props: {
  onClose: Function;
  onSubmit: Function;
}) {
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
      }}
      type={TaskFormType.CLIENT_CREATE}
      onClose={props.onClose}
      onSubmit={props.onSubmit}
      onDelete={() => {}}
    />
  );
}

export function AddClassTask(props: { onClose: Function; onSubmit: Function }) {
  return (
    <TaskForm
      data={{
        id: "",
        dueDate: new Date(),
        name: "New Task",
        description: "",
        checkboxes: [],
        editables: {
          nameEditable: false,
          descEditable: false,
          dueEditable: false,
          deletable: false,
        },
      }}
      type={TaskFormType.ADMIN_CREATE}
      onClose={props.onClose}
      onSubmit={props.onSubmit}
      onDelete={() => {}}
    />
  );
}
