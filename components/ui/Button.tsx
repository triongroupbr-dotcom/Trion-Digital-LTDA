import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive";
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = "default", 
  className = "", 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 disabled:pointer-events-none disabled:opacity-50";
  
  let variantStyles = "";
  
  switch (variant) {
    case "default":
      variantStyles = "bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-500/25";
      break;
    case "destructive":
      variantStyles = "bg-red-800 text-white hover:bg-red-700";
      break;
    case "outline":
      variantStyles = "border border-red-500/40 bg-black/60 text-red-300 hover:bg-red-600/20 hover:border-red-500 hover:text-red-400";
      break;
    case "ghost":
      variantStyles = "hover:bg-red-500/10 text-red-300";
      break;
  }

  return (
    <button className={`${baseStyles} ${variantStyles} ${className}`} {...props}>
      {children}
    </button>
  );
};