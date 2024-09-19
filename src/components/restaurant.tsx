import React, {useState, useEffect, useRef} from "react";
import locationData from '../data/location.json';
import { fetchRestaurants, nextSlide, prevSlide } from "../store/slices/restaurantSlice";
import '../styles/restaurant.css';
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import { RootState, AppDispatch } from "../store/store";

interface RestaurantProps {
  name?: string;
}


interface LocationData {
    [key: string]: string[];
  }

const locations: LocationData = locationData;

const useAppDispatch = () => useDispatch<AppDispatch>();
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

const LocationSelector: React.FC<RestaurantProps> = ({ name }) => {
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
        // name이 있을 때만 name을 포함시켜서 fetchRestaurants 호출
        dispatch(
          fetchRestaurants({
            region: selectedProvince,
            city: selectedCity,
            category: selectedCategory || '',
            name: name || undefined, 
          })
        );
      }
    }, [selectedProvince, selectedCity, selectedCategory, name, dispatch]);

    //슬라이드 너비 업데이트
    useEffect(() => {
        const updateSlideWidth = () => {
            if (slideContainerRef.current) {
                const containerWidth = slideContainerRef.current.clientWidth;
                const calculatedSlideWidth = (containerWidth - 60) / 4;
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
                  <button
                    onClick={goToPrev}
                    className="slider-button prev-button"
                    style={{ visibility: currentIndex === 0 ? 'hidden' : 'visible' }}
                  >{'←'}</button>
              <div
                className="restaurant-content"
                style={{ transform: `translateX(-${currentIndex * slideWidth}px)`,
                justifyContent: restaurants.length - currentIndex <= 4 ? 'center' : 'flex-start', }}
              >
                {restaurants.slice(currentIndex, currentIndex + 4).map((restaurant) => (
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
              <button
                onClick={goToNext}
                className="slider-button next-button"
                style={{ visibility: currentIndex >= restaurants.length - 4 ? 'hidden' : 'visible' }}
              >{'→'}</button>
            </div>
          )}
        </div>
      );
    };

export default LocationSelector;