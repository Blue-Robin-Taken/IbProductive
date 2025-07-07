import React, { ReactElement, useEffect, useState } from "react";

type TaskDueProps = {
  due: Date;
};

export default function TaskDue(props: TaskDueProps) {
  const [dueStr, setDueStr] = useState<ReactElement>();

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const ms: number = props.due.getTime() - now.getTime();

      setDueStr(getTimeLeft(new Date(ms)));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  });

  return <div>{dueStr}</div>;
}

function getTimeLeft(timeLeft: Date) {
  let years: number = timeLeft.getUTCFullYear() - 1970; // 1970 needs to be subtracted for some reason
  if (years < 0) {
    // negative years
    return <p>Overdue!</p>;
  } else if (years >= 1) {
    return <p>{"Due in: " + years + " years"}</p>;
  }

  let output: String = "Due in: ";
  let months: number = timeLeft.getUTCMonth();
  let days: number = timeLeft.getUTCDate() - 1;

  if (months > 0) {
    output += months + " months " + days + " days";

    return <p>{output}</p>;
  } else if (days > 3 && months === 0) {
    return <p>{days + " days"}</p>;
  }

  let hours: number = timeLeft.getUTCHours();

  if (days > 0) {
    output += days + " days ";
    if (hours !== 0) {
      output += hours + " hours";
    }
    return <p>{output}</p>;
  }

  if (hours > 5 && days === 0) {
    return <p>{hours + " hours"}</p>;
  }

  let minutes: number = timeLeft.getUTCMinutes();
  if (hours !== 0) {
    output += hours + " hours ";
  }
  output += minutes + " minutes";
  return <p>{output}</p>;
}
