'use client';

import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale';

// #region DateRangePicker 컴포넌트
export type DateRangePickerProps = {
  startDate: Date | null;
  endDate: Date | null;
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
  className?: string;
};

export function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  className = '',
}: DateRangePickerProps) {
  // Date Picker 콜백 핸들러
  const handleStartDateChange = (date: Date | null) => {
    onStartDateChange(date);
  };

  const handleEndDateChange = (date: Date | null) => {
    onEndDateChange(date);
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <DatePicker
        selected={startDate ?? undefined}
        onChange={handleStartDateChange}
        selectsStart
        startDate={startDate ?? undefined}
        endDate={endDate ?? undefined}
        dateFormat="yyyy-MM-dd"
        placeholderText="시작 날짜"
        locale={ko}
        className="border px-2 py-1 rounded w-36"
      />
      <span className="text-sm">~</span>
      <DatePicker
        selected={endDate ?? undefined}
        onChange={handleEndDateChange}
        selectsEnd
        startDate={startDate ?? undefined}
        endDate={endDate ?? undefined}
        minDate={startDate ?? undefined}
        dateFormat="yyyy-MM-dd"
        placeholderText="마지막 날짜"
        locale={ko}
        className="border px-2 py-1 rounded w-36"
      />
    </div>
  );
}
// #endregion

// #region 단일 DatePicker 컴포넌트
export type SingleDatePickerProps = {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  dateFormat?: string;
  placeholderText?: string;
  minDate?: Date | null;
  maxDate?: Date | null;
  className?: string;
  showTimeSelect?: boolean;
  timeFormat?: string;
  timeIntervals?: number;
};

export function SingleDatePicker({
  selected,
  onChange,
  dateFormat = "yyyy-MM-dd",
  placeholderText = "날짜 선택",
  minDate,
  maxDate,
  className = "",
  showTimeSelect = false,
  timeFormat = "HH:mm",
  timeIntervals = 30,
}: SingleDatePickerProps) {
  // Date Picker 콜백 핸들러
  const handleDateChange = (date: Date | null) => {
    onChange(date);
  };

  // 입력 포맷 결정: 기본 날짜 포맷인 "yyyy-MM-dd"만 사용하는 경우에만 시간 포함
  const inputDateFormat = showTimeSelect && dateFormat === "yyyy-MM-dd"
    ? `${dateFormat} ${timeFormat}`
    : dateFormat;

  return (
    <DatePicker
      selected={selected ?? undefined}
      onChange={handleDateChange}
      dateFormat={inputDateFormat}
      placeholderText={placeholderText}
      minDate={minDate ?? undefined}
      maxDate={maxDate ?? undefined}
      locale={ko}
      showTimeSelect={showTimeSelect}
      timeFormat={timeFormat}
      timeIntervals={timeIntervals}
      className={`border px-2 py-1 rounded ${className}`}
    />
  );
}
// #endregion 