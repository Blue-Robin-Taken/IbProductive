import { useEffect, useState } from "react";

type AddModalEventDetails = {
  dialog: HTMLDialogElement;
};

export default function ModalSystem() {
  const [modals, setModals] = useState<HTMLDialogElement[]>([]);

  useEffect(() => {
    document.addEventListener("add-modal", (event) => {
      if (!("detail" in event)) {
        throw new Error('The "add-modal" event is not custom.');
      }

      const details: AddModalEventDetails = (event as CustomEvent).detail;
      setModals((prev) => [...prev, details.dialog]);
    });
  }, []);

  useEffect(() => {
    if (modals.length == 0) return;
    modals[0].showModal();
  }, [modals]);

  return <>{modals.length > 0 ? modals[0] : null}</>;
}

export function ErrorModal(props: {
  header: string;
  body: string;
  onClose: Function;
}) {
  return (
    <div
      className="modal-box"
      onKeyDown={(e) => {
        e.preventDefault();
        if (e.key == "enter") {
          props.onClose();
        }
      }}
    >
      <h1>{props.header}</h1>
      <p>{props.body}</p>
      <form className="modal-action" method="dialog">
        <button className="btn" onClick={props.onClose()}>
          Close
        </button>
      </form>
    </div>
  );
}

export function ConfirmModal(props: {
  body: string;
  onConfirm: Function;
  onCancel: Function;
  onClose: Function;
}) {
  return (
    <div className="modal-box">
      <h1>An action needs confirmation!</h1>
      <p>{props.body}</p>
      <form
        className="modal-action"
        method="dialog"
        onSubmit={() => props.onClose()}
      >
        <button className="btn" onClick={() => props.onConfirm()}>
          Confirm
        </button>
        <button className="btn" onClick={() => props.onCancel()}>
          Cancel
        </button>
      </form>
    </div>
  );
}
