import { withAccelerate } from "@prisma/extension-accelerate";
import { randomUUID } from "crypto";
import { addMinutes } from "date-fns";

import { PrismaClient } from "../generated/prisma";
import {
  TaskCheckbox,
  TaskData,
} from "@/app/components/calendar/tasks/TaskFrontEnd";

const prisma = new PrismaClient();

async function createUser() {
  // prisma.
}

export async function createAccount(
  username: string,
  email: string,
  passwordHash: string
) {}

export async function createAccountVerificationToken(
  token: string,
  email: string,
  username: string,
  password: string
) {
  /* Used specifically to create
    a token in the prisma database so that the 
    account can be created after the user's verfification
    email is accepted. This is the token that will
    be referenced in that process. */
  await prisma.verificationToken.create({
    data: {
      email,
      token, // TODO: Implement password hashing here
      expiresAt: addMinutes(new Date(), 15), // expires in 15 mins
    },
  });

  return token;
}

export async function handleVerifyEmail(sentToken: string) {
  /* Used after the user clicked the verification link sent to their inbox */
  const databaseEntry = await prisma.verificationToken.findUnique({
    where: {
      token: sentToken,
    },
  });

  if (databaseEntry) {
    // Check expiry
    const now = new Date();
    if (now > databaseEntry.expiresAt) {
      // if expired delete token
      await prisma.verificationToken.delete({
        where: {
          token: sentToken,
        },
      });
      return "expired";
    } else {
      // await createAccount()
      // todo
      return "account created";
    }
  } else {
    return "No key";
  }
}

async function deleteUnusedVerificationKeys() {
  // todo
  /* This is used to delete keys that have expired periodically with a node cron job */
}

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
  await prisma.clientTask.create({
    data: { name, description, dueDate, labels, bools },
  });
}

export async function getTasksFromPrisma(date: Date) {
  const tasks = await prisma.clientTask.findMany({
    where: {
      dueDate: date,
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
      dueDate: i.dueDate,
      name: i.name,
      description: i.description == null ? "" : i.description,
      checkboxes: checkboxes,
    };

    dataPlural.push(taskData);
  }

  return dataPlural;
}
