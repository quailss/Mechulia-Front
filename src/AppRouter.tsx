import React from "react";
import { Routes, Route } from "react-router-dom";
import Main from "./main";
import Login from "./login";
import CreateAccount from "./createAccount";
import Theme from "./theme";
import Recipe from "./recipe";
import FindAccount from "./findAccount";

function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/login" element={<Login />} />
            <Route path="/createAccount" element={<CreateAccount />} />
            <Route path="/theme" element={<Theme />} />
            <Route path="/recipe" element={<Recipe />} />
            <Route path="/findAccount" element={<FindAccount />} />
        </Routes>
    );
}

export default AppRouter;
