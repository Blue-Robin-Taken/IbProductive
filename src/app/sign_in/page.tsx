'use client'; // Form validation should be done both client side and server side!!!
// Do not store anything sensitive here!!
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignIn() {
  const router = useRouter();
  const [formValid, setFormValid] = useState('');

  async function submitForm(e: FormEvent) {
    e.preventDefault();

    const username = (e.target as HTMLFormElement).username.value;
    const password = (e.target as HTMLFormElement).passkey.value;

    const req = await fetch('/api/auth/signIn', {
      method: 'POST',
      body: JSON.stringify({
        username: username,
        password: password,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const requestText = await req.text();

    if (requestText == 'login happy') {
      router.push('/workspace');
    }

    setFormValid(requestText);
  }

  return (
    <div className="flex justify-center ">
      <form className="grid grid-rows-3 gap-5" onSubmit={submitForm}>
        <label className="text-center text-white" htmlFor="username">
          Username:
        </label>
        <input className="" type="text" id="username" name="username" />
        <label className="text-center" htmlFor="passkey">
          Password:
        </label>
        <input
          className="text-white"
          type="password"
          id="passkey"
          name="passkey"
        />
        <input
          className="bg-lime-300 text-black"
          type="submit"
          value="Submit"
        />
      </form>

      {/* Handle response */}
      {formValid && <p>{formValid}</p>}
      {/* if true, then do other end of ampersand */}
    </div>
  );
}
