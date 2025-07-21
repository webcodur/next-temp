import React, { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

interface SpinnerProps extends ComponentPropsWithoutRef<"div"> {
  size?: 'small' | 'medium' | 'large';
  color?: 'blue' | 'green' | 'red' | 'purple' | 'primary';
}

const sizeMap = {
  small: 'w-6 h-6',
  medium: 'w-8 h-8',
  large: 'w-12 h-12',
};

const colorMap = {
  blue: 'border-blue-500',
  green: 'border-green-500',
  red: 'border-red-500',
  purple: 'border-purple-500',
  primary: 'border-primary',
};

export const Spinner = React.memo(function Spinner({
  size = 'medium',
  color = 'blue',
  className,
  ...props
}: SpinnerProps) {
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-transparent",
        sizeMap[size],
        `${colorMap[color]} border-t-current`,
        className
      )}
      {...props}
    />
  );
});

Spinner.displayName = "Spinner"; 