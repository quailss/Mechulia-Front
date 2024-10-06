import React, {useEffect, useState} from "react";
import { Provider } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import store from "./store/store";
import Navigation from "./components/nav";
import SearchBar from "./components/searchBar";
import axios from "axios";
import "./styles/theme.css";

interface ThemeRecipe {
    name: string;
    image_url: string;
    id: number;
}

interface Slide {
    src: string;
    text: string;
    keyword: string;
}

const Theme: React.FC = () => {
    const API_URL = process.env.REACT_APP_API_URL;

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const keyword = params.get("keyword");
    const navigate = useNavigate();

    //해당 테마 음식 가져오기
    const [recipes, setRecipes] = useState<ThemeRecipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0); 
    const [totalPages, setTotalPages] = useState(1);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0); 
    const slidesPerPage = 4;

    useEffect(() => {
        const fetchThemeRecipes = async () => {
            const requestUrl = `${API_URL}/api/recipes/theme?keyword=${keyword}&page=${currentPage}`;
            
            try {
                const response = await axios.get(requestUrl);

                setRecipes(response.data.recipes || []);
                
                // totalPages 계산
                const totalElements = response.data.totalElements || 0;
                setTotalPages(Math.ceil(totalElements / 15)); 

                setLoading(false);
                } catch (error) {
                    setLoading(false);
                }
            };

        fetchThemeRecipes();
    }, [keyword, currentPage]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error fetching data</div>;
    }

    const text = location.state?.text;

    //다른 테마
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

    const filteredSlides = slides.filter(slide => slide.keyword !== keyword);
    {console.log(filteredSlides)}
    const totalSlides = filteredSlides.length;

    // 이전 슬라이드로 이동
    const handlePrev = () => {
        setCurrentSlideIndex(prevIndex => Math.max(prevIndex - 1, 0));
    };

    // 다음 슬라이드로 이동
    const handleNext = () => {
        setCurrentSlideIndex(prevIndex => Math.min(prevIndex + 1, totalSlides - slidesPerPage));
    };

    //다른 테마로 이동
    const handleClick = (keyword: string, text: string) => {
        navigate(`/theme?keyword=${keyword}`, {state: {text}});
        window.scrollTo(0, 0);
    }

    return (
        <Provider store={store}>
            <div>
                <Navigation />
                <div className="searchbar-fix">
                    <SearchBar /> 
                </div>
                <div className="theme-page">
                    <h2 className="theme-title">{text}</h2>
                </div>

                <div className="theme-menu-container">
                    {recipes.map((recipe, index) => (
                    <div key={index} className="recipe-item" 
                    onClick={() => {
                        const encodedImageUrl = encodeURIComponent(recipe.image_url);
                        navigate(`/recipe?${recipe.name}`, { state: { name: recipe.name, id: recipe.id, image_url: encodedImageUrl } });
                    }}//클릭하면 레시피 페이지로 이동
                    >
                        <img src={recipe.image_url} alt={recipe.name} className="recipe-image" />
                        <h2>{recipe.name}</h2>
                    </div>
                    ))}
                </div>
                <div className="theme-pagination">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setCurrentPage(index);
                                window.scrollTo(0, 0); //화면 최상단으로 스크롤
                            }}
                            disabled={currentPage === index} 
                            className={currentPage === index ? "active-page" : ""}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>

                <h2 className="another-theme">다른 테마</h2>
                <div className="another-theme-page">
                    <div className="another-theme-slider-container">
                        <button className="prev slide-btn" onClick={handlePrev} disabled={currentSlideIndex === 0}>{"←"}</button>

                        <div className="another-theme-slider" >
                            <div 
                                className="slides-wrapper"
                                style={{ 
                                    transform: `translateX(-${currentSlideIndex * (100 / slidesPerPage)}%)`,
                                    transition: "transform 0.5s ease-in-out"
                                }}
                                
                            >
                                {filteredSlides.map((slide, index) => (
                                    <div 
                                    key={index} 
                                    className="another-theme-slide"
                                    onClick={() => handleClick(slide.keyword, slide.text)}
                                    >
                                        <img src={slide.src} alt={slide.text} className="another-theme-image"/>
                                        <p className="another-theme-p">{slide.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button 
                            onClick={handleNext} 
                            disabled={currentSlideIndex >= totalSlides - slidesPerPage}
                            className="next slide-btn"
                        >
                            {"→"}
                        </button>
                    </div>
                </div>
            </div>
            
            <footer className="footer"></footer>

        </Provider>
    );
};

export default Theme;