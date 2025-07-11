import prisma from '..';
import { scrypt, randomBytes, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

// scrypt is callback based so with promisify we can await it
const scryptAsync = promisify(scrypt);

export default async function checkLogin(username: string, password: string) {
    if (!username || !password) {
        return false;
    } // return blank

    const prismaFetch = await prisma.user.findUnique({
        where: { username: username },
    });

    if (!prismaFetch) {
        // Check username
        return 'Unauthorized';
    }
    const [hashedPassword, salt] = prismaFetch.passHash.split('.');

    const hashedPasswordBuf = Buffer.from(hashedPassword, 'hex'); // Convert back from hex to buffer
    const hashedCheckPasswordBuf = (await scryptAsync(
        password,
        salt,
        64
    )) as Buffer;

    // https://stackoverflow.com/questions/62908969/password-hashing-in-nodejs-using-built-in-crypto/67038052#67038052
    if (!timingSafeEqual(hashedCheckPasswordBuf, hashedPasswordBuf)) {
        // Check timing safe & hashed password
        return 'Unauthorized.';
    }

    return 'You have logged in!';
}
