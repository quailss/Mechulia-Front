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

const CreateAccountForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  width: 400px;
  height: 600px;
  background-color: #f2f2f2;
  border-radius: 20px;
  position: fixed;
`;

const CreateAccountTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
  width: 300px;
  height: 50px;
  background-color: rgb(38, 158, 38);
  margin-bottom: 20px;
`;

const CreatAccountInput = styled.input`
  width: 250px;
  height: 30px;
  border-radius: 20px;
  text-align: center;
  border: none;
`;

const CreateAccountBtn = styled.button`
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

const LoginBtn = styled.span`
  cursor: pointer;
  &:hover {
    text-decoration-line: underline;
  }
`;

const Errors = styled.span`
  color: Red;
`;

interface FormProps {
  email: string;
  password: string;
  name: string;
  number: number;
  date: Date;
}

const CreateAccount: React.FC = () => {
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
      <CreateAccountForm onSubmit={handleSubmit(onValid)}>
        <CreateAccountTitle>회원가입</CreateAccountTitle>
        <CreatAccountInput
          type="email"
          placeholder="이메일을 입력하세요."
          {...register("email", { required: "이메일은 필수입니다." })}
        />
        <Errors>{errors.email?.message}</Errors>
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
        <CreatAccountInput
          type="name"
          placeholder="이름을 입력하세요."
          {...register("name", {
            required: "이름은 필수입니다.",
            maxLength: 10,
          })}
        />
        <Errors>{errors.name?.message}</Errors>
        <CreatAccountInput
          type="number"
          placeholder="전화번호를 입력하세요."
          {...register("number", { required: "전화번호는 필수입니다." })}
        />
        <Errors>{errors.number?.message}</Errors>
        <CreatAccountInput
          type="date"
          placeholder="생년월일을 입력하세요."
          {...register("date", { required: "생년월일은 필수입니다." })}
        />
        <Errors>{errors.date?.message}</Errors>
        <CreateAccountBtn>가입</CreateAccountBtn>
        <LoginBtn onClick={() => nvigate("/login")}>
          이미 계정이 있으신가요?
        </LoginBtn>
      </CreateAccountForm>
    </Wrapper>
  );
};

export default CreateAccount;
