import { cookies } from "next/headers";
import { PrismaClient } from "../generated/prisma";
import {
  TaskCheckbox,
  TaskData,
} from "@/app/components/calendar/tasks/TaskBackEnd";
import { MS_IN_DAY } from "@/app/components/generic/time/time";

let prisma = new PrismaClient();

export default prisma;

///
/// Tasks
///
export async function addClientTask(
  username: string,
  name: string,
  description: string,
  dueDate: Date,
  labels: string[],
  bools: boolean[]
) {
  await prisma.clientTask.create({
    data: {
      username: username,
      name,
      description,
      date: dueDate,
      labels,
      bools,
    },
  });
}

export async function editClientTask(
  username: string,
  id: string,
  name: string,
  description: string,
  dueDate: Date,
  labels: string[],
  bools: boolean[]
) {
  await prisma.clientTask.update({
    where: { username: username, id: id },
    data: { name, description, date: dueDate, labels, bools },
  });
}

export async function getTasksFromPrisma(
  username: string,
  firstDate: number,
  lastDate: number
) {
  const tasks = await prisma.clientTask.findMany({
    where: {
      username: username,
      date: {
        gte: new Date(firstDate),
        lte: new Date(lastDate + MS_IN_DAY - 1),
      },
    },
  });

  let dataPlural = [];
  for (const i of tasks) {
    let checkboxes: TaskCheckbox[] = [];

    for (let j = 0; j < i.labels.length; j++) {
      checkboxes.push({
        id: j,
        label: i.labels[j],
        bool: i.bools[j],
      });
    }

    let taskData: TaskData = {
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
