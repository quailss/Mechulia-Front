import React, {useState, useEffect} from "react";
import axios from "axios";
import Navigation from "./components/nav";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import "./styles/myPage.css";

const MyPage:React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [memberInfo, setMemberInfo] = useState({
        email: '',
        name: '',
        phoneNumber: '',
        birthday: ''
    });

    // 비밀번호 표시/숨기기 토글 핸들러
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    //멤버 정보 가져오기
    useEffect(() => {
        const fetchMemberInfo = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/auth/profile', {
                    withCredentials: true,
                });
                const data = response.data;
                setMemberInfo({
                    email: data.email || '',
                    name: data.name || '',
                    phoneNumber: data.phoneNumber || '',
                    birthday: data.birthday || ''
                });
            } catch (error) {
                console.error('회원 정보를 가져오는 중 오류 발생:', error);
            }
        };

        fetchMemberInfo();
    }, []);

    //회원 정보 탈퇴
    const handleDelete = () => {
        const confirmed = window.confirm("정말로 탈퇴하시겠습니까?");
        if (confirmed) {
            fetch('http://localhost:8080/api/auth/profile/delete-member', {
                method: 'DELETE',
                credentials: 'include',
            })
            .then(response => {
                if (response.ok) {
                    alert("회원탈퇴가 완료되었습니다.");
                    window.location.href = "/";
                } else {
                    alert("회원 탈퇴에 실패하였습니다. 다시 시도해주세요.");
                }
            })
            .catch(error => {
                console.error("회원 탈퇴 에러: ", error);
                alert("회원 탈퇴 중 오류가 발생했습니다.");
            });
        }
    };

    return (
        <div>
            <Navigation />
            <h1 className="my-page">마이페이지</h1>
            <div className="mypage-controller">
                <div className="mypage-container">
                    <div className="mypage-label">
                        <p>이메일</p>
                        <p>비밀번호</p>
                        <p>이름</p>
                        <p>전화번호</p>
                        <p>생년월일</p>
                    </div>
                    <div className="mypage-input">
                        <input type="text" id="useremail" name="useremail"  value={memberInfo.email} disabled />
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                required
                            />
                            <span
                                onClick={togglePasswordVisibility}
                                style={{
                                    position: 'absolute',
                                    right: '5px',
                                    top: '60%',
                                    transform: 'translateY(-50%)',
                                    cursor: 'pointer',
                                }}
                            >
                                {showPassword ? <FaEye /> : <FaEyeSlash />}
                            </span>
                        </div>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={memberInfo.name}
                            onChange={(e) => setMemberInfo({ ...memberInfo, name: e.target.value })}
                            required
                        />
                        <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={memberInfo.phoneNumber}
                                onChange={(e) => setMemberInfo({ ...memberInfo, phoneNumber: e.target.value })}
                                maxLength={12}
                                required
                        />
                        <input type="text" id="birthday" name="birthday" value={memberInfo.birthday} onChange={(e) => setMemberInfo({ ...memberInfo, birthday: e.target.value })} maxLength={8} required />
                    </div>
                </div>
            </div>
            <div className="mypage-button">
                <div className="mypage-button-container">
                    <button className="withdraw-btn" onClick={handleDelete}>회원탈퇴</button>
                    <button className="update-btn">업데이트</button>
                </div>
            </div>
        </div>
    );
};

export default MyPage;