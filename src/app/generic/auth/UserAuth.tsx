"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import createFeedbackForm from "../overlays/FeedbackForm";
export default function UserLayout() {
  const [loggedIn, setLoggedIn] = useState(false);

  const location = usePathname();

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
    console.log("hi");
  }, [location]);

  return loggedIn ? (
    <details className="dropdown space-x-8 text-green-500">
      <summary>Account</summary>
      <ul className="menu dropdown-content text-2xl">
        <li>
          <Link href="/settings">Settings</Link>
        </li>
        <li>
          <button onClick={() => createFeedbackForm()}>Feedback</button>
        </li>
        <li>
          <button
            onClick={async () => {
              const deleteRes = await fetch("/api/auth/signIn", {
                method: "DELETE",
              });
              const deleteResText = await deleteRes.text();

              if (deleteRes.status != 200 || deleteResText != "") {
              } else {
                window.location.reload();
              }
            }}
          >
            Sign Out
          </button>
        </li>
      </ul>
    </details>
  ) : (
    <div className="space-x-8 text-green-500">
      <Link className="" href="/sign_in">
        Sign In
      </Link>
      <Link href="/sign_up">Sign Up</Link>
    </div>
  );
}
