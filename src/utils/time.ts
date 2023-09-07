import { Moment } from "moment";

export enum FormatTime {
  netflix = "netflix", // X h X min
  intern = "intern", // HH:mm
}

export const toHoursAndMinutes = (totalMinutes: number, format: FormatTime) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return format === FormatTime.intern
    ? `${padToTwoDigits(hours)}:${padToTwoDigits(minutes)}`
    : `${hours} h ${minutes} min`;
};

export const padToTwoDigits = (num: number) => num.toString().padStart(2, "0");

export const momentToMinutes = (moment: Moment) =>
  moment.hours() * 60 + moment.minutes();
