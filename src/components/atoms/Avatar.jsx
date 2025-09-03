import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Avatar = forwardRef(({ 
  children, 
  className, 
  size = "md",
  name = "",
  ...props 
}, ref) => {
  const sizes = {
    sm: "h-6 w-6 text-xs",
    md: "h-8 w-8 text-sm",
    lg: "h-10 w-10 text-base",
    xl: "h-12 w-12 text-lg"
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map(word => word.charAt(0).toUpperCase())
      .join("")
      .slice(0, 2);
  };

  const getColorFromName = (name) => {
    const colors = [
      "bg-gradient-to-br from-red-500 to-pink-500",
      "bg-gradient-to-br from-blue-500 to-indigo-500",
      "bg-gradient-to-br from-green-500 to-emerald-500",
      "bg-gradient-to-br from-purple-500 to-violet-500",
      "bg-gradient-to-br from-yellow-500 to-orange-500",
      "bg-gradient-to-br from-cyan-500 to-blue-500",
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center font-medium text-white rounded-full shadow-sm",
        sizes[size],
        getColorFromName(name),
        className
      )}
      {...props}
    >
      {children || getInitials(name)}
    </div>
  );
});

Avatar.displayName = "Avatar";

export default Avatar;