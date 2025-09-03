import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name="AlertTriangle" className="w-8 h-8 text-red-600" />
      </div>
      <h3 className="text-lg font-semibold text-surface-900 mb-2">
        Oops! Something went wrong
      </h3>
      <p className="text-surface-600 mb-6 max-w-md">
        {message}. Please try again or contact support if the problem persists.
      </p>
      {onRetry && (
        <Button onClick={onRetry} className="inline-flex items-center gap-2">
          <ApperIcon name="RefreshCw" className="w-4 h-4" />
          Try Again
        </Button>
      )}
    </div>
  );
};

export default Error;