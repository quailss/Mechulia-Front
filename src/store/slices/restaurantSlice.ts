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
  //구글 api를 이용해 이미지 가져오기
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

// 이미지 URL 캐시를 위한 객체
const imageCache: { [key: string]: string | null } = {};

// 딜레이 함수 (200ms)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 구글 Places API로 place_id 가져오기
const fetchPlaceId = async (x: string, y: string, placeName: string) => {
  try {
    const params = {
      location: `${y},${x}`,  
      radius: 500,           
      keyword: placeName,    
      type: "restaurant",    
      key: process.env.REACT_APP_GOOGLE_API_KEY, 
    };

    const response = await axios.get('/api/google/maps/api/place/nearbysearch/json', { params });
    const results = response.data.results;

    if (results.length > 0) {
      return results[0].place_id; 
    } else {
      console.log("검색 결과가 없습니다.");
      return null;
    }
  } catch (error) {
    console.error("Place ID를 가져오는 중 오류 발생:", error);
    return null;
  }
};


// 구글 Places API로 이미지 URL 가져오기
const fetchPlacePhoto = async (placeId: string) => {

  /*다른 기능 중 요청을 하지 않게 하기 위해 주석 처리(후에 주석 제거해야 함.)

    */
};

// 음식점 정보와 이미지 가져오기 (캐시 기능 및 딜레이 추가)
export const fetchRestaurants = createAsyncThunk(
  'restaurants/fetchRestaurants',
  async ({ region, city, category }: { region: string; city: string; category?: string }) => {
    const query = `${region} ${city}`;
    const categoryQuery = category ? ` ${category}` : '';

    // 카카오 API 요청
    const params: any = {
      query: query + categoryQuery,
      category_group_code: 'FD6',   // 음식점 카테고리
    };

    const response = await axios.get(
      `https://dapi.kakao.com/v2/local/search/keyword.json`,
      {
        params,
        headers: {
          Authorization: `KakaoAK ${process.env.REACT_APP_KAKAO_API_KEY}`,
        },
      }
    );

    const restaurants = response.data.documents;

    // 각 음식점에 대해 구글 API를 사용해 이미지 가져오기
    const restaurantsWithImages = await Promise.all(
      restaurants.map(async (restaurant: Restaurant) => {
        const { x, y, place_name } = restaurant;

        // 이미지 캐시 확인
        if (imageCache[place_name]) {
          return { ...restaurant, place_img: imageCache[place_name] };
        }

        // 구글 Places API로 place_id 가져오기
        const placeId = await fetchPlaceId(x, y, place_name);
        let imageUrl = null;

        if (placeId) {
          // 200ms 딜레이 추가
          await delay(200);

          // 구글 Places API로 이미지 URL 가져오기
          imageUrl = await fetchPlacePhoto(placeId);
        }

        // 사진이 없을 경우 기본 이미지 사용
        if (!imageUrl) {
          imageUrl = "https://github.com/quailss/image-data/blob/main/noimage.png?raw=true";
        }

        // 캐시에 이미지 URL 저장
        imageCache[place_name] = imageUrl;

        return { ...restaurant, place_img: imageUrl };
      })
    );

    return restaurantsWithImages.slice(0, 24); // 최대 24개의 음식점 정보만 반환
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

