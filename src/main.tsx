import React, { useState } from "react";
import { Provider } from "react-redux";
import store from "./store/store";
import Navigation from "./components/nav";
import SearchBar from "./components/searchBar";
import Category from "./components/category";
import Banner from "./components/banner";
import ThemeSlider from "./components/themeSlider";
import Restaurant from "./components/restaurant";
import MenuList from "./components/menuList";
import "./styles/main.css";

const Main: React.FC = () => {
  return (
    <Provider store={store}>
      <Navigation />
      <div className="category">
        <Category />
      </div>
      <div className="searchbar">
        <SearchBar />
      </div>
      <div className="banner">
        <Banner />
      </div>
      <h2 className="nearby-restaurant">음식점 검색</h2>
      <div className="restaurant-container">
        <Restaurant />
      </div>
      <div className="theme-container">
        <h2 className="recommendation-theme">테마별 음식 추천</h2>
        <ThemeSlider />
      </div>
      <h2 className="recipe">레시피 확인하고 요리 시작</h2>
      <div className="menu-container">
        <MenuList />
      </div>
      <footer className="footer"></footer>
    </Provider>
  );
};

export default Main;
