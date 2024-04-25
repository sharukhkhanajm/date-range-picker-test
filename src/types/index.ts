export interface IPreset {
    label: string;
    getDateRange: () => [Date, Date];
}
  
export interface IDateRangePicker {
    years?: number[];
    showTodaySelection?: boolean;
    closeOnRangeSelection?: boolean;
    presets?: IPreset[];
    selectedRange?: [Date, Date];

    onApply: (selectedRange: [Date, Date], weekends: Date[]) => void;
    onChange?: (selectedRange: [Date, Date], weekends: Date[]) => void;
    onClear?: () => void;
  }