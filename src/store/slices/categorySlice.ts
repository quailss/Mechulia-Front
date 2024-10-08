import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CategoryState {
  selectedCategory: string | null;
}

const initialState: CategoryState = {
  selectedCategory: null,  // 초기에는 선택된 카테고리가 없음
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload;  // 카테고리 업데이트
    },
    resetCategory: (state) => {
      state.selectedCategory = null;
    },
  },
});

export const { setCategory, resetCategory } = categorySlice.actions;

export default categorySlice.reducer;