import CModal from '@react/commons/Modal';
import { Upload } from 'antd';
import styled from 'styled-components';

export const StyledModal = styled(CModal)`
  .ant-modal-body {
    padding-bottom: 8px !important;
  }
`;
export const StyledUpload = styled(Upload)`
  .ant-upload-select {
    width: 100%;
  }
`;
export const StyledFormItem = styled.div`
  .ant-form-item-control-input-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
  }
`;
