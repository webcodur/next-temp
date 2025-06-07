import React, { ReactNode, useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface FilterPanelProps {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  defaultOpen?: boolean;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  title,
  children,
  footer,
  defaultOpen = true,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-[#e0e0e0] rounded-xl mb-6">
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center justify-between cursor-pointer p-4 bg-[#e0e0e0] rounded-t-xl shadow-neu hover:neu-raised active:shadow-neu-inset "
      >
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-700" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-700" />
        )}
      </div>
      <div className={`overflow-hidden origin-top  ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-4">
          {children}
          {footer && <div className="flex gap-2 mt-4">{footer}</div>}
        </div>
      </div>
    </div>
  );
}; 