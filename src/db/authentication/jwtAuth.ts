import * as jose from 'jose';

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
  console.log(payload, protectedHeader);
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
