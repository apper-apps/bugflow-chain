import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ 
  children, 
  className, 
  variant = "default",
  size = "md",
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center font-medium rounded-full transition-all duration-200";
  
  const variants = {
    default: "bg-surface-100 text-surface-800",
    primary: "bg-gradient-to-r from-primary-100 to-purple-100 text-primary-800 border border-primary-200",
    success: "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200",
    warning: "bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border border-yellow-200",
    danger: "bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-200",
    info: "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border border-blue-200",
    critical: "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg",
    high: "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md",
    medium: "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-sm",
    low: "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-sm"
  };
  
  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm"
  };
  
  return (
    <span
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;