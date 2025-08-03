export function ErrorModal(props: {
  header: string;
  body: string;
  onClose: Function;
}) {
  const close = () => {
    props.onClose();
  };

  return (
    <div
      onKeyDown={(e) => {
        e.preventDefault();
        if (e.key == "enter" || e.key == "escape") {
          close();
        }
      }}
    >
      <h1>{props.header}</h1>
      <p>{props.body}</p>
      <button onClick={close}>Close</button>
    </div>
  );
}

export function ConfirmModal(props: {
  body: string;
  onConfirm: Function;
  onCancel: Function;
  onClose: Function;
}) {
  const confirm = () => {
    props.onConfirm();
    props.onClose();
  };

  const deny = () => {
    props.onCancel();
    props.onClose();
  };

  return (
    <div
      onKeyDown={(e) => {
        e.preventDefault();
        if (e.key == "enter") {
          confirm();
        } else if (e.key == "escape") {
          deny();
        }
      }}
    >
      <h1>An action needs confirmation</h1>
      <p>{props.body}</p>
      <button onClick={confirm}>Confirm</button>
      <button onClick={deny}>Cancel</button>
    </div>
  );
}
