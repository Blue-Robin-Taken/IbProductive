import { TaskCheckbox } from "@/app/components/calendar/tasks/Task";
import { createTaskForClass } from "@/db/classes/class";

interface PostRequest {
  classId: number;
  name: string;
  description: string;
  dueDate: Date;
  checkboxes: TaskCheckbox[];
}

export async function POST(req: Request) {
  const reqJson: PostRequest = await req.json();
  await createTaskForClass(
    reqJson.classId,
    reqJson.name,
    reqJson.description,
    reqJson.dueDate,
    reqJson.checkboxes
  );

  return new Response();
}
