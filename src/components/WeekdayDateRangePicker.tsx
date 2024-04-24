import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IWeekdayDateRangePicker } from "../types";
import { daysInMonth, getDateRangeAndWeekends } from "../utils";

const WeekdayDateRangePicker: React.FC<IWeekdayDateRangePicker> = ({
  years = new Array(10)
    .fill(0)
    .map((_, index) => new Date().getFullYear() + index),
  showTodaySelection = true,
  closeOnRangeSelection = true,
  presets = [],
  selectedRange,

  onApply,
  onChange,
  onClear: onClearFn,
}) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [displayedMonth, setDisplayedMonth] = useState<number>(
    new Date().getMonth()
  );
  const [displayedYear, setDisplayedYear] = useState<number>(
    new Date().getFullYear()
  );
  const popoverRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen && selectedRange) {
      const startMonth = selectedRange[0].getMonth();
      const startYear = selectedRange[1].getFullYear();
      setDisplayedMonth(startMonth);
      setDisplayedYear(startYear);
    }
  }, [isOpen, selectedRange]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (onChange && startDate && endDate) {
      const { range, weekends } = getDateRangeAndWeekends({
        startDate,
        endDate,
      });
      onChange(range, weekends);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate]);

  /**
   * Checks if the given year is out of bounds.
   * @param year - The year to check.
   * @returns `true` if the year is out of bounds, `false` otherwise.
   */
  const isYearOutOfBounds = (year: number) =>
    year < years[0] || year > years[years.length - 1];

  /**
   * Handles the change of month in the date range picker.
   * @param type - The type of change, either "prev" or "next".
   */
  const handleChangeMonth = (type: "prev" | "next") => {
    if (type === "prev") {
      if (displayedMonth === 0) {
        setDisplayedMonth(11);
        const year = displayedYear - 1;

        if (!isYearOutOfBounds(year)) {
          setDisplayedYear(year);
        } else {
          setDisplayedYear(years[years.length - 1]);
        }
      } else {
        setDisplayedMonth(displayedMonth - 1);
      }
    } else if (type === "next") {
      if (displayedMonth === 11) {
        setDisplayedMonth(0);
        const year = displayedYear + 1;

        if (!isYearOutOfBounds(year)) {
          setDisplayedYear(year);
        } else {
          setDisplayedYear(years[0]);
        }
      } else {
        setDisplayedMonth(displayedMonth + 1);
      }
    }
  };

  const handleChangeYear = (newYear: number) => {
    setDisplayedYear(newYear);
  };

  const handleDateSelect = useCallback(
    (selectedDate: Date) => {
      const dayOfWeek = selectedDate.getDay();

      if (dayOfWeek === 0 || dayOfWeek === 6) {
        return; // Prevent selection of weekends if allowWeekends is false
      }

      if (!startDate) {
        // Set the start date if it's not already set
        setStartDate(selectedDate);
      } else if (!endDate && selectedDate > startDate) {
        // Set the end date only if end date is not set and selected date is after start date
        setEndDate(selectedDate);
        if (closeOnRangeSelection) {
          setIsOpen(false); // Close the popover on range completion
        }
      } else {
        // Reset the start date and end date if a new start date is selected
        setStartDate(selectedDate);
        setEndDate(null);
      }
    },
    [closeOnRangeSelection, endDate, startDate]
  );

  const handleDateHover = (hoverDate: Date | null) => {
    setHoveredDate(hoverDate);
  };

  /**
   * Handles the apply action for the date range picker.
   * If both startDate and endDate are selected, it calculates the date range and weekends,
   * and calls the onApply callback with the range and weekends as arguments.
   * Finally, it closes the date range picker.
   */
  const handleApply = () => {
    if (startDate && endDate) {
      const { range, weekends } = getDateRangeAndWeekends({
        startDate,
        endDate,
      });
      onApply(range, weekends);
      setIsOpen(false);
    }
  };

  /**
   * Clears the selected start date, end date, and hovered date.
   * Calls the `onClearFn` callback if provided.
   * Closes the date range picker.
   */
  const handleClear = () => {
    setStartDate(null);
    setEndDate(null);
    setHoveredDate(null);
    onClearFn?.();
    setIsOpen(false);
  };

  const handleOpenPopover = () => {
    setIsOpen(true);
  };

  /**
   * Renders the calendar view for the specified month and year.
   * Days are rendered within weeks, grouped by rows.
   * Each day cell includes interactive behavior for selection and hover effects.
   */
  const renderCalendar = useMemo(() => {
    // Determine the number of days in the displayed month
    const daysCount = daysInMonth(displayedMonth, displayedYear);
    // Initialize the start date of the month
    const monthStart = new Date(displayedYear, displayedMonth, 1);
    // Determine the day of the week for the first day of the month
    const startDayOfWeek = monthStart.getDay();
    // Array to store JSX elements representing weeks of days
    const weeks: JSX.Element[] = [];
    // Array to store the current week's day elements
    let currentWeek: JSX.Element[] = [];
    // Render empty day placeholders for days before the start of the month
    for (let i = 0; i < startDayOfWeek; i++) {
      currentWeek.push(
        <div key={`empty-${i}`} className="calendar-day empty"></div>
      );
    }

    // Iterate through each day of the month
    for (let day = 1; day <= daysCount; day++) {
      // Create a Date object representing the current day in the displayed month
      const currentDate = new Date(displayedYear, displayedMonth, day);
      // Ensure consistent time for comparison (ignore time component)
      startDate?.setHours(0, 0, 0, 0);
      endDate?.setHours(0, 0, 0, 0);
      // Determine if the current day is a weekend (Saturday or Sunday)
      const isWeekend =
        currentDate.getDay() === 0 || currentDate.getDay() === 6;
      // Determine if the current day is selected within the date range
      const isSelected =
        startDate &&
        endDate &&
        currentDate >= startDate &&
        currentDate <= endDate;
      // Determine if the current day is hovered (during date range selection)
      const isHovered =
        startDate && endDate
          ? false
          : hoveredDate &&
            startDate &&
            currentDate >= startDate &&
            currentDate <= hoveredDate;

      // Determine if the current day is today's date
      const isToday = currentDate.toDateString() === new Date().toDateString();

      // Define CSS classes based on date properties for styling
      const dayClassName = `calendar-day ${isWeekend ? `weekend` : ""} ${
        isSelected ? "selected" : ""
      } ${isHovered ? "hovered" : ""} ${
        isToday ? `today ${showTodaySelection ? "show" : ""}` : ""
      }
          `;

      // Create a day element with click and hover event handlers
      currentWeek.push(
        <div
          key={day}
          className={dayClassName}
          onClick={() => handleDateSelect(currentDate)}
          onMouseEnter={() => handleDateHover(currentDate)}
          onMouseLeave={() => handleDateHover(null)}
        >
          {day}
        </div>
      );

      // Check if the current week is complete (7 days) and push to weeks array
      if (currentWeek.length === 7) {
        weeks.push(
          <div key={weeks.length} className="calendar-week">
            {currentWeek}
          </div>
        );
        // Reset current week array for the next week
        currentWeek = [];
      }
    }

    // Push any remaining days in the current week to the weeks array
    if (currentWeek.length > 0) {
      weeks.push(
        <div key={weeks.length} className="calendar-week">
          {currentWeek}
        </div>
      );
    }

    // Return the calendar view composed of weeks of days
    return <div className="calendar">{weeks}</div>;
  }, [
    displayedMonth,
    displayedYear,
    endDate,
    handleDateSelect,
    hoveredDate,
    showTodaySelection,
    startDate,
  ]);

  let dateMessage = "Select Date Range";

  if (startDate && endDate) {
    dateMessage = `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
  } else if (startDate) {
    dateMessage = `${startDate.toLocaleDateString()} - Select End Date`;
  }

  const monthOptions = Array.from({ length: 12 }, (_, index) => {
    const monthDate = new Date(displayedYear, index, 1);
    return {
      value: index,
      label: monthDate.toLocaleDateString("en-US", { month: "long" }),
    };
  });

  return (
    <div className="weekday-date-range-picker">
      <button className="primary" onClick={handleOpenPopover}>
        {dateMessage}
      </button>
      {isOpen && (
        <div className="popover" ref={popoverRef}>
          <div className="header">
            <button
              className="primary"
              onClick={() => handleChangeMonth("prev")}
            >
              {"<"}
            </button>

            <button
              className="primary"
              onClick={() => handleChangeMonth("next")}
            >
              {">"}
            </button>

            <span>
              <div className="month-selector">
                <select
                  value={displayedMonth}
                  onChange={(e) => setDisplayedMonth(parseInt(e.target.value))}
                >
                  {monthOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </span>
            <select
              value={displayedYear}
              onChange={(e) => handleChangeYear(parseInt(e.target.value))}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          {renderCalendar}
          <footer className="footer">
            <div className="actions">
              <button
                className="primary"
                onClick={handleApply}
                disabled={!startDate || !endDate}
              >
                Apply
              </button>
              <button className="outline" onClick={handleClear}>
                Clear
              </button>
            </div>

            <div className="presets">
              {presets.map((option, index) => (
                <button
                  key={index}
                  onClick={() => {
                    const [start, end] = option.getDateRange();
                    console.log({ start, end });

                    setStartDate(start);
                    setEndDate(end);
                    handleApply();
                  }}
                  className="ghost"
                  style={{
                    padding: 0,
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </footer>
        </div>
      )}
    </div>
  );
};

export default WeekdayDateRangePicker;
