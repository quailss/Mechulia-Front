import React from "react";
import { Routes, Route } from "react-router-dom";
import Main from "./main";
import Login from "./login";
import CreateAccount from "./createAccount";
import Theme from "./theme";
import Recipe from "./recipe";
import FindAccount from "./findAccount";
import Bookmark from "./bookmark";
import RecipeReview from "./recipeReview";
import MyReviews from "./myReviews";
import MyPage from "./myPage";
import Search from "./search";

function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/login" element={<Login />} />
            <Route path="/createAccount" element={<CreateAccount />} />
            <Route path="/theme" element={<Theme />} />
            <Route path="/recipe" element={<Recipe />} />
            <Route path="/findAccount" element={<FindAccount />} />
            <Route path="/bookmark" element={<Bookmark />} />
            <Route path="/recipeReview" element={<RecipeReview />} />
            <Route path="/myReviews" element={<MyReviews />} />
            <Route path="/myPage" element={<MyPage />} />
            <Route path="/search" element={<Search />} />
        </Routes>
    );
}

export default AppRouter;
