import { ArrowRightOutlined } from '@ant-design/icons';
import { Form } from 'antd';
import styled from 'styled-components';
import CInput from '../Input';

export const RangeNumberPicker = styled.div<{
  width?: string;
}>`
  display: flex;
  position: relative;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  justify-content: center;
  align-items: center;
  width: ${({ width }) => (width ? width : '257px')};
  .ant-form-item {
    flex: 1;
    width: 100%;
    max-width: unset !important;
    margin-bottom: 0px !important;
    input {
      width: 100%;
    }
    .ant-form-item-explain-error {
      position: absolute;
    }
  }
  .ant-input-outlined.ant-input-status-error.numberFrom {
    border-right: 0px !important;
  }
  .ant-input-outlined.ant-input-status-error.numberTo {
    border-left: 0px !important;
  }
`;

export const StyleFormItem = styled(Form.Item)`
  margin-bottom: 0 !important;
`;

export const RangePickerFrom = styled(CInput)`
  border-radius: 6px 0 0 6px;
  width: 160px;
  border: none;

  &:focus {
    border: none;
    box-shadow: none;
  }

  .ant-input {
    transform: translateX(-40%);
  }
  .ant-form-item:has(.customErrorMessage) {
    bottom: -45px !important;
  }
  .ant-form-item:not(.customErrorMessage) .ant-form-item-explain-error {
    bottom: -20px;
  }
`;

export const RangePickerTo = styled(CInput)`
  border-radius: 0 6px 6px 0;
  width: 160px;
  padding-left: 12px;
  border: none;

  &:focus,
  &:focus-within {
    border: none;
    box-shadow: none;
  }

  .ant-input-outlined.ant-input-status-error:not(.ant-input-disabled) {
    border-left: 0px;
  }

  .ant-form-item:has(.customErrorMessage) {
    bottom: -45px !important;
  }
  .ant-form-item:not(.customErrorMessage) .ant-form-item-explain-error {
    bottom: -20px;
  }
`;

export const ArrowIcon = styled(ArrowRightOutlined)`
  left: 50%;
  z-index: 1;
  top: 50%;
  transform: translate(-50%, -50%);
  color: #b9b9b9;
  position: absolute;
`;
