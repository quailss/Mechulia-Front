import React, {useState, useEffect} from "react";
import axios from 'axios';
import { Provider } from "react-redux";
import store from "./store/store";
import Navigation from "./components/nav";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import "./styles/createAccount.css"

const CreateAccount: React.FC = () => {
    const [email, setEmail] = useState("");
    const [isEmailValid, setIsEmailValid] = useState<boolean | null>(null);
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [passwordcheck, setPasswordcheck] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordCheck, setShowPasswordCheck] = useState(false);
    const [phone, setphone] = useState("");
    const [birthYear, setBirthYear] = useState("");
    const [birthMonth, setBirthMonth] = useState("");
    const [birthDay, setBirthDay] = useState("");
    const [errors, setErrors] = useState({
        email: '',
        password: '',
        passwordCheck: '',
        phone: '',
        birth: '',
    });

    const [formValid, setFormValid] = useState(false); 

    // 전화번호 입력값 처리 함수
    const handlephoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, ""); // 숫자만 남기기
        setphone(value); // 포맷팅된 값을 상태에 저장
        if (value.length !== 11) {
            setErrors(prev => ({ ...prev, phone: '휴대폰 번호는 11자리여야 합니다.' }));
        } else {
            setErrors(prev => ({ ...prev, phone: '' }));
        }
    };

    // 이메일 입력 변경 핸들러
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        setIsEmailValid(null); // 이메일을 바꿀 때마다 유효성 검사를 초기화
    };

    // 이메일 중복 확인 요청 핸들러
    const handleEmailCheck = async () => {
        try {
            const response = await axios.post("http://localhost:8080/api/auth/check-email", { email });
            console.log("응답 데이터:", response.data);
            if (response.data === true) {
                setIsEmailValid(true);
                alert("사용 가능한 이메일입니다.");
            } else {
                setIsEmailValid(false);
                setEmail("");
                alert("이미 사용 중인 이메일입니다.");
            }
        } catch (error) {
            console.error("이메일 중복 검사 중 오류 발생:", error);
        }
    };

    // 비밀번호 표시/숨기기 토글 핸들러
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    //비밀번호 체크 표시/숨기기 토글 핸들러
    const togglePasswordCheckVisibility = () => {
        setShowPasswordCheck(!showPasswordCheck);
    };

    // 비밀번호 유효성 검사
    const validatePassword = (password: string) => {
        const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordPattern.test(password)) {
            setErrors(prev => ({ ...prev, password: '영문, 숫자, 특수문자 조합으로 8자 이상 입력해주세요.' }));
        } else {
            setErrors(prev => ({ ...prev, password: '' }));
        }
    };

    // 비밀번호 입력 핸들러
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPassword(value);
        validatePassword(value);
    };

    // 비밀번호 확인 입력 핸들러
    const handlePasswordCheckChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPasswordcheck(value);
        if (password !== value) {
            setErrors(prev => ({ ...prev, passwordCheck: '비밀번호가 일치하지 않습니다.' }));
        } else {
            setErrors(prev => ({ ...prev, passwordCheck: '' }));
        }
    };


    // 생년월일 유효성 검사
    const validatebirth = () => {
        // 글자 수가 맞는지 확인
        if (birthYear.length !== 4 || birthMonth.length !== 2 || birthDay.length !== 2) {
            setErrors(prev => ({ ...prev, birth: '생년월일을 정활히 입력해주세요.' }));
            return;
        }

        const birthPattern = /^\d{4}[01]\d[0-3]\d$/; // YYYYMMDD 형식
        const birth = birthYear + birthMonth.padStart(2, '0') + birthDay.padStart(2, '0');
        if (!birthPattern.test(birth)) {
            setErrors(prev => ({ ...prev, birth: '' }));
        } else {
            setErrors(prev => ({ ...prev, birth: '' }));
        }
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

    // 생년월일이 바뀔 때마다 유효성 검사를 실행
    useEffect(() => {
        validatebirth();
    }, [birthYear, birthMonth, birthDay]);

    useEffect(() => {
        const formIsValid = isFormValid(); // 폼 유효성 확인

        setFormValid(isFormValid()); // 폼 유효성 업데이트
    }, [email, name, password, passwordcheck, phone, birthYear, birthMonth, birthDay, isEmailValid, errors]);

    // 폼 유효성 검사 통과 여부
    const isFormValid = () => {

        return (
            isEmailValid === true &&
            name.trim() !== "" &&
            !errors.password &&
            !errors.passwordCheck &&
            phone.length === 11 &&
            !errors.birth
        );
    };

    //회원가입 api로 정보 보내기
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // 폼 제출 기본 동작 방지
    
        // 생년월일 YYYYMMDD 형식으로 결합
        const birthDate = `${birthYear}-${birthMonth.padStart(2, '0')}-${birthDay.padStart(2, '0')}`;

        const userData = {
            email,
            name,
            password,
            phone,
            birth: birthDate,
        };
    
        try {
            console.log("보내는 데이터: ", userData);
            // Axios를 사용하여 POST 요청 보내기
            const response = await axios.post(
                'http://localhost:8080/api/auth/register',
                userData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );

            console.log("보낸 url: ", response);
            
            if (response.data) {
                alert('회원가입 성공!');
                window.location.href = '/login';
            } else {
                alert('회원가입 실패: ' + response.data.message);
            }
        } catch (error) {
            console.error('회원가입 중 오류 발생:', error);
            alert('회원가입 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="wrapper">
            <div className="management-container">
                <div className="register-container">
                    <h2 className="register-title">회원가입</h2>
                    <h2 className="information">필수입력 정보</h2>
                    <p className="precautions">필수항목이므로 반드시 입력해주세요.</p>
                </div>
                <hr className="divider"></hr>
                <form onSubmit={handleSubmit}>
                <div className="inner-container">
                    <div>
                        <label className="email">이메일</label>
                        <input type="text" id="useremail" name="useremail" className="input-email" value={email} onChange={handleEmailChange} required />
                        <button className={`email-check ${email ? 'active' : ''}`} disabled={!email} onClick={handleEmailCheck}>중복확인</button>
                        {errors.email && <p className="error-text">{errors.email}</p>}
                    </div>
                    <div>
                        <label className="name">이름</label>
                        <input type="text" id="username" name="username" className="input-name" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                        <label className="password">비밀번호</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
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
                    <div>
                        {errors.password && <p className="conditional">{errors.password}</p>}
                    </div>

                    <div style={{ position: 'relative', display: 'inline-block' }}>
                        <label className="check-password">비밀번호 확인</label>
                        <input
                            type={showPasswordCheck ? 'text' : 'password'}
                            id="password-check"
                            name="password-check"
                            className="inputpassword"
                            required
                            value={passwordcheck}
                            onChange={handlePasswordCheckChange}
                            style={{ paddingRight: '30px' }}
                        />
                        <span
                            onClick={togglePasswordCheckVisibility}
                            style={{
                                position: 'absolute',
                                right: '10px',
                                top: '40%',
                                transform: 'translateY(-50%)',
                                cursor: 'pointer',
                            }}
                        >
                            {showPasswordCheck ? <FaEye /> : <FaEyeSlash />}
                        </span>
                    </div>
                    <div>
                        {errors.passwordCheck && <p className="warning">{errors.passwordCheck}</p>}
                    </div>

                    <div>
                        <label className="phonenumber">휴대폰 번호</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={phone}
                            className="input-number"
                            onChange={handlephoneChange}
                            maxLength={12}
                            required
                        />
                        {errors.phone && <p className="error-text">{errors.phone}</p>}
                    </div>

                    <div>
                        <label className="birth">생년월일</label>
                        <input type="text" id="birth-year" name="birth-year" className="input-year" value={birthYear} onChange={handleYearChange} maxLength={4} required />
                        <label className="birthyear">년</label>
                        <input type="text" id="birth-month" name="birth-month" className="input-month" value={birthMonth} onChange={handleMonthChange} maxLength={2} required />
                        <label className="birthmonth">월</label>
                        <input type="text" id="birth-day" name="birth-day" className="input-day" value={birthDay} onChange={handleDayChange} maxLength={2} required />
                        <label className="birthday">일</label>
                        {errors.birth && <p className="error-text">{errors.birth}</p>}
                    </div>
                </div>
                <div className="register-btn-container">
                <button type="submit" className="register-btn" disabled={!formValid}>
                    가입완료
                </button>
                </div>
                </form>
            </div>
        </div>
    );
};

export default CreateAccount;
