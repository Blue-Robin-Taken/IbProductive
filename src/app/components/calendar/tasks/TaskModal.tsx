import { useState } from "react";
import { TaskCheckbox, TaskData } from "./TaskBackEnd";

export default function TaskModal(props: {
  isOpen: Boolean;
  onClose: Function;
  data: TaskData;
  date: Date;
  timeLeft: Date;
}) {
  const [checkboxes, setCheckboxes] = useState(props.data.checkboxes);
  const [desc, setDesc] = useState(props.data.description);
  let nextId: number =
    checkboxes.length === 0 ? 1 : checkboxes[checkboxes.length - 1].id + 1; // get the last used id and add one

  if (props.isOpen == false) return null;

  console.log("givenDate: " + props.date);
  console.log("dueDate: " + props.data.dueDate);

  return (
    <div className="flex-col fixed z-40 top-0 left-0 w-full h-full bg-gray-700 bg-opacity-85">
      <div className="flex justify-between bg-slate-800">
        <h1 className="m-5 py-3 px-4 bg-red-500 text-6xl">{props.data.name}</h1>
        <button
          // flex none prevents from growing/shrinking
          className="m-5 px-4 text-3xl flex-none"
          onClick={() => {
            props.onClose(desc, checkboxes);
          }}
        >
          Close
        </button>
      </div>
      <div>{getTimeLeft(props.timeLeft)}</div>
      {/* TODO: what if the checklist is too big so you need to scroll? */}
      <form
        id="taskForm"
        className="grid grid-cols-[10%_auto] gap-y-5"
        onKeyDown={(e) => {
          if (e.key === "enter") {
            e.preventDefault();
            props.onClose(desc, checkboxes);
          }
        }}
      >
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
    </div>
  );
}

function getTimeLeft(timeLeft: Date) {
  let years: number = timeLeft.getUTCFullYear() - 1970; // 1970 needs to be subtracted for some reason
  if (years < 0) {
    // negative years
    return (
      <div>
        <p>Overdue!</p>
      </div>
    );
  }

  let output: String = "Due in: ";
  let months: number = timeLeft.getUTCMonth();
  let days: number = timeLeft.getUTCDate() - 1;

  if (months > 0) {
    if (years !== 0) {
      output += years + " years ";
    }
    output += months + " months " + days + " days";

    return (
      <div>
        <p>{output}</p>
      </div>
    );
  } else if (days > 3 && months === 0) {
    return (
      <div>
        <p>{days + " days"}</p>
      </div>
    );
  }

  let hours: number = timeLeft.getUTCHours();

  if (days > 0) {
    output += days + " days ";
    if (hours !== 0) {
      output += hours + " hours";
    }
    return (
      <div>
        <p>{output}</p>
      </div>
    );
  }

  if (hours > 5 && days === 0) {
    return (
      <div>
        <p>{hours + " hours"}</p>
      </div>
    );
  }

  let minutes: number = timeLeft.getUTCMinutes();
  if (hours !== 0) {
    output += hours + " hours ";
  }
  output += minutes + " minutes";
  return (
    <div>
      <p>{output}</p>
    </div>
  );
}
