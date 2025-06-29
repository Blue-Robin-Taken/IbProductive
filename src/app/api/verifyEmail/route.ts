import { NextResponse } from 'next/server';
export async function GET(req: Request) {
    console.log(req);

    const key = new URL(req.url).searchParams.get('key');

    return new NextResponse(key);
}
