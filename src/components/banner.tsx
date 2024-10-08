import React, { useEffect, useState } from "react";
import { RootState, AppDispatch } from "../store/store";
import { useSelector, useDispatch } from "react-redux";
import { fetchBannerRecipes } from "../store/slices/bannerSlice";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/banner.css"; 
import { convertToWebP } from "../utils/imageUtils";


// 5개의 랜덤 레시피를 선택하는 함수
function getRandomRecipes(recipes: any[]) {
    const shuffled = [...recipes].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
  }

const Banner = () => {
  const dispatch: AppDispatch = useDispatch();
  const { bannerRecipes, status, error } = useSelector((state: RootState) => state.banner);
  const [randomRecipes, setRandomRecipes] = useState<any[]>([]);
  const [convertedImages, setConvertedImages] = useState<string[]>([]);  
  const [currentIndex, setCurrentIndex] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();

  // 컴포넌트가 처음 렌더링될 때 레시피 가져오기
  useEffect(() => {
    dispatch(fetchBannerRecipes());
  }, [dispatch]);

  // 가져온 레시피 중 5개 랜덤 선택 및 WebP 변환
  useEffect(() => {
    const convertAndPreloadImages = async () => {  
      if (bannerRecipes.length > 0) {
        const randomSelection = getRandomRecipes(bannerRecipes);
        setRandomRecipes(randomSelection);
  
        // WebP로 변환된 이미지 배열을 생성
        const converted = await Promise.all(
          randomSelection.map((recipe) => convertToWebP(recipe.image_url))
        );
        setConvertedImages(converted);  // 변환된 WebP 이미지 배열 상태에 저장
  
        // 첫 번째 WebP 이미지 미리 로드
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = converted[0]; 
        document.head.appendChild(link);
      }
    };
  
    convertAndPreloadImages();
  }, [bannerRecipes]);

  // 5초마다 이미지 변경
  useEffect(() => {
      const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % randomRecipes.length); 
      }, 5000);
      return () => clearInterval(interval);
  }, [randomRecipes]); 

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  // WebP 이미지나 기본 이미지 중 현재 이미지 URL을 결정
  const currentRecipe = randomRecipes[currentIndex];
  const currentImageUrl = convertedImages[currentIndex] || (currentRecipe ? currentRecipe.image_url : '');

  // currentRecipe나 currentImageUrl가 undefined일 때 렌더링하지 않도록 조건부 렌더링
  if (!currentRecipe || !currentImageUrl) {
    return <div>Loading...</div>;  // 필요한 데이터가 준비되지 않았을 때 안전하게 처리
  }

  return (
    <div className="banner-container">
      {randomRecipes.length > 0 && (
        <div className="banner-item">
          <img 
            src={currentImageUrl} 
            alt={currentRecipe.name} 
            className="banner-image" 
            loading="lazy" 
          />
          <div className="inner-item">
              <h3 className="banner-name">{currentRecipe.name}</h3>
              <div className="banner-counter">
                  <span className="banner-counter-container">
                      <span className="banner-counter-number">{currentIndex + 1}</span> / {randomRecipes.length}
                  </span>
                  <button
                    className="banner-recipe"
                    onClick={() => {
                      navigate(`/recipe?${currentRecipe.name}`, {
                        state: { name: currentRecipe.name, id: currentRecipe.id, image_url: encodeURIComponent(currentRecipe.image_url) }
                      });
                    }}
                  >
                    레시피 보러가기
                  </button>
              </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Banner;

