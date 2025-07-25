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
  name: string,
  description: string,
  dueDate: Date,
  labels: string[],
  bools: boolean[]
) {
  //   const cookieStore = await cookies();
  //   const token = cookieStore.get("token");
  //   const username: string = token == null ? "null" : token?.value;

  await prisma.clientTask.create({
    data: {
      username: "totallycoolperson",
      name,
      description,
      date: dueDate,
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
  await prisma.clientTask.update({
    where: { username: "totallycoolperson", id: id },
    data: { name, description, date: dueDate, labels, bools },
  });
}

export async function getTasksFromPrisma(firstDate: number, lastDate: number) {
  const tasks = await prisma.clientTask.findMany({
    where: {
      username: "totallycoolperson",
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
