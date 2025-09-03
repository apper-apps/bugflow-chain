import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import IssueCard from "@/components/molecules/IssueCard";
import Button from "@/components/atoms/Button";

const KanbanBoard = ({ 
  issues, 
  onIssueClick, 
  onCreateIssue, 
  onStatusChange,
  isLoading = false 
}) => {
  const [draggedIssue, setDraggedIssue] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);

  const columns = [
    { 
      id: "open", 
      title: "Open", 
      color: "blue",
      icon: "Circle",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    { 
      id: "in-progress", 
      title: "In Progress", 
      color: "orange",
      icon: "Clock",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200"
    },
    { 
      id: "review", 
      title: "Review", 
      color: "purple",
      icon: "Eye",
      bgColor: "bg-purple-50", 
      borderColor: "border-purple-200"
    },
    { 
      id: "closed", 
      title: "Closed", 
      color: "green",
      icon: "CheckCircle",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    }
  ];

  const getIssuesForColumn = (status) => {
    return issues.filter(issue => issue.status.toLowerCase().replace(" ", "-") === status);
  };

  const handleDragStart = (e, issue) => {
    setDraggedIssue(issue);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.target.outerHTML);
    e.dataTransfer.setDragImage(e.target, 0, 0);
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverColumn(columnId);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOverColumn(null);
  };

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    setDragOverColumn(null);
    
    if (draggedIssue && draggedIssue.status.toLowerCase().replace(" ", "-") !== newStatus) {
      const statusMap = {
        "open": "Open",
        "in-progress": "In Progress", 
        "review": "Review",
        "closed": "Closed"
      };
      
      onStatusChange(draggedIssue.Id, statusMap[newStatus]);
    }
    setDraggedIssue(null);
  };

  const handleDragEnd = () => {
    setDraggedIssue(null);
    setDragOverColumn(null);
  };

  if (isLoading) {
    return (
      <div className="flex gap-6 p-6 h-full">
        {columns.map((column) => (
          <div key={column.id} className="flex-1">
            <div className="bg-white rounded-lg p-4 mb-4 card-shadow">
              <div className="h-6 bg-gradient-to-r from-surface-200 to-surface-300 rounded animate-shimmer mb-2"></div>
              <div className="h-4 bg-gradient-to-r from-surface-200 to-surface-300 rounded animate-shimmer w-16"></div>
            </div>
            <div className="space-y-3">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg p-4 card-shadow">
                  <div className="h-4 bg-gradient-to-r from-surface-200 to-surface-300 rounded animate-shimmer mb-2"></div>
                  <div className="h-4 bg-gradient-to-r from-surface-200 to-surface-300 rounded animate-shimmer w-3/4 mb-2"></div>
                  <div className="h-3 bg-gradient-to-r from-surface-200 to-surface-300 rounded animate-shimmer"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-6 p-6 h-full custom-scrollbar overflow-x-auto">
      {columns.map((column) => {
        const columnIssues = getIssuesForColumn(column.id);
        const isOver = dragOverColumn === column.id;
        
        return (
          <div
            key={column.id}
            className={`flex-1 min-w-80 ${isOver ? column.bgColor + " " + column.borderColor + " border-2 border-dashed" : ""} transition-all duration-200 rounded-lg p-2`}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            {/* Column Header */}
            <div className="bg-white rounded-lg p-4 mb-4 card-shadow border border-surface-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br from-${column.color}-500 to-${column.color}-600 flex items-center justify-center`}>
                    <ApperIcon name={column.icon} className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-surface-900">{column.title}</h3>
                    <p className="text-sm text-surface-500">{columnIssues.length} issues</p>
                  </div>
                </div>
                
                {column.id === "open" && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={onCreateIssue}
                    className="text-surface-400 hover:text-surface-600"
                  >
                    <ApperIcon name="Plus" className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Issues */}
            <div className="space-y-3 min-h-96">
              <AnimatePresence mode="popLayout">
                {columnIssues.map((issue) => (
                  <motion.div
                    key={issue.Id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                    draggable
                    onDragStart={(e) => handleDragStart(e, issue)}
                    onDragEnd={handleDragEnd}
                    className={draggedIssue?.Id === issue.Id ? "opacity-50" : ""}
                  >
                    <IssueCard
                      issue={issue}
                      onClick={() => onIssueClick(issue)}
                      isDragging={draggedIssue?.Id === issue.Id}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {columnIssues.length === 0 && (
                <div className="text-center py-8 text-surface-400">
                  <ApperIcon name="Inbox" className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No issues in {column.title.toLowerCase()}</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KanbanBoard;