import holidays from "./holidays.json" assert { type: "json" };
import "./holiday.css";

/**
 * Gets all of the
 * @param day     the day that needs to be checked
 * @param month   the month that needs to be checked
 * @param year    the year that needs to be checked
 * @returns       HTML components
 */
export function getHolidays(day: number, month: number, year: number) {
  // if the year is not present then there are no holidays that year
  if (!(String(year) in holidays)) {
    return <div></div>;
  }
  const inYear = holidays[String(year) as keyof typeof holidays];

  // if the month is not present, then there are no holidays that month
  if (!(String(month) in inYear)) {
    return <div></div>;
  }
  const holidayArray = inYear[String(month) as keyof typeof inYear];

  // if the day is not present, then there are no holidays on that day.
  if (!(String(day) in holidayArray)) {
    return <div></div>;
  }
  const holiday: String[] =
    holidayArray[String(day) as keyof typeof holidayArray];

  // allows for multiple holidays on the same day.
  let arr = [];
  for (let i = 0; i < holiday.length; i++) {
    arr.push(HolidayLabel(holiday[i]));
  }
  return arr;
}

/**
 * The HTML of the holiday label.
 * @param holiday
 * @returns
 */
function HolidayLabel(holiday: String) {
  const cssArray = holidays["holiday_css"];
  const holidayCSS = cssArray[String(holiday) as keyof typeof cssArray];

  return (
    <div key={`${holiday}`} className="justify-left inline-block mb-1">
      <p className={`holiday-label ` + holidayCSS}>{String(holiday)}</p>
    </div>
  );
}
