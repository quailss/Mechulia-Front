import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Navigation from "./components/nav";
import axios from "axios";
import { KAKAO_AUTH_URL, NAVER_AUTH_URL } from "./oauth";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const CreateAccountForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
`;

const CreateAccountTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

const InfoTitle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 640px;
`;

const InfoFirstTitle = styled.span`
  font-size: 20px;
`;

const InfoSecondTitle = styled.span`
  color: #6666;
  font-size: 14px;
`;

const Email = styled.div`
  width: 640px;
  display: grid;
  grid-template-columns: 1fr 376px 1fr;
  margin-top: 20px;
`;

const CheckEmail = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  background-color: #42c6ff;
  width: 112px;
`;

const Password = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  margin-top: 20px;
`;

const CheckPassword = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  margin-top: 20px;
`;

const UserName = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  margin-top: 20px;
`;

const PhoneNumber = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  margin-top: 20px;
`;

const Date = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  margin-top: 20px;
`;

const CreatAccountInput = styled.input`
  height: 40px;
  text-align: center;
`;

const CreateAccountOrOut = styled.div`
  display: flex;
  gap: 20px;
`;

const OutBtn = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 150px;
  height: 40px;
  border: none;
  font-family: "GangwonEdu_OTFBoldA";
  font-size: 15px;
  cursor: pointer;
  &:active {
    filter: brightness(70%);
  }
  background-color: #ff8946;
`;

const CreateAccountBtn = styled.button`
  width: 150px;
  height: 40px;
  border: none;
  font-family: "GangwonEdu_OTFBoldA";
  font-size: 15px;
  cursor: pointer;
  &:active {
    filter: brightness(70%);
  }
  background-color: #62a1ff;
`;

const Line = styled.div`
  border-top: 1px solid;
  width: 600px;
  margin-top: 40px;
`;

const Errors = styled.span`
  color: Red;
`;

const KaKaoLogin = styled.div`
  width: 300px;
  height: 40px;
  background-color: #ffd02c;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  margin-top: 40px;
  &:active {
    filter: brightness(70%);
  }
`;

const NaverLogin = styled.div`
  width: 300px;
  height: 40px;
  background-color: #21d811;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  &:active {
    filter: brightness(70%);
  }
`;

interface FormProps {
  email: string;
  password: string;
  name: string;
  number: number;
  date: Date;
}

const CreateAccount: React.FC = () => {
  const [check, setCheck] = useState("");
  const [error, setError] = useState("");
  const checkEmails = async () => {
    try {
      const response = await axios.post("http://localhost:8080/auth/register");
      const Emails: string[] = await response.data;
      if (Emails.includes(check)) {
        setError("중복된 이메일이 있습니다.");
      } else {
        setError("");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCheck(e.currentTarget.value);
  };

  const onClick = () => {
    navigate("/");
  };

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormProps>();
  const onValid = async ({
    email,
    password,
    name,
    number,
    date,
  }: FormProps) => {
    try {
      await axios.post("http://localhost:8080/auth/register", {
        email,
        password,
        name,
        number,
        date,
      });
      alert("가입되었습니다.");
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Wrapper>
      <Navigation />
      <CreateAccountTitle>회원가입</CreateAccountTitle>
      <InfoTitle>
        <InfoFirstTitle>필수입력 정보</InfoFirstTitle>
        <InfoSecondTitle>필수항목이므로 반드시 입력해주세요.</InfoSecondTitle>
      </InfoTitle>
      <CreateAccountForm onSubmit={handleSubmit(onValid)}>
        <Email>
          <span>이메일</span>
          <CreatAccountInput
            type="email"
            placeholder="이메일을 입력하세요."
            {...register("email", {
              required: "이메일은 필수입니다.",
              onChange: onChange,
            })}
          />
          <CheckEmail onClick={() => checkEmails}>중복 확인</CheckEmail>
        </Email>
        <Errors>{errors.email?.message}</Errors>
        <Errors>{error}</Errors>
        <Password>
          <span>비밀번호</span>
          <CreatAccountInput
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
        <CheckPassword>
          <span>비밀번호 확인</span>
          <CreatAccountInput
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
        </CheckPassword>
        <UserName>
          <span>이름</span>
          <CreatAccountInput
            type="name"
            placeholder="이름을 입력하세요."
            {...register("name", {
              required: "이름은 필수입니다.",
              maxLength: 10,
            })}
          />
          <Errors>{errors.name?.message}</Errors>
        </UserName>
        <PhoneNumber>
          <span>전화번호</span>
          <CreatAccountInput
            type="number"
            placeholder="전화번호를 입력하세요."
            {...register("number", { required: "전화번호는 필수입니다." })}
          />
          <Errors>{errors.number?.message}</Errors>
        </PhoneNumber>
        <Date>
          <span>생년월일</span>
          <CreatAccountInput
            type="date"
            placeholder="생년월일을 입력하세요."
            {...register("date", { required: "생년월일은 필수입니다." })}
          />
          <Errors>{errors.date?.message}</Errors>
        </Date>
        <CreateAccountOrOut>
          <OutBtn onClick={onClick}>취소</OutBtn>
          <CreateAccountBtn>가입</CreateAccountBtn>
        </CreateAccountOrOut>
        <Line />
        <a href={KAKAO_AUTH_URL}>
          <KaKaoLogin>카카오 로그인</KaKaoLogin>
        </a>
        <a href={NAVER_AUTH_URL}>
          <NaverLogin>네이버 로그인 </NaverLogin>
        </a>
      </CreateAccountForm>
    </Wrapper>
  );
};

export default CreateAccount;
