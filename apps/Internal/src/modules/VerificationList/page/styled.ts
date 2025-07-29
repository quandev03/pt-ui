import CButton from '@react/commons/Button';
import CDatePicker from '@react/commons/DatePicker';
import CModal from '@react/commons/Modal';
import { themeConfig } from 'apps/Internal/src/configs/ThemeConfig';
import styled from 'styled-components';

interface ButtonProps {
  disableStyle?: boolean;
}
export const StyledButton = styled(CButton)<ButtonProps>`
  background-color: ${(props) =>
    props.disableStyle ? '#DCDCDC' : themeConfig.primary};
`;

export const StyledDatePicker = styled(CDatePicker)`
  .ant-picker-disabled:hover {
    border-color: #ff4d4f !important;
  }
`;
export const StyledModal = styled(CModal)`
  .ant-modal-body {
    padding-bottom: 8px !important;
  }
`;
