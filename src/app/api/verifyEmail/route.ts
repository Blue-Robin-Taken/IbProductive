import { handleVerifyEmail } from '@/db/authentication/auth';
import { NextResponse } from 'next/server';
export async function GET(req: Request) {
    const key = new URL(req.url).searchParams.get('key');

    if (key != null) {
        const dbResponse = await handleVerifyEmail(key);

        switch (dbResponse) {
            case 'No key':
                return new NextResponse(
                    "There is no matching verification key. It might've been deleted or it's invalid."
                );
                break;
            case 'account created':
                return new NextResponse(
                    'Account created, you may close this window now'
                );
                break;
            case 'already exists':
                return new NextResponse('This account already exists.');
                break;
            case 'expired':
                return new NextResponse(
                    'This key is invalid because it has expired. Please make a new request.'
                );
                break;
        }
    }
    return new NextResponse('Key is null');
}
