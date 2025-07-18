"use client";

import EditableDueDate from "../components/calendar/tasks/due/EditableDueDate";

export default function Test() {
  return (
    <div className="items-center">
      <EditableDueDate due={new Date()} />
    </div>
  );
}
