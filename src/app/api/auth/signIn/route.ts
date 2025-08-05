import { NextResponse } from "next/server";
import checkLogin from "@/db/authentication/signIn";
import * as jose from "jose";
import { createSecretKey } from "crypto";
import { cookies } from "next/headers";
import { checkDatabaseIsAdmin } from "@/db/authentication/jwtAuth";

interface responseType {
  username: string;
  password: string;
}

/* Implementation to authenticate the user*/
export async function POST(request: Request) {
  const cookieStore = await cookies();
  const res: responseType = await request.json();

  const username = res.username;
  const password = res.password;

  console.log(await checkLogin(username, password));

  if (await checkLogin(username, password)) {
    // if true
    if (!process.env["JWT_SECRET"]) {
      console.log("NO JWT TOKEN SET");
      return;
    }
    const JWT_SECRET: string = process.env["JWT_SECRET"];

    const jwt_key = await new jose.SignJWT({
      username: username,
      isAdmin: await checkDatabaseIsAdmin(username),
    })
      .setProtectedHeader({ alg: "HS256" })
      .sign(createSecretKey(JWT_SECRET, "utf-8")); // createSecretKey is for https://stackoverflow.com/a/74704299/15982771
    cookieStore.set({
      name: "token",
      value: jwt_key,
      httpOnly: true,
    }); // set the cookie

    return new NextResponse("login happy"); // https://stackoverflow.com/a/69128205/15982771
    // put an actual response msg lol
  }
  return new NextResponse("login sad"); // purposeful null response
  // put an actual response msg lol
}

export async function DELETE(request: Request) {
  let cookieStore = await cookies();

  cookieStore.set({ name: "token", value: "", httpOnly: true, expires: 1 });
  // cookieStore.delete("token");

  return new Response("");
}
