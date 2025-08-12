// import Image from "next/image";
import Link from 'next/link';
export default function Home() {
  return (
    <div className="flex fixed inset-0  h-screen w-screen pointer-events-none">
      <div className="flex flex-col m-auto pointer-events-auto">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-9xl m-2 font-extrabold">IB Productive</h1>
          <div className="p-8">
            <p className="italic text-3xl m-4">Do you need to be productive?</p>
            <p className=" text-xl">We have the solution for you.</p>
          </div>
        </div>
        <div className="flex flex-grow text-center justify-center m-10 align-middle">
          <Link
            className="btn btn-primary p-8 text-4xl justify-center text-center align-middle"
            href="/workspace"
          >
            Get Started Now
          </Link>
        </div>
      </div>
    </div>
  );
}
