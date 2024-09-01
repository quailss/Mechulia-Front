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
    const [selectedCity, setSelectedCity] = useState<string>('');
    const [cities, setCities] = useState<string[]>([]);
    const dispatch = useAppDispatch(); 
    const currentIndex = useSelector((state: RootState) => state.slider.currentIndex);

    const slideContainerRef = useRef<HTMLDivElement>(null);
    const [slideWidth, setSlideWidth] = useState(0);

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
            setSelectedCity('');
        } else {
            setCities([]);
            setSelectedCity('');
        }
    }, [selectedProvince]);

    //다음 슬라이드 이동
    const goToNext = () => {
        dispatch(nextSlide());
    };

    //이전 슬라이드 이동
    const goToPrev = () => {
        dispatch(prevSlide());
    };

    //지역 선택 시 음식점 목록 업데이트
    useEffect(() => {
        if(selectedProvince && selectedCity) {
            dispatch(fetchRestaurants({region: selectedProvince, city: selectedCity}));
        }
    }, [selectedProvince, selectedCity, dispatch]);

    return (
        <div className="location-container">
            <div className="location-dropdown">
                <label>
                    시/도:
                </label>
                <select value={selectedProvince} onChange={(e) => setSelectedProvince(e.target.value)}>
                <option value=""></option>
                {Object.keys(locations).map((province) => (
                    <option key={province} value={province}>
                    {province}
                    </option>
                ))}
                </select>
            </div>
            <div className="location-dropdown">
                <label>
                    시/군/구:
                </label>
                <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} disabled={!selectedProvince}>
                <option value="">선택하세요</option>
                {cities.map((city) => (
                    <option key={city} value={city}>
                    {city}
                    </option>
                ))}
                </select>
            </div>
        </div>
    );
};

export default LocationSelector;