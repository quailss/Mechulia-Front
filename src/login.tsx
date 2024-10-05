import React, {useState, useEffect} from "react";
import "./styles/login.css";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import NaverLogin from "./images/naverLogin.png";
import KakaoLogin from "./images/kakaoLogin.png";
import { Link } from "react-router-dom";
import axios from 'axios';

const Login: React.FC = () => {

    const API_URL = process.env.REACT_APP_API_URL;

    //카카오, 네이버 로그인
    const KAKAO_AUTH_URL = `${API_URL}/oauth2/authorization/kakao`;
    const NAVER_AUTH_URL = `${API_URL}/oauth2/authorization/naver`;

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
    const [isLoginFormValid, setIsLoginFormValid] = useState(false);

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

    // 로그인 버튼 유효성 검사
    useEffect(() => {
        const isValid = username.trim() !== '' && password.trim() !== '';
        setIsLoginFormValid(isValid);
    }, [username, password]);


    // 로그인 처리
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        const loginData = {
            email: username,
            password: password
        };

        try {
            const response = await axios.post(`${API_URL}/api/auth/login`, loginData, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true,
            });

            if (response.status === 200) {
                localStorage.setItem('userEmail', loginData.email);
                alert('로그인 성공!');
                // 세션이 저장될 시간을 확보하기 위해 약간의 지연 추가
                setTimeout(() => {
                    window.location.href = '/'; 
                }, 300)
            } else {
                alert('로그인 실패!');
            }
        } catch (error) {
            alert('로그인 실패!');
        }
    };

    //엔터 키로 로그인 처리
    const handleKeyDown = (event: any) => {
        if (event.key === 'Enter' && isFormValid) {
            handleLogin(event);
        }
    };

    return(
        <div className="page-container">
            <div className="login-page">
                <h2 className="title">메추리아</h2>
                <div className="login-container">
                    <input type="text" id="username" name="username" className="input-id" required placeholder="아이디 입력" value={username} onChange={handleUsernameChange} onKeyDown={handleKeyDown} />
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
                        onKeyDown={handleKeyDown}
                        style={{ paddingRight: '30px' }} 
                    />
                    <span
                        onClick={togglePasswordVisibility}
                        style={{
                            position: 'absolute',
                            right: '10px',
                            top: '55%',
                            transform: 'translateY(-50%)',
                            cursor: 'pointer',
                        }}
                    >
                        {showPassword ? <FaEye /> : <FaEyeSlash />}
                    </span>
                    </div>
                    <button className={`login-button ${isFormValid ? 'active' : ''}`} disabled={!isFormValid} onClick={handleLogin} onKeyDown={handleKeyDown}>로그인</button>
                </div>
                <div className="management-container">
                    <Link to="/createAccount" className="register">회원가입</Link>
                    <Link to="/findAccount" className="find">ID/PW 찾기</Link>
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