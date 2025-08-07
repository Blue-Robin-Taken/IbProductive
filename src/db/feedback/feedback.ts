import { de } from "date-fns/locale";
import prisma from "..";

export default async function createFeedback(
  email: string,
  desc: string,
  name: string
) {
  await prisma.feedback.create({
    data: { email, description: desc, title: name, createdAt: new Date() },
  });
}
