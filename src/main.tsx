import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navigation from "./components/nav";
import SearchBar from "./components/searchBar";
import Category from "./components/category";

const Main = () =>{
    return(
       <Router>
            <Navigation />
            <SearchBar />
            <Category />
        </Router>
    );
}

export default Main;