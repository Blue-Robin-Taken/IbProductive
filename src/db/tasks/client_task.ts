import { TaskCheckbox, TaskData } from "@/app/components/calendar/tasks/Task";
import { MS_IN_DAY } from "@/app/generic/time/time";
import prisma from "..";
// import { TaskFormEditable } from "@/app/components/calendar/tasks/TaskForm";

export async function addGlobalTask(
  name: string,
  description: string,
  dueDate: Date,
  labels: string[],
  bools: boolean[]
) {
  await prisma.globalTask.create({
    data: {
      name,
      description,
      date: dueDate,
      labels,
      bools,
    },
  });
}

export async function editGlobalTask(
  id: string,
  name: string,
  description: string,
  dueDate: Date,
  labels: string[],
  bools: boolean[]
) {
  await prisma.globalTask.update({
    where: { id: id },
    data: {
      name,
      description,
      date: dueDate,
      labels,
      bools,
    },
  });
}

export async function getGlobalTasks(firstDate: number, lastDate: number) {
  const tasks = await prisma.globalTask.findMany({
    where: {
      date: {
        gte: new Date(firstDate),
        lte: new Date(lastDate + MS_IN_DAY - 1),
      },
    },
  });

  const dataPlural = [];
  for (const i of tasks) {
    const checkboxes: TaskCheckbox[] = [];

    for (let j = 0; j < i.labels.length; j++) {
      checkboxes.push({
        id: j,
        label: i.labels[j],
        bool: i.bools[j],
      });
    }

    const taskData: TaskData = {
      id: i.id,
      dueDate: i.date,
      name: i.name,
      description: i.description == null ? "" : i.description,
      checkboxes: checkboxes,
    };

    dataPlural.push(taskData);
  }

  return dataPlural;
}

export async function deleteClientTask(username: string, id: string) {
  await prisma.clientTask.delete({
    where: {
      username: username,
      id: id,
    },
  });
}
