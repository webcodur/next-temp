import React, { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

interface PulseProps extends ComponentPropsWithoutRef<"div"> {
  size?: 'small' | 'medium' | 'large';
  color?: 'blue' | 'green' | 'red' | 'purple' | 'primary' | 'secondary';
}

const sizeMap = {
  small: 'w-8 h-8',
  medium: 'w-12 h-12',
  large: 'w-16 h-16',
};

const colorMap = {
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  red: 'bg-red-500',
  purple: 'bg-purple-500',
  primary: 'bg-primary',
  secondary: 'bg-secondary',
};

export const Pulse = React.memo(function Pulse({
  size = 'medium',
  color = 'blue',
  className,
  ...props
}: PulseProps) {
  return (
    <div className={cn("relative", className)} {...props}>
      {/* 메인 원 */}
      <div
        className={cn(
          "rounded-full animate-pulse",
          sizeMap[size],
          colorMap[color]
        )}
      />
      
      {/* 확장되는 링 */}
      <div
        className={cn(
          "absolute top-0 left-0 rounded-full border-2 animate-ping",
          sizeMap[size],
          color === 'primary' ? 'border-primary' : 
          color === 'secondary' ? 'border-secondary' : 
          `border-${color}-500`
        )}
        style={{ opacity: 0.75 }}
      />
    </div>
  );
});

Pulse.displayName = "Pulse"; 