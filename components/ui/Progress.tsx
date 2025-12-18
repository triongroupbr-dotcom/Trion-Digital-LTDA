import React from "react";

interface ProgressProps {
  value: number;
  className?: string;
}

export const Progress: React.FC<ProgressProps> = ({ value, className = "" }) => {
  return (
    <div className={`relative h-2 w-full overflow-hidden rounded-full bg-gray-900 ${className}`}>
      <div
        className="h-full w-full flex-1 bg-red-500 transition-all duration-500 ease-in-out"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </div>
  );
};