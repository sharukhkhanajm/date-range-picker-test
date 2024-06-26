import { useState } from "react";
import "./App.css";
import { IPreset } from "./types";
import DateRangePicker from "./components/DateRangePicker";

function App() {
  const presets: IPreset[] = [
    {
      label: "Today",
      getDateRange: () => {
        const today = new Date();
        return [today, today];
      },
    },
    {
      label: "This Week",
      getDateRange: () => {
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 5);
        return [startOfWeek, endOfWeek];
      },
    },
    {
      label: "Last Week",
      getDateRange: () => {
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() - 7);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 5);
        return [startOfWeek, endOfWeek];
      },
    },
    {
      label: "This Month",
      getDateRange: () => {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        const endOfMonth = new Date(startOfMonth);
        endOfMonth.setMonth(endOfMonth.getMonth() + 1);
        endOfMonth.setDate(0);
        return [startOfMonth, endOfMonth];
      },
    },
    {
      label: "Last Month",
      getDateRange: () => {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setMonth(startOfMonth.getMonth() - 1);
        const endOfMonth = new Date(startOfMonth);
        endOfMonth.setMonth(endOfMonth.getMonth() + 1);
        endOfMonth.setDate(0);
        return [startOfMonth, endOfMonth];
      },
    },
  ];
  const [range, setRange] = useState<[Date, Date]>();
  const [weekends, setWeekends] = useState<Date[]>();

  /**
   * Handles the apply event of the date range picker.
   *
   * @param selectedRange - The selected date range.
   * @param weekends - The weekends within the selected range.
   */
  const handleDateRangeOnApply = (
    selectedRange: [Date, Date],
    weekends: Date[]
  ) => {
    setRange(selectedRange);
    setWeekends(weekends);
  };

  /**
   * Handles the change event of the date range picker.
   *
   * @param selectedRange - The selected date range.
   * @param weekends - The weekends within the selected date range.
   */
  const handleDateRangeOnChange = (
    selectedRange: [Date, Date],
    weekends: Date[]
  ) => {
    setRange(selectedRange);
    setWeekends(weekends);
  };

  return (
    <>
      <h2>Weekday Date Range Picker Example</h2>
      <DateRangePicker
        onApply={handleDateRangeOnApply}
        presets={presets}
        onChange={handleDateRangeOnChange}
        onClear={() => {
          setRange(undefined);
          setWeekends(undefined);
        }}
        selectedRange={range}
      />

      {range ? (
        <>
          <h3>Selected Date Range</h3>
          <p>
            {`${range[0].toLocaleDateString()} - ${range[1].toLocaleDateString()}`}
          </p>
        </>
      ) : null}

      {weekends ? (
        <>
          <h3>Weekends</h3>
          <p>
            {weekends &&
              weekends.map((date) => date.toLocaleDateString()).join(", ")}
          </p>
        </>
      ) : null}
    </>
  );
}

export default App;
