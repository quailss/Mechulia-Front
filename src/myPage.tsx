import React, {useState, useEffect} from "react";
import axios from "axios";
import Navigation from "./components/nav";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import "./styles/myPage.css";

const MyPage:React.FC = () => {
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL;

    const [showPassword, setShowPassword] = useState(false);
    const [memberInfo, setMemberInfo] = useState({
        email: '',
        password: '',
        name: '',
        phoneNumber: '',
        birthday: '',
        provider: ''
    });

    const [passwordError, setPasswordError] = useState('');
    const [isUpdateButtonDisabled, setIsUpdateButtonDisabled] = useState(false);

    // 비밀번호 규칙 확인 함수
    const validatePassword = (password: string) => {
        const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordPattern.test(password);
    };

    // 비밀번호 표시/숨기기 토글 핸들러
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // 비밀번호 변경 핸들러
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const password = e.target.value;
        setMemberInfo({ ...memberInfo, password });

        // 비밀번호가 입력된 경우 유효성 검사
        if (password) {
            if (validatePassword(password)) {
                setPasswordError('');
                setIsUpdateButtonDisabled(false); 
            } else {
                setPasswordError('비밀번호는 영문, 숫자, 특수문자 조합으로 8자 이상 입력해야 합니다.');
                setIsUpdateButtonDisabled(true);
            }
        } else {
            setPasswordError('');
            setIsUpdateButtonDisabled(false);
        }
    };

    //멤버 정보 가져오기
    useEffect(() => {
        const fetchMemberInfo = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/auth/profile`, {
                    withCredentials: true,
                });
                const data = response.data;
                setMemberInfo({
                    email: data.email || '',
                    name: data.name || '',
                    password: data.password || '',
                    phoneNumber: data.phoneNumber || '',
                    birthday: data.birthday || '',
                    provider: data.provider || '',
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
            fetch(`${API_URL}/api/auth/profile/delete-member`, {
                method: 'DELETE',
                credentials: 'include',
            })
            .then(response => {
                if (response.ok) {
                    alert("회원탈퇴가 완료되었습니다.");
                    navigate('/');
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

    //회원 정보 수정
    const handleUpdateMemberInfo = () => {
        //비밀번호 입력 여부에 따라 전달값 설정
        const { email, ...restMemberInfo } = memberInfo;

        const updateMemberInfo = {
            ...restMemberInfo,
            password: memberInfo.password ? memberInfo.password : "",
        };

        console.log('보내는 회원 정보:', updateMemberInfo);
        
        //회원정보 수정 API 호출
        axios.put(`${API_URL}/api/auth/profile/Memberinformation`, updateMemberInfo)
        .then(response => {
            console.log('서버 응답: ', response);
            alert('회원정보가 수정되었습니다.');
            navigate(0);
        })
        .catch(error => {
            console.error('회원정보 수정 실패: ', error);
            alert('회원정보 수정에 실패했습니다.');
        });
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
                        <input
                            type="text"
                            id="useremail"
                            name="useremail"
                            value={memberInfo.email}
                            disabled
                        />
                        <div className="password-container">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                value={memberInfo.password || ''}
                                onChange={handlePasswordChange}
                                required
                                disabled={memberInfo.provider !== 'LOCAL'}
                            />
                            <span
                                onClick={togglePasswordVisibility}
                            >
                                {showPassword ? <FaEye /> : <FaEyeSlash />}
                            </span>
                            {passwordError && (
                                <p className="error-message">{passwordError}</p>
                            )}
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
                        <input 
                            type="text" 
                            id="birthday" 
                            name="birthday" 
                            value={memberInfo.birthday} onChange={(e) => setMemberInfo({ ...memberInfo, birthday: e.target.value })} 
                            maxLength={8} 
                            required />
                    </div>
                </div>
            </div>
            <div className="mypage-button">
                <div className="mypage-button-container">
                    <button className="withdraw-btn" onClick={handleDelete}>회원탈퇴</button>
                    <button className="update-btn" onClick={handleUpdateMemberInfo} disabled={isUpdateButtonDisabled}>업데이트</button>
                </div>
            </div>
        </div>
    );
};

export default MyPage;