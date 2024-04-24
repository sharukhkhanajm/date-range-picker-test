/**
 * Calculates the date range and weekends between two given dates.
 * @param startDate - The start date of the range.
 * @param endDate - The end date of the range.
 * @returns An object containing the date range and weekends.
 */
export const getDateRangeAndWeekends = ({ startDate, endDate }: {
    startDate: Date;
    endDate: Date;
}) => {
    const range: [Date, Date] = [startDate, endDate];
    const weekends: Date[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        weekends.push(new Date(currentDate));
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return { range, weekends };
}

/**
 * Returns the number of days in a given month and year.
 * 
 * @param month - The month (0-indexed) for which to determine the number of days.
 * @param year - The year for which to determine the number of days.
 * @returns The number of days in the specified month and year.
 */
export const daysInMonth = (month: number, year: number): number => {
    return new Date(year, month + 1, 0).getDate();
};
  