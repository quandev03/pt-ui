import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  StyledIconX,
  StyledTextSuccess,
  StyledTitleError,
} from '@react/commons/Notification/styles';
import { Modal } from 'antd';
import { delay } from 'lodash';
import { ReactNode } from 'react';

export const NotificationNodeError = (message: ReactNode) => {
  const renderTitle = () => (
    <StyledTitleError>
      <StyledIconX onClick={() => modalError.destroy()}>
        <FontAwesomeIcon icon={faXmark} size="xl" style={{ color: 'white' }} />
      </StyledIconX>
      Thất bại
    </StyledTitleError>
  );

  const renderContent = () => <StyledTextSuccess>{message}</StyledTextSuccess>;

  const modalError = Modal.error({
    title: renderTitle(),
    content: renderContent(),
    maskClosable: true,
    icon: null,
    footer: null,
    centered: true,
    styles: { content: { padding: 0 } },
  });

  delay(() => {
    modalError.destroy();
  }, 2000);

  return modalError;
};
