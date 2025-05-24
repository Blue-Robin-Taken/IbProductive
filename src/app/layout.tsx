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
            <body className="bg-slate-900">
                {/*Navbar*/}
                <div className="p-5 m-0 space-x-10 text-4xl bg-gray-800">
                    <Link href="/">Home</Link>
                    <Link href="/about">About</Link>
                </div>

                {children}
            </body>
        </html>
    );
}
