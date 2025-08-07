import createFeedback from "@/db/feedback/feedback";

interface PostRequest {
  email: string;
  name: string;
  description: string;
}

export async function POST(request: Request) {
  let reqJson: PostRequest = await request.json();
  await createFeedback(reqJson.email, reqJson.description, reqJson.name);

  return new Response("");
}
