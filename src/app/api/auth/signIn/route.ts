import { NextResponse } from 'next/server';

interface responseType {
    username: string;
    password: string;
}

/* Implementation to authenticate the user*/
export async function POST(request: Request) {
    const res: responseType = await request.json();

    const username = res.username;
    const password = res.password;

    console.log(password, username);
}
