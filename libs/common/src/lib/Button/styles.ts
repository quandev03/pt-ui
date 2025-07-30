import { Button } from 'antd';
import styled from 'styled-components';

export const StyledButton = styled(Button)`
  box-shadow: none;

  .ant-btn-icon {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &:where(
      .css-dev-only-do-not-override-17migqo
    ).ant-btn-color-dangerous.ant-btn-variant-solid:not(:disabled):not(
      .ant-btn-disabled
    ):hover {
    color: white;
  }
  :where(.css-dev-only-do-not-override-2fprp8).ant-btn-variant-solid:not(
      :disabled
    ):not(.ant-btn-disabled):hover {
    color: white;
  }
`;
