import { TaskCheckbox, TaskData } from "./TaskBackEnd";
import "../calendar.css";
import "./tasks.css";
import { useState } from "react";

type TaskFormEditable = {
  nameEditable: boolean;
  descEditable: boolean;
  dueEditable: boolean;
  deletable: boolean;
};

type TaskFormProps = {
  data: TaskData;
  editable: TaskFormEditable;
  onClose: Function;
  onSubmit: Function; // name, desc, dueDate, checklists
};

export function TaskForm(props: TaskFormProps) {
  const close = () => {
    props.onClose();
  };
  const submit = () => {
    props.onSubmit(name, desc, props.data.dueDate, checkboxes);
    close();
  };
  const del = () => {
    close();
  };

  const [name, setName] = useState<string>(props.data.name);
  const [desc, setDesc] = useState<string>(props.data.description);
  const [checkboxes, setCheckboxes] = useState<TaskCheckbox[]>(
    props.data.checkboxes
  );
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
          }
        }}
      >
        <div className="modal-header">
          {props.editable.nameEditable ? (
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
          {/* Description */}
          <label className="task-form-label">Description:</label>
          {props.editable.descEditable ? (
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
          {props.editable.deletable ? (
            <button
              onClick={(e) => {
                e.preventDefault();
                del();
              }}
            >
              Delete Task
            </button>
          ) : null}
          <input type="submit" value="submit" />
        </div>
      </form>
    </div>
  );
}
