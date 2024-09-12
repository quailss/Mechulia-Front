import React, {useState} from "react";
import axios from 'axios';
import { Provider } from "react-redux";
import store from "./store/store";
import Navigation from "./components/nav";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import "./styles/createAccount.css"

const CreateAccount: React.FC = () => {
    const [email, setEmail] = useState("");
    const [isEmailValid, setIsEmailValid] = useState<boolean | null>(null); 

    const [password, setPassword] = useState('');
    const [passwordcheck, setPasswordcheck] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [birthYear, setBirthYear] = useState("");
    const [birthMonth, setBirthMonth] = useState("");
    const [birthDay, setBirthDay] = useState("");
    

    // 전화번호 입력값 처리 함수
    const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, ""); // 숫자만 남기기

        setPhoneNumber(value); // 포맷팅된 값을 상태에 저장
    };

    // 이메일 입력 변경 핸들러
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        setIsEmailValid(null);
    };

    // 이메일 중복 확인 요청 핸들러
    const handleEmailCheck = async () => {
        try {
            const response = await axios.post("http://localhost:8080/api/auth/check-email", { email });
            const { available } = response.data;

            console.log("응답 데이터:", response.data);

            if (available) {
                // 이메일 사용 가능
                setIsEmailValid(true);
                alert("사용 가능한 이메일입니다.");
            } else {
                // 이메일 중복
                setIsEmailValid(false);
                setEmail(""); // 이메일을 지움
                alert("이미 사용 중인 이메일입니다.");
            }
        } catch (error) {
            console.error("이메일 중복 검사 중 오류 발생:", error);
        }
    };

    // 이메일 입력 여부에 따라 버튼 스타일 클래스 설정
    const isEmailEntered = email.length > 0;


    // 비밀번호 표시/숨기기 토글 핸들러
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handlePasswordCheckChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordcheck(e.target.value);
    };

    // 생년월일 입력값 처리 함수 (연, 월, 일 각각 관리)
    const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, "");
        setBirthYear(value);
    };

    const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, "");
        setBirthMonth(value);
    };

    const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, ""); 
        setBirthDay(value);
    };

    return(
        <Provider store={store}>
            <Navigation />
            <div className="wrapper">
                <div className="management-container">
                    <div className="register-container">
                    <h2 className="register-title">회원가입</h2>
                    <h2 className="information">필수입력 정보</h2>
                    <p className="precautions">필수항목이므로 반드시 입력해주세요.</p>
                    </div>
                    <hr className="divider"></hr>
                    <div className="inner-container">
                        <div>
                            <label className="email">이메일 </label>
                            <input type="text" id="useremail" name="useremail" className="input-email" value={email} onChange={handleEmailChange} required />
                            <button className={`email-check ${isEmailEntered ? 'active' : ''}`} disabled={!isEmailEntered} onClick={handleEmailCheck}>중복확인</button>
                        </div>
                        <div>
                            <label className="name">이름</label>
                            <input type="text" id="username" name="username" className="input-name" required />
                        </div>
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                            <label className="password">비밀번호</label>
                            <input
                                type={showPassword ? 'text' : 'password'} // 비밀번호 표시 상태에 따라 타입 변경
                                id="password"
                                name="password"
                                className="inputpassword"
                                required
                                value={password}
                                onChange={handlePasswordChange}
                                style={{ paddingRight: '30px' }} 
                            />
                            <span
                                onClick={togglePasswordVisibility}
                                style={{
                                    position: 'absolute',
                                    right: '10px',
                                    top: '40%',
                                    transform: 'translateY(-50%)',
                                    cursor: 'pointer',
                                }}
                        >
                            {showPassword ? <FaEye /> : <FaEyeSlash />}
                        </span>
                        </div>
                        <p className="conditional">영문, 숫자, 특수문자 조합으로 8자 이상 입력해주세요.</p>

                        <div style={{ position: 'relative', display: 'inline-block' }}>
                            <label className="check-password">비밀번호 확인</label>
                            <input
                                type={showPassword ? 'text' : 'password'} // 비밀번호 표시 상태에 따라 타입 변경
                                id="password-check"
                                name="password-check"
                                className="inputpassword"
                                required
                                value={passwordcheck}
                                onChange={handlePasswordCheckChange}
                                style={{ paddingRight: '30px' }} 
                            />
                            <span
                                onClick={togglePasswordVisibility}
                                style={{
                                    position: 'absolute',
                                    right: '10px',
                                    top: '40%',
                                    transform: 'translateY(-50%)',
                                    cursor: 'pointer',
                                }}
                        >
                            {showPassword ? <FaEye /> : <FaEyeSlash />}
                        </span>
                        </div>
                        <p className="warning">비밀번호가 일치하지 않습니다.</p>

                        <div>
                            <label className="phonenumber">휴대폰 번호</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={phoneNumber}
                                className="input-number"
                                onChange={handlePhoneNumberChange}
                                maxLength={13}
                                required
                            />
                        </div>

                        <div>
                            <label className="birth">생년월일</label>
                            <input type="text" id="birth-year" name="birth-year" className="input-year" value={birthYear} onChange={handleYearChange} maxLength={4} required />
                            <label className="birthyear">년</label>
                            <input type="text" id="birth-month" name="birth-month" className="input-month" value={birthMonth} onChange={handleMonthChange} maxLength={2} required />
                            <label className="birthmonth">월</label>
                            <input type="text" id="birth-day" name="birth-day" className="input-day" value={birthDay} onChange={handleDayChange} maxLength={2} required />
                            <label className="birthday">일</label>
                        </div>
                    </div>
                    <div className="register-btn-container">
                        <button className="register-btn">가입완료</button>
                    </div>
                </div>
            </div>
        </Provider>
    );
};

export default CreateAccount;