export type SideBarData = {
  name: String;
  description: String;
  day: number;
  month: number;
  year: number;
};

export default function SideBar(data: SideBarData) {
  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.description}</p>
    </div>
  );
}

/**
 * Countdown for how much time is left until a task is due.
 * @param data
 * @returns
 */
function countdown(data: SideBarData) {
  let date = new Date();
  let countdown = "";

  return <div></div>;
}
