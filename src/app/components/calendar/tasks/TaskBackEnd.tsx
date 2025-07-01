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
