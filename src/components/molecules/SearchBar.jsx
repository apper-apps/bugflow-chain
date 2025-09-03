import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";

const SearchBar = ({ onSearch, placeholder = "Search issues..." }) => {
  const [searchValue, setSearchValue] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearch(value);
  };

  const clearSearch = () => {
    setSearchValue("");
    onSearch("");
  };

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <ApperIcon name="Search" className="h-4 w-4 text-surface-400" />
      </div>
      <Input
        type="text"
        placeholder={placeholder}
        value={searchValue}
        onChange={handleChange}
        className="pl-10 pr-10 w-full md:w-80"
      />
      {searchValue && (
        <button
          onClick={clearSearch}
          className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-surface-600 transition-colors"
        >
          <ApperIcon name="X" className="h-4 w-4 text-surface-400 hover:text-surface-600" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;