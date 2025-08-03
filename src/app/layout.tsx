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
      <body className="bg-black font-lato font-light">
        {/*Navbar*/}
        <div className="p-5 m-0 text-4xl bg-gradient-to-r from-zinc-900 to-zinc-950 flex flex-row font-semibold">
          <div className="space-x-8">
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/workspace">Workspace</Link>
          </div>
          <div className="ml-auto flex flex-row space-x-8">
            <Link href="/settings">Settings</Link>
            <div className="space-x-8 text-green-500">
              <Link className="" href="/sign_in">
                Sign In
              </Link>
              <Link href="/sign_up">Sign Up</Link>
            </div>
          </div>
        </div>
        <div className="m-10">{children}</div>
      </body>
    </html>
  );
}
