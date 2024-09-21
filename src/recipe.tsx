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
import axios from "axios";

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
    const { id, name, image_url } = location.state;
    const decodedImageUrl = decodeURIComponent(image_url);

    const dispatch = useDispatch<AppDispatch>();

    // Redux 상태 가져오기
    const recipeData = useSelector((state: RootState) => state.recipe.data as RecipeData | null); // RecipeData 타입 적용
    const recipeLoading = useSelector((state: RootState) => state.recipe.loading);
    const recipeError = useSelector((state: RootState) => state.recipe.error);

    //북마크
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [bookmarkId, setBookmarkId] = useState<number | null>(null); 
    const [loading, setLoading] = useState(false);
    const recipeId = id;

    //별점
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState<number | null>(null);
    const [review, setReview] = useState('');
    const [isButtonActive, setIsButtonActive] = useState(false); 

    // 별점 선택 처리
    const handleStarClick = (value: number) => {
        setRating(value);
        setIsButtonActive(review.trim().length > 0 && value > 0);
    };

    // 리뷰 입력 처리
    const handleReviewChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setReview(e.target.value);
        setIsButtonActive(e.target.value.trim().length > 0 && rating > 0);
    };

    //리뷰 제출
    const handleSubmit = async() => {

        try {
            const reviewData = {
                recipe_id: id,
                score: rating,
                content: review
            };

            const response = await axios.post('http://localhost:8080/api/review', reviewData, {
                withCredentials: true // 세션 정보를 포함하여 요청
            });

            if (response.status === 200) {
                alert('리뷰가 저장되었습니다.');
                setRating(0); 
                setReview('');
                setIsButtonActive(false);
            }
        } catch(error) {
            alert('리뷰 저장에 실패했습니다.');
        }
    };


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

    //북마크 확인
    useEffect(() => {
        const fetchBookmarkStatus = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/bookmark/checked`, {
                    params: {recipeId},
                    withCredentials:true,
                });

                console.log("API Response:", response.data);
                
                setIsBookmarked(response.data);
                setBookmarkId(response.data.bookmarkId); 
            } catch(error) {
                console.error("북마크 상태 오류: ", error);
            }
        };

        fetchBookmarkStatus();
    }, [recipeId]);

    //북마크 추가 및 삭제
    const handleBookmarkClick = async () => {
        setLoading(true);
        try {
            if (isBookmarked) {
              // 북마크 삭제 요청
              const response = await axios.delete(`http://localhost:8080/api/bookmark?bookmarkId=${bookmarkId}`, {
                withCredentials: true,
              });
              console.log("북마크 삭제 요청: ", response);
            } else {
              // 북마크 추가 요청
              const response = await axios.post(`http://localhost:8080/api/bookmark`, null, {
                params: { recipeId },
                withCredentials: true,
              });
              setBookmarkId(response.data.bookmarkId);
            }

            setIsBookmarked(!isBookmarked);
          } catch (error) {
            console.error("Error handling bookmark:", error);
          } finally {
            setLoading(false);
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
                        <FaBookmark className="bookmark-icon" 
                        onClick={handleBookmarkClick}
                        style={{
                          color: isBookmarked ? "#FFD700" : "#ccc",
                          cursor: loading ? "not-allowed" : "pointer",
                        }}/>
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

                <div className="recipe-review-container">
                    <h1>리뷰</h1>
                                    <div>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                        key={star}
                        size={25} // 별의 크기
                        color={star <= (hover || rating) ? "#ffc107" : "#e4e5e9"} 
                        onClick={() => handleStarClick(star)}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(null)} 
                        style={{ cursor: 'pointer', marginRight: 5 }}
                        />
                    ))}
                    </div>
                    <textarea id="review" name="review" className="input-review" required placeholder="리뷰를 입력해주세요." value={review} onChange={handleReviewChange} />
                    <button className={`review-button ${isButtonActive ? 'active' : ''}`} disabled={!isButtonActive} onClick={handleSubmit}>작성하기</button>
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
                        <FaBookmark className="bookmark-icon"
                        onClick={handleBookmarkClick}
                        style={{
                          color: isBookmarked ? "#FFD700" : "#ccc",
                          cursor: loading ? "not-allowed" : "pointer",
                        }} />
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

                <div className="recipe-review-container">
                    <h1>리뷰</h1>
                                    <div>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                        key={star}
                        size={25} // 별의 크기
                        color={star <= (hover || rating) ? "#ffc107" : "#e4e5e9"} 
                        onClick={() => handleStarClick(star)}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(null)} 
                        style={{ cursor: 'pointer', marginRight: 5 }}
                        />
                    ))}
                    </div>
                    <textarea id="review" name="review" className="input-review" required placeholder="리뷰를 입력해주세요." value={review} onChange={handleReviewChange} />
                    <button className={`review-button ${isButtonActive ? 'active' : ''}`} disabled={!isButtonActive} onClick={handleSubmit}>작성하기</button>
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
                    <FaBookmark className="bookmark-icon" 
                    onClick={handleBookmarkClick}
                    style={{
                      color: isBookmarked ? "#FFD700" : "#ccc",
                      cursor: loading ? "not-allowed" : "pointer",
                    }}/>
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

            <div className="recipe-review-container">
                <h1>리뷰</h1>
                                <div>
                {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                    key={star}
                    size={25} // 별의 크기
                    color={star <= (hover || rating) ? "#ffc107" : "#e4e5e9"} 
                    onClick={() => handleStarClick(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(null)} 
                    style={{ cursor: 'pointer', marginRight: 5 }}
                    />
                ))}
                </div>
                <textarea id="review" name="review" className="input-review" required placeholder="리뷰를 입력해주세요." value={review} onChange={handleReviewChange} />
                <button className={`review-button ${isButtonActive ? 'active' : ''}`} disabled={!isButtonActive} onClick={handleSubmit}>작성하기</button>
            </div>  

            <div className="related-restaurant">
                <h1>여기에서 먹을 수 있어요!</h1>
                <Restaurant name={name} />
            </div>
        </div>
    );
};

export default Recipe;