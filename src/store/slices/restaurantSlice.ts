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
  //네이버 api를 이용해 이미지 가져오기
  place_img?: string | null;
}

interface RestaurantState {
  restaurants: Restaurant[];
  currentIndex: number; 
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: RestaurantState = {
  restaurants: [],
  currentIndex: 0,  
  status: 'idle',
  error: null,
};

// 카카오 api를 이용해 음식점 정보 가져오기
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

    const restaurants = response.data.documents;

    // 각 음식점에 대해 네이버 이미지 검색을 수행하고, place_img 필드를 추가
    const restaurantsWithImages = await Promise.all(
      restaurants.map(async (restaurant: Restaurant) => {
        const imageUrl = await fetchImage(restaurant.place_name);
        return {
          ...restaurant,
          place_img: imageUrl,  // 썸네일 이미지를 place_img로 설정
        };
      })
    );

    return restaurantsWithImages.slice(0, 24); // 최대 24개의 음식점 정보만 반환
  }
);

//네이버 이미지 검색 api를 이용해 이미지 가져오기
async function fetchImage(placeName: string): Promise<string | null> {

  try {
    const response = await axios.get('/api/v1/search/image', {
      params: {
        query: placeName,
        display: 1,
      },
      headers: {
        'X-Naver-Client-ID': `${process.env.REACT_APP_NAVER_CLIENT_ID}`,
        'X-Naver-Client-Secret': `${process.env.REACT_APP_NAVER_CLIENT_SECRET}`,
      }
    });
    const items = response.data.items;
    return items.length > 0 ? items[0].thumbnail : null;
  } catch (error) {
    console.error(`Failed to fetch image for ${placeName}`, error);
    return null;
  }
}


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
        state.currentIndex = 0; 
      })
      .addCase(fetchRestaurants.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch restaurants';
      });
  },
});

export const { nextSlide, prevSlide, setSlide } = restaurantSlice.actions;

export default restaurantSlice.reducer;
