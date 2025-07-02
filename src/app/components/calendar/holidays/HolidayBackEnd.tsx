import holidays from "./holidays.json" assert { type: "json" };
import "./holiday.css";
import "../calendar.css";

/**
 * Gets all of the
 * @param date     the day that needs to be checked
 * @param month   the month that needs to be checked
 * @param year    the year that needs to be checked
 * @returns       HTML components
 */
export function getHolidays(dateItem: Date) {
  let year: number = dateItem.getFullYear();
  let month: number = dateItem.getMonth();
  let date: number = dateItem.getDate();

  // if the year is not present then there are no holidays that year
  if (!(String(year) in holidays)) {
    return null;
  }
  const inYear = holidays[String(year) as keyof typeof holidays];

  // if the month is not present, then there are no holidays that month
  if (!(String(month) in inYear)) {
    return null;
  }
  const holidayArray = inYear[String(month) as keyof typeof inYear];

  // if the day is not present, then there are no holidays on that day.
  if (!(String(date) in holidayArray)) {
    return null;
  }
  const holiday: String[] =
    holidayArray[String(date) as keyof typeof holidayArray];

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
    <div key={`${holiday}`} className="calendar-item">
      <p className={`holiday-label ` + holidayCSS}>{String(holiday)}</p>
    </div>
  );
}
