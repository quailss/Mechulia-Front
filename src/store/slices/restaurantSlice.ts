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

// 이미지 캐시를 위한 Map (검색어를 키로, 이미지 URL을 값으로 저장)
const imageCache = new Map<string, string>();

// 네이버 이미지 검색 api를 이용해 이미지 가져오기 (딜레이 및 캐싱 적용)
async function fetchImageWithDelayAndCache(placeName: string, delay: number): Promise<string | null> {
  // 캐시된 이미지가 있는 경우, 캐시에서 가져오기
  if (imageCache.has(placeName)) {
    return imageCache.get(placeName) || null;
  }

  // 요청 간 딜레이를 추가 (밀리초 단위)
  await new Promise(resolve => setTimeout(resolve, delay));

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
    const imageUrl = items.length > 0 ? items[0].thumbnail : 'https://github.com/quailss/image-data/blob/main/noimage.png?raw=true';

    // 캐시에 저장
    if (imageUrl) {
      imageCache.set(placeName, imageUrl);
    }

    return imageUrl;
  } catch (error) {
    console.error(`Failed to fetch image for ${placeName}`, error);
    return 'https://github.com/quailss/image-data/blob/main/noimage.png?raw=true';
  }
}

// 카카오 API를 이용해 음식점 정보 가져오기
export const fetchRestaurants = createAsyncThunk(
  'restaurants/fetchRestaurants',
  async ({ region, city, category }: { region: string; city: string; category?: string }) => {
    const query = `${region} ${city}`;
    const categoryQuery = category ? ` ${category}` : '';

    console.log(`API 요청 URL: https://dapi.kakao.com/v2/local/search/keyword.json?query=${query}${categoryQuery}&category_group_code=FD6`);

    // API 요청 시 사용할 파라미터 객체
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

    // 각 음식점에 대해 네이버 이미지 검색을 수행하고, place_img 필드를 추가 (딜레이 추가)
    const restaurantsWithImages = await Promise.all(
      restaurants.map(async (restaurant: Restaurant, index: number) => {
        // 딜레이를 200ms씩 추가하여 요청 빈도를 조정
        const delay = index * 200;

        // 이미지 요청에 캐싱 및 딜레이 적용
        const imageUrl = await fetchImageWithDelayAndCache(restaurant.place_name, delay);

        return {
          ...restaurant,
          place_img: imageUrl,
        };
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
