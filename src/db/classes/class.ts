import { TaskCheckbox, TaskData } from "@/app/components/calendar/tasks/Task";
import prisma from "..";

export type ClassData = {
  name: string;
  id: number;
};

export type UserData = {
  name: string;
  id: number;
};

export async function getAllClasses(): Promise<ClassData[]> {
  const classes = await prisma.class.findMany();
  return classes.map((i) => {
    return { name: i.name, id: i.id };
  });
}

/**
 * Returns an array of user ids that are associated with the class.
 * @param id
 */
export async function getUsersInClass(id: number) {
  let userClassRels = await prisma.usersInClass.findMany({
    where: { classId: id },
  });

  let arr = [];

  for (const i of userClassRels) {
    let userData: UserData = {
      name: i.username,
      id: i.userId,
    };

    arr.push(userData);
  }

  return arr;
}

export async function createTaskForClass(
  classId: number,
  name: string,
  desc: string,
  dueDate: Date,
  checkboxes: TaskCheckbox[]
) {
  let users: UserData[] = await getUsersInClass(classId);

  let labels: string[] = checkboxes.map((i) => {
    return i.label;
  });

  let bools: boolean[] = checkboxes.map((i) => {
    return i.bool;
  });

  let data = users.map((i) => {
    return {
      username: i.name,
      name,
      description: desc,
      date: dueDate,
      labels,
      bools,
      nameEditable: false,
      descEditable: false,
      dateEditable: false,
      isDeletable: false,
    };
  });

  await prisma.clientTask.createMany({ data });
}
