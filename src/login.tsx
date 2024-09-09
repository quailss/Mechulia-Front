import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { KAKAO_AUTH_URL } from "./oauth";
import Navigation from "./components/nav";

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
  font-size: 30px;
`;

const Email = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
`;

const Password = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
`;

const LoginInput = styled.input`
  width: 600px;
  height: 30px;
  text-align: center;
`;

const LoginBtn = styled.button`
  width: 250px;
  height: 50px;
  border: none;
  font-family: "GangwonEdu_OTFBoldA";
  font-size: 15px;
  cursor: pointer;
  &:active {
    filter: brightness(70%);
  }
  color: white;
  background-color: #1e78ff;
  margin-top: 20px;
`;

const CrtActOrIdPws = styled.div`
  width: 600px;
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
  margin-bottom: 40px;
`;

const CreateAccountBtn = styled.span`
  cursor: pointer;
  &:hover {
    text-decoration-line: underline;
  }
`;

const IdPasswordFind = styled.span`
  cursor: pointer;
  &:hover {
    text-decoration-line: underline;
  }
`;

const Errors = styled.span`
  color: Red;
`;

const Or = styled.span`
  border-top: 1px solid;
  width: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  span {
    position: absolute;
  }

  margin-bottom: 20px;
`;

const KaKaoLogin = styled.div`
  width: 300px;
  height: 40px;
  background-color: #ffd02c;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  margin-top: 20px;
`;

const NaverLogin = styled.div`
  width: 300px;
  height: 40px;
  background-color: #21d811;
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface LoginProps {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginProps>();
  const onValid = () => {
    navigate("/");
  };
  return (
    <Wrapper>
      <Navigation />
      <LoginForm onSubmit={handleSubmit(onValid)}>
        <LoginTitle>로그인</LoginTitle>
        <Email>
          <span>이메일</span>
          <LoginInput
            type="email"
            placeholder="메일을 입력하세요."
            {...register("email", { required: "이메일은 필수입니다." })}
          />
          <Errors>{errors.email?.message}</Errors>
        </Email>
        <Password>
          <span>비밀번호</span>
          <LoginInput
            type="password"
            placeholder="비밀번호를 입력하세요."
            {...register("password", {
              required: "비밀번호는 필수입니다.",
              minLength: {
                value: 4,
                message: "비밀번호가 짧습니다.",
              },
            })}
          />
          <Errors>{errors.password?.message}</Errors>
        </Password>
        <LoginBtn>로그인</LoginBtn>
        <CrtActOrIdPws>
          <CreateAccountBtn onClick={() => navigate("/create-account")}>
            회원가입
          </CreateAccountBtn>
          <IdPasswordFind>아이디·비밀번호 찾기</IdPasswordFind>
        </CrtActOrIdPws>
        <Or>
          <span>또는</span>
        </Or>
        <KaKaoLogin>
          <a href={KAKAO_AUTH_URL}>카카오 로그인</a>
        </KaKaoLogin>
        <NaverLogin>네이버 로그인</NaverLogin>
      </LoginForm>
    </Wrapper>
  );
};

export default Login;
