import { useState } from "react";
import { TaskCheckbox, TaskData } from "./TaskBackEnd";

export default function TaskModal(props: {
  isOpen: Boolean;
  onClose: Function;
  data: TaskData;
}) {
  const [checkboxes, setCheckboxes] = useState(props.data.checkboxes);
  const [desc, setDesc] = useState(props.data.description);

  if (props.isOpen == false) {
    return null;
  }

  return (
    <div className="flex-col fixed z-40 top-0 left-0 w-full h-full bg-gray-700 bg-opacity-85">
      <div className="flex justify-between bg-slate-800">
        <h1 className="m-5 py-3 px-4 bg-red-500 text-6xl">{props.data.name}</h1>
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
      <form className="grid grid-cols-[10%_auto]">
        {/* Description */}
        <label className="task-label">Description:</label>
        <input
          className="task-input"
          type="text"
          id="description"
          name="description"
          defaultValue={String(desc)}
        />

        {/* Checklist */}
        <label className="task-label">Checklist:</label>
        <div>
          {checkboxes.map((i) => (
            <div key={String(i.label)}>
              <input type="checkbox" defaultChecked={Boolean(i.bool)} />
              <input type="text" defaultValue={String(i.label)} />
              <button
                onClick={() => {
                  setCheckboxes(checkboxes.filter((j) => j.label !== i.label));
                  // filters the checkboxes to add all that do not have the same label
                }}
              >
                - Remove Checkbox
              </button>
            </div>
          ))}

          {/* Add Checkbox */}
          <button
            key={"add-checkbox"}
            onClick={() => {
              setCheckboxes((c) => [
                ...c,
                { label: "New Checkbox", bool: false },
              ]);
            }}
          >
            + Add New Checkbox
          </button>
        </div>
      </form>
    </div>
  );
}
