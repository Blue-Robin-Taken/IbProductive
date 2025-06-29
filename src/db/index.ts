import { withAccelerate } from "@prisma/extension-accelerate";
import { randomUUID } from "crypto";
import { addMinutes } from "date-fns";

import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

async function createUser() {
  // prisma.
}

export async function createAccountVerificationToken(
  token: string,
  email: string,
  username: string,
  password: string
) {
  /* Used specifically to create
    a token in the prisma database so that the 
    account can be created after the user's verfification
    email is accepted. This is the token that will
    be referenced in that process. */
  await prisma.verificationToken.create({
    data: {
      email,
      token, // TODO: Implement password hashing here
      expiresAt: addMinutes(new Date(), 15), // expires in 15 mins
    },
  });

  return token;
}
