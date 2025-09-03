import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Label from "@/components/atoms/Label";
import { toast } from "react-toastify";

const CreateIssueModal = ({ isOpen, onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    assignee: "",
    labels: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    setIsSubmitting(true);
    try {
const newIssue = {
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        assignee: formData.assignee,
        status: "Open",
        labels: formData.labels.filter(label => label.trim()),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        history: [{
          timestamp: new Date().toISOString(),
          action: "Issue created",
          field: null,
          oldValue: null,
          newValue: null
        }]
      };
      
      await onCreate(newIssue);
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        priority: "Medium",
        assignee: "",
        labels: []
      });
      
      onClose();
      toast.success("Issue created successfully");
    } catch (error) {
      toast.error("Failed to create issue");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

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
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-xl shadow-2xl z-50 m-4"
          >
            <form onSubmit={handleSubmit}>
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-surface-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <ApperIcon name="Plus" className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-surface-900">Create New Issue</h2>
                    <p className="text-sm text-surface-500">Report a bug or request a feature</p>
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="p-2 hover:bg-surface-100 rounded-lg transition-colors disabled:opacity-50"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                {/* Title */}
                <div>
                  <Label htmlFor="title" className="required">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={handleChange("title")}
                    placeholder="Brief description of the issue"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={handleChange("description")}
                    placeholder="Provide detailed information about the issue, including steps to reproduce, expected behavior, etc."
                    rows={6}
                    disabled={isSubmitting}
                    className="w-full rounded-lg border border-surface-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 resize-none disabled:opacity-50"
                  />
                </div>

                {/* Priority and Assignee Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Priority */}
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <select
                      id="priority"
                      value={formData.priority}
                      onChange={handleChange("priority")}
                      disabled={isSubmitting}
                      className="w-full rounded-lg border border-surface-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 disabled:opacity-50"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>

                  {/* Assignee */}
                  <div>
                    <Label htmlFor="assignee">Assignee</Label>
                    <select
                      id="assignee"
                      value={formData.assignee}
                      onChange={handleChange("assignee")}
                      disabled={isSubmitting}
                      className="w-full rounded-lg border border-surface-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 disabled:opacity-50"
                    >
                      <option value="">Unassigned</option>
                      <option value="John Smith">John Smith</option>
                      <option value="Sarah Johnson">Sarah Johnson</option>
                      <option value="Mike Chen">Mike Chen</option>
                      <option value="Emily Davis">Emily Davis</option>
                    </select>
                  </div>
                </div>

                {/* Labels */}
                <div>
                  <Label>Labels (optional)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {["frontend", "backend", "ui/ux", "performance", "security", "bug", "feature"].map((label) => (
                      <label key={label} className="flex items-center space-x-2 cursor-pointer hover:bg-surface-50 p-2 rounded-md">
                        <input
                          type="checkbox"
                          checked={formData.labels.includes(label)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData(prev => ({
                                ...prev,
                                labels: [...prev.labels, label]
                              }));
                            } else {
                              setFormData(prev => ({
                                ...prev,
                                labels: prev.labels.filter(l => l !== label)
                              }));
                            }
                          }}
                          disabled={isSubmitting}
                          className="rounded border-surface-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-surface-700 capitalize">{label.replace("/", " / ")}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-surface-200">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !formData.title.trim()}
                  className="inline-flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <ApperIcon name="Plus" className="w-4 h-4" />
                      Create Issue
                    </>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CreateIssueModal;