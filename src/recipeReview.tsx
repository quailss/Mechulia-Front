import React, {useEffect} from "react";
import Navigation from "./components/nav";
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { fetchReviews } from "./store/slices/reviewSlice";
import { AppDispatch, RootState } from './store/store';
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
    const averagereviewCount = allReviews.length;

    //전체 리뷰 가져오기
    useEffect(() => {
        dispatch(fetchReviews(recipeId)); 
    }, [dispatch, recipeId]);

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
            <h2>전체 리뷰 수: {averagereviewCount}</h2>

            <div>
                {allReviews.length > 0 ? (
                    allReviews.map((review) => (
                        <div key={review.id} className="review-box">
                            <div className="review-writer-container">
                                <p className="review-writer">{review.memberName} </p>
                                <p className="review-score">{renderStars(review.score)} </p>
                                <p className="review-date">{new Date(review.createdAt).toLocaleDateString()} </p>
                            </div>
                            <p className="review-content"> {review.content} </p>
                        </div>
                    ))
                ) : (
                    <p>리뷰가 없습니다.</p> // 리뷰가 없을 때 보여줄 내용
                )}
            </div>
        </div>
    );
};

export default RecipeReview;