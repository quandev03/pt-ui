import { Row, Table } from 'antd';
import styled from 'styled-components';

export const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .ant-form {
  }
`;

export const RowHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 16px;
  align-items: flex-end;

  .ant-form {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: flex-start;
    flex: 1;
    max-width: 768px;

    &-item {
      margin-bottom: 0;
      width: auto;
      min-width: 235px;
    }
  }
`;

export const WrapperButton = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
`;

export const RowStyle = styled(Row)`
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  padding: 20px 0px 12px 0px;
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
  }
`;
export const RowUploadFile = styled(Row)`
  &:not(:last-child) {
    margin: 24px -12px;
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

export const StyleTableForm = styled(Table)`
  tr.ant-table-row:not(:last-child) span.anticon-plus {
    display: none;
    pointer-events: none;
  }
  td.ant-table-cell .ant-form-item {
    margin-bottom: 0;
  }
  &.ant-table-wrapper .ant-table-tbody > tr > td {
    padding: 8px;
  }
  &.ant-table-wrapper .ant-table-cell,
  &.ant-table-wrapper .ant-table-thead > tr > th {
    padding: 8px;
  }
`;
