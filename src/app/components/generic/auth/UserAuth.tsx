'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
export default function UserLayout() {
  const [loggedIn, setLoggedIn] = useState(false);

  const location = usePathname();

  useEffect(() => {
    fetch('/api/auth/user?')
      .then((res) => {
        return res.text();
      })
      .then((text) => {
        if (text == 'token') {
          setLoggedIn(true);
        }
      });
    console.log('hi');
  }, [location]);

  return loggedIn ? (
    <Link href="/settings">Settings</Link>
  ) : (
    <div className="space-x-8 text-green-500">
      <Link className="" href="/sign_in">
        Sign In
      </Link>
      <Link href="/sign_up">Sign Up</Link>
    </div>
  );
}
