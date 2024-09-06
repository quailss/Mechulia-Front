import React, {useState} from 'react';
import { Provider } from 'react-redux';
import store from './store/store';
import Navigation from './components/nav';
import SearchBar from './components/searchBar';
import Category from './components/category';
import Banner from './components/banner';
import ThemeSlider from './components/themeSlider';
import Restaurant from './components/restaurant';
import MenuList from './components/menuList';
import './styles/main.css';

const Main: React.FC = () => {

  return (
    <Provider store={store}>
      <Navigation />
      <SearchBar />
      <Category />
      <Banner />
      <h2 className="recommendation-theme">테마별 음식 추천</h2>
      <ThemeSlider />
      <h2 className="nearby-restaurant">음식점</h2>
      <div className="restaurant-container">
        <Restaurant />
      </div>
      <h2 className="recipe">메뉴 추천</h2>
      <MenuList />
    </Provider>
  );
};

export default Main;

