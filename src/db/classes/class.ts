import { TaskCheckbox } from '@/app/components/calendar/tasks/Task';
import prisma from '..';

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
  const userClassRels = await prisma.usersInClass.findMany({
    where: { classId: id },
  });

  const arr = [];

  for (const i of userClassRels) {
    const userData: UserData = {
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
  const users: UserData[] = await getUsersInClass(classId);

  const labels: string[] = checkboxes.map((i) => {
    return i.label;
  });

  const bools: boolean[] = checkboxes.map((i) => {
    return i.bool;
  });

  const data = users.map((i) => {
    return {
      classId,
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

export async function editTaskForClass(
  classId: number,
  oldName: string,
  newName: string,
  desc: string,
  dueDate: Date
) {
  await prisma.clientTask.updateMany({
    where: { classId, name: oldName },
    data: { name: newName, description: desc, date: dueDate },
  });
}

export async function deleteTaskForClass(classId: number, taskName: string) {
  await prisma.clientTask.deleteMany({ where: { classId, name: taskName } });
}

export async function assignUserToClasses(
  classId: number[],
  userId: number,
  username: string
) {
  const data = classId.map((i: number) => {
    return { classId: i, userId, username };
  });

  await prisma.usersInClass.createMany({ data });
}
