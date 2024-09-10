import React from "react";
import { Routes, Route } from "react-router-dom";
import Main from "./main";

function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<Main />} />
        </Routes>
    );
}

export default AppRouter;
