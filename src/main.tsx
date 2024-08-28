import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navigation from "./components/nav";

const Main = () =>{
    return(
       <Router>
            <Navigation />
        </Router>
    );
}

export default Main;