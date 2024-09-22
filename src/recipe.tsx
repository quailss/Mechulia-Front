import React, {useEffect, useState} from "react";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from './store/store';
import { Provider } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import store from "./store/store";
import { fetchRestaurants } from "./store/slices/restaurantSlice";
import Navigation from "./components/nav";
import SearchBar from "./components/searchBar";
import { fetchRecipe, RecipeData } from "./store/slices/recipeSlice";
import { fetchPreviewReviews, fetchReviews } from "./store/slices/reviewSlice";
import './styles/recipe.css';
import { FaStar, FaBookmark, FaStarHalfAlt } from "react-icons/fa";
import Restaurant from "./components/restaurant";
import axios from "axios";

interface Member {
    id: number;
    name: string;
    email: string;
}

interface Recipe {
    id: number;
    name: string;
    image_url: string;
}

interface Review {
    id: number;
    content: string;
    score: number;
    createdAt: string;
    member: Member;
    recipe: Recipe;
}


const Recipe: React.FC = () => {
    const location = useLocation();
    const { id, name, image_url } = location.state;
    const decodedImageUrl = decodeURIComponent(image_url);

    const dispatch = useDispatch<AppDispatch>();

    // Redux 상태 가져오기
    const recipeData = useSelector((state: RootState) => state.recipe.data as RecipeData | null); 
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

    //평균 별점 상태
    const averageScore = useSelector((state: RootState) => state.review.averageScore);
    const allReviews = useSelector((state: RootState) => state.review.allReviews);
    const averagereviewCount = allReviews.length;

    //리뷰
    const previewReviews = useSelector((state: RootState) => state.review.previewReviews as Review[]);
    const reviewsStatus = useSelector((state: RootState) => state.review.status);

    //평균 별점을 위해 전체 리뷰 렌더링 하기
    useEffect(() => {
        dispatch(fetchReviews(id)); 
    }, [dispatch, id]);

    // 별점 렌더링 로직
    const totalStars = 5;
    
    const renderaverageStars = () => {
        const stars = [];
        for (let i = 1; i <= totalStars; i++) {
            if (i <= Math.floor(averageScore)) {
                stars.push(<FaStar key={i} color="#ffcc00" size={18} />);
            } else if (i === Math.ceil(averageScore) && averageScore % 1 !== 0) {
                stars.push(<FaStarHalfAlt key={i} color="#ffcc00" size={18} />);
            } else {
                stars.push(<FaStar key={i} color="#dcdcdc" size={18} />);
            }
        }
        return stars;
    };

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
                score: rating,
                content: review
            };

            const response = await axios.post(`http://localhost:8080/api/reviews/recipe/${recipeId}`, reviewData, {
                withCredentials: true // 세션 정보를 포함하여 요청
            });

            if (response.status === 200) {
                alert('리뷰가 저장되었습니다.');
                setRating(0); 
                setReview('');
                setIsButtonActive(false);

                //화면 최상단으로 이동
                window.location.reload();
            }
        } catch(error) {
            alert('리뷰 저장에 실패했습니다.');
        }
    };

    //리뷰 가져오기
    useEffect(() => {
        if (reviewsStatus === 'idle') {
            dispatch(fetchPreviewReviews(recipeId));
        }
    }, [reviewsStatus, dispatch, recipeId]);

    //점수에 따른 별 생성
    const renderStars = (score: any) => {
        const totalStars = 5;
        const fullStars = Math.floor(score); // 정수 값만큼 노란색 별
        const emptyStars = totalStars - fullStars; // 나머지는 회색 별

        return (
            <div>
                {/* 노란색 별 */}
                {Array(fullStars).fill('★').map((star, index) => (
                    <span key={index} style={{ color: 'gold' }}>{star}</span>
                ))}
                {/* 회색 별 */}
                {Array(emptyStars).fill('★').map((star, index) => (
                    <span key={index} style={{ color: 'lightgray' }}>{star}</span>
                ))}
            </div>
        );
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
                const response = await axios.get(`http://localhost:8080/api/bookmark/checked/${recipeId}`, {
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
              const response = await axios.delete(`http://localhost:8080/api/bookmark/${bookmarkId}`, {
                withCredentials: true,
              });
              console.log("북마크 삭제 요청: ", response);
            } else {
              // 북마크 추가 요청
              const response = await axios.post(`http://localhost:8080/api/bookmark/${recipeId}`, null, {
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
                        <div className="star-rating">
                            <div className="stars">{renderaverageStars()}</div>
                            <span className="review-count">({averagereviewCount})</span>
                        </div>
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

                    <div className="reviews-container">
                        {previewReviews.map((review) => (
                            <div key={review.id} className="review-box">
                                <div className="review-writer-container">
                                    <p className="review-writer">{review.member.name} </p>
                                    <p className="review-score">{renderStars(review.score)} </p>
                                    <p className="review-date">{new Date(review.createdAt).toLocaleDateString()} </p>
                                </div>
                                <p className="review-content"> {review.content} </p>
                            </div>
                        ))}
                        <div className="full-review-container">
                            <Link to="/recipeReview" className="view-full-review">리뷰 전체보기 <span className="arrow">〉</span></Link>
                        </div>
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
                        <FaBookmark className="bookmark-icon"
                        onClick={handleBookmarkClick}
                        style={{
                          color: isBookmarked ? "#FFD700" : "#ccc",
                          cursor: loading ? "not-allowed" : "pointer",
                        }} />
                    </div>
                    <div className="food-container">
                        <h1 className="food-name">{name}</h1>
                        <div className="star-rating">
                            <div className="stars">{renderaverageStars()}</div>
                            <span className="review-count">({averagereviewCount})</span>
                        </div>
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

                    <div className="reviews-container">
                        {previewReviews.map((review) => (
                            <div key={review.id} className="review-box">
                                <div className="review-writer-container">
                                    <p className="review-writer">{review.member.name} </p>
                                    <p className="review-score">{renderStars(review.score)} </p>
                                    <p className="review-date">{new Date(review.createdAt).toLocaleDateString()} </p>
                                </div>
                                <p className="review-content"> {review.content} </p>
                            </div>
                        ))}
                        <div className="full-review-container">
                            <Link to="/recipeReview" className="view-full-review">리뷰 전체보기 <span className="arrow">〉</span></Link>
                        </div>
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
                    <FaBookmark className="bookmark-icon" 
                    onClick={handleBookmarkClick}
                    style={{
                      color: isBookmarked ? "#FFD700" : "#ccc",
                      cursor: loading ? "not-allowed" : "pointer",
                    }}/>
                </div>
                <div className="food-container">
                     <h1 className="food-name">{isExactMatch ? name : `비슷한 레시피: ${recipeData.RCP_NM}`}</h1>
                        <div className="star-rating">
                            <div className="stars">{renderaverageStars()}</div>
                            <span className="review-count">({averagereviewCount})</span>
                        </div>
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

                <div className="reviews-container">
                    {previewReviews.map((review) => (
                        <div key={review.id} className="review-box">
                            <div className="review-writer-container">
                                <p className="review-writer">{review.member.name} </p>
                                <p className="review-score">{renderStars(review.score)} </p>
                                <p className="review-date">{new Date(review.createdAt).toLocaleDateString()} </p>
                            </div>
                            <p className="review-content"> {review.content} </p>
                        </div>
                    ))}
                    <div className="full-review-container">
                        <Link to="/recipeReview" className="view-full-review">리뷰 전체보기 <span className="arrow">〉</span></Link>
                    </div>
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