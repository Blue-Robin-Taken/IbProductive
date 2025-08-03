import * as jose from 'jose';
import prisma from '..';

interface jwtAuthToken {
  username: string;
}

export async function checkJWT(jwtString: string) {
  if (!process.env['JWT_SECRET']) {
    console.log('JWT NOT SET');
    return 'JWT NOT SET';
  }
  const JWT_SECRET: string = process.env['JWT_SECRET'];

  const { payload, protectedHeader } = await jose.jwtVerify<jwtAuthToken>(
    jwtString,
    new TextEncoder().encode(JWT_SECRET)
  );
  if (payload['username']) {
    // check database for user
    const dbResp = await (
      await fetch(
        new URL(
          `/api/auth/middlewareDBAccess?username=${payload['username']}`,
          process.env['WEBSITE_URL']
        )
      )
    ).text();

    if (dbResp == 'true') {
      return true;
    } else {
      return false;
    }
  }
}

export async function checkDatabaseIsAdmin(username: string) {
  const prismaFetch = await prisma.user.findUnique({
    where: { username: username },
  });

  if (!prismaFetch) {
    // Check username
    return false;
  }
  return prismaFetch.isAdmin;
}

export async function checkJWTIsAdmin(jwtString: string) {
  // This does NOT validate if the user exists in the database -> This is to save database resources
  // Technically the above is not required but as of writing there is no jwt key expiry
  if (!process.env['JWT_SECRET']) {
    console.log('JWT NOT SET');
    return 'JWT NOT SET';
  }
  const JWT_SECRET: string = process.env['JWT_SECRET'];

  const { payload, protectedHeader } = await jose.jwtVerify<jwtAuthToken>(
    jwtString,
    new TextEncoder().encode(JWT_SECRET)
  );

  return payload.isAdmin;
}

export async function getUsername(jwtString: string) {
  if (!process.env['JWT_SECRET']) {
    console.log('JWT NOT SET');
    return 'JWT NOT SET';
  }
  const JWT_SECRET: string = process.env['JWT_SECRET'];

  const { payload, protectedHeader } = await jose.jwtVerify<jwtAuthToken>(
    jwtString,
    new TextEncoder().encode(JWT_SECRET)
  );

  return payload.username;
}
