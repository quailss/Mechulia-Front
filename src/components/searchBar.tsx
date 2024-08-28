import React from "react";
import { Link } from "react-router-dom";
import { IoSearch } from "react-icons/io5";
import "../styles/searchBar.css";

const SearchBar = () => {
    return (
        <div className="search-container">
            <Link to="/" className="search-bar">메뉴 검색</Link>
            <IoSearch className="search-icon" />
        </div>
    )
}

export default SearchBar;