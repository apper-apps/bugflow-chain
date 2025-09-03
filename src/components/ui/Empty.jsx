import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "No items found", 
  description = "Get started by creating your first item", 
  actionLabel = "Create New",
  onAction,
  icon = "Package"
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} className="w-10 h-10 text-primary-600" />
      </div>
      <h3 className="text-xl font-semibold text-surface-900 mb-3">
        {title}
      </h3>
      <p className="text-surface-600 mb-8 max-w-md leading-relaxed">
        {description}
      </p>
      {onAction && (
        <Button onClick={onAction} className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700">
          <ApperIcon name="Plus" className="w-4 h-4" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default Empty;