import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import { fetchRecipes } from '../store/slices/menuSlice';
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
  // useDispatch를 사용하되, AppDispatch로 타입 지정
  const dispatch: AppDispatch = useDispatch();

  // Redux에서 menuId와 recipes 관련 상태 가져오기
  const { recipes, status, error, totalElements, menuId } = useSelector((state: RootState) => state.menu);

  const [page, setPage] = useState(0);

  // 페이지 또는 menuId가 변경될 때마다 API 요청
  useEffect(() => {
    console.log("Current menuId:", menuId);
    // 카테고리가 선택된 상태이면 카테고리별 API 요청, 그렇지 않으면 기본 API 요청
    if (menuId !== undefined) {
      dispatch(fetchRecipes({ page, menu_id: menuId })); // 카테고리별 API 요청
    } else {
      dispatch(fetchRecipes({ page })); // 기본 API 요청
    }

    // 디버깅용 URL 콘솔 출력
    const url = menuId !== undefined
      ? `http://localhost:8080/api/recipe/category/${menuId}?page=${page}&size=15`
      : `http://localhost:8080/api/recipe/main?page=${page}&size=15`;
    console.log("Request URL:", url);
  }, [dispatch, page, menuId]);

  // 페이지 변경 함수
  const handlePageChange = (newPage: number) => {
    setPage(newPage); // 페이지 상태 업데이트
  };

  return (
    <div className="menu-container">
      {status === 'loading' && <p>Loading...</p>}
      {status === 'failed' && <p>Error: {error}</p>}
      {status === 'succeeded' && Array.isArray(recipes.content) && recipes.content.length > 0 ? ( 
        <>
          <ul className="menu-list">
            {recipes.content.map((recipe: Recipes) => (
              <li className="menu-item" key={recipe.id}>
                <img src={recipe.image_url} className='menu-image' alt={recipe.name} />
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