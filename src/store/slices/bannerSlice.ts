import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

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

interface BannerState {
  bannerRecipes: Recipes[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  menuId: string;
}

// 초기 상태
const initialState: BannerState = {
  bannerRecipes: [],
  status: 'idle',
  error: null,
  menuId: ''
};

// 비동기 레시피 요청 Thunk
export const fetchBannerRecipes = createAsyncThunk(
    'banner/fetchBannerRecipes',
    async () => {
      const response = await axios.get<{ recipes: Recipes[] }>(`${API_URL}/api/recipes?page=4&size=15`);
      return response.data.recipes;
    }
  );

// 슬라이스 정의
const bannerSlice = createSlice({
  name: 'banner',
  initialState,
  reducers: {
    resetBanner(state) {
      state.bannerRecipes = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBannerRecipes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBannerRecipes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.bannerRecipes = action.payload;
      })
      .addCase(fetchBannerRecipes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to load banner recipes';
      });
  }
});

export const { resetBanner } = bannerSlice.actions;
export default bannerSlice.reducer;
