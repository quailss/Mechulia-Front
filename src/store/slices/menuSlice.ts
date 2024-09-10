import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Recipes 인터페이스 정의
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

interface RecipesState {
  recipes: { content: Recipes[] };  
  selectedRecipe: Recipes | null;  
  totalElements: number, 
  currentIndex: number;            
  status: 'idle' | 'loading' | 'succeeded' | 'failed';  
  error: string | null;            
}

// 초기 상태 정의
const initialState: RecipesState = {
  recipes: { content: [] },  // content 배열을 포함한 객체로 초기화
  selectedRecipe: null,
  totalElements: 0,
  currentIndex: 0,
  status: 'idle',
  error: null,
};

// 비동기 API 요청을 위한 thunk 생성
export const fetchRecipes = createAsyncThunk(
  'recipes/fetchRecipes',
  async ({ page }: { page: number }) => {
    try {
      const url = `http://localhost:8080/api/recipe/main?page=${page}&size=15`;

      console.log("Request URL:", url);

      const response = await axios.get(url);

      if (response.status !== 200) {
        throw new Error(`Unexpected status code: ${response.status}`);
      }

      console.log("data: ", response.data);

      // 필요한 경우 응답 데이터의 구조에 따라 content 배열만 반환하도록 수정
      const { recipes, totalElements } = response.data; 

      return { recipes, totalElements }; // 컴포넌트에서 활용할 수 있도록 반환
    } catch (error: any) {
      console.error('Error fetching recipes:', error.message || error);
      throw new Error(error.response?.data || 'Failed to fetch recipes');
    }
  }
);




// recipeSlice 생성
const recipeSlice = createSlice({
  name: 'recipes',
  initialState,  // 초기 상태를 정의
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipes.pending, (state) => {
        state.status = 'loading';
        state.error = null; 
      })
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // action.payload에서 recipes와 totalElements를 추출하여 state에 저장
        state.recipes.content = action.payload.recipes;  
        state.totalElements = action.payload.totalElements;  // 전체 요소 수 저장
        state.error = null;  
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch recipes';  
      });
  },
});



// 리듀서 기본 내보내기
export default recipeSlice.reducer;

