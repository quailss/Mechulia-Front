import React from "react";
import Navigation from "./components/nav";
import { useLocation } from 'react-router-dom';
import "./styles/recipeReview.css";

const RecipeReview: React.FC = () => {
    const location = useLocation();
    const { recipeId, name, image_url } = location.state;

    // 이미지 URL을 디코딩하여 사용
    const decodedImageUrl = decodeURIComponent(image_url);

    return (
        <div>
            <Navigation />
            <h1 className="all-review">Review </h1>
            <div className="review-menu-container">
                <div>
                    <h2>{name}</h2>
                    <p> 레시피 id: {recipeId} </p>
                    <img src={decodedImageUrl} alt={name} className="review-image" />
                </div>
            </div>
        </div>
    );
};

export default RecipeReview;