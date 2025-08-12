import type { Metadata } from 'next';
// import { Geist, Geist_Mono } from 'next/font/google';
import Link from 'next/link';
import './globals.css';
import UserLayout from './generic/auth/UserAuth';
import ToastSystem from './generic/overlays/toasts';
import ModalSystem from './generic/overlays/modals';

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
      <body className="font-lato font-regular bg-black m-0 p-0 min-h-screen ">
        {/*Navbar*/}
        <div className="p-5 m-0 text-4xl bg-gradient-to-r flex flex-row z-20">
          <div className="space-x-8">
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/workspace">Workspace</Link>
          </div>
          <div className="ml-auto flex flex-row gap-8">
            <UserLayout />
          </div>
        </div>
        <div className="z-0">{children}</div>
        <ToastSystem />
        <ModalSystem />
      </body>
    </html>
  );
}
