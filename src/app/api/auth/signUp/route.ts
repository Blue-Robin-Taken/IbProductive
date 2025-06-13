import { NextResponse } from "next/server";

/* Implementation to authenticate the user*/
export async function POST(request: Request) {
  function hasUpperCase(str: String) {
    return str !== str.toLowerCase();
  }

  console.log(request.formData());
}
