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
  menuId?: number;           
}

// 초기 상태 정의
const initialState: RecipesState = {
  recipes: { content: [] },  // content 배열을 포함한 객체로 초기화
  selectedRecipe: null,
  totalElements: 0,
  currentIndex: 0,
  status: 'idle',
  error: null,
  menuId: undefined,
};

// 비동기 API 요청을 위한 thunk 생성
export const fetchRecipes = createAsyncThunk(
  'recipes/fetchRecipes',
  async ({ page, menu_id }: { page: number; menu_id?: number }) => {
    try {
      // menu_id가 존재하면 URL에 포함, 없으면 제외
      const url = menu_id 
        ? `http://localhost:8080/api/recipe/category/${menu_id}?page=${page}&size=15`
        : `http://localhost:8080/api/recipe/main?page=${page}&size=15`;

      const response = await axios.get(url);

      if (response.status !== 200) {
        throw new Error(`Unexpected status code: ${response.status}`);
      }

      const { recipes, totalElements } = response.data; 

      return { recipes, totalElements, menuId:menu_id };
    } catch (error: any) {
      throw new Error(error.response?.data || 'Failed to fetch recipes');
    }
  }
);

// recipeSlice 생성
const recipeSlice = createSlice({
  name: 'recipes',
  initialState,  // 초기 상태를 정의
  reducers: {
    setMenuId(state, action: PayloadAction<number | undefined>) {
      state.menuId = action.payload;  // menuId 상태 업데이트
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipes.pending, (state) => {
        state.status = 'loading';
        state.error = null; 
      })
      .addCase(fetchRecipes.fulfilled, (state, action) => {


        // 상태 업데이트
        state.status = 'succeeded';
        state.recipes.content = [...action.payload.recipes]; // 배열 복사
        state.totalElements = action.payload.totalElements;
        state.menuId = action.payload.menuId;
        state.error = null;
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch recipes';  
      });
  },
});

// 리듀서 기본 내보내기
export const { setMenuId } = recipeSlice.actions; 
export default recipeSlice.reducer;

