import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { KAKAO_AUTH_URL, NAVER_AUTH_URL } from "./oauth";
import Navigation from "./components/nav";
import axios from "axios";

const Wrapper = styled.div`
  display: flex;
  top: -240px;
  justify-content: center;
  position: relative;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  position: fixed;
`;

const LoginTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  margin-bottom: 56px;
  position: relative;
`;

const PasswordHide = styled.div`
  position: absolute;
  top: 165px;
  left: 450px;
`;

const LoginInput = styled.input`
  width: 376px;
  height: 48px;
  margin-bottom: 12px;
  padding-left: 16px;
  box-sizing: border-box;
  border: 1px solid #ebebeb;
`;

const LoginBtn = styled.button`
  width: 376px;
  height: 48px;
  border: none;
  cursor: pointer;
  &:active {
    filter: brightness(70%);
  }
  color: #9999;
  background-color: #ebebeb;
`;

const CrtActOrIdPws = styled.div`
  width: 600px;
  display: flex;
  justify-content: center;
  margin-top: 40px;
  margin-bottom: 40px;
`;

const CreateAccountBtn = styled.span`
  width: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:hover {
    text-decoration-line: underline;
  }
`;

const IdPasswordFind = styled.span`
  width: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-left: 1px solid #ebebeb;
  cursor: pointer;
  &:hover {
    text-decoration-line: underline;
  }
`;

const Errors = styled.span`
  color: Red;
`;

const Or = styled.span`
  width: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #767676;
  gap: 15px;
  :nth-child(1) {
    border-top: 1px solid #d9d9d9;
    width: 112px;
  }
  :nth-child(3) {
    border-top: 1px solid #d9d9d9;
    width: 112px;
  }
  margin-bottom: 20px;
`;

const KaKaoLogin = styled.div`
  gap: 16px;
  width: 376px;
  height: 48px;
  background-color: #ffd02c;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  margin-top: 14px;
  text-decoration-line: none;
  &:active {
    filter: brightness(70%);
  }
`;

const NaverLogin = styled.div`
  color: #fff;
  gap: 16px;
  width: 376px;
  height: 48px;
  background-color: #21d811;
  display: flex;
  align-items: center;
  justify-content: center;
  &:active {
    filter: brightness(70%);
  }
`;

interface LoginProps {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [show, setShow] = useState(false);
  const onClick = () => {
    setShow((prev) => !prev);
  };
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginProps>();
  const onValid = async ({ email, password }: LoginProps) => {
    try {
      await axios.post("http://localhost:8080/auth/login", {
        email,
        password,
      });
      sessionStorage.setItem("email", email);
      sessionStorage.setItem("password", password);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Wrapper>
      <Navigation />
      <LoginForm onSubmit={handleSubmit(onValid)}>
        <LoginTitle>로그인</LoginTitle>
        <PasswordHide onClick={onClick}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17.1363 16.3834L14.7529 14C14.8761 13.8029 14.9715 13.572 15.0393 13.3072C15.107 13.0423 15.1409 12.7744 15.1409 12.5035C15.1409 11.6289 14.836 10.8868 14.2263 10.2771C13.6166 9.66744 12.8745 9.36259 12 9.36259C11.729 9.36259 11.4642 9.39338 11.2055 9.45497C10.9469 9.51655 10.7129 9.61509 10.5035 9.75058L8.47113 7.69977C8.90223 7.50269 9.45343 7.33025 10.1247 7.18245C10.796 7.03464 11.4519 6.96074 12.0924 6.96074C13.7552 6.96074 15.2887 7.41647 16.6928 8.32794C18.097 9.23941 19.1686 10.465 19.9076 12.0046C19.9446 12.0662 19.9692 12.1401 19.9815 12.2263C19.9938 12.3125 20 12.4049 20 12.5035C20 12.602 19.9938 12.6975 19.9815 12.7898C19.9692 12.8822 19.9446 12.9592 19.9076 13.0208C19.5874 13.6982 19.1932 14.3202 18.7252 14.8868C18.2571 15.4534 17.7275 15.9523 17.1363 16.3834ZM17.8014 20.1524L15.1039 17.5104C14.6728 17.6828 14.1863 17.8152 13.6443 17.9076C13.1024 18 12.5543 18.0462 12 18.0462C10.3002 18.0462 8.74211 17.5905 7.32564 16.679C5.90916 15.7675 4.83141 14.542 4.09238 13.0023C4.05543 12.9284 4.03079 12.8514 4.01848 12.7714C4.00616 12.6913 4 12.602 4 12.5035C4 12.4049 4.00924 12.3095 4.02771 12.2171C4.04619 12.1247 4.06774 12.0477 4.09238 11.9861C4.35104 11.4319 4.68052 10.893 5.08083 10.3695C5.48114 9.84604 5.95227 9.35027 6.49423 8.88222L4.55427 6.94226C4.44342 6.83141 4.38799 6.70208 4.38799 6.55427C4.38799 6.40647 4.44342 6.27714 4.55427 6.16628C4.66513 6.05543 4.79754 6 4.9515 6C5.10547 6 5.23788 6.05543 5.34873 6.16628L18.5774 19.3949C18.6759 19.4935 18.7252 19.6135 18.7252 19.7552C18.7252 19.8968 18.6759 20.0231 18.5774 20.1339C18.4788 20.2571 18.3526 20.3187 18.1986 20.3187C18.0447 20.3187 17.9122 20.2633 17.8014 20.1524ZM12 15.6443C12.1724 15.6443 12.3572 15.6289 12.5543 15.5982C12.7513 15.5674 12.9176 15.5212 13.0531 15.4596L9.04388 11.4503C8.98229 11.5982 8.9361 11.7644 8.90531 11.9492C8.87452 12.1339 8.85912 12.3187 8.85912 12.5035C8.85912 13.3903 9.16705 14.1355 9.78291 14.739C10.3988 15.3426 11.1378 15.6443 12 15.6443ZM13.94 13.1871L11.3164 10.5635C12.0801 10.2802 12.7883 10.428 13.4411 11.0069C14.0939 11.5858 14.2602 12.3125 13.94 13.1871Z"
              fill="#999999"
            />
          </svg>
        </PasswordHide>
        <LoginInput
          type="email"
          placeholder="아이디 입력"
          {...register("email", { required: "이메일은 필수입니다." })}
        />
        <Errors>{errors.email?.message}</Errors>
        <LoginInput
          type={show ? "text" : "password"}
          placeholder="비밀번호를 입력"
          {...register("password", {
            required: "비밀번호는 필수입니다.",
            minLength: {
              value: 4,
              message: "비밀번호가 짧습니다.",
            },
          })}
        />
        <Errors>{errors.password?.message}</Errors>
        <LoginBtn>로그인</LoginBtn>
        <CrtActOrIdPws>
          <CreateAccountBtn onClick={() => navigate("/create-account")}>
            회원가입
          </CreateAccountBtn>
          <IdPasswordFind onClick={() => navigate("/find")}>
            ID/PW찾기
          </IdPasswordFind>
        </CrtActOrIdPws>
        <Or>
          <span></span>
          <span>SNS 계정으로 로그인</span>
          <span></span>
        </Or>
        <a style={{ textDecorationLine: "none" }} href={KAKAO_AUTH_URL}>
          <KaKaoLogin>
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M9.00002 0.599976C4.02917 0.599976 0 3.71293 0 7.55226C0 9.94 1.5584 12.0449 3.93152 13.2969L2.93303 16.9445C2.84481 17.2668 3.21341 17.5237 3.49646 17.3369L7.87334 14.4482C8.2427 14.4838 8.61808 14.5046 9.00002 14.5046C13.9705 14.5046 17.9999 11.3918 17.9999 7.55226C17.9999 3.71293 13.9705 0.599976 9.00002 0.599976Z"
                fill="black"
              />
            </svg>

            <span>카카오 로그인</span>
          </KaKaoLogin>
        </a>
        <a style={{ textDecorationLine: "none" }} href={NAVER_AUTH_URL}>
          <NaverLogin>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.8491 8.56267L4.91687 0H0V16H5.15088V7.436L11.0831 16H16V0H10.8491V8.56267Z"
                fill="white"
              />
            </svg>
            <span>네이버 로그인</span>
          </NaverLogin>
        </a>
      </LoginForm>
    </Wrapper>
  );
};

export default Login;
