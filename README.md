This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

# Prisma

Prisma generation:

```
npx prisma generate
npx prisma db push
```

This is important for when the database schema changes. See [here](https://www.prisma.io/docs/getting-started/setup-prisma/add-to-existing-project/relational-databases/install-prisma-client-typescript-postgresql)

# Email API

https://resend.com/onboarding

# Environment Variables

File: `.env`
Variables:

```
DATABASE_URL="PRISMA-DATABASE-URL-HERE"
EMAIL_API_KEY="EMAIL-API-KEY-HERE"
WEBSITE_URL="WEBSITE-URL-HERE"
JWT_SECRET="JWT-SECRET-HERE"
```

## Production environment .env.production

File: `.env.production`

Variables:

```
DATABASE_URL="PRISMA-PRODUCTION-DATABASE-URL-HERE"
```
