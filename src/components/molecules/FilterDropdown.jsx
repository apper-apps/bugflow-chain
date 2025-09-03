import React, { useState, useRef, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { motion, AnimatePresence } from "framer-motion";

const FilterDropdown = ({ 
  label, 
  options, 
  selected = [], 
  onSelectionChange, 
  icon = "Filter" 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOptionToggle = (value) => {
    const newSelection = selected.includes(value)
      ? selected.filter(item => item !== value)
      : [...selected, value];
    onSelectionChange(newSelection);
  };

  const clearAll = () => {
    onSelectionChange([]);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 relative"
      >
        <ApperIcon name={icon} className="w-4 h-4" />
        {label}
        {selected.length > 0 && (
          <span className="ml-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {selected.length}
          </span>
        )}
        <ApperIcon 
          name="ChevronDown" 
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} 
        />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-surface-200 z-50"
          >
            <div className="p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-surface-700">Filter by {label}</span>
                {selected.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="text-xs text-primary-600 hover:text-primary-700"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <div className="space-y-1">
                {options.map((option) => (
                  <label key={option.value} className="flex items-center space-x-2 cursor-pointer hover:bg-surface-50 p-2 rounded-md">
                    <input
                      type="checkbox"
                      checked={selected.includes(option.value)}
                      onChange={() => handleOptionToggle(option.value)}
                      className="rounded border-surface-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-surface-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterDropdown;