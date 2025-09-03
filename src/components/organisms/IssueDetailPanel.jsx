import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Label from "@/components/atoms/Label";
import PriorityBadge from "@/components/molecules/PriorityBadge";
import StatusBadge from "@/components/molecules/StatusBadge";
import Avatar from "@/components/atoms/Avatar";
import { toast } from "react-toastify";

const IssueDetailPanel = ({ 
  issue, 
  isOpen, 
  onClose, 
  onSave, 
  onDelete 
}) => {
  const [editedIssue, setEditedIssue] = useState(issue || {});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (issue) {
      setEditedIssue(issue);
      setIsEditing(false);
    }
  }, [issue]);

  const handleSave = async () => {
    try {
      await onSave(editedIssue);
      setIsEditing(false);
      toast.success("Issue updated successfully");
    } catch (error) {
      toast.error("Failed to update issue");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this issue? This action cannot be undone.")) {
      try {
        await onDelete(issue.Id);
        onClose();
        toast.success("Issue deleted successfully");
      } catch (error) {
        toast.error("Failed to delete issue");
      }
    }
  };

  const handleChange = (field) => (e) => {
    setEditedIssue(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleCancel = () => {
    setEditedIssue(issue);
    setIsEditing(false);
  };

  if (!issue) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 overflow-y-auto custom-scrollbar"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-surface-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ApperIcon name="Bug" className="w-5 h-5 text-surface-400" />
                <div>
                  <h2 className="text-lg font-semibold text-surface-900">Issue #{issue.Id}</h2>
                  <p className="text-sm text-surface-500">
                    Created {format(new Date(issue.createdAt), "MMM d, yyyy 'at' h:mm a")}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {!isEditing ? (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-2"
                  >
                    <ApperIcon name="Edit2" className="w-4 h-4" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSave}
                      className="inline-flex items-center gap-2"
                    >
                      <ApperIcon name="Save" className="w-4 h-4" />
                      Save
                    </Button>
                  </div>
                )}
                
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Title */}
              <div>
                <Label htmlFor="title">Title</Label>
                {isEditing ? (
                  <Input
                    id="title"
                    value={editedIssue.title || ""}
                    onChange={handleChange("title")}
                    placeholder="Issue title"
                  />
                ) : (
                  <h1 className="text-xl font-semibold text-surface-900 mt-1">
                    {issue.title}
                  </h1>
                )}
              </div>

              {/* Status and Priority */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Label>Status:</Label>
                  {isEditing ? (
                    <select
                      value={editedIssue.status || ""}
                      onChange={handleChange("status")}
                      className="rounded-lg border border-surface-300 px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Review">Review</option>
                      <option value="Closed">Closed</option>
                    </select>
                  ) : (
                    <StatusBadge status={issue.status} />
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Label>Priority:</Label>
                  {isEditing ? (
                    <select
                      value={editedIssue.priority || ""}
                      onChange={handleChange("priority")}
                      className="rounded-lg border border-surface-300 px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  ) : (
                    <PriorityBadge priority={issue.priority} />
                  )}
                </div>
              </div>

              {/* Assignee */}
              <div>
                <Label htmlFor="assignee">Assignee</Label>
                {isEditing ? (
                  <select
                    id="assignee"
                    value={editedIssue.assignee || ""}
                    onChange={handleChange("assignee")}
                    className="w-full rounded-lg border border-surface-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 mt-1"
                  >
                    <option value="">Unassigned</option>
                    <option value="John Smith">John Smith</option>
                    <option value="Sarah Johnson">Sarah Johnson</option>
                    <option value="Mike Chen">Mike Chen</option>
                    <option value="Emily Davis">Emily Davis</option>
                  </select>
                ) : (
                  <div className="flex items-center gap-3 mt-1">
                    {issue.assignee ? (
                      <>
                        <Avatar name={issue.assignee} size="sm" />
                        <span className="text-surface-700">{issue.assignee}</span>
                      </>
                    ) : (
                      <span className="text-surface-500">Unassigned</span>
                    )}
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description</Label>
                {isEditing ? (
                  <textarea
                    id="description"
                    value={editedIssue.description || ""}
                    onChange={handleChange("description")}
                    placeholder="Describe the issue in detail..."
                    rows={6}
                    className="w-full rounded-lg border border-surface-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 mt-1 resize-none"
                  />
                ) : (
                  <div className="mt-1">
                    {issue.description ? (
                      <p className="text-surface-700 leading-relaxed whitespace-pre-wrap">
                        {issue.description}
                      </p>
                    ) : (
                      <p className="text-surface-500 italic">No description provided</p>
                    )}
                  </div>
                )}
              </div>

              {/* Labels */}
              <div>
                <Label>Labels</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {issue.labels && issue.labels.length > 0 ? (
                    issue.labels.map((label, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 text-sm font-medium bg-surface-100 text-surface-700 rounded-full border border-surface-200"
                      >
                        <ApperIcon name="Tag" className="w-3 h-3 mr-1" />
                        {label}
                      </span>
                    ))
                  ) : (
                    <p className="text-surface-500">No labels assigned</p>
                  )}
                </div>
              </div>

              {/* Activity History */}
              <div>
                <h3 className="text-lg font-semibold text-surface-900 mb-4">Activity</h3>
                <div className="space-y-4">
                  {issue.history && issue.history.length > 0 ? (
                    issue.history.map((entry, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="w-8 h-8 bg-surface-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <ApperIcon name="Activity" className="w-4 h-4 text-surface-500" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-surface-700">
                            <span className="font-medium">{entry.action}</span>
                            {entry.field && (
                              <>
                                {" "}changed {entry.field} from{" "}
                                <span className="font-medium">{entry.oldValue}</span> to{" "}
                                <span className="font-medium">{entry.newValue}</span>
                              </>
                            )}
                          </p>
                          <p className="text-xs text-surface-500 mt-1">
                            {format(new Date(entry.timestamp), "MMM d, yyyy 'at' h:mm a")}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-surface-500">No activity recorded</p>
                  )}
                </div>
              </div>

              {/* Danger Zone */}
              <div className="border-t border-surface-200 pt-6">
                <h3 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h3>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-red-800">Delete this issue</h4>
                      <p className="text-sm text-red-600 mt-1">
                        Once deleted, this issue cannot be recovered. This action is permanent.
                      </p>
                    </div>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={handleDelete}
                      className="ml-4 flex-shrink-0"
                    >
                      <ApperIcon name="Trash2" className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default IssueDetailPanel;