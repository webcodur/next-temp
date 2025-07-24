import React, { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

interface DotsProps extends ComponentPropsWithoutRef<"div"> {
  size?: 'small' | 'medium' | 'large';
  color?: 'blue' | 'green' | 'red' | 'purple' | 'primary' | 'secondary';
}

const sizeMap = {
  small: 'w-2 h-2',
  medium: 'w-3 h-3',
  large: 'w-4 h-4',
};

const colorMap = {
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  red: 'bg-red-500',
  purple: 'bg-purple-500',
  primary: 'bg-primary',
  secondary: 'bg-secondary',
};

export const Dots = React.memo(function Dots({
  size = 'medium',
  color = 'blue',
  className,
  ...props
}: DotsProps) {
  return (
    <div className={cn("flex space-x-2", className)} {...props}>
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className={cn(
            "rounded-full animate-bounce",
            sizeMap[size],
            colorMap[color]
          )}
          style={{
            animationDelay: `${index * 0.1}s`,
            animationDuration: '0.6s',
          }}
        />
      ))}
    </div>
  );
});

Dots.displayName = "Dots"; 