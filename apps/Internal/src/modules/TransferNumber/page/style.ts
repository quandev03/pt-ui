import { Button, Col, Form } from 'antd';
import styled from 'styled-components';

export const Header = styled.header``;

export const RowHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 16px;

  .ant-form {
    flex: 1;
    &-item {
      margin-bottom: 0;
    }
  }
`;
export const RowButton = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;

  button {
    min-width: 120px;
  }
`;

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
