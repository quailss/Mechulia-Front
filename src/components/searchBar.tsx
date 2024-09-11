import React from "react";
import { Link } from "react-router-dom";
import { IoSearch } from "react-icons/io5";
import "../styles/searchBar.css";

const SearchBar = () => {
    return (
        <div className="search-container">
            <h2 className="search-text">레시피가 궁금한 음식을 검색해보세요.</h2>
            <Link to="/" className="search-bar">레시피를 입력해주세요.</Link>
            <IoSearch className="search-icon" />
        </div>
    );
};

export default SearchBar;