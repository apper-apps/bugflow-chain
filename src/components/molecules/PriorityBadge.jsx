import React from "react";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const PriorityBadge = ({ priority, showIcon = true, size = "md" }) => {
  const priorityConfig = {
    critical: {
      variant: "critical",
      icon: "AlertTriangle",
      label: "Critical"
    },
    high: {
      variant: "high", 
      icon: "ArrowUp",
      label: "High"
    },
    medium: {
      variant: "medium",
      icon: "Minus",
      label: "Medium"
    },
    low: {
      variant: "low",
      icon: "ArrowDown", 
      label: "Low"
    }
  };

  const config = priorityConfig[priority?.toLowerCase()] || priorityConfig.medium;

  return (
    <Badge variant={config.variant} size={size} className="inline-flex items-center gap-1">
      {showIcon && <ApperIcon name={config.icon} className="w-3 h-3" />}
      {config.label}
    </Badge>
  );
};

export default PriorityBadge;