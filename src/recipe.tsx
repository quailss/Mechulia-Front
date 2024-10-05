import React, {useEffect, useState} from "react";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from './store/store';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { fetchRestaurants } from "./store/slices/restaurantSlice";
import Navigation from "./components/nav";
import SearchBar from "./components/searchBar";
import { fetchRecipe } from "./store/slices/recipeSlice";
import { fetchPreviewReviews, fetchReviews, clearReviews } from "./store/slices/reviewSlice";
import './styles/recipe.css';
import { FaStar, FaBookmark, FaStarHalfAlt } from "react-icons/fa";
import Restaurant from "./components/restaurant";
import axios from "axios";

interface Review {
    id: number;
    content: string;
    score: number;
    createdAt: string;
    updatedAt: string;
    memberId: number;
    memberName: string;
    recipeId: number;
}

const Recipe: React.FC = () => {
    const API_URL = process.env.REACT_APP_API_URL;
    
    const location = useLocation();
    const navigate = useNavigate();
    const { id, name, image_url } = location.state;
    const decodedImageUrl = decodeURIComponent(image_url);

    //이미지 인코딩
    const encodedImageUrl = encodeURIComponent(decodedImageUrl);

    const dispatch = useDispatch<AppDispatch>();

    // Redux 상태 가져오기
    const recipeData = useSelector((state: RootState) => state.recipe.data);
    const recipeLoading = useSelector((state: RootState) => state.recipe.loading);
    const recipeError = useSelector((state: RootState) => state.recipe.error);

    //북마크
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [loading, setLoading] = useState(false);
    const recipeId = id;

    //별점
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState<number | null>(null);
    const [review, setReview] = useState('');
    const [isButtonActive, setIsButtonActive] = useState(false); 

    //평균 별점 상태
    const reviewCount = useSelector((state: RootState) => state.review.reviewCount);
    const averageScore = useSelector((state: RootState) => state.review.averageScore);

    //리뷰
    const previewReviews = useSelector((state: RootState) => state.review.previewReviews as Review[]);
    const reviewsStatus = useSelector((state: RootState) => state.review.status);
    const page = useSelector((state: RootState) => state.review.page);



    // 레시피 가져오기
    useEffect(() => {
        if (name) {
            dispatch(fetchRecipe(name));
        }
    }, [dispatch, name]);
    
    //평균 별점을 위해 전체 리뷰 렌더링 하기
    useEffect(() => {
        dispatch(fetchReviews({ recipeId, page }));
    }, [dispatch, recipeId, page]);

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

            const response = await axios.post(`${API_URL}/api/reviews/recipe/${recipeId}`, reviewData, {
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
            alert('리뷰 저장에 실패했습니다. 로그인을 확인해 주세요');
            navigate('/login'); 
        }
    };

    // 페이지가 변경될 때 리뷰 초기화
    useEffect(() => {
        dispatch(clearReviews()); 
    }, [location.pathname, dispatch]);

    //리뷰 가져오기
    useEffect(() => {
        if (reviewsStatus === 'idle') {
            dispatch(fetchPreviewReviews(recipeId));
        }
    }, [reviewsStatus, dispatch, recipeId]);

    //리뷰 엔터값 포함
    const formatContentWithLineBreaks = (content: string) => {
        return content.split('\n').map((line, index) => (
          <span key={index}>
            {line}
            <br />
          </span>
        ));
      };

    //점수에 따른 별 생성
    const renderStars = (score: any) => {
        const totalStars = 5;
        const fullStars = Math.floor(score);
        const emptyStars = totalStars - fullStars;

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

    //북마크 확인
    useEffect(() => {
        const fetchBookmarkStatus = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/bookmark/checked/${recipeId}`, {
                    withCredentials:true,
                });

                setIsBookmarked(response.data);
            } catch(error) {
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
              const response = await axios.delete(`${API_URL}/api/bookmark/recipe/${recipeId}`, {
                withCredentials: true,
              });
            } else {
              // 북마크 추가 요청
              const response = await axios.post(`${API_URL}/api/bookmark/${recipeId}`, null, {
                withCredentials: true,
              });

            }

            setIsBookmarked(!isBookmarked);
        } catch (error: any) {
            // 인증 관련 오류 발생 시 로그인 페이지로 리다이렉트
            if (error.response && (error.response === 401 || error.response === 403)) {
                navigate('/login'); 
            } else if(error.rsponse === 303) {
                const redirectUrl = error.response.headers.location;
                if(redirectUrl) {
                    window.location.href = redirectUrl;
                }
            } else {
                alert("로그인을 확인해주세요.");
                navigate('/login'); 
            }
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
                          color: isBookmarked ? "#FFD700" : "#EBEBEB",
                          cursor: loading ? "not-allowed" : "pointer",
                        }}/>
                    </div>
                    <div className="food-container">
                        <h1 className="food-name">{name}</h1>
                        <div className="star-rating">
                            <div className="stars">{renderaverageStars()}</div>
                            <span className="review-count">({reviewCount})</span>
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
                    {previewReviews.length > 0 ? (
                        previewReviews.map((review) => (
                            <div key={review.id} className="review-box">
                                <div className="review-writer-container">
                                    <p className="review-writer">{review.memberName} </p>
                                    <p className="review-score">{renderStars(review.score)} </p>
                                    <p className="review-date">{new Date(review.createdAt).toLocaleDateString()} </p>
                                </div>
                                <p className="review-content"> {formatContentWithLineBreaks(review.content)} </p>
                            </div>
                        ))
                    ) : (
                        <p>리뷰가 없습니다.</p> // 리뷰가 없을 때 보여줄 내용
                    )}

                    {/* 리뷰가 있을 때만 "리뷰 전체보기" 링크 표시 */}
                    {previewReviews.length > 0 && (
                        <div className="full-review-container">
                            <Link 
                                to={`/recipeReview?name=${encodeURIComponent(name)}`}  
                                state={{ recipeId: recipeId, name: name, image_url: encodedImageUrl }} 
                                className="view-full-review"
                            >
                                리뷰 전체보기 <span className="arrow">〉</span>
                            </Link>
                        </div>
                    )}
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
                          color: isBookmarked ? "#FFD700" : "#EBEBEB",
                          cursor: loading ? "not-allowed" : "pointer",
                        }} />
                    </div>
                    <div className="food-container">
                        <h1 className="food-name">{name}</h1>
                        <div className="star-rating">
                            <div className="stars">{renderaverageStars()}</div>
                            <span className="review-count">({reviewCount})</span>
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
                    {previewReviews.length > 0 ? (
                        previewReviews.map((review) => (
                            <div key={review.id} className="review-box">
                                <div className="review-writer-container">
                                    <p className="review-writer">{review.memberName} </p>
                                    <p className="review-score">{renderStars(review.score)} </p>
                                    <p className="review-date">{new Date(review.createdAt).toLocaleDateString()} </p>
                                </div>
                                <p className="review-content"> {formatContentWithLineBreaks(review.content)} </p>
                            </div>
                        ))
                    ) : (
                        <p>리뷰가 없습니다.</p> // 리뷰가 없을 때 보여줄 내용
                    )}

                    {/* 리뷰가 있을 때만 "리뷰 전체보기" 링크 표시 */}
                    {previewReviews.length > 0 && (
                        <div className="full-review-container">
                            <Link 
                                to={`/recipeReview?name=${encodeURIComponent(name)}`}  
                                state={{ recipeId: recipeId, name: name, image_url: encodedImageUrl }} 
                                className="view-full-review"
                            >
                                리뷰 전체보기 <span className="arrow">〉</span>
                            </Link>
                        </div>
                    )}
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
                      color: isBookmarked ? "#FFD700" : "#EBEBEB",
                      cursor: loading ? "not-allowed" : "pointer",
                    }}/>
                </div>
                <div className="food-container">
                     <h1 className="food-name">{isExactMatch ? name : `비슷한 레시피: ${recipeData.RCP_NM}`}</h1>
                        <div className="star-rating">
                            <div className="stars">{renderaverageStars()}</div>
                            <span className="review-count">({reviewCount})</span>
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
                    {previewReviews.length > 0 ? (
                        previewReviews.map((review) => (
                            <div key={review.id} className="review-box">
                                <div className="review-writer-container">
                                    <p className="review-writer">{review.memberName} </p>
                                    <p className="review-score">{renderStars(review.score)} </p>
                                    <p className="review-date">{new Date(review.createdAt).toLocaleDateString()} </p>
                                </div>
                                <p className="review-content"> {formatContentWithLineBreaks(review.content)} </p>
                            </div>
                        ))
                    ) : (
                        <p>리뷰가 없습니다.</p> // 리뷰가 없을 때 보여줄 내용
                    )}

                    {/* 리뷰가 있을 때만 "리뷰 전체보기" 링크 표시 */}
                    {previewReviews.length > 0 && (
                        <div className="full-review-container">
                            <Link 
                                to={`/recipeReview?name=${encodeURIComponent(name)}`}  
                                state={{ recipeId: recipeId, name: name, image_url: encodedImageUrl }} 
                                className="view-full-review"
                            >
                                리뷰 전체보기 <span className="arrow">〉</span>
                            </Link>
                        </div>
                    )}
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