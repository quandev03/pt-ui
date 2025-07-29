import { createGlobalStyle } from 'styled-components';

export const StyledDatePickerWeek = createGlobalStyle`
  .ant-picker-cell.ant-picker-cell-disabled::before {
    background-color: rgba(0, 0, 0, 0.04) !important;
  }
  .ant-picker-cell-disabled .ant-picker-cell-inner {
    color: #000 !important;
  }
`;
