import React, { useState } from "react";
import "../styles/category.css";

function Category(){
    //선택 옵션
    const options = ["한식", "중식", "일식", "양식", "그 외",];
    const [selected, setSelected] = useState<string | undefined>();

    const handleSelect = (option: string) => {
        setSelected(option);
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