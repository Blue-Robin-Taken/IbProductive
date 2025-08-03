/* general auth file */
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';
import { createSecretKey } from 'crypto';

// scrypt is callback based so with promisify we can await it
const scryptAsync = promisify(scrypt);

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(18).toString('hex'); // 18 to be slightly more secure, change if needed (at least 16)
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  // Yes, it is synchronous... Might need to change this if we get more web traffic in the future.
  const passHash = `${buf.toString('hex')}.${salt}`;

  return passHash;
}
