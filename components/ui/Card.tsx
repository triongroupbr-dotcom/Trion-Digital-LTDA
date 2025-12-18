import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = "", ...props }) => {
  return (
    <div className={`rounded-xl border border-red-500/20 bg-black/80 backdrop-blur-sm text-red-400 shadow-xl ${className}`} {...props}>
      {children}
    </div>
  );
};