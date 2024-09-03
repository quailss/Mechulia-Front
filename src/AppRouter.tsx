import React from "react";
import { Routes, Route } from "react-router-dom";
import Main from "./main";
import Login from './login';
import CreateAccount from './createAccount';

function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/login" element={<Login />} />
            <Route path="/create-account" element={<CreateAccount />} />
        </Routes>
    );
}

export default AppRouter;
