import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Label = forwardRef(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "block text-sm font-medium text-surface-700 mb-1",
      className
    )}
    {...props}
  />
));

Label.displayName = "Label";

export default Label;