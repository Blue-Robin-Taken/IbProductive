import { handleVerifyEmail } from '@/db';
import { NextResponse } from 'next/server';
export async function GET(req: Request) {
    const key = new URL(req.url).searchParams.get('key');

    console.log(key);
    if (key != null) {
        console.log(await handleVerifyEmail(key));
    }
    return new NextResponse(key);
}
