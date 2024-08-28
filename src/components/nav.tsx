import React from "react";
import { Link } from "react-router-dom";
import "../styles/nav.css";

const Navigation = () => {
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.reload();
    };

    return (
        <nav className="nav-container">
            <Link to="/" className="logo-title">메추리아</Link>
            {token ? (
                <div>
                    <button onClick={handleLogout} className="logout">로그아웃</button>
                </div>
            ) : (
                <div>
                    <Link to="/" className="login">로그인</Link>
                    <Link to="/" className="membership">회원가입</Link>
                </div>
            )}
        </nav>
    );
};

export default Navigation;