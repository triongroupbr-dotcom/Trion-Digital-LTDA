import React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, className = "", ...props }) => {
  return (
    <div className={`inline-flex items-center rounded-full border border-transparent px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 ${className}`} {...props}>
      {children}
    </div>
  );
};