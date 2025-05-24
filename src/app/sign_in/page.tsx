export default function SignIn() {
    return (
        <div className="inline-flex border-indigo-500">
            <form>
                <label htmlFor="fname">First name:</label>
                <input type="text" id="fname" name="fname" />
                <label htmlFor="lname">Last name:</label>
                <input type="text" id="lname" name="lname" />
                <button>Sign in</button>
            </form>
        </div>
    );
}
