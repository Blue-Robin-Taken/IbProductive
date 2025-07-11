'use client'; // Form validation should be done both client side and server side!!!
// Do not store anything sensitive here!!
import { FormEvent } from 'react';

function submitForm(e: FormEvent): void {
    e.preventDefault();

    const username = (e.target as HTMLFormElement).username.value;
    const password = (e.target as HTMLFormElement).passkey.value;
    console.log(username, password);
    fetch('/api/auth/signIn', {
        method: 'POST',
        body: JSON.stringify({
            username: username,
            password: password,
        }),
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

export default function SignIn() {
    return (
        <div className="flex justify-center ">
            <form className="grid grid-rows-3 gap-5" onSubmit={submitForm}>
                <label className="text-center" htmlFor="username">
                    Username:
                </label>
                <input
                    className="text-black"
                    type="text"
                    id="username"
                    name="username"
                />
                <label className="text-center" htmlFor="passkey">
                    Password:
                </label>
                <input
                    className="text-black"
                    type="text"
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
            {}
        </div>
    );
}
