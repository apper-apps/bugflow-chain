import React from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import PriorityBadge from "@/components/molecules/PriorityBadge";
import Avatar from "@/components/atoms/Avatar";
import ApperIcon from "@/components/ApperIcon";

const IssueCard = ({ 
  issue, 
  onClick, 
  isDragging = false,
  dragHandleProps,
  style
}) => {
  return (
    <motion.div
      layout
      style={style}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`bg-white rounded-lg p-4 card-shadow hover:card-shadow-hover cursor-pointer transition-all duration-200 border border-surface-200 hover:border-primary-200 ${
        isDragging ? "opacity-50 rotate-2 scale-105" : ""
      }`}
      onClick={onClick}
      {...dragHandleProps}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <ApperIcon name="Bug" className="w-4 h-4 text-surface-400" />
          <span className="text-xs font-medium text-surface-500">#{issue.Id}</span>
        </div>
        <PriorityBadge priority={issue.priority} size="sm" />
      </div>

      <h4 className="font-semibold text-surface-900 mb-2 leading-tight">
        {issue.title}
      </h4>

      {issue.description && (
        <p className="text-sm text-surface-600 mb-3 line-clamp-2 leading-relaxed">
          {issue.description}
        </p>
      )}

      {issue.labels && issue.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {issue.labels.slice(0, 2).map((label, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 text-xs font-medium bg-surface-100 text-surface-700 rounded-md"
            >
              {label}
            </span>
          ))}
          {issue.labels.length > 2 && (
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-surface-100 text-surface-700 rounded-md">
              +{issue.labels.length - 2}
            </span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-surface-500">
          <ApperIcon name="Calendar" className="w-3 h-3" />
          <span className="text-xs">
            {format(new Date(issue.createdAt), "MMM d")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {issue.assignee && (
            <Avatar name={issue.assignee} size="sm" />
          )}
          <ApperIcon name="GripVertical" className="w-4 h-4 text-surface-300 hover:text-surface-500" />
        </div>
      </div>
    </motion.div>
  );
};

export default IssueCard;