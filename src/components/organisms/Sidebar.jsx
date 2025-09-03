import React from "react";
import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import FilterDropdown from "@/components/molecules/FilterDropdown";

const Sidebar = ({ 
  filters, 
  onFiltersChange, 
  isMobileOpen, 
  onMobileClose 
}) => {
  const priorityOptions = [
    { value: "critical", label: "Critical" },
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" }
  ];

  const assigneeOptions = [
    { value: "John Smith", label: "John Smith" },
    { value: "Sarah Johnson", label: "Sarah Johnson" },
    { value: "Mike Chen", label: "Mike Chen" },
    { value: "Emily Davis", label: "Emily Davis" }
  ];

  const labelOptions = [
    { value: "frontend", label: "Frontend" },
    { value: "backend", label: "Backend" },
    { value: "ui/ux", label: "UI/UX" },
    { value: "performance", label: "Performance" },
    { value: "security", label: "Security" },
    { value: "bug", label: "Bug" },
    { value: "feature", label: "Feature" }
  ];

  const navigationItems = [
    { icon: "LayoutGrid", label: "Board View", href: "/board", isActive: true },
    { icon: "List", label: "List View", href: "/list", isActive: false },
    { icon: "BarChart3", label: "Reports", href: "/reports", isActive: false },
    { icon: "Settings", label: "Settings", href: "/settings", isActive: false }
  ];

  const handleFilterChange = (filterType) => (values) => {
    onFiltersChange({ ...filters, [filterType]: values });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      priority: [],
      assignee: [],
      labels: [],
      searchText: filters.searchText || ""
    });
  };

  const hasActiveFilters = filters.priority?.length || filters.assignee?.length || filters.labels?.length;

  // Mobile Sidebar
  const MobileSidebar = () => (
    <>
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" 
          onClick={onMobileClose}
        />
      )}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-surface-200 transform transition-transform duration-300 lg:hidden ${
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <SidebarContent 
          filters={filters}
          onFiltersChange={onFiltersChange}
          priorityOptions={priorityOptions}
          assigneeOptions={assigneeOptions}
          labelOptions={labelOptions}
          navigationItems={navigationItems}
          handleFilterChange={handleFilterChange}
          clearAllFilters={clearAllFilters}
          hasActiveFilters={hasActiveFilters}
          onMobileClose={onMobileClose}
          isMobile={true}
        />
      </div>
    </>
  );

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div className="hidden lg:block w-72 bg-white border-r border-surface-200 h-full">
      <SidebarContent 
        filters={filters}
        onFiltersChange={onFiltersChange}
        priorityOptions={priorityOptions}
        assigneeOptions={assigneeOptions}
        labelOptions={labelOptions}
        navigationItems={navigationItems}
        handleFilterChange={handleFilterChange}
        clearAllFilters={clearAllFilters}
        hasActiveFilters={hasActiveFilters}
        isMobile={false}
      />
    </div>
  );

  return (
    <>
      <MobileSidebar />
      <DesktopSidebar />
    </>
  );
};

const SidebarContent = ({ 
  filters,
  priorityOptions,
  assigneeOptions,
  labelOptions,
  navigationItems,
  handleFilterChange,
  clearAllFilters,
  hasActiveFilters,
  onMobileClose,
  isMobile
}) => (
  <div className="h-full flex flex-col">
    {isMobile && (
      <div className="flex items-center justify-between p-6 border-b border-surface-200">
        <h2 className="text-lg font-semibold text-surface-900">Navigation</h2>
        <button onClick={onMobileClose} className="p-2 hover:bg-surface-100 rounded-lg">
          <ApperIcon name="X" className="w-5 h-5" />
        </button>
      </div>
    )}

    <div className="p-6">
      <nav className="space-y-2">
        {navigationItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-gradient-to-r from-primary-50 to-purple-50 text-primary-700 border-l-4 border-primary-600"
                  : "text-surface-600 hover:bg-surface-50 hover:text-surface-900"
              }`
            }
            onClick={isMobile ? onMobileClose : undefined}
          >
            <ApperIcon name={item.icon} className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>

    <div className="border-t border-surface-200 p-6 flex-1">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-surface-700">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-xs text-primary-600 hover:text-primary-700 font-medium"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-3">
        <FilterDropdown
          label="Priority"
          icon="AlertTriangle"
          options={priorityOptions}
          selected={filters.priority || []}
          onSelectionChange={handleFilterChange("priority")}
        />

        <FilterDropdown
          label="Assignee"
          icon="User"
          options={assigneeOptions}
          selected={filters.assignee || []}
          onSelectionChange={handleFilterChange("assignee")}
        />

        <FilterDropdown
          label="Labels"
          icon="Tag"
          options={labelOptions}
          selected={filters.labels || []}
          onSelectionChange={handleFilterChange("labels")}
        />
      </div>

      {hasActiveFilters && (
        <div className="mt-6 p-3 bg-surface-50 rounded-lg">
          <p className="text-xs text-surface-600 mb-2">Active Filters:</p>
          <div className="space-y-1">
            {filters.priority?.length > 0 && (
              <div className="text-xs text-surface-700">
                <span className="font-medium">Priority:</span> {filters.priority.join(", ")}
              </div>
            )}
            {filters.assignee?.length > 0 && (
              <div className="text-xs text-surface-700">
                <span className="font-medium">Assignee:</span> {filters.assignee.join(", ")}
              </div>
            )}
            {filters.labels?.length > 0 && (
              <div className="text-xs text-surface-700">
                <span className="font-medium">Labels:</span> {filters.labels.join(", ")}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  </div>
);

export default Sidebar;