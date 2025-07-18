import prisma from '..';
import { randomUUID } from 'crypto';
import { addMinutes } from 'date-fns';
import { passwordStrength } from 'check-password-strength';
import { hashPassword } from './auth';

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
  const passHash = await hashPassword(password);

  // todo: Test database for same email
  let test = await prisma.user.findFirst({ where: { email: email } });

  if (test) {
    return 'Email already exists';
  }

  // Test database for same username
  test = await prisma.user.findFirst({ where: { username: username } });
  if (test) {
    return 'Username already exists';
  }

  // https://stackoverflow.com/a/67038052/15982771
  // the above post was used to determine how to hash passwords

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

      await prisma.verificationToken.delete({
        where: {
          token: sentToken,
        },
      });

      if (user) {
        return 'already exists';
      }

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

// Below are two helper functions to check an account's username and email for dupes
export async function emailAccountExists(checkEmail: string) {
  const user = await prisma.user.findFirst({
    where: { email: checkEmail },
  });

  if (user) {
    return true;
  }
}

export async function usernameExists(checkUser: string) {
  const user = await prisma.user.findFirst({
    where: { username: checkUser },
  });

  if (user) {
    return true;
  }
}

export async function checkCookieUser(cookieJWT: string){
    
}

// export async function deleteUnusedVerificationKeys() {
//     /* This is used to delete keys that have expired periodically with a node cron job */
//     await prisma.verificationToken.deleteMany({
//         where: {
//             expiresAt: {
//                 lte: new Date(),
//             },
//         },
//     });
// }
