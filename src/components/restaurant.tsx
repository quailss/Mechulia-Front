import React, {useState, useEffect, useRef} from "react";
import locationData from '../data/location.json';
import { fetchRestaurants, nextSlide, prevSlide, setSlide } from "../store/slices/restaurantSlice";
import '../styles/restaurant.css';
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import { RootState, AppDispatch } from "../store/store";

interface LocationData {
    [key: string]: string[];
  }

const locations: LocationData = locationData;

const useAppDispatch = () => useDispatch<AppDispatch>();
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

const LocationSelector: React.FC = () => {
    const [selectedProvince, setSelectedProvince] = useState<string>('서울특별시');
    const [selectedCity, setSelectedCity] = useState<string>('종로구');
    const [cities, setCities] = useState<string[]>([]);

    const dispatch = useAppDispatch(); 
    const selectedCategory = useAppSelector((state) => state.category.selectedCategory);
    const { restaurants, currentIndex, status } = useAppSelector((state) => state.restaurants);

    const slideContainerRef = useRef<HTMLDivElement>(null);
    const [slideWidth, setSlideWidth] = useState(0);

    useEffect(() => {
      if (selectedProvince && selectedCity) {
        console.log('API 요청 전송:', selectedProvince, selectedCity, selectedCategory);  // 로그 확인
        dispatch(fetchRestaurants({ region: selectedProvince, city: selectedCity, category: selectedCategory || '' }));
      }
    }, [selectedProvince, selectedCity, selectedCategory, dispatch]); 

    //슬라이드 너비 업데이트
    useEffect(() => {
        const updateSlideWidth = () => {
            if (slideContainerRef.current) {
                const containerWidth = slideContainerRef.current.clientWidth;
                const calculatedSlideWidth = (containerWidth - 60) / 3;
                setSlideWidth(calculatedSlideWidth);
            }
        };

        updateSlideWidth();
        window.addEventListener("resize", updateSlideWidth);

        return () => {
            window.removeEventListener("resize", updateSlideWidth);
        };
    }, []);

    //사용자가 지역을 선택하면 목록 업데이트
    useEffect(() => {
        if (selectedProvince) {
            setCities(locations[selectedProvince]);
            setSelectedCity('종로구');
        } else {
            setCities([]);
            setSelectedCity('');
        }
    }, [selectedProvince]);

    //다음 슬라이드 이동
    const goToNext = () => {
      const remainingItems = restaurants.length - (currentIndex + 1);
    
      if (remainingItems > 0) {
        dispatch(nextSlide());
      } else {
      }
    };

    //이전 슬라이드 이동
    const goToPrev = () => {
      if (currentIndex > 0) {
        dispatch(prevSlide());
      } else {
      }
    };

    return (
        <div>
          <div className="location-container">
            <div className="location-dropdown">
              <label>시/도:</label>
              <select value={selectedProvince} onChange={(e) => setSelectedProvince(e.target.value)}>
                <option value="">선택하세요</option>
                {Object.keys(locations).map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </select>
            </div>
            <div className="location-dropdown">
              <label>시/군/구:</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                disabled={!selectedProvince}
              >
                <option value="">선택하세요</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>
    
          {status === 'loading' && <p>Loading...</p>}
          {status === 'failed' && <p>Failed to load restaurants.</p>}
          {status === 'succeeded' && restaurants.length > 0 && (
            <div className="restaurant-container margin-top" ref={slideContainerRef}>
              <button onClick={goToPrev} className="slider-button prev-button" disabled={currentIndex === 0}>{'←'}</button>
              <div
                className="restaurant-content"
                style={{ transform: `translateX(-${currentIndex * slideWidth}px)` }}
              >
                {restaurants.slice(currentIndex, currentIndex + 3).map((restaurant) => (
                  <div
                    key={restaurant.id}
                    className="restaurant-card"
                    style={{ width: slideWidth }}
                  >
                    {restaurant.place_img && <img src={restaurant.place_img} alt={restaurant.place_name} />}
                    <h3>{restaurant.place_name}</h3>
                  </div>
                ))}
              </div>
              <button onClick={goToNext} className="slider-button next-button" disabled={currentIndex >= restaurants.length - 3}>{'→'}</button>
            </div>
          )}
        </div>
      );
    };

export default LocationSelector;