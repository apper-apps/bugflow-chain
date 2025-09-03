import React from "react";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const StatusBadge = ({ status, showIcon = true, size = "md" }) => {
  const statusConfig = {
    open: {
      variant: "info",
      icon: "Circle",
      label: "Open"
    },
    "in-progress": {
      variant: "warning",
      icon: "Clock",
      label: "In Progress"
    },
    review: {
      variant: "primary", 
      icon: "Eye",
      label: "Review"
    },
    closed: {
      variant: "success",
      icon: "CheckCircle",
      label: "Closed"
    }
  };

  const config = statusConfig[status?.toLowerCase()] || statusConfig.open;

  return (
    <Badge variant={config.variant} size={size} className="inline-flex items-center gap-1">
      {showIcon && <ApperIcon name={config.icon} className="w-3 h-3" />}
      {config.label}
    </Badge>
  );
};

export default StatusBadge;