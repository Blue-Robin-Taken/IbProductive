import { ClassData, getAllClasses } from "@/db/classes/class";

export async function GET(req: Request) {
  const url = new URL(req.url);
  let params = new URLSearchParams(url.search);
  const className = String(params.get("name"));

  if (className === "all") {
    let res: ClassData[] = await getAllClasses();
    return new Response(JSON.stringify({ arr: res }));
  }
  return new Response(JSON.stringify({ arr: [] }));
}
