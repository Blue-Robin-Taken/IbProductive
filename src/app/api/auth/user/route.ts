import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  if (token) {
    return new Response("token");
  } else {
    return new Response("no token");
  }
}
