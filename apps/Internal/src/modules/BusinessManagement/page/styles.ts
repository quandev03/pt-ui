import { CTable } from '@react/commons/index';
import CModal from '@react/commons/Modal';
import { Col, Form } from 'antd';
import styled from 'styled-components';

export const Wrapper = styled.div`
  height: 100%;

  .iconReload {
    cursor: pointer;
    transition: all 0.25s linear;
    &:hover {
      opacity: 0.7;
    }
  }
`;

export const StyledModal = styled(CModal)`
  .buttonsWrap {
    width: 100%;
    display: flex;
    justify-content: center;

    button {
      margin: 10px;
      min-width: 120px;
    }
  }
  .ant-form-item-label {
    font-weight: 500;
  }
  .ant-divider {
    margin: 20px 0;
  }

  .switchActive {
    margin-top: 12px;

    .ant-row {
      flex-direction: row;
    }

    .ant-form-item-label {
      padding-bottom: 0;

      label {
        padding-bottom: 0;
        line-height: 2.3;
      }
    }

    .spanActive {
      padding-left: 10px;
    }
  }
`;

export const WrapperBtnAction = styled(Col)`
  text-align: right;
  button {
    margin-left: 8px;
  }
`;

export const StyledForm = styled(Form)`
  .ant-input-status-warning,
  .ant-select-outlined.ant-select-status-warning:not(
      .ant-select-customize-input
    )
    .ant-select-selector,
  .ant-picker-outlined.ant-picker-status-warning {
    border-color: #496fb4 !important;
  }
  .fileChanged .ant-form-item-control-input {
    border: 1px solid #496fb4 !important;
    border-radius: 5px !important;
  }
`;
export const StyledTable = styled(CTable)`
  .ant-table-body {
    max-height: 612px !important;
  }
`;
