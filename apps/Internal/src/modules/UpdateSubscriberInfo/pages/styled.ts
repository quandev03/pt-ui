import { CInput, CUpload } from '@vissoft-react/common';
import styled from 'styled-components';

export const StyledUpload = styled(CUpload)`
  .ant-upload {
    width: 100%;
  }
`;
export const StyledInput = styled(CInput)`
  input::placeholder {
    font-size: 14px;
    font-weight: 400;
  }
`;
