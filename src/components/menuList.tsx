import React, { useEffect } from 'react';
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import { fetchRecipes } from '../store/slices/menuSlice';
import { RootState, AppDispatch } from "../store/store";

const useAppDispatch = () => useDispatch<AppDispatch>();
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

const RecipeList = () => {
  const dispatch = useAppDispatch();
  const { recipes, status, error } = useAppSelector((state) => state.menu);

  useEffect(() => {
    // 컴포넌트가 마운트될 때 API 요청 보내기
    dispatch(fetchRecipes());
  }, [dispatch]);

  return (
    <div>
      <h1>Recipe List</h1>
      {status === 'loading' && <p>Loading...</p>}
      {status === 'failed' && <p>Error: {error}</p>}
      {status === 'succeeded' && Array.isArray(recipes) && recipes.length > 0 ? ( // 배열인지 확인하고 렌더링
        <ul>
          {recipes.map((recipe: any) => (
            <li key={recipe.id}>{recipe.title}</li>
          ))}
        </ul>
      ) : (
        <p>No recipes available</p> // 배열이 아니거나 빈 배열인 경우
      )}
    </div>
  );
};

export default RecipeList;

