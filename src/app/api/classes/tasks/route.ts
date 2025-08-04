import { TaskCheckbox } from "@/app/components/calendar/tasks/Task";
import { checkDBIsAdminToken, getUsername } from "@/db/authentication/jwtAuth";
import { checkCookieUser } from "@/db/authentication/signUp";
import {
  createTaskForClass,
  deleteTaskForClass,
  editTaskForClass,
} from "@/db/classes/class";
import { cookies } from "next/headers";

interface PostRequest {
  taskId: string;
  classId: number;
  newName: string;
  oldName: string;
  description: string;
  dueDate: Date;
  checkboxes: TaskCheckbox[];
}

export async function POST(req: Request) {
  const reqJson: PostRequest = await req.json();

  /* Check if admin in DB */
  const cookieStore = await cookies();
  const tokenString = cookieStore.get("token")?.value;
  const isAdminDB = await checkDBIsAdminToken(tokenString as string);

  if (!isAdminDB) {
    return new Response("User is not an admin.");
  }

  if (reqJson.taskId === "") {
    await createTaskForClass(
      reqJson.classId,
      reqJson.newName,
      reqJson.description,
      reqJson.dueDate,
      reqJson.checkboxes
    );
  } else {
    await editTaskForClass(
      reqJson.classId,
      reqJson.oldName,
      reqJson.newName,
      reqJson.description,
      reqJson.dueDate
    );
  }

  return new Response("");
}

interface DeleteRequest {
  classId: number;
  taskName: string;
}

export async function DELETE(req: Request) {
  const reqJson: DeleteRequest = await req.json();

  await deleteTaskForClass(reqJson.classId, reqJson.taskName);

  return new Response();
}
