import { TaskCheckbox } from "@/app/components/calendar/tasks/Task";
import { TaskFormEditable } from "@/app/components/calendar/tasks/TaskForm";
import { getUsername } from "@/db/authentication/jwtAuth";
import {
  getTasksFromPrisma,
  addClientTask,
  editClientTask,
  deleteClientTask,
} from "@/db/tasks/client_task";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  /* Search Params */
  // throw errors when null instead?
  // const startParam = request.nextUrl.searchParams.get("start");
  // const start: string = startParam === null ? "" : startParam;
  // const endParam = request.nextUrl.searchParams.get("end");
  // const end: string = endParam === null ? "" : endParam;

  const url = new URL(request.url);
  let params = new URLSearchParams(url.search);
  const start = String(params.get("start"));
  const end = String(params.get("end"));

  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("token")?.value;
  const username = await getUsername(String(tokenCookie));

  if (end === "") {
    // Simple
    let res = await getTasksFromPrisma(
      username,
      Number.parseInt(start),
      Number.parseInt(start)
    );
    return new Response(JSON.stringify({ taskArr: res }));
  }

  // Complex
  let res = await getTasksFromPrisma(
    username,
    Number.parseInt(start),
    Number.parseInt(end)
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

  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("token")?.value;
  const username = await getUsername(String(tokenCookie));

  if (json.id === "") {
    await addClientTask(
      username,
      json.name,
      json.description,
      new Date(json.dueDate),
      labels,
      bools
    );
    return new NextResponse();
  } else {
    await editClientTask(
      username,
      json.id,
      json.name,
      json.description,
      new Date(json.dueDate),
      labels,
      bools
    );
    return new NextResponse();
  }
}

interface DeleteRequest {
  id: string;
}

export async function DELETE(request: Request) {
  const json: DeleteRequest = await request.json();

  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("token")?.value;
  const username = await getUsername(String(tokenCookie));

  await deleteClientTask(username, json.id);
}
