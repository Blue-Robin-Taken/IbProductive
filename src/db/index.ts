import { cookies } from "next/headers";
import { PrismaClient } from "../generated/prisma";
import {
  TaskCheckbox,
  TaskData,
} from "@/app/components/calendar/tasks/TaskBackEnd";

let prisma = new PrismaClient();

export default prisma;

///
/// Tasks
///
export async function addClientTask(
  name: string,
  description: string,
  dueDate: Date,
  labels: string[],
  bools: boolean[]
) {
  let year: number = dueDate.getFullYear();
  let month: number = dueDate.getMonth();
  let date: number = dueDate.getDate();
  //   const cookieStore = await cookies();
  //   const token = cookieStore.get("token");
  //   const username: string = token == null ? "null" : token?.value;

  await prisma.clientTask.create({
    data: {
      username: "totallycoolperson",
      name,
      description,
      year,
      month,
      date,
      labels,
      bools,
    },
  });
}

export async function editClientTask(
  id: string,
  name: string,
  description: string,
  dueDate: Date,
  labels: string[],
  bools: boolean[]
) {
  let year: number = dueDate.getFullYear();
  let month: number = dueDate.getMonth();
  let date: number = dueDate.getDate();

  await prisma.clientTask.update({
    where: { username: "totallycoolperson", id: id },
    data: { name, description, year, month, date, labels, bools },
  });
}

export async function getTasksFromPrisma(day: Date) {
  let year: number = day.getFullYear();
  let month: number = day.getMonth();
  let date: number = day.getDate();

  const tasks = await prisma.clientTask.findMany({
    where: {
      username: "totallycoolperson",
      year: year,
      month: month,
      date: date,
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
      dueDate: new Date(i.year, i.month, i.date),
      name: i.name,
      description: i.description == null ? "" : i.description,
      checkboxes: checkboxes,
    };

    dataPlural.push(taskData);
  }

  return dataPlural;
}

export async function getMultipleTasksFromPrisma(start: number, end: number) {
  let arr = [];

  for (let i = start; i <= end; i += 86400000) {
    // 86,400,000 is the number of ms in a day
    let addend = await getTasksFromPrisma(new Date(i));

    for (const j of addend) {
      arr.push(j);
    }
  }

  return arr;
}
