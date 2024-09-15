import React, { useEffect, useState, useRef } from "react";
import "../styles/themeSlider.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useNavigate } from "react-router-dom";

interface Slide {
    src: string;
    text: string;
    keyword: string;
}

const ThemeSlider: React.FC = () => {
    const dispatch = useDispatch();
    const currentIndex = useSelector((state: RootState) => state.slider.currentIndex);

    const slides: Slide[] = [
        { src: "https://github.com/quailss/image-data/blob/main/meat-1155132_1280.jpg?raw=true", text: "오늘은 고기파티!", keyword:"육류" },
        { src: "https://github.com/quailss/image-data/blob/main/spicy.jpg?raw=true", text: "매콤한 한방이 필요해", keyword:"매운 맛" },
        { src: "https://github.com/quailss/image-data/blob/main/soup.jpg?raw=true", text: "따끈따끈 국물로 속을 달래자", keyword:"국물 요리" },
        { src: "https://github.com/quailss/image-data/blob/main/ramen-6651033_1280.jpg?raw=true", text: "쫄깃쫄깃 면발의 유혹", keyword:"면" },
        { src: "https://github.com/quailss/image-data/blob/main/dessert-1786311_1280.jpg?raw=true", text: "입안에서 녹아드는 달달한 디저트", keyword:"디저트" },
        { src: "https://github.com/quailss/image-data/blob/main/japans-1618622_1280.jpg?raw=true", text: "입안 가득 퍼지는 바다의 풍미", keyword:"해산물" },
        { src: "https://github.com/quailss/image-data/blob/main/midnight.jpg?raw=true", text: "오늘도 야식과 함께하는 늦은 밤", keyword:"야식" },
        { src: "https://github.com/quailss/image-data/blob/main/gimbap.jpg?raw=true", text: "맛있고 간편한 한 끼", keyword:"간편식사" },
    ];

    const slideContainerRef = useRef<HTMLDivElement>(null);
    const [slideWidth, setSlideWidth] = useState(0);

    useEffect(() => {
        const updateSlideWidth = () => {
            if (slideContainerRef.current) {
                const containerWidth = slideContainerRef.current.clientWidth;
                const calculatedSlideWidth = (containerWidth - 60) / 3;
                setSlideWidth(calculatedSlideWidth);
            }
        };

        updateSlideWidth();
        window.addEventListener("resize", updateSlideWidth);

        return () => {
            window.removeEventListener("resize", updateSlideWidth);
        };
    }, []);

    //키워드 값을 상세 페이지로 전달
    const navigate = useNavigate();

    const handleSlideClick = (keyword: string, text: string) => {
        navigate(`/theme?keyword=${keyword}`, {state: {text}});
    }

    return (
        <div className="slider-wrapper">
        <div className="theme-slider-container">
            {/* 윗 줄 (첫 번째 4개 슬라이드) */}
            <div className="slide-content">
            {slides.slice(0, 4).map((slide, index) => (
                <div key={index} className="slide" onClick={() => handleSlideClick(slide.keyword, slide.text)}>
                <div className="slide-box">
                    <div className="slide-image-container">
                    <img src={slide.src} alt={`slide-${index}`} className="slide-image" />
                    </div>
                    <div className="slide-text-box">
                        <h2 className="slide-text">{slide.text}</h2>
                    </div>
                </div>
                </div>
            ))}
            </div>

            {/* 밑 줄 (나머지 4개 슬라이드) */}
            <div className="slide-content">
            {slides.slice(4).map((slide, index) => (
                <div key={index} className="slide" onClick={() => handleSlideClick(slide.keyword, slide.text)}>
                <div className="slide-box">
                    <div className="slide-image-container">
                    <img src={slide.src} alt={`slide-${index}`} className="slide-image" />
                    </div>
                    <div className="slide-text-box">
                        <h2 className="slide-text">{slide.text}</h2>
                    </div>
                </div>
                </div>
            ))}
            </div>
        </div>
        </div>


    );
};

export default ThemeSlider;
