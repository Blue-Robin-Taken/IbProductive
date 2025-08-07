import React, { useEffect, useState } from "react";

type TaskDueProps = {
  due: Date;
};

type TaskDueState = {
  str: string;
  css: string;
};

export default function TaskDueCountdown(props: TaskDueProps) {
  const [state, setState] = useState<TaskDueState>({
    str: "Loading...",
    css: "",
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const ms: number = props.due.getTime() - now.getTime();

      setState(getTimeLeft(new Date(ms)));
      // console.log("updated state");
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  });

  return (
    <div className={state.css}>
      <p>{state.str}</p>
    </div>
  );
}

function getTimeLeft(timeLeft: Date): TaskDueState {
  let years: number = timeLeft.getUTCFullYear() - 1970; // 1970 needs to be subtracted for some reason
  if (years < 0) {
    // negative years
    return { str: "Overdue!", css: "" };
  } else if (years >= 1) {
    return { str: "Due in: " + years + " years", css: "" };
  }

  let output: string = "Due in: ";
  let months: number = timeLeft.getUTCMonth();
  let days: number = timeLeft.getUTCDate() - 1;

  if (months > 0) {
    output += months + " months " + days + " days";

    return { str: output, css: "" };
  } else if (days > 3 && months === 0) {
    return { str: "Due in: " + days + " days", css: "" };
  }

  let hours: number = timeLeft.getUTCHours();

  if (days > 0) {
    output += days + " days ";
    if (hours !== 0) {
      output += hours + " hours";
    }
    return { str: output, css: "" };
  }

  if (hours > 5 && days === 0) {
    return { str: "Due in: " + hours + " hours", css: "" };
  }

  let minutes: number = timeLeft.getUTCMinutes();
  if (hours !== 0) {
    output += hours + " hours ";
  }
  output += minutes + " minutes";
  return { str: output, css: "" };
}
