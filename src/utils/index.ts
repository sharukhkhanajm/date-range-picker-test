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

export const daysInMonth = (month: number, year: number): number => {
    return new Date(year, month + 1, 0).getDate();
};
  