import { NextResponse } from 'next/server';

import { Resend } from 'resend';
import { config } from 'dotenv';
import { randomUUID } from 'crypto';

import { createAccountVerificationToken } from '@/db/authentication/auth';

config();

const resend = new Resend(process.env['EMAIL_API_KEY']);

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
    const token = randomUUID(); // or custom string

    const verification_link = `${process.env['WEBSITE_URL']}/api/verifyEmail?key=${token}`;

    await resend.emails.send({
        from: 'IBProductive <onboarding@ibproductive.org>',
        to: [res.email],
        subject: 'IBProductive Verification Email',
        html: `<h1>Welcome To IBProductive!</h1>
         <p>Here is your verification link:${verification_link}</p> <br> 
         <p>If you got this email without sending it yourself, please contact us.</p>`,
    });

    createAccountVerificationToken(
        token,
        res.email,
        res.username,
        res.password
    );

    return new NextResponse(JSON.stringify({ error: 0 }));
}
