import { NextResponse } from 'next/server';

import { Resend } from 'resend';
import { config } from 'dotenv';
import { randomUUID } from 'crypto';

import {
  createAccountVerificationToken,
  emailAccountExists,
  usernameExists,
  verificationKeyExists,
} from '@/db/authentication/signUp';

import * as EmailValidator from 'email-validator';

import { passwordStrength } from 'check-password-strength';

// import prisma from "@/db";

config();

const resend = new Resend(process.env['EMAIL_API_KEY']);

interface responseType {
  username: string;
  email: string;
  password: string;
}

/* Implementation to authenticate the user*/
export async function POST(request: Request) {
  const res: responseType = await request.json();

  const hasAccount = await emailAccountExists(res.email);
  if (hasAccount) {
    return new NextResponse('This email already exists.');
  }

  hasAccount = await usernameExists(res.username);
  if (hasAccount) {
    return new NextResponse('This username already exists.');
  }

  // Validate form data before sending:
  if (EmailValidator.validate(res.email) != true) {
    return new NextResponse(
      'Email validation failed on backend. This email is a duplicate.'
    );
  } else if (passwordStrength(res.password).id < 2) {
    return new NextResponse(
      'Password policy failed on backend. (If this happens PLEASE talk to the devs)'
    );
  }

  /* Check that no other keys exist for this account */
  const keyExists = await verificationKeyExists(res.email, res.username);
  if (keyExists) {
    return new NextResponse(
      'Verification key already sent, please check your email.'
    );
  }

  /* Send Email*/
  const token = randomUUID(); // or custom string

  const verification_link = `${process.env['WEBSITE_URL']}/api/verifyEmail?key=${token}`;
  /* Save the verification token for the account in the prisma database */
  createAccountVerificationToken(token, res.email, res.username, res.password);
  await resend.emails.send({
    from: 'IBProductive <onboarding@ibproductive.org>',
    to: [res.email],
    subject: 'IBProductive Verification Email',
    html: `<h1>Welcome To IBProductive!</h1>
         <p>Here is your verification link:${verification_link}</p> <br> 
         <p>If you got this email without sending it yourself, please contact us.</p>`,
  });

  return new NextResponse('Verification email sent.');
}
