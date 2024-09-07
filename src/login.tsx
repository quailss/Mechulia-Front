import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  width: 400px;
  height: 400px;
  background-color: #f2f2f2;
  border-radius: 20px;
  position: fixed;
`;

const LoginTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
  width: 300px;
  height: 50px;
  background-color: rgb(38, 158, 38);
  margin-bottom: 20px;
`;

const LoginInput = styled.input`
  width: 250px;
  height: 30px;
  border-radius: 20px;
  text-align: center;
  border: none;
`;

const LoginBtn = styled.button`
  width: 200px;
  height: 50px;
  border-radius: 15px;
  border: none;
  font-family: "GangwonEdu_OTFBoldA";
  font-size: 15px;
  cursor: pointer;
  &:active {
    filter: brightness(70%);
  }
  background-color: rgb(38, 158, 38);
`;

const CreateAccountBtn = styled.span`
  cursor: pointer;
  &:hover {
    text-decoration-line: underline;
  }
`;

const Errors = styled.span`
  color: Red;
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
      <LoginForm onSubmit={handleSubmit(onValid)}>
        <LoginTitle>로그인</LoginTitle>
        <LoginInput
          type="email"
          placeholder="메일을 입력하세요."
          {...register("email", { required: "이메일은 필수입니다." })}
        />
        <Errors>{errors.email?.message}</Errors>
        <LoginInput
          type="password"
          placeholder="비밀번호를 입력하세요."
          {...register("password", {
            required: "비밀번호는 필수입니다.",
            minLength: {
              value: 5,
              message: "비밀번호가 짧습니다.",
            },
          })}
        />
        <Errors>{errors.password?.message}</Errors>
        <LoginBtn>로그인</LoginBtn>
        <CreateAccountBtn onClick={() => navigate("/create-account")}>
          계정이 없으신가요?
        </CreateAccountBtn>
      </LoginForm>
    </Wrapper>
  );
};

export default Login;
