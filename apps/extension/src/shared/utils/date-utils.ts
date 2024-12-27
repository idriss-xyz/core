import { useEffect, useState } from 'react';

/**
 * Returns the difference in days between the given date and today.
 *
 * The difference will be negative if the given date is in the past, and positive if the given date is in the future.
 */
export const getDifferenceInDays = (dateInMs: number) => {
  const currentDate = new Date();

  // Set the time of the current date to 00:00:00 for accurate day difference calculation
  currentDate.setHours(0, 0, 0, 0);

  // Create a new date object for the target date, also set to 00:00:00
  const targetDate = new Date(dateInMs);
  targetDate.setHours(0, 0, 0, 0);

  // Calculate the difference in milliseconds
  const differenceInMs = targetDate.getTime() - currentDate.getTime();

  // Convert the difference from milliseconds to days
  const differenceInDays = differenceInMs / (1000 * 60 * 60 * 24);

  return Math.round(differenceInDays);
};

/**
 * Returns the difference between the given ISO timestamp and the current time
 * in a compact format:
 * - For days: "1 day 20 hrs 30 mins"
 * - For hours: "20 hrs 30 mins"
 * - For minutes: "30 mins"
 * - For seconds (only if under 1 min): "30 secs"
 */
export const getFormattedTimeDifference = (isoTimestamp: string) => {
  const currentDate = new Date();
  const targetDate = new Date(isoTimestamp);
  const differenceInMs = targetDate.getTime() - currentDate.getTime();

  const totalSeconds = Math.abs(Math.floor(differenceInMs / 1000));
  const days = Math.floor(totalSeconds / (60 * 60 * 24));
  const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = totalSeconds % 60;

  let result = '';

  if (days > 0) {
    result += `${days} ${days > 1 ? 'days' : 'day'} `;
  }

  if (hours > 0 || days > 0) {
    result += `${hours} hrs `;
  }

  if (minutes > 0 || days > 0) {
    result += `${minutes} ${minutes > 1 ? 'mins' : 'min'}`;
  }

  if (minutes < 1 && hours < 1 && days < 1) {
    result += `${seconds} ${seconds > 1 ? 'secs' : 'sec'}`;
  }

  return result.trim();
};

export const TimeDifferenceCounter = ({
  timestamp,
  text,
}: {
  timestamp: string;
  text: string;
}) => {
  const [timeDifference, setTimeDifference] = useState(
    getFormattedTimeDifference(timestamp),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeDifference(getFormattedTimeDifference(timestamp));
    }, 1000);

    return () => {
      return clearInterval(interval);
    };
  }, [timestamp]);

  return text ? `${timeDifference} ${text}` : timeDifference;
};

/**
 * Returns the label for the end date based on the difference in days.
 *
 * For the positive differenceInDays value, the label will be "Ends in X days", for the negative label will be "Ended X days ago", and for 0 the label will be "Ends today".
 * @param differenceInDays
 * @returns
 */
export const getEndsInLabel = (differenceInDays: number) => {
  if (differenceInDays === -1) {
    return 'Ended yesterday';
  }

  if (differenceInDays === 0) {
    return 'Ends today';
  }

  if (differenceInDays === 1) {
    return 'Ends in 1 day';
  }

  if (differenceInDays < -1) {
    return `Ended ${Math.abs(differenceInDays)} days ago`;
  }

  return `Ends in ${differenceInDays} days`;
};
