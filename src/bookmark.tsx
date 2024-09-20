import React, { useEffect, useState } from "react";
import axios from "axios";
import Navigation from "./components/nav";
import SearchBar from "./components/searchBar";
import './styles/bookmark.css';

const Bookmark:React.FC = () => {
    const [bookmark, setBookmark] = useState([]);

    //북마크된 레시피 가져오기
    useEffect(() => {
        const fetchBookmarks = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/bookmark/member", {
                    withCredentials: true,

                });
                console.log("Bookmark Data: ", response.data);
                    setBookmark(response.data);
            } catch (error) {
                console.error("Error fetching bookmark: ", error);
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
        </div>
    );
};

export default Bookmark;