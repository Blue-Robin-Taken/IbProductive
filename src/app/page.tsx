import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
    return (
        <div className="">
            <div className="flex flex-col justify-center justify-items-center text-center">
                <h1 className="text-7xl m-2">Ib Productive</h1>
                <p className="italic text-2xl m-1">
                    Do you need to be productive?
                </p>
                <p className="font-semibold text-xl">
                    We have the solution for you.
                </p>
            </div>
            <div className="flex flex-grow text-center justify-center m-10 align-middle">
                <Link
                    className="bg-slate-950 p-5 rounded-lg text-xl justify-center text-center align-middle"
                    href="/workspace"
                >
                    Get Started Now
                </Link>
            </div>
        </div>
    );
}
