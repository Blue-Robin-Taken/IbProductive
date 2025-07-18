import { useState } from "react";
import TaskDueCountdown from "./TaskDueDate";
import DateInput from "@/app/components/generic/time/DateInput";

type EditableDueProps = {
  due: Date;
};

export default function EditableDueDate(props: EditableDueProps) {
  const [due, setDue] = useState<Date>(props.due);
  const [isOpen, setOpen] = useState<boolean>(false);

  const toggleOpen = () => {
    setOpen((prev) => !prev);
  };

  return (
    <div>
      <button title="Change due date" onClick={toggleOpen}>
        <TaskDueCountdown due={due} />
      </button>
      {!isOpen ? null : (
        <DateInput
          outputFunction={(date: Date) => {
            setDue(date);
          }}
        />
      )}
    </div>
  );
}
