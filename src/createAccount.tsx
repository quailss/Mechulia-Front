import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Navigation from "./components/nav";

const Wrapper = styled.div`
  display: flex;
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

const CheckPassword = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
`;

const UserName = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
`;

const PhoneNumber = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
`;

const Date = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
`;

const CreatAccountInput = styled.input`
  width: 600px;
  height: 30px;
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
`;

const NaverLogin = styled.div`
  width: 300px;
  height: 40px;
  background-color: #21d811;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

interface FormProps {
  email: string;
  password: string;
  name: string;
  number: number;
  date: Date;
}

const CreateAccount: React.FC = () => {
  const onClick = () => {
    nvigate("/");
  };
  const nvigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormProps>();
  const onValid = () => {
    alert("가입되었습니다.");
    nvigate("/login");
  };
  return (
    <Wrapper>
      <Navigation />
      <CreateAccountForm onSubmit={handleSubmit(onValid)}>
        <CreateAccountTitle>회원가입</CreateAccountTitle>
        <Email>
          <span>이메일</span>
          <CreatAccountInput
            type="email"
            placeholder="이메일을 입력하세요."
            {...register("email", { required: "이메일은 필수입니다." })}
          />
          <Errors>{errors.email?.message}</Errors>
        </Email>
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
        <KaKaoLogin>카카오 로그인</KaKaoLogin>
        <NaverLogin>네이버 로그인</NaverLogin>
      </CreateAccountForm>
    </Wrapper>
  );
};

export default CreateAccount;
