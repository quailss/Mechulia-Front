import React, {useEffect, useRef, useCallback} from "react";
import Navigation from "./components/nav";
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { fetchReviews } from "./store/slices/reviewSlice";
import { AppDispatch, RootState } from './store/store';
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import "./styles/recipeReview.css";

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

const RecipeReview: React.FC = () => {
    const location = useLocation();
    const { recipeId, name, image_url } = location.state;

    const dispatch = useDispatch<AppDispatch>();

    const allReviews = useSelector((state: RootState) => state.review.allReviews as Review[]);
    const reviewCount = useSelector((state: RootState) => state.review.reviewCount);
    const averageScore = useSelector((state: RootState) => state.review.averageScore);
    const page = useSelector((state: RootState) => state.review.page);
    const hasMore = useSelector((state: RootState) => state.review.hasMore);

    //전체 리뷰 가져오기
    useEffect(() => {
        dispatch(fetchReviews({ recipeId, page }));
    }, [dispatch, recipeId, page]);

    //엔터값 포함
    const formatContentWithLineBreaks = (content: string) => {
        return content.split('\n').map((line, index) => (
          <span key={index}>
            {line}
            <br />
          </span>
        ));
      };

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

    //무한 스크롤
    const observer = useRef<IntersectionObserver | null>(null);
    const lastReviewElementRef = useCallback(
        (node: any) => {
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    dispatch(fetchReviews({ recipeId, page: page + 1 }));
                }
            });
            if (node) observer.current.observe(node);
        },
        [hasMore, dispatch, recipeId, page]
    );

    // 이미지 URL을 디코딩하여 사용
    const decodedImageUrl = decodeURIComponent(image_url);

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

    return (
        <div>
            <Navigation />
            <h1 className="all-review">Review </h1>
            <h2>전체 리뷰 수: {reviewCount}</h2>
            <div className="averagescore-rating">
                <h2>평균 별점: </h2>
                <div className="stars">{renderaverageStars()}</div>
            </div>

            <div className="all-review-container">
                {Array.isArray(allReviews) && allReviews.length > 0 ? (
                    allReviews.map((review, index) => {
                        if (index === allReviews.length - 1) {
                            return (
                                <div ref={lastReviewElementRef} key={review.id} className="review-box">
                                    <div className="review-writer-container">
                                        <p className="review-writer">{review.memberName}</p>
                                        <p className="review-score">{renderStars(review.score)}</p>
                                        <p className="review-date">{new Date(review.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <p className="review-content">{formatContentWithLineBreaks(review.content)}</p>
                                </div>
                            );
                        } else {
                            return (
                                <div key={review.id} className="review-box">
                                    <div className="review-writer-container">
                                        <p className="review-writer">{review.memberName}</p>
                                        <p className="review-score">{renderStars(review.score)}</p>
                                        <p className="review-date">{new Date(review.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <p className="review-content">{formatContentWithLineBreaks(review.content)}</p>
                                </div>
                            );
                        }
                    })
                ) : (
                    <p>리뷰가 없습니다.</p> 
                )}
            </div>

            <footer className="recipeReview-footer"></footer>
        </div>
    );
};

export default RecipeReview;