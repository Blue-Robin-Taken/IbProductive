import { FormEvent, useRef } from "react";
import { createInfoModal } from "./modals";
import { createToastEvent, ToastAlertType } from "./toasts";

export function FeedbackForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLInputElement>(null);

  async function handleForm(e: FormEvent) {
    e.preventDefault(); // stops the reload
    e.stopPropagation(); // needed to stop the modal from closing, in case form is invalid
    let validForm: boolean = true;

    const email: string | undefined = emailRef.current?.value;
    const name: string | undefined = nameRef.current?.value;
    const desc: string | undefined = descRef.current?.value;

    if (email == "") {
      validForm = false;
    }
    if (desc == "") {
      validForm = false;
    }

    if (!validForm) return;

    const res = await fetch("/api/feedback", {
      method: "POST",
      body: JSON.stringify({
        email: email,
        name: name ? name : "",
        description: desc,
      }),
    });

    const resText = await res.text();
    if (res.status != 200 || resText != "") {
      createInfoModal(
        "Error " + res.status + ": " + resText,
        <p>There was an issue submitting the feedback.</p>
      );
    } else {
      createToastEvent(
        ToastAlertType.SUCCESS,
        "Your feedback has been submitted!"
      );
    }

    const closeEvent = new Event("close-modal");
    document.dispatchEvent(closeEvent);
  }

  return (
    <div
      className="modal-box max-h-screen max-w-screen"
      onKeyDown={(e) => {
        if (e.key == "enter") {
          e.preventDefault();
          formRef.current?.requestSubmit();
        }
      }}
    >
      <form className="flex flex-col" ref={formRef} onSubmit={handleForm}>
        <input
          ref={emailRef}
          placeholder="Email"
          className="input input-xl"
          type="email"
          required
        />
        <input
          ref={nameRef}
          className="input input-xl"
          type="text"
          placeholder="Title"
        />
        <input
          className="input input-xl"
          ref={descRef}
          type="text"
          placeholder="Please be as descriptive as possible."
          required
        />
      </form>
      <form className="modal-action" method="dialog">
        <button
          className="btn"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            formRef.current?.requestSubmit();
          }}
        >
          Submit
        </button>
        <button className="btn">Cancel</button>
      </form>
    </div>
  );
}

export default function createFeedbackForm() {
  const event = new CustomEvent("add-modal", {
    detail: {
      body: <FeedbackForm />,
    },
  });

  document.dispatchEvent(event);
}
