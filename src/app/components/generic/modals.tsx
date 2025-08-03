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
