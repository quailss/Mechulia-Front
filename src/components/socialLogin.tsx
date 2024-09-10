import React from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';

const SocialLoginButtons: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();


  const KAKAO_AUTH_URL = `http://localhost:8080/oauth2/authorization/kakao`;
  const NAVER_AUTH_URL = `http://localhost:8080/oauth2/authorization/naver`;

  return (
    <div>
        <a href={KAKAO_AUTH_URL}>
            카카오 로그인
        </a>
        <a href={NAVER_AUTH_URL}>
            네이버 로그인
        </a>
    </div>
  );
};

export default SocialLoginButtons;
