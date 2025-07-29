import { Form, Row } from 'antd';
import styled from 'styled-components';

export const FormRegisterSuccess = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const LabelOTP = styled.div`
  display: flex;
  justify-content: center;
  text-align: center;
  font-weight: 500;
  font-size: 14px;
  color: ${({ theme }) => theme.contentPlaceholder};
  margin-bottom: 20px;
`;

export const LabelRegisterSuccess = styled.div`
  font-weight: 600;
  font-size: 18px;
  color: #4a4b4f;
`;

export const FormItem = styled(Form.Item)`
  width: calc(50% - 6px);
`;
export const WrapperFormItem = styled(Form.Item)`
  .ant-form-item-control-input-content {
    display: flex;
    justify-content: space-between;
  }
`;

export const WrapperRegister = styled.div`
  text-align: center;
  margin-top: 24px;
  font-weight: 400;
  font-size: 13px;
`;
export const ButtonRegister = styled.span`
  cursor: pointer;
  font-weight: 600;
  font-size: 13px;
  color: ${({ theme }) => theme.primary};
  text-decoration-line: underline;
`;

export const Wrapper = styled.div`
  height: 100vh;
  width: 100vw;
`;

export const WrapperFormLogin = styled.div`
  height: calc(100% - 45px);
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const WrapperRow = styled(Row)`
  height: 100%;
  padding: 24px;
`;

export const TitleOtp = styled.div`
  text-align: center;
  font-weight: 600;
  font-size: 18px;
  margin-bottom: 25px;
  color: #4a4b4f;
`;

export const WrapperImage = styled.div`
  height: 100%;
  display: flex;
  justify-content: flex-end;
  position: relative;
  > img {
    border-radius: 5%;
    width: 100%;
    height: auto;
  }
`;

export const WrapperButton = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
  gap: 12px;
  .ant-btn {
    min-width: 120px;
  }
`;
export const ErrorDetail = styled.div`
  text-align: center;
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  padding-left: 10px;
  color: ${({ theme }) => theme.statusRed};
`;
export const ForgotPassword = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 24px;

  > div {
    cursor: pointer;
    color: ${({ theme }) => theme.primary};
    font-weight: 400;
    font-size: 13px;
  }
`;

export const LoginPassport = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
export const LoginPassportItem = styled.div`
  padding: 30px 15px 15px;
  border: 1px solid #d8d8d8;
  cursor: pointer;
  width: max-content;
  border-radius: 16px;
  box-shadow: 2px 2px 7px rgb(201 201 201);
  width: 200px;
  text-align: center;
  &:hover {
    box-shadow: 2px 2px 9px rgb(143, 143, 143);
  }
`;
