import { TaskCheckbox } from "@/app/components/calendar/tasks/Task";
import {
  createTaskForClass,
  deleteTaskForClass,
  editTaskForClass,
} from "@/db/classes/class";

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

  return new Response();
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
