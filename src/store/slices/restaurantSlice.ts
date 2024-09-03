import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Restaurant {
  id: string;
  place_name: string;
  address_name: string;
  road_address_name: string;
  phone: string;
  place_url: string;
  x: string;
  y: string;
}

interface RestaurantState {
  restaurants: Restaurant[];
  currentIndex: number;  // currentIndex를 상태에 추가
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: RestaurantState = {
  restaurants: [],
  currentIndex: 0,  // currentIndex 초기 값 추가
  status: 'idle',
  error: null,
};

// 비동기 API 호출을 위한 thunk 생성
export const fetchRestaurants = createAsyncThunk(
  'restaurants/fetchRestaurants',
  async ({ region, city }: { region: string; city: string }) => {
    const query = `${region} ${city}`;

    const response = await axios.get(
      `https://dapi.kakao.com/v2/local/search/keyword.json`,
      {
        params: {
          query, // 쿼리 파라미터로 전달할 값
          category_group_code: 'FD6',
        },
        headers: {
          Authorization: `KakaoAK ${process.env.REACT_APP_KAKAO_API_KEY}`, // Authorization 헤더 설정
        }
      }
    );

    return response.data.documents; // 응답 데이터 반환
  }
);


const restaurantSlice = createSlice({
  name: 'restaurants',
  initialState,
  reducers: {
    nextSlide: (state) => {
      if (state.currentIndex < state.restaurants.length - 3) {
        state.currentIndex += 3;
      }
    },
    prevSlide: (state) => {
      if (state.currentIndex > 0) {
        state.currentIndex -= 3;
      }
    },
    setSlide: (state, action) => {
      state.currentIndex = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRestaurants.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRestaurants.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.restaurants = action.payload.slice(0, 24); // 최대 24개의 음식점 정보 저장
        state.currentIndex = 0;  // 슬라이드 인덱스 초기화
      })
      .addCase(fetchRestaurants.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch restaurants';
      });
  },
});

export const { nextSlide, prevSlide, setSlide } = restaurantSlice.actions;

export default restaurantSlice.reducer;
