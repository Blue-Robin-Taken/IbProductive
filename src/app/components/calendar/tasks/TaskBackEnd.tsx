import { TaskCheckbox, TaskData } from "./TaskFrontEnd";

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

export function fetchTasks() {
  let params = new URLSearchParams({
    date:
      // date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
      "2025-6-15",
  });

  return fetch("/api/calendar/tasks?" + params)
    .then((response) => response.json())
    .then((json) => json["taskArr" as keyof typeof json])
    .then((data: TaskData[]) => {
      console.log(data);
      return data;
    });
}
