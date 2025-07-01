import { useState } from "react";
import "./tasks.css";

export default function AddTaskModal(props: {
  isOpen: Boolean;
  onClose: Function;
  onCreate: Function;
}) {
  const [checkboxes, setCheckboxes] = useState([
    { id: 0, label: "New Checkbox", bool: false },
  ]);
  const [desc, setDesc] = useState("");
  const [name, setName] = useState("New Task");
  const [dueDate, setDueDate] = useState(new Date());
  let nextId: number = 1;

  if (props.isOpen == false) return null;

  return (
    <div className="task-modal bg-opacity-85">
      <div className="flex justify-between bg-slate-800">
        <h1 className="m-5 py-3 px-4 bg-red-500 text-6xl">
          Create New Client Task
        </h1>
        <button
          // flex none prevents from growing/shrinking
          className="m-5 px-4 text-3xl flex-none"
          onClick={() => {
            props.onClose();
          }}
        >
          Close
        </button>
      </div>
      <form
        id="taskForm"
        className="grid grid-cols-[10%_auto] gap-y-5"
        onKeyDown={(e) => {
          if (e.key === "escape") {
            e.preventDefault();
            props.onClose();
          } else if (e.key === "enter") {
            e.preventDefault();
            props.onCreate(name, desc, dueDate, checkboxes);
          }
        }}
      >
        {/* Name */}
        <label className="task-form-label">Name:</label>
        <input
          className="task-input"
          type="text"
          id="name"
          name="name"
          defaultValue={String(name)}
          onChange={(e) => {
            e.preventDefault();
            setName(e.currentTarget.value);
          }}
        />

        {/* Description */}
        <label className="task-form-label">Description:</label>
        <input
          className="task-input"
          type="text"
          id="description"
          name="description"
          defaultValue={String(desc)}
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
              setCheckboxes((c) => [
                ...c,
                { id: nextId, label: "New Checkbox", bool: false },
              ]);
              nextId++;
            }}
          >
            + Add New Checkbox
          </button>
        </div>
      </form>
      <button onClick={() => props.onCreate(name, desc, dueDate, checkboxes)}>
        Create
      </button>
    </div>
  );
}
