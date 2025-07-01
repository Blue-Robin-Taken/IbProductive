import {
  TaskCheckbox,
  TaskData,
} from "@/app/components/calendar/tasks/TaskFrontEnd";
import { addClientTask, getTasksFromPrisma } from "@/db";
import { NextRequest } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  let params = new URLSearchParams(url.search);
  // console.log(new Date(String(params.get("date"))));

  let tasks = getTasksFromPrisma(new Date(String(params.get("date"))));

  return new Response(JSON.stringify({ tasks: tasks }));
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

  addClientTask(json.name, json.description, json.dueDate, labels, bools);

  return new Response();
}
