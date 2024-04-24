export interface IPreset {
    label: string;
    getDateRange: () => [Date, Date];
}
  
export interface IWeekdayDateRangePicker {
    years?: number[];
    showTodaySelection?: boolean;
    closeOnRangeSelection?: boolean;
    presets?: IPreset[];
    // startDate: Date | null;
    // endDate: Date | null;
    // selectedYear?: number;
    // selectedMonth?: number;

    onApply: (selectedRange: [Date, Date], weekends: Date[]) => void;
    onChange?: (selectedRange: [Date, Date], weekends: Date[]) => void;
    onClear?: () => void;
  }