import holidays from "./holidays.json" assert { type: "json" };
import "./holiday.css";

export function getHolidays(day: number, month: number, year: number) {
  if (!(String(year) in holidays)) {
    return <div></div>;
  }
  const inYear = holidays[String(year) as keyof typeof holidays];

  if (!(String(month) in inYear)) {
    return <div></div>;
  }

  const holidayArray = inYear[String(month) as keyof typeof inYear];
  if (!(String(day) in holidayArray)) {
    return <div></div>;
  }
  const holiday: String[] =
    holidayArray[String(day) as keyof typeof holidayArray];

  let arr = [];
  for (let i = 0; i < holiday.length; i++) {
    arr.push(HolidayLabel(holiday[i]));
  }
  return arr;
}

function HolidayLabel(holiday: String) {
  const cssArray = holidays["holiday_css"];
  const holidayCSS = cssArray[String(holiday) as keyof typeof cssArray];

  return (
    <div key={`${holiday}`} className="justify-left inline-block mb-1">
      <p className={`holiday-label ` + holidayCSS}>{String(holiday)}</p>
    </div>
  );
}
