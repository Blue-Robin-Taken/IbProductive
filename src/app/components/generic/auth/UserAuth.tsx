"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function UserLayout() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [rerender, setRerender] = useState(0);

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
  }, [rerender]);

  return loggedIn ? (
    <div className="space-x-8 text-green-500">
      <Link href="/settings">Settings</Link>
      <button
        onClick={async () => {
          let deleteRes = await fetch("/api/auth/signIn", { method: "DELETE" });
          let deleteResText = await deleteRes.text();

          if (deleteRes.status != 200 || deleteResText != "") {
          } else {
            window.location.reload();
          }
        }}
      >
        Sign Out
      </button>
    </div>
  ) : (
    <div className="space-x-8 text-green-500">
      <Link className="" href="/sign_in">
        Sign In
      </Link>
      <Link href="/sign_up">Sign Up</Link>
    </div>
  );
}
