import React from "react";

export type SideBarData = {
  name: String;
  description: String;
  date: number;
  month: number;
  year: number;
};

type SideBarState = {
  data: SideBarData;
};

class SideBar extends React.Component<{}, SideBarState> {
  constructor(props: {}, data: SideBarData) {
    super(props);
    this.state = {
      data: data,
    };
  }

  render() {
    return (
      <div>
        <h1>{this.state.data.name}</h1>
        <p>{this.state.data.description}</p>
      </div>
    );
  }
}

function countdown(dateDue: number, monthDue: number, yearDue: number) {
  let date: Date = new Date();
  let dateCurrent: number = date.getDate();
  let monthCurrent: number = date.getMonth();
  let yearCurrent: number = date.getFullYear();
  let text: String = "";

  // most likely is scuffed, fix later
  let yearDiff: number = yearDue - yearCurrent;
  let monthDiff: number = monthDue - monthCurrent;
  let dateDiff: number = dateDue - dateCurrent;

  return <div></div>;
}
