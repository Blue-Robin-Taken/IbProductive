import { Task, TaskCheckbox, TaskData } from "./TaskFrontEnd";

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
    compArr.push(<Task key={task.id} data={task} />);
  }

  return compArr;
}
