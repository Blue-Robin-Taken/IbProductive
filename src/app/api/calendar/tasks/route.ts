import {
  TaskCheckbox,
  TaskData,
} from "@/app/components/calendar/tasks/TaskFrontEnd";
import {
  addClientTask,
  getMultipleTasksFromPrisma,
  getTasksFromPrisma,
} from "@/db";

export async function GET(request: Request) {
  // Simple
  // const url = new URL(request.url);
  // let params = new URLSearchParams(url.search);

  // let res = await getTasksFromPrisma(new Date(String(params.get("date"))));

  // return new Response(JSON.stringify({ taskArr: res }));

  // Complex
  const url = new URL(request.url);
  console.log("url: " + url);
  let params = new URLSearchParams(url.search);

  let res = await getMultipleTasksFromPrisma(
    new Date(String(params.get("start"))),
    new Date(String(params.get("end")))
  );

  return new Response(JSON.stringify({ taskArr: res }));
}

interface PostRequest {
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

  addClientTask(
    json.name,
    json.description,
    new Date(json.dueDate),
    labels,
    bools
  );

  return new Response();
}
