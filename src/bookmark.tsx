import React, { useEffect, useState } from "react";
import axios from "axios";
import Navigation from "./components/nav";
import SearchBar from "./components/searchBar";
import { useLocation, useNavigate } from "react-router-dom";
import './styles/bookmark.css';
import { IoBookmarkSharp } from "react-icons/io5";

const Bookmark:React.FC = () => {
    const [bookmark, setBookmark] = useState<any[]>([]);

    const location = useLocation();
    const navigate = useNavigate();

    //북마크된 레시피 가져오기
    useEffect(() => {
        const fetchBookmarks = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/bookmark/member", {
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
                        const encodedImageUrl = encodeURIComponent(bookmark.recipe.image_url);
                        navigate(`/recipe?${bookmark.recipe.name}`, { state: { name: bookmark.recipe.name, id: bookmark.recipe.id, image_url: encodedImageUrl } });
                    }}
                    >
                        <img src={bookmark.recipe.image_url} className="bookmark-image" />
                        <h3>{bookmark.recipe.name}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Bookmark;