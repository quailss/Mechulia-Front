import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// 비동기 API 요청을 위한 thunk 생성
export const fetchRecipes = createAsyncThunk(
    'recipes/fetchRecipes',
    async (_, { rejectWithValue }) => {
      try {
        const response = await axios.get('http://localhost:8080/api/recipe/main');
        
        // 응답 상태 코드 확인
        if (response.status !== 200) {
          throw new Error(`Unexpected status code: ${response.status}`);
        }
  
        return response.data;
      } catch (error: any) {
        console.error("Error fetching recipes:", error.message || error);
        
        // 에러를 명시적으로 rejectWithValue를 통해 처리
        return rejectWithValue(error.response?.data || 'Failed to fetch recipes');
      }
    }
  );
  
  
  // 초기 상태 정의
  const initialState = {
    recipes: [],   // 레시피 리스트
    status: 'idle', // 요청 상태 (idle, loading, succeeded, failed)
    error: null,    // 에러 메시지
  };

// recipeSlice 생성
const recipeSlice = createSlice({
  name: 'recipes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.recipes = action.payload; // 성공적으로 데이터를 가져오면 상태에 저장
        console.log('Fetched recipes:', action.payload); // 데이터를 콘솔에 출력
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.status = 'failed';
        console.error('Failed to fetch recipes:', action.error.message); // 에러를 콘솔에 출력
      });
  },
});

export default recipeSlice.reducer;
