import React, { useEffect, useState } from "react";
import axios from "axios";
import Navigation from "./components/nav";
import SearchBar from "./components/searchBar";
import { useNavigate } from "react-router-dom";
import './styles/bookmark.css';

const Bookmark:React.FC = () => {
    const API_URL = process.env.REACT_APP_API_URL;

    const [bookmark, setBookmark] = useState<any[]>([]);
    const navigate = useNavigate();

    //북마크된 레시피 가져오기
    useEffect(() => {
        const fetchBookmarks = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/bookmark/member`, {
                    withCredentials: true,

                });

                setBookmark(response.data);
            } catch (error) {

            }
        };

        fetchBookmarks();
    }, []);

    return(
        <div>
            <Navigation />
            <div className="searchbar-fix">
                <SearchBar />
            </div>
            <h1 className="bookmark-title">즐겨찾기 한 메뉴</h1>
            <div className="bookmark-list">
                {bookmark.map((bookmark, index) => (
                    <div key={index} className="bookmark-card"
                    onClick={() => {
                        const encodedImageUrl = encodeURIComponent(bookmark.imgUrl);
                        navigate(`/recipe?${bookmark.recipeName}`, { state: { name: bookmark.recipeName, id: bookmark.recipeId, image_url: encodedImageUrl } });
                    }}
                    >
                        <img src={bookmark.imgUrl} alt="북마크한 음식 이미지" className="bookmark-image" />
                        <h3>{bookmark.recipeName}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Bookmark;