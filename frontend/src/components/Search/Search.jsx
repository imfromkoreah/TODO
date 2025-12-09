import { useState } from "react";
import "./Search.css";

function Search({ onSearch }) {
  const [value, setValue] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (onSearch) onSearch(value);
    }
  };

  return (
    <div className="search-wrapper">
      <input
        type="text"
        placeholder="했던 일을 찾아볼까요?"
        className="search-input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}  
      />
      <button
        className="search-btn"
        onClick={() => onSearch && onSearch(value)}
      >
        검색
      </button>
    </div>
  );
}

export default Search;
