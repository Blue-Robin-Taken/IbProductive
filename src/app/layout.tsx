import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'IbProductive',
  description: 'Become more productive!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head></head>
      <body className="font-lato font-regular bg-black m-0 p-0  h-[calc(100vh)]">
        {/*Navbar*/}
        <div className="p-5 m-0 text-4xl bg-gradient-to-r flex flex-row z-20">
          <div className="space-x-8">
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/workspace">Workspace</Link>
          </div>
          <div className="ml-auto flex flex-row gap-8">
            <Link href="/settings">Settings</Link>
            <div className="space-x-8 text-green-500">
              <Link className="" href="/sign_in">
                Sign In
              </Link>
              <Link href="/sign_up">Sign Up</Link>
            </div>
          </div>
        </div>
        <div className="z-0">{children}</div>
      </body>
    </html>
  );
}
