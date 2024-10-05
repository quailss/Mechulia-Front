import React, { useState } from "react";
import axios from 'axios';
import Navigation from "./components/nav";
import "./styles/findAccount.css";
import PopUp from './components/popup';
import { useNavigate } from "react-router-dom";

const FindAccount:React.FC = () => {
    const API_URL = process.env.REACT_APP_API_URL;

    const navigate = useNavigate();
    //아이디 찾기
    const [username, setUsername] = useState('');
    const [userphone, setUserphone] = useState('');
    //서버에서 받은 이메일
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false); 

    //비밀번호 재설정
    const [user_name, setUser_name] = useState('');
    const [user_phone, setUser_phone] = useState('');
    const [resetpassword, setResetpassword] = useState('');

    //두 입력값이 모두 채워졌는지 확인(아이디 찾기)
    const isFormValid = username && userphone;

    //입력값이 모두 채워졌는지 확인(비밀번호 재설정)
    const isPasswordValid = user_name && user_phone && resetpassword;

    //아이디 찾기
    const handleFindId = async () => {
        try {
          // 입력한 이름과 전화번호로 POST 요청
          const response = await axios.post(`${API_URL}/api/auth/find-id`, {
            name: username,
            phoneNumber: userphone,
          });
    
          // 서버에서 받은 이메일을 상태로 저장
          setEmail(response.data);
          setErrorMessage('');
          setIsModalOpen(true);

          //null 값인 경우
          const receivedEmail = response.data;

          if (receivedEmail === '이메일:null') {
            setErrorMessage('해당 사용자를 찾을 수 없습니다.');
            setEmail(''); 
          } else {
            setEmail(receivedEmail);
            setErrorMessage(''); 
          }
          setIsModalOpen(true); 

        } catch (error: any) {
          // 오류 발생 시 메시지 출력
          if (error.response && error.response.status === 404) {
            setErrorMessage('해당 사용자를 찾을 수 없습니다.');
          } else {
            setErrorMessage('오류가 발생했습니다. 다시 시도해주세요.');
          }
          setEmail(''); 
          setIsModalOpen(true);
        }
    };

    //비밀번호 재설정
    const handleChangePassword = async() => {
      try {
        const response = await axios.post(`${API_URL}/api/auth/reset-password`, {
          email: user_name,
          phoneNumber: user_phone,
          password: resetpassword,
        });
        
        alert("비밀번호 재설정이 완료됐습니다.")
        navigate('/login');
      } catch (error: any) {
        alert("입력하신 정보가 맞는지 확인해주세요.");
      }
    };

    return(
        <div>
            <Navigation />
            <div className="find-id-container">
                <h1>아이디 찾기</h1>
                <div>
                    <label className="text-font">이름 </label>
                    <input type="text" id="username" name="username" className="search-id" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div>
                    <label className="text-font">전화번호 </label>
                    <input type="phone" id="userphone" name="userphone" className="search-phone" value={userphone} onChange={(e) => setUserphone(e.target.value)} required />
                </div>
                <button className={`find-id-button ${isFormValid ? 'active' : ''}`}  disabled={!isFormValid} onClick={handleFindId}>아이디 찾기</button>
                {/*팝업창*/}
                <div className="popup-wrapper">
                  <PopUp isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                      {email ? (
                          <p>{email}</p>
                      ) : (
                          <p style={{ color: 'red' }}>{errorMessage}</p>
                      )}
                  </PopUp>
              </div>
            </div>

            <hr className="id-password-divider"></hr>

            <div className="reset-password-container">
                <h1>비밀번호 재설정</h1>
                <div>
                    <label className="text-font">이메일 </label>
                    <input type="text" id="username" name="username" className="search-id" value={user_name} onChange={(e) => setUser_name(e.target.value)} required />
                </div>
                <div>
                    <label className="text-font">전화번호 </label>
                    <input type="phone" id="userphone" name="userphone" className="search-phone" value={user_phone} onChange={(e) => setUser_phone(e.target.value)} required />
                </div>
                <div>
                    <label className="text-font">새로운 비밀번호 </label>
                    <input type="password" id="password" name="password" className="reset-password" value={resetpassword} onChange={(e) => setResetpassword(e.target.value)} required />
                </div>
            </div>
            <div className="reset-button-container">
              <button className={`reset-password-button ${isPasswordValid ? 'active' : ''}`} onClick={handleChangePassword}>비밀번호 재설정</button>
            </div>

            <footer className="footer"></footer>
        </div>
    );
};

export default FindAccount;