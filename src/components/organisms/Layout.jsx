import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/organisms/Header";
import Sidebar from "@/components/organisms/Sidebar";
import ApperIcon from "@/components/ApperIcon";

const Layout = () => {
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [onCreateIssue, setOnCreateIssue] = useState(null);
  const [filters, setFilters] = useState({
    priority: [],
    assignee: [],
    labels: [],
    searchText: ""
  });

  const handleSearch = (searchText) => {
    setFilters(prev => ({ ...prev, searchText }));
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
// Function to receive onCreateIssue from child component
  const handleCreateIssueRef = (createIssueHandler) => {
    setOnCreateIssue(() => createIssueHandler);
  };
  return (
    <div className="flex h-screen bg-surface-50">
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg lg:hidden border border-surface-200"
      >
        <ApperIcon name="Menu" className="w-5 h-5" />
      </button>

      {/* Sidebar */}
      <Sidebar
        filters={filters}
        onFiltersChange={handleFiltersChange}
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={closeMobileMenu}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
<Header 
          onSearch={handleSearch} 
          searchQuery={filters.searchText}
          onCreateIssue={onCreateIssue}
        />
<main className="flex-1 overflow-auto">
          <Outlet context={{ filters, onFiltersChange: handleFiltersChange }} />
        </main>
      </div>
    </div>
  );
};

export default Layout;