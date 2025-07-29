import { ButtonProps } from 'antd';
import React from 'react';
import { StyledButton } from './styles';
import { TypeCustom } from '@react/commons/Button/enum';

const CButton: React.FC<ButtonProps & { typeCustom?: TypeCustom }> = React.memo(
  ({ ...rest }) => {
    return <StyledButton type="primary" {...rest} />;
  }
);

export default CButton;
export { default as CButtonAdd } from './ButtonAdd';
export { default as CButtonClose } from './ButtonClose';
export { default as CButtonSave } from './ButtonSave';
export { default as CButtonSaveAndAdd } from './ButtonSaveAndAdd';
export { default as CButtonDownload } from './ButtonDownload';
export { default as CButtonDelete } from './ButtonDelete';
export { default as CButtonEdit } from './ButtonEdit';
export { default as CButtonExport } from './ButtonExport';
export { default as CButtonDetail } from './ButtonDetail';
export { default as CButtonRefuse } from './ButtonRefuse';
export { default as CButtonApprove } from './ButtonApprove';
export { default as CButtonPrint } from './ButtonPrint';
