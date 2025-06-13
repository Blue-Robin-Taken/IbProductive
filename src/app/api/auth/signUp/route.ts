import { NextResponse } from "next/server";

import { Resend } from "resend";
import { config } from "dotenv";

config();

const resend = new Resend(process.env["EMAIL_API_KEY"]);

console.log(resend);

interface responseType {
  username: string;
  email: string;
  password: string;
}

/* Implementation to authenticate the user*/
export async function POST(request: Request) {
  function hasUpperCase(str: String) {
    return str !== str.toLowerCase();
  }

  const res: responseType = await request.json();

  /* Save the verification token for the account in the prisma database */
  

  /* Send Email*/
  await resend.emails.send({
    from: "IBProductive <onboarding@resend.dev>",
    to: [res.email],
    subject: "hello world",
    html: "<p>it works!</p>",
  });

  return new NextResponse(JSON.stringify({ error: 0 }));
}
