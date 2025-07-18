'use client';
/* Form Validation should be handled on the API level for 
security (but this is the client side part) */
import { FormEvent, useState } from 'react';
import * as EmailValidator from 'email-validator';
import { passwordStrength } from 'check-password-strength';

export default function SignIn() {
  const [formInvalid, setValidation] = useState('');

  async function submitForm(e: FormEvent) {
    // Must be in the SignIn function because of the form validation hook
    e.preventDefault();
    const username = (e.target as HTMLFormElement).username.value;
    const email = (e.target as HTMLFormElement).email.value;
    const password = (e.target as HTMLFormElement).passKey.value;
    const checkSamePass = (e.target as HTMLFormElement).checkPassSame.value;

    // validate before sending a request

    if (EmailValidator.validate(email) != true) {
      return setValidation('Email validation failed');
    } else if (checkSamePass != password) {
      return setValidation("Passwords aren't the same");
    } else if (passwordStrength(password).id < 2) {
      return setValidation(
        'Password is too weak. Minimum length of 8. Consider adding at least two of the following: Uppercase/lowercase, symbols, a number.'
      );
    } else {
      // No issues
      setValidation('');
    }

    const resp = await fetch('/api/auth/signUp', {
      method: 'POST',
      body: JSON.stringify({
        email: email,
        username: username,
        password: password,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    setValidation(await resp.text());
  }

  return (
    <div className="flex justify-center flex-col text-center align-middle items-center gap-12">
      <form
        className="flex flex-col justify-center max-w-56 gap-4 align-middle text-center"
        onSubmit={submitForm}
      >
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
        <input
          className="text-black"
          type="password" // This is for the browser to recognize that it should hide the autofill
          id="passKey"
          name="passKey"
        />

        <label className="text-center" htmlFor="checkPassSame">
          Confirm Password:
        </label>
        <input
          className=" text-black"
          type="password"
          id="checkPassSame"
          name="checkPassSame"
        />
        <input
          className="bg-lime-300 text-black"
          type="submit"
          value="submit"
        ></input>
      </form>

      {/* Handle response */}

      {formInvalid && <p className="font-bold text-red-600">{formInvalid}</p>}
    </div>
  );
}
