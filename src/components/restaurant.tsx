import React, {useState, useEffect} from "react";
import locationData from '../data/location.json';
import '../styles/restaurant.css';

interface LocationData {
    [key: string]: string[];
  }


const locations: LocationData = locationData;

const LocationSelector: React.FC = () => {
    const [selectedProvince, setSelectedProvince] = useState<string>('서울특별시');
    const [selectedCity, setSelectedCity] = useState<string>('');
    const [cities, setCities] = useState<string[]>([]);

    //사용자가 시/도를 선택하면 목록 업데이트
    useEffect(() => {
        if (selectedProvince) {
            setCities(locations[selectedProvince]);
            setSelectedCity('');
        } else {
            setCities([]);
            setSelectedCity('');
        }
    }, [selectedProvince]);

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