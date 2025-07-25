import { usernameExists } from '@/db/authentication/signUp';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const username = new URL(req.url).searchParams.get('username');

  if (!username) {
    return new NextResponse('No username provided');
  }

  return new NextResponse((await usernameExists(username!)).toString());
}
