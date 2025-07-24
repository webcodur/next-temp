import React, { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

interface WaveProps extends ComponentPropsWithoutRef<"div"> {
  size?: 'small' | 'medium' | 'large';
  color?: 'blue' | 'green' | 'red' | 'purple' | 'primary' | 'secondary';
}

const sizeMap = {
  small: { width: 'w-1', height: 'h-6' },
  medium: { width: 'w-1.5', height: 'h-8' },
  large: { width: 'w-2', height: 'h-12' },
};

const colorMap = {
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  red: 'bg-red-500',
  purple: 'bg-purple-500',
  primary: 'bg-primary',
  secondary: 'bg-secondary',
};

export const Wave = React.memo(function Wave({
  size = 'medium',
  color = 'blue',
  className,
  ...props
}: WaveProps) {
  const { width, height } = sizeMap[size];
  
  return (
    <div className={cn("flex items-center space-x-1", className)} {...props}>
      {[0, 1, 2, 3, 4].map((index) => (
        <div
          key={index}
          className={cn(
            "rounded-sm animate-wave",
            width,
            height,
            colorMap[color]
          )}
          style={{
            animationDelay: `${index * 0.1}s`,
            animationDuration: '1.2s',
            animationIterationCount: 'infinite',
          }}
        />
      ))}
    </div>
  );
});

Wave.displayName = "Wave"; 