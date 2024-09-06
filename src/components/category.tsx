import React, {useEffect, useState} from "react";
import { RootState, AppDispatch } from "../store/store";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import "../styles/category.css";
import { fetchRestaurants } from "../store/slices/restaurantSlice";
import { setCategory  } from "../store/slices/categorySlice";

const useAppDispatch = () => useDispatch<AppDispatch>();
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

const Category: React.FC = () => {
    //선택 옵션
    const options = ["한식", "중식", "일식", "양식", "그 외",];
    const [selected, setSelected] = useState<string | undefined>();

    const dispatch = useAppDispatch();

    const handleSelect = (option: string) => {
        setSelected(option);
        dispatch(setCategory(option)); 
        console.log(`선택된 카테고리: ${option}`);
      };

    return (
        <div className="category-container">
            {options.map((option) => (
                <div key={option} 
                    className={`category-item ${selected === option ? 'selected': ''}`}
                    onClick={() => handleSelect(option)}
                    >
                    <span>{option}</span>
                </div>
            ))}
        </div>
    );
}

export default Category;