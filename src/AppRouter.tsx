import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./main";

function AppRouter() {
    return(
        <Router>
            <Routes>
                <Route path="*" element={<Main />} />
            </Routes>
        </Router>
    );
}

export default AppRouter;