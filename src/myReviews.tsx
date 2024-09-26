import React, { useEffect, useState } from "react";
import Navigation from "./components/nav";
import axios from "axios";
import "./styles/myReviews.css";

const MyReviews: React.FC = () => {
    const [reviews, setReviews] = useState<Review[]>([]); 
    const [loading, setLoading] = useState<boolean>(true);

    //리뷰 수정
    const [editMode, setEditMode] = useState<number | null>(null);
    const [editContent, setEditContent] = useState<string>("");
    const [editScore, setEditScore] = useState<number | null>(null);

    
    // 리뷰 데이터 타입 정의
    type Review = {
      id: number;
      content: string;
      createdAt: string;
      updatedAt: string;
      memberId: number;
      memberName: string;
      memberStatus: string | null;
      recipeId: number;
      score: number;
      imgUrl: string;
      recipeName: string;
    };
  
    //리뷰 불러오기
    useEffect(() => {
      const fetchMyReviews = async () => {
        try {
          const response = await axios.get("http://localhost:8080/api/reviews/member", {
            withCredentials: true, 
          });

          setReviews(response.data);
        } catch (error) {
          console.error("Error fetching reviews: ", error);
        } finally {
          setLoading(false); 
        }
      };
  
      fetchMyReviews();
    }, []);

    //엔터 표시
    const formatContentWithLineBreaks = (content: string) => {
      return content.split('\n').map((line, index) => (
        <span key={index}>
          {line}
          <br />
        </span>
      ));
    };
  
    // 점수에 따른 별 생성 함수
    const renderStars = (score: number) => {
      const totalStars = 5;
      const fullStars = Math.floor(score); 
      const emptyStars = totalStars - fullStars; 
  
      return (
        <div>
          {Array(fullStars)
            .fill("★")
            .map((star, index) => (
              <span key={index} style={{ color: "gold" }}>
                {star}
              </span>
            ))}
          {Array(emptyStars)
            .fill("★")
            .map((star, index) => (
              <span key={index} style={{ color: "lightgray" }}>
                {star}
              </span>
            ))}
        </div>
      );
    };
  
    if (loading) {
      return <p>Loading...</p>; // 로딩 중일 때 표시
    }

    //리뷰 수정 활성화
    const handleEditClick = (reviewId: number, currentContent: string, currentScore: number) => {
        setEditMode(reviewId);
        setEditContent(currentContent);
        setEditScore(currentScore);
    };

    //별점 수정
    const renderEditableStars = (score: number) => {
      const totalStars = 5;

      return (
        <div>
          {Array(totalStars)
            .fill(0)
            .map((_, index) => (
              <span
                key={index}
                style={{
                  color: index < score ? "gold" : "lightgray",
                  cursor: "pointer",
                  fontSize: "24px",
                }}
                onClick={() => setEditScore(index + 1)} 
              >
                ★
              </span>
            ))}
        </div>
      );
    };


    //수정 내용 저장
    const handleSaveClick = async (reviewId: number) => {
        try {
          const response = await axios.put(
            `http://localhost:8080/api/reviews/${reviewId}`,
            { content: editContent, score: editScore }, 
            { withCredentials: true } 
          );
            const updatedReview = response.data;
      
            setReviews((prevReviews) =>
              prevReviews.map((review) =>
                review.id === updatedReview.id ? updatedReview : review
              )
            );
      
            alert("리뷰가 성공적으로 수정되었습니다.");
            setEditMode(null);
            window.location.reload();
            
          } catch (error) {
            console.error("리뷰 업데이트 에러: ", error);
        }
    };

    // 리뷰 삭제 함수
    const handleDeleteClick = async (reviewId: number) => {
        if (window.confirm("정말로 이 리뷰를 삭제하시겠습니까?")) {
        try {
            await axios.delete(`http://localhost:8080/api/reviews/${reviewId}`, {
            withCredentials: true, 
            });
            setReviews(reviews.filter((review) => review.id !== reviewId));
            alert("리뷰가 성공적으로 삭제되었습니다.");
        } catch (error: any) {
            console.error("리뷰 삭제 실패:", error);
            alert("리뷰 삭제에 실패했습니다.");
        }
        }
    };
  
    return (
      <div>
        <Navigation />
        <div className="my-reviews-container">
            <h1>내가 작성한 리뷰</h1>
            {reviews.length > 0 ? (
            reviews.map((review) => (
                <div key={review.id} className="review-box">
                <div className="my-review-container">
                  <div className="review-left">
                    <img src={review.imgUrl} className="my-review-image"></img>
                    <p>{review.recipeName}</p>
                  </div>
                  <div className="review-right">
                    <div className="review-writer-container">
                        <p className="review-writer">{review.memberName}</p>
                        <p className="review-score">{renderStars(review.score)}</p>
                        <p className="review-date">{new Date(review.updatedAt).toLocaleDateString()}</p>
                    </div>
                    <p className="review-content">{formatContentWithLineBreaks(review.content)}</p>
                    <div className="review-actions">
                        <button onClick={() => handleEditClick(review.id, review.content, review.score)}>수정</button>
                        <button className="review-delete" onClick={() => handleDeleteClick(review.id)}>삭제</button>
                    </div>
                  </div>
                </div>

                {/* 수정 모드 */}
                {editMode === review.id && (
                <div className="review-edit-container">
                  <p className="review-score edit-score">{renderEditableStars(editScore ?? review.score)}</p>
                  <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="review-edit-input"
                  />
                  <button onClick={() => setEditMode(null)}>취소</button>
                  <button onClick={() => handleSaveClick(review.id)}>저장</button>
                </div>
                )}
                </div>
            ))
            ) : (
            <p>작성한 리뷰가 없습니다.</p>
            )}
        </div>
      </div>
    );
  };
  
  export default MyReviews;