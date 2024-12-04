import React from "react";
import "./../assets/components/SearchBar.scss";

const SearchBar = ({ onSearch }) => (
  <div className="search-bar">
    <input
      type="text"
      placeholder="Search documents..."
      onChange={(e) => onSearch(e.target.value)}
    />
  </div>
);

export default SearchBar;
