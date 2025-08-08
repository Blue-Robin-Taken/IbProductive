import Calendar from '../components/calendar/page';
import Pomodoro from '../components/pomodoro/page';
export default function Workspace() {
  return (
    <div className="p-8">
      <Pomodoro />
      <div className="p-8">
        <Calendar />
      </div>
    </div>
  );
}
