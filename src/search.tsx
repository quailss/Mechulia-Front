import React, { useRef, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoSearch } from "react-icons/io5";
import Navigation from "./components/nav";
import axios from "axios";
import "./styles/search.css";

const Search: React.FC = () => {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const [keyword, setKeyword] = useState(''); 
    const [recipes, setRecipes] = useState([]); 
    const [loading, setLoading] = useState(false); 
    const [totalResults, setTotalResults] = useState(0);

    //클릭하면 레시피 페이지로 이동
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const navigate = useNavigate();

    //해당 페이지로 이동하면 자동으로 input에 포커스 주기
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    // 검색어 변경 핸들러
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setKeyword(e.target.value);
    };

    // 검색 버튼 클릭 핸들러
    const handleSearch = async () => {
        if (!keyword) {
            alert('검색어를 입력해주세요.');
            return;
        }

        try {
            setLoading(true); // 로딩 시작
            const response = await axios.get(`http://localhost:8080/api/recipes/search`, {
                params: {
                    menuId: 0, // 적절한 menuId로 설정
                    keyword: keyword,
                },
            });
            setRecipes(response.data.recipes);
            setTotalResults(response.data.totalElements);
        } catch (error) {
            console.error('검색 중 에러 발생:', error);
            alert('검색에 실패했습니다.');
        } finally {
            setLoading(false); // 로딩 종료
        }
    };

    // Enter 키로 검색 실행
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };
    

    return (
        <div>
            <Navigation />

            <div className="search-container">
                <h2 className="search-text">레시피가 궁금한 음식을 검색해보세요.</h2>
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="레시피를 입력해주세요."
                    className="search-bar search-input"
                    value={keyword}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                />
                <IoSearch className="search-icon" onClick={handleSearch}/>

                {/*검색 결과 표시*/}
                <div>
                {loading ? (
                    <p>검색 중...</p>
                ) : (
                <div className="search-result-container">
                    {totalResults > 0 && (
                        <p className="search-total">총 검색 결과: {totalResults}개</p>
                    )}

                        {recipes.length > 0 ? (
                            <ul className="search-list">
                                {recipes.map((recipe: any) => (
                                    <li key={recipe.id}
                                    onClick={() => {
                                        const encodedImageUrl = encodeURIComponent(recipe.image_url);
                                        navigate(`/recipe?${recipe.name}`, { state: { name: recipe.name, id: recipe.id, image_url: encodedImageUrl } });
                                    }}
                                    >
                                        <img 
                                            src={recipe.image_url} 
                                            alt={recipe.name} 
                                            className="search-image"
                                        />
                                        <p>{recipe.name}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>검색 결과가 없습니다.</p>
                        )}
                    </div>
                    )}
                </div>
                <footer className="search-footer"></footer>
            </div>
        </div>
    );
};

export default Search;