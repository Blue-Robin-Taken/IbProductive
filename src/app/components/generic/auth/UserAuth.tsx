"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function UserLayout() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    fetch("/api/auth/user?")
      .then((res) => {
        return res.text();
      })
      .then((text) => {
        if (text == "token") {
          setLoggedIn(true);
        }
      });
  }, []);

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
