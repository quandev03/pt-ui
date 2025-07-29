import React, { FC, ReactNode } from 'react';
import { ModalProps, Spin } from 'antd';
import { StyledModal } from './style';
import CloseIcon from '../../assets/images/CloseIcon.svg';
interface Props extends ModalProps {
  children?: ReactNode;
}

const CModal: FC<Props> = React.memo(({ loading, children, ...rest }) => {
  return (
    <StyledModal
      centered
      closeIcon={<img src={CloseIcon} alt="Logo" />}
      maskClosable={false}
      {...rest}
    >
      <Spin spinning={!!loading}>{children}</Spin>
    </StyledModal>
  );
});

export default CModal;
