import { Row } from 'antd';
import styled from 'styled-components';

export const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const RowStyle = styled(Row)`
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  padding: 12px 0;
  &:not(:last-child) {
    margin-bottom: 24px;
  }
  h3.title-blue {
    font-weight: bold;
    color: #2855a7;
  }
  .ant-form-item .ant-form-item-label {
    display: flex;
    white-space: break-spaces;
    line-height: 18px;
  }
`;