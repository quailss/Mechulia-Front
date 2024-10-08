import React, {useEffect, useState} from "react";
import { AppDispatch, RootState } from "../store/store";
import { useDispatch, useSelector } from "react-redux";
import "../styles/category.css";
import { fetchRecipes, setMenuId } from "../store/slices/menuSlice";
import { setCategory } from "../store/slices/categorySlice";

const useAppDispatch = () => useDispatch<AppDispatch>();

const Category: React.FC = () => {
    //선택 옵션
    const options = ["한식", "중식", "일식", "양식", "그 외",];
    //옵션 값
    const categoryToMenuId: { [key: string]: number } = {
        "한식": 1,
        "중식": 3,
        "일식": 4,
        "양식": 2,
        "그 외": 5,
      };

    const selectedCategory = useSelector((state: RootState) => state.category.selectedCategory);

    const [selected, setSelected] = useState<string | undefined>();

    const dispatch = useAppDispatch();

    useEffect(() => {
        setSelected(selectedCategory || undefined);  
      }, [selectedCategory]);

    const handleSelect = (option: string) => {
        setSelected(option);
        const selectedMenuId = categoryToMenuId[option];

        //그 외 선택 처리
        const categoryForAPI = option === "그 외" ? "아시안" : option;
        
        //선택한 메뉴 id redux에 저장
        dispatch(setMenuId(selectedMenuId));
        dispatch(fetchRecipes({ page: 0, menu_id: selectedMenuId }));
        dispatch(setCategory(categoryForAPI));
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