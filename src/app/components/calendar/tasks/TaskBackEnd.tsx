import ClientTask from "./ClientTask";

///
/// Data Types
///
export type TaskState = {
  isOpen: boolean;
  data: TaskData;
};

export type TaskData = {
  id: string;
  dueDate: Date;
  name: string;
  description: string;
  checkboxes: TaskCheckbox[];
};

export type TaskCheckbox = {
  id: number;
  label: string;
  bool: boolean;
};

export type TaskModalProps = {
  isOpen: boolean;
  onClose: Function;
  data: TaskData;
};

/**
 * Creates a new task on the Prisma databse. Only for ClientTask
 * @param name          the name of the task
 * @param description   the description of the task
 * @param dueDate       when the task is due
 * @param checkboxes    the checkboxes associated with the task
 */
export function createTask(
  name: string,
  description: string,
  dueDate: Date,
  checkboxes: TaskCheckbox[]
) {
  fetch("/api/calendar/tasks", {
    method: "POST",
    body: JSON.stringify({
      id: "",
      name: name,
      description: description,
      dueDate: dueDate,
      checkboxes: checkboxes,
    }),
  });
}

/**
 * Edits the data of a task on the Prisma database. Works for both ClientTask and GlobalTask.
 * @param data
 */
export function editTask(data: TaskData) {
  fetch("/api/calendar/tasks", {
    method: "POST",
    body: JSON.stringify({
      id: data.id,
      name: data.name,
      description: data.description,
      dueDate: data.dueDate,
      checkboxes: data.checkboxes,
    }), // would this work?
  });
}

export function taskComps(data: TaskData[], date: Date) {
  let taskArr = data.filter((task) => {
    let due: Date = new Date(task.dueDate);

    return (
      due.getFullYear() == date.getFullYear() &&
      due.getMonth() == date.getMonth() &&
      due.getDate() == date.getDate()
    );
  });

  let compArr = [];
  for (const task of taskArr) {
    compArr.push(<ClientTask key={task.id} data={task} />);
  }

  return compArr;
}

export function getTimeLeft(timeLeft: Date) {
  let years: number = timeLeft.getUTCFullYear() - 1970; // 1970 needs to be subtracted for some reason
  if (years < 0) {
    // negative years
    return (
      <div>
        <p>Overdue!</p>
      </div>
    );
  } else if (years >= 1) {
    return (
      <div>
        <p>{"Due in: " + years + " years"}</p>
      </div>
    );
  }

  let output: String = "Due in: ";
  let months: number = timeLeft.getUTCMonth();
  let days: number = timeLeft.getUTCDate() - 1;

  if (months > 0) {
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
