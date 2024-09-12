import React, {useState} from "react";
import "./styles/login.css";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import NaverLogin from "./images/naverLogin.png";
import KakaoLogin from "./images/kakaoLogin.png";
import { Link } from "react-router-dom";


const Login: React.FC = () => {

    //카카오, 네이버 로그인
    const KAKAO_AUTH_URL = "http://localhost:8080/oauth2/authorization/kakao";
    const NAVER_AUTH_URL = "http://localhost:8080/oauth2/authorization/naver";

    const handleKakaoLogin = () => {
        window.location.href = KAKAO_AUTH_URL; 
    };

    const handleNaverLogin = () => {
        window.location.href = NAVER_AUTH_URL; 
    };

    // 아이디, 비밀번호 상태 저장
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // 입력 필드의 값이 변경될 때 호출되는 함수
    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    // 비밀번호 표시/숨기기 토글 핸들러
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const isFormValid = username.length > 0 && password.length > 0;

    return(
        <div className="page-container">
            <div className="login-page">
                <h2 className="title">메추리아</h2>
                <div className="login-container">
                    <input type="text" id="username" name="username" className="input-id" required placeholder="아이디 입력" value={username} onChange={handleUsernameChange} />
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                    <input
                        type={showPassword ? 'text' : 'password'} // 비밀번호 표시 상태에 따라 타입 변경
                        id="password"
                        name="password"
                        className="input-password"
                        required
                        placeholder="비밀번호 입력"
                        value={password}
                        onChange={handlePasswordChange}
                        style={{ paddingRight: '30px' }} 
                    />
                    <span
                        onClick={togglePasswordVisibility}
                        style={{
                            position: 'absolute',
                            right: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            cursor: 'pointer',
                        }}
                    >
                        {showPassword ? <FaEye /> : <FaEyeSlash />}
                    </span>
                    </div>
                    <button className={`login-button ${isFormValid ? 'active' : ''}`} disabled={!isFormValid}>로그인</button>
                </div>
                <div className="management-container">
                    <Link to="#" className="register">회원가입</Link>
                    <Link to="#" className="find">ID/PW 찾기</Link>
                </div>
                <div className="division">
                    <hr className="line line-left" />
                    <p className="social-login">SNS 계정으로 로그인</p>
                    <hr className="line line-right" />
                </div>
                <div className="separator">
                    <button className="naver-login" onClick={handleNaverLogin}>
                        <img className="naverLogin" src={NaverLogin} alt="네이버 로그인" />
                    </button>
                    <button className="kakao-login" onClick={handleKakaoLogin}>
                        <img className="kakaoLogin" src={KakaoLogin} alt="카카오 로그인" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;