import React from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";

const Header = ({ onSearch, onCreateIssue, searchQuery }) => {
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-surface-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div 
            className="flex items-center gap-3 cursor-pointer" 
            onClick={() => navigate("/")}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <ApperIcon name="Bug" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gradient">BugFlow</h1>
              <p className="text-xs text-surface-500">Issue Tracking</p>
            </div>
          </div>
          
          <div className="hidden md:block">
            <SearchBar 
              onSearch={onSearch} 
              placeholder="Search issues..."
              value={searchQuery}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={onCreateIssue}
            size="sm"
            className="inline-flex items-center gap-2"
          >
            <ApperIcon name="Plus" className="w-4 h-4" />
            New Issue
          </Button>
          
          <div className="flex items-center gap-2 text-sm text-surface-600">
            <ApperIcon name="Users" className="w-4 h-4" />
            <span className="hidden md:inline">Team View</span>
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden mt-4">
        <SearchBar 
          onSearch={onSearch} 
          placeholder="Search issues..."
          value={searchQuery}
        />
      </div>
    </header>
  );
};

export default Header;