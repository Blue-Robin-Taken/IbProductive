export default function SignIn() {
    return (
        <div className="flex justify-center">
            <form className="grid grid-rows-3 gap-5">
                <label className="text-center" htmlFor="username">
                    Username:
                </label>
                <input type="text" id="username" name="username" />
                <label className="text-center" htmlFor="passkey">
                    Password:
                </label>
                <input type="text" id="passkey" name="passkey" />
                <input
                    className="bg-lime-300 text-black"
                    type="submit"
                    value="Submit"
                />
            </form>
        </div>
    );
}
