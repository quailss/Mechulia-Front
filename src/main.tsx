import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navigation from "./components/nav";
import SearchBar from "./components/searchBar";

const Main = () =>{
    return(
       <Router>
            <Navigation />
            <SearchBar />
        </Router>
    );
}

export default Main;