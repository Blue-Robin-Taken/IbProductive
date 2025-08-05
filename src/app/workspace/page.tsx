import Calendar from "../components/calendar/page";
import Pomodoro from "../components/pomodoro/page";
export default function Workspace() {
  return (
    <div>
      <Pomodoro />
      <Calendar />
    </div>
  );
}
