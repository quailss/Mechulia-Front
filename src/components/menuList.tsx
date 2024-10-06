import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { fetchRecipes } from '../store/slices/menuSlice';
import { useLocation, useNavigate } from "react-router-dom";
import { RootState, AppDispatch } from "../store/store";
import "../styles/menuList.css";

interface Recipes {
  id: string;
  name: string;
  image_url: string;
  keyword1: string;
  keyword2: string;
  keyword3: string;
  keyword4: string;
  menu: string;
}

const RecipeList = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const dispatch: AppDispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const { recipes, status, error, totalElements, menuId } = useSelector((state: RootState) => state.menu);

  const [page, setPage] = useState(0);

  // 페이지 또는 menuId가 변경될 때마다 API 요청
  useEffect(() => {
    // 카테고리가 선택된 상태이면 카테고리별 API 요청, 그렇지 않으면 기본 API 요청
    if (menuId !== undefined) {
      dispatch(fetchRecipes({ page, menu_id: menuId })); 
    } else {
      dispatch(fetchRecipes({ page })); 
    }

    // 디버깅용 URL 콘솔 출력
    const url = menuId !== undefined
      ? `${API_URL}/api/recipes/category/${menuId}?page=${page}&size=15`
      : `${API_URL}/api/recipes?page=${page}&size=15`;
  }, [dispatch, page, menuId]);

  // 페이지 변경 함수
  const handlePageChange = (newPage: number) => {
    console.log("Page clicked:", newPage);
    setPage(newPage);
  };

  return (
    <div className="menu-container">
      {status === 'loading' && <p>Loading...</p>}
      {status === 'failed' && <p>Error: {error}</p>}
      {status === 'succeeded' && Array.isArray(recipes.content) && recipes.content.length > 0 ? ( 
        <>
          <ul className="menu-list">
            {recipes.content.map((recipe: Recipes) => (
              <li className="menu-item" key={recipe.id} onClick={() => {
                const encodedImageUrl = encodeURIComponent(recipe.image_url);
                navigate(`/recipe?${recipe.name}`, { state: { name: recipe.name, id: recipe.id, image_url: encodedImageUrl } });
            }}
            >
                <picture>
                  <source srcSet={recipe.image_url.replace(/\.(jpg|jpeg|png)$/, ".webp")} type="image/webp" />
                  <img src={recipe.image_url} className="menu-image" alt={recipe.name} loading="lazy" />
                </picture>
                <h2 className='recipe-name'>{recipe.name}</h2>
              </li>
            ))}
          </ul>

          <div className="pagination-container">
            <div className="pagination">
              {Array.from({ length: Math.ceil(totalElements / 15) }, (_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(index)} 
                  disabled={page === index}  
                  className={page === index ? "active-page" : ""}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        status === 'succeeded' && <p>No recipes found</p>
      )}

    </div>
  );
};

export default RecipeList;