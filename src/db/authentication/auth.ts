import prisma from '..';
import { randomUUID } from 'crypto';
import { addMinutes } from 'date-fns';
import { scryptSync, randomBytes, timingSafeEqual } from 'crypto';
import { passwordStrength } from 'check-password-strength';

export async function createAccount(
    username: string,
    email: string,
    passwordHash: string
) {
    return prisma.user.create({
        data: { email: email, passHash: passwordHash, username: username },
    });
}

export async function createAccountVerificationToken(
    token: string,
    email: string,
    username: string,
    password: string
) {
    /* Used specifically to create
    a token in the prisma database so that the 
    account can be created after the user's verification
    email is accepted. This is the token that will
    be referenced in that process. */

    // strip password of spaces: (commonly placed and may confuse users when their password doesn't work)
    password = password.replace(' ', '');

    // todo: Test database for same email
    let test = await prisma.user.findFirst({ where: { email: email } });

    if (test) {
        return 'email exists';
    }

    // Test database for same username
    test = await prisma.user.findFirst({ where: { username: username } });
    if (test) {
        return 'user exists';
    }

    // todo: test database for password length & other security measures
    if (passwordStrength(password).id < 2) {
        return 'pass too weak';
    }
    // https://stackoverflow.com/a/67038052/15982771
    // the above post was used to determine how to hash passwords

    const salt = randomBytes(18).toString('hex'); // 18 to be slightly more secure, change if needed (at least 16)
    const buf = scryptSync(password, salt, 64) as Buffer;
    // Yes, it is synchronous... Might need to change this if we get more web traffic in the future.
    const passHash = `${buf.toString('hex')}.${salt}`;
    /* 
    How a salt works:
    - Used in hashing the password
    - Is meant to be public or treated as available information (obviously there's 0 point in posting it anywhere but the salt is *meant* to be randomized)
    - Is made so that every hash is randomly unique and rainbow tables can't be used
    */

    await prisma.verificationToken.create({
        data: {
            email: email,
            token: token,
            username: username,
            passHash: passHash,
            createdAt: new Date(),
            expiresAt: addMinutes(new Date(), 15), // expires in 15 mins
        },
    });

    return 'sent';
}

export async function handleVerifyEmail(sentToken: string) {
    /* Used after the user clicked the verification link sent to their inbox */
    const databaseEntry = await prisma.verificationToken.findUnique({
        where: {
            token: sentToken,
        },
    });

    if (databaseEntry) {
        // Check expiry
        const now = new Date();
        if (now > databaseEntry.expiresAt) {
            // if expired delete token
            await prisma.verificationToken.delete({
                where: {
                    token: sentToken,
                },
            });
            return 'expired';
        } else {
            // check if account already exists
            const user = await prisma.user.findFirst({
                where: { email: databaseEntry.email },
            });

            if (user) {
                return 'already exists';
            }

            console.log(databaseEntry.username, 'monke');

            await createAccount(
                databaseEntry.username,
                databaseEntry.email,
                databaseEntry.passHash
            ); // Create the account in the database

            const del = await prisma.verificationToken.delete({
                where: {
                    token: sentToken,
                },
            }); // Delete the token

            return 'account created';
        }
    } else {
        return 'No key';
    }
}

async function deleteUnusedVerificationKeys() {
    // todo
    /* This is used to delete keys that have expired periodically with a node cron job */
}
