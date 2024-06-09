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
