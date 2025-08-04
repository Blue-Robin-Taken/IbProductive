import { checkJWTIsAdmin } from "@/db/authentication/jwtAuth";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("token")?.value;
  let jwtVal: string | boolean = await checkJWTIsAdmin(String(tokenCookie));
  let adminVal: boolean;

  if (typeof jwtVal !== "boolean") {
    return false;
  } else {
    adminVal = jwtVal;
  }

  return new Response(JSON.stringify({ isAdmin: adminVal }));
}
