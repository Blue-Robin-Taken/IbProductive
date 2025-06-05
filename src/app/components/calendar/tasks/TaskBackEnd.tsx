import React from "react";
import { SideBarData } from "../sideBar/page";

type TaskState = {
  taskData: SideBarData;
  opened: boolean;
};

class TaskLabel extends React.Component<{}, TaskState> {
  constructor(props: {}, taskData: SideBarData) {
    super(props);
    this.state = {
      taskData: taskData,
      opened: false,
    };
  }

  render() {
    return (
      <div>
        <button>{this.state.taskData.name}</button>
      </div>
    );
  }

  sideBar() {}
}

/**
 * Gets the tasks in a given day.
 * @param day
 * @param month
 * @param year
 * @returns
 */
export function getTasks(day: number, month: number, year: number) {
  // get tasks that match the date, number, and year, as well as the classes the user has
  return <div></div>;
}
