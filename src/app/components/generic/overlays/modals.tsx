"use client";

import { ReactElement, useEffect, useRef, useState } from "react";

type AddModalEventDetails = {
  body: ReactElement;
};

export default function ModalSystem() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [modals, setModals] = useState<ReactElement[]>([]);
  const [modalUp, setModalUp] = useState<boolean>(false);

  useEffect(() => {
    document.addEventListener("add-modal", (event) => {
      if (!("detail" in event)) {
        throw new Error('The "add-modal" event is not custom.');
      }

      const details: AddModalEventDetails = (event as CustomEvent).detail;
      setModals((prev) => [...prev, details.body]);
    });
  }, []);

  useEffect(() => {
    console.log(modals);
    if (modalUp || modals.length == 0) return; // don't show modal if up or if there are none queued
    dialogRef.current?.showModal();
    setModalUp(true);
  }, [modals]);

  // remove the most recent modal if the modal is removed
  useEffect(() => {
    if (modalUp || modals.length == 0) return;

    setModals((prev) => prev.slice(1));
  }, [modalUp]);

  function closeModal() {
    // Promise is used to wait for the modal to disappear before the next one renders
    new Promise((resolve) => setTimeout(() => setModalUp(false), 500));
  }

  return (
    <dialog
      className="modal"
      ref={dialogRef}
      onCancel={closeModal}
      onSubmit={closeModal}
    >
      {modals.length == 0 ? null : modals[0]}
    </dialog>
  );
}

export function createInfoModal(
  header: string,
  body: ReactElement,
  onKeyDown?: Function,
  onClose?: Function
) {
  const event = new CustomEvent("add-modal", {
    detail: {
      body: (
        <div
          className="modal-box"
          onKeyDown={(e) => (onKeyDown ? onKeyDown(e) : null)}
        >
          <h1>{header}</h1>
          {body}
          <form
            className="modal-action"
            method="dialog"
            onSubmit={() => (onClose ? onClose() : null)}
          >
            <button className="btn">Close</button>
          </form>
        </div>
      ),
    },
  });

  document.dispatchEvent(event);
}

export function createConfirmModal(
  body: ReactElement,
  onConfirm: Function,
  onCancel?: Function,
  onClose?: Function
) {
  const event = new CustomEvent("add-modal", {
    detail: {
      body: (
        <div className="modal-box">
          <h1>An action needs confirmation!</h1>
          {body}
          <form
            className="modal-action"
            method="dialog"
            onSubmit={() => (onClose ? onClose() : null)}
          >
            <button className="btn" onClick={() => onConfirm()}>
              Confirm
            </button>
            <button
              className="btn"
              onClick={() => (onCancel ? onCancel() : null)}
            >
              Cancel
            </button>
          </form>
        </div>
      ),
    },
  });

  document.dispatchEvent(event);
}
