import React, { useEffect, useState, useRef } from "react";
import { nextSlide, prevSlide, setSlide } from "../store/slices/sliderSlice";
import "../styles/themeSlider.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";

interface Slide {
    src: string;
    text: string;
}

const ThemeSlider: React.FC = () => {
    const dispatch = useDispatch();
    const currentIndex = useSelector((state: RootState) => state.slider.currentIndex);

    const slides: Slide[] = [
        { src: "https://github.com/quailss/image-data/blob/main/meat-1155132_1280.jpg?raw=true", text: "오늘은 고기파티!" },
        { src: "https://github.com/quailss/image-data/blob/main/spicy.jpg?raw=true", text: "매콤한 한방이 필요해" },
        { src: "https://github.com/quailss/image-data/blob/main/soup.jpg?raw=true", text: "따끈따끈 국물로 속을 달래자" },
        { src: "https://github.com/quailss/image-data/blob/main/ramen-6651033_1280.jpg?raw=true", text: "쫄깃쫄깃 면발의 유혹" },
        { src: "https://github.com/quailss/image-data/blob/main/dessert-1786311_1280.jpg?raw=true", text: "입안에서 녹아드는 달달한 디저트" },
        { src: "https://github.com/quailss/image-data/blob/main/japans-1618622_1280.jpg?raw=true", text: "입안 가득 퍼지는 바다의 풍미" },
        { src: "https://github.com/quailss/image-data/blob/main/midnight.jpg?raw=true", text: "오늘도 야식과 함께하는 늦은 밤" },
        { src: "https://github.com/quailss/image-data/blob/main/bibimbap-4887394_1280.jpg?raw=true", text: "전통의 맛, 한식의 품격" },
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

    // 다음 슬라이드로 이동
    const goToNext = () => {
        if (currentIndex < slides.length - 3) {
            dispatch(nextSlide());
        } else {
            dispatch(setSlide(0));
        }
    };

    // 이전 슬라이드로 이동
    const goToPrev = () => {
        if (currentIndex > 0) {
            dispatch(prevSlide());
        } else {
            dispatch(setSlide(slides.length - 3));
        }
    };

    return (
        <div className="slider-wrapper">
        <div className="theme-slider-container">
            {/* 윗 줄 (첫 번째 4개 슬라이드) */}
            <div className="slide-content">
            {slides.slice(0, 4).map((slide, index) => (
                <div key={index} className="slide">
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
                <div key={index} className="slide">
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
