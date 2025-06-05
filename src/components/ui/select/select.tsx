import React, { ChangeEvent } from 'react';

export interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  value,
  onChange,
  options,
  className = '',
}) => {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="flex flex-col">
      {label && <label className="mb-1 text-sm text-gray-700">{label}</label>}
      <select
        value={value}
        onChange={handleChange}
        className={`w-full px-3 py-2 border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 transition ${className}`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}; 