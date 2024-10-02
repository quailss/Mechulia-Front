import React, {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import "../styles/nav.css";

const Navigation = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    //세션에서 정보 가져오기
    useEffect(() => {
        const fetchSessionInfo = async() => {
            try {
                const response = await axios.get('http://localhost:8080/api/auth', {
                    withCredentials: true,
                });
                const data = response.data;

                if(data.loggedIn) {
                    setLoggedIn(true);
                    setNickname(data.nickname);
                    setEmail(data.email);

                    console.log("이메일: ", setEmail);
                } else {
                    setLoggedIn(false);
                }
            } catch(error) {
                console.error("세션 정보를 가져오는 중 오류 발생: ", error);
            }
        };

        fetchSessionInfo();
    }, []);

    // 로그아웃 핸들러
    const handleLogout = () => {
        fetch('http://localhost:8080/api/auth/logout', {
            method: 'GET',
            credentials: 'include', 
        })
        .then(response => {
            if (response.ok) {
                alert('로그아웃 되었습니다.');
                window.location.reload(); 
            } else {
                console.error('로그아웃 실패');
            }
        })
        .catch(error => {
            console.error('로그아웃 중 오류 발생:', error);
        });
    };

    //드롭다운
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <nav className="nav-container">
            <Link to="/" className="logo-title">메추리아</Link>
            {loggedIn ? (
                <div className="login-nav">
                    <div className="nav-dropdown">
                        <button onClick={toggleDropdown} className="dropdown-toggle">
                            My 🔽
                        </button>
                        {isDropdownOpen && (
                        <ul className="dropdown-menu">
                            <li><Link to="/bookmark">즐겨찾기</Link></li>
                            <li><Link to="/myReviews">내가 쓴 리뷰</Link></li>
                            <li><Link to="/myPage">내 정보관리</Link></li>
                        </ul>
                        )}
                    </div>
                    <button onClick={handleLogout} className="logout">로그아웃</button>
                </div>
            ) : (
                <div>
                    <Link to="/login" className="login">로그인</Link>
                    <Link to="/createAccount" className="membership">회원가입</Link>
                </div>
            )}
        </nav>
    );
};

export default Navigation;