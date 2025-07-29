import Button from '@react/commons/Button';
import { Col, Form } from 'antd';
import styled from 'styled-components';

export const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;
export const StyledCol = styled(Col)`
  display: flex;
  align-items: center;
`;
export const StyledForm = styled(Form)`
  .ant-form-item {
    margin-bottom: 0;
  }
  margin-bottom: 20px;
`;
export const StyledButton = styled(Button)`
  height: 30px;
`;
