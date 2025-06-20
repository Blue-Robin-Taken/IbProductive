"use client";
/* Form Validation should be handled on the API level for 
security (but this is the client side part) */
import { FormEvent } from "react";

function submitForm(e: FormEvent): void {
  e.preventDefault();
  const username = (e.target as HTMLFormElement).username.value;
  const email = (e.target as HTMLFormElement).email.value;
  const password = (e.target as HTMLFormElement).passKey.value;
  console.log(email, username, password);
  fetch("/api/auth/signUp", {
    method: "POST",
    body: JSON.stringify({
      email: email,
      username: username,
      password: password,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export default function SignIn() {
  return (
    <div className="flex justify-center">
      <form className="grid grid-rows-3 gap-5" onSubmit={submitForm}>
        <label className="text-center" htmlFor="email">
          Email:
        </label>
        <input className="text-black" type="text" id="email" name="email" />
        <label className="text-center" htmlFor="username">
          Username:
        </label>
        <input
          className="text-black"
          type="text"
          id="username"
          name="username"
        />
        <label className="text-center" htmlFor="passKey">
          Password:
        </label>
        <input className="text-black" type="text" id="passKey" name="passKey" />
        <input
          className="bg-lime-300 text-black"
          type="submit"
          value="Submit"
        />
      </form>
    </div>
  );
}
