import React, {useEffect, useState} from "react";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from './store/store';
import { Provider } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import store from "./store/store";
import { fetchRestaurants } from "./store/slices/restaurantSlice";
import Navigation from "./components/nav";
import SearchBar from "./components/searchBar";
import { fetchRecipe, RecipeData } from "./store/slices/recipeSlice";
import './styles/recipe.css';
import { FaStar, FaBookmark } from "react-icons/fa";
import Restaurant from "./components/restaurant";

//별점 정의
const StarRating = ({ averageRating = 0, reviewCount = 0 }) => {
    const totalStars = 5;

    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= totalStars; i++) {
            stars.push(
                <FaStar
                    key={i}
                    color={i <= averageRating ? "#ffcc00" : "#dcdcdc"}
                    size={18}
                />
            );
        }
        return stars;
    };

    return (
        <div className="star-rating">
            <div className="stars">{renderStars()}</div>
            <span className="review-count">({reviewCount})</span>
        </div>
    );
};

const Recipe: React.FC = () => {
    const location = useLocation();
    const { name, image_url } = location.state;
    const decodedImageUrl = decodeURIComponent(image_url);

    const dispatch = useDispatch<AppDispatch>();

    // Redux 상태 가져오기
    const recipeData = useSelector((state: RootState) => state.recipe.data as RecipeData | null); // RecipeData 타입 적용
    const recipeLoading = useSelector((state: RootState) => state.recipe.loading);
    const recipeError = useSelector((state: RootState) => state.recipe.error);


    // 나중에 API로 별점 및 리뷰 개수 가져올 수 있도록 상태 추가
    const [averageRating, setAverageRating] = useState(0);
    const [reviewCount, setReviewCount] = useState(0);

    useEffect(() => {
        if (name) {
            dispatch(fetchRestaurants({
                region: "서울특별시",
                city: "종로구",      
                category: "",      
                name: name           
            }));
        } else {
            console.warn("Name is not defined");
        }
    }, [dispatch, name]);

    // API 호출
    useEffect(() => {
        if (name) {
            dispatch(fetchRecipe(name));
            // 여기서 별점과 리뷰 개수를 가져오는 비동기 함수 추가
            fetchRatingData();
        }
    }, [dispatch, name]);

    // 별점 데이터 가져오기 (나중에 REST API로 변경)
    const fetchRatingData = async () => {
        try {
            // 나중에 실제 API로 변경할 부분
            const response = await fetch("/api/reviews"); // 실제 API 주소로 변경
            const data = await response.json();

            // 받은 데이터로 상태 업데이트
            setAverageRating(data.averageRating || 0);
            setReviewCount(data.reviewCount || 0);
        } catch (error) {
            console.error("Error fetching rating data:", error);
        }
    };

    // 에러 처리
    if (recipeError) {
        return (
            <div>
                <Navigation />
                <div className="searchbar-fix">
                    <SearchBar />
                </div>
                
                <div className="recipe-main">
                    <div className="image-container">
                        <img src={decodedImageUrl} alt={name} className="food-image" />
                        <FaBookmark className="bookmark-icon" />
                    </div>
                    <div className="food-container">
                        <h1 className="food-name">{name}</h1>
                        <StarRating averageRating={averageRating} reviewCount={reviewCount} />
                    </div>
                </div>
                <div className="how-to-make">
                    <h1>레시피 정보</h1>
                    <div>
                        <p>검색되는 레시피가 없습니다.</p>
                    </div>
                </div>
                <div className="related-restaurant">
                    <h1>여기에서 먹을 수 있어요!</h1>
                    <Restaurant />
                </div>
            </div>
        );
    }

    if (!recipeData) {
        return (
            <div>
                <Navigation />
                <div className="searchbar-fix">
                    <SearchBar />
                </div>
                
                <div className="recipe-main">
                    <div className="image-container">
                        <img src={decodedImageUrl} alt={name} className="food-image" />
                        <FaBookmark className="bookmark-icon" />
                    </div>
                    <div className="food-container">
                        <h1 className="food-name">{name}</h1>
                        <StarRating averageRating={averageRating} reviewCount={reviewCount} />
                    </div>
                </div>
                <div className="how-to-make">
                    <h1>레시피 정보</h1>
                    <div>
                        <p>검색되는 레시피가 없습니다.</p>
                    </div>
                </div>
                <div className="related-restaurant">
                    <h1>여기에서 먹을 수 있어요!</h1>
                    <Restaurant />
                </div>
            </div>
        );
    }

    // 로딩 상태 처리
    if (recipeLoading) {
        return <p>Loading...</p>;
    }

    // 레시피 이름이 정확히 일치하는지 확인
    const isExactMatch = recipeData.RCP_NM === name;

    return (
        <div>
            <Navigation />
            <div className="searchbar-fix">
                <SearchBar />
            </div>
            <div className="recipe-main">
                <div className="image-container">
                    {recipeData.ATT_FILE_NO_MAIN && <img src={recipeData.ATT_FILE_NO_MAIN} alt="메인 이미지" className="food-image" />}
                    <FaBookmark className="bookmark-icon" />
                </div>
                <div className="food-container">
                     <h1 className="food-name">{isExactMatch ? name : `비슷한 레시피: ${recipeData.RCP_NM}`}</h1>
                     <StarRating averageRating={averageRating} reviewCount={reviewCount} />
                     <h2 className="required-materials"> 필요재료</h2>
                     <p>{recipeData.RCP_PARTS_DTLS}</p>
                     <h2 className="kcal">칼로리</h2>
                     <p>{recipeData.INFO_ENG} kcal</p>
                </div>
            </div>
            <div className="how-to-make">
                <h1>레시피 정보</h1>
                <div>
                    {recipeData.manuals.map((manual, index) => (
                        <div key={index}>
                            {manual.img && <img src={manual.img} alt={`Step ${index + 1}`} className="manual-image" />}
                            <p>{manual.step}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="related-restaurant">
                <h1>여기에서 먹을 수 있어요!</h1>
                <Restaurant name={name} />
            </div>
        </div>
    );
};

export default Recipe;