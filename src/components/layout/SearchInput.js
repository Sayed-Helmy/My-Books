import React, { useState } from "react";
import "./SearchInput.css";

export default function SearchInput(props) {
  const [searchValue, setSearchValue] = useState("");
  const searchValueHandler = (e) => {
    setSearchValue(e.target.value);
    props.onSearch(e.target.value);
  };
  return (
    <div className="search-holder">
      <input
        type="text"
        placeholder="Search By Title Or Author"
        value={searchValue}
        onChange={searchValueHandler}
      />
    </div>
  );
}
