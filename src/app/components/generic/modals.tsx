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
