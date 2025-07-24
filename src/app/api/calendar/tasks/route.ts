import { TaskCheckbox } from "@/app/components/calendar/tasks/TaskBackEnd";

import {
  addClientTask,
  editClientTask,
  getMultipleTasksFromPrisma,
  getTasksFromPrisma,
} from "@/db";

export async function GET(request: Request) {
  const url = new URL(request.url);
  let params = new URLSearchParams(url.search);

  if (String(params.get("end")) === "") {
    // Simple
    let res = await getTasksFromPrisma(new Date(String(params.get("start"))));
    return new Response(JSON.stringify({ taskArr: res }));
  }

  // Complex
  let res = await getMultipleTasksFromPrisma(
    Number.parseInt(String(params.get("start"))),
    Number.parseInt(String(params.get("end")))
  );

  return new Response(JSON.stringify({ taskArr: res }));
}

interface PostRequest {
  id: string;
  name: string;
  description: string;
  dueDate: Date;
  checkboxes: TaskCheckbox[];
}

export async function POST(request: Request) {
  const json: PostRequest = await request.json();

  let labels: string[] = [];
  let bools: boolean[] = [];

  for (const checkbox of json.checkboxes) {
    labels.push(checkbox.label);
    bools.push(checkbox.bool);
  }

  if (json.id === "") {
    await addClientTask(
      json.name,
      json.description,
      new Date(json.dueDate),
      labels,
      bools
    );
  } else {
    await editClientTask(
      json.id,
      json.name,
      json.description,
      new Date(json.dueDate),
      labels,
      bools
    );
  }

  return new Response();
}
