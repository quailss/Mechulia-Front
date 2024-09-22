import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Review {
    id: number;
    content: string;
    score: number;
    createdAt: string;
    updatedAt: string;
    memberId: number;
    memberName: string;
    recipeId: number;
}


// 3개의 리뷰 데이터만 가져오는 Thunk
export const fetchPreviewReviews = createAsyncThunk('reviews/fetchPreviewReviews', async (recipeId: string) => {
    const response = await axios.get(`http://localhost:8080/api/reviews/recipe/${recipeId}`);

    return response.data.slice(0, 3); // 3개만 반환
});

// 전체 리뷰 데이터를 가져오는 Thunk
export const fetchReviews = createAsyncThunk('reviews/fetchReviews', async (recipeId: string) => {
    const response = await axios.get(`http://localhost:8080/api/reviews/recipe/${recipeId}`);
    return response.data; // 전체 데이터 반환
});

const reviewsSlice = createSlice({
    name: 'reviews',
    initialState: {
        previewReviews: [], // 3개의 리뷰만 저장
        allReviews: [], // 전체 리뷰 저장
        averageScore: 0, //평균 점수 저장
        status: 'idle',
        error: null as string | null
    },
    reducers: {
        // 리뷰 초기화 액션
        clearReviews(state) {
            state.previewReviews = [];
            state.allReviews = [];
            state.averageScore = 0;
            state.status = 'idle';
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        // 3개의 리뷰만 처리
        builder
            .addCase(fetchPreviewReviews.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchPreviewReviews.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.previewReviews = action.payload; // 3개의 리뷰만 저장
            })
            .addCase(fetchPreviewReviews.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message ?? 'Unknown error';
            });

        // 전체 리뷰 처리
        builder
            .addCase(fetchReviews.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchReviews.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.allReviews = action.payload; // 전체 리뷰 저장

                // 평균 점수 계산
                const totalScore = action.payload.reduce((sum: number, review: Review) => sum + review.score, 0);
                const reviewCount = action.payload.length;
                state.averageScore = reviewCount > 0 ? totalScore / reviewCount : 0;
            })
            .addCase(fetchReviews.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message ?? 'Unknown error';
            });
    }
});

export const { clearReviews } = reviewsSlice.actions;
export default reviewsSlice.reducer;

