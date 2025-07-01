import { TaskData } from "@/app/components/calendar/tasks/TaskFrontEnd";
import { getTasksFromPrisma } from "@/db";
import { NextRequest } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  let params = new URLSearchParams(url.search);
  // console.log(new Date(String(params.get("date"))));

  let tasks = getTasksFromPrisma(new Date(String(params.get("date"))));

  return new Response(JSON.stringify({ tasks: tasks }));
}

export async function POST(request: Request) {}
