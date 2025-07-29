import { Modal } from 'antd';
import { CommonError } from '@react/commons/types';
import {
  StyledIconX,
  StyledTextSuccess,
  StyledTitleError,
  StyledTitleSuccess,
  StyledTitleWarning,
} from './styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { ReactComponent as IconDone } from 'commons/src/lib/assets/images/icon_done.svg';
import { ReactComponent as IconError } from 'commons/src/lib/assets/images/icon_error.svg';
import delay from 'lodash/delay';

export interface ErrMessage {
  detail: string;
  message?: string;
  title?: string;
}

export const NotificationSuccess = (message: string, timeDelay?: number) => {
  const modalSuccess = Modal.success({
    title: (
      <StyledTitleSuccess>
        <StyledIconX onClick={() => modalSuccess.destroy()}>
          <FontAwesomeIcon
            icon={faXmark}
            size="xl"
            style={{ color: 'white' }}
          />
        </StyledIconX>
        <IconDone />
        Thành công
      </StyledTitleSuccess>
    ),
    content: <StyledTextSuccess>{message}</StyledTextSuccess>,
    maskClosable: true,
    icon: null,
    footer: null,
    centered: true,
    styles: { content: { padding: 0 } },
  });

  delay(() => {
    modalSuccess.destroy();
  }, timeDelay ?? 2000);

  return modalSuccess;
};

export const NotificationError = (message: string | CommonError) => {
  const modalError = Modal.error({
    title: (
      <StyledTitleError>
        <StyledIconX onClick={() => modalError.destroy()}>
          <FontAwesomeIcon
            icon={faXmark}
            size="xl"
            style={{ color: 'white' }}
          />
        </StyledIconX>
        <IconError />
        Thất bại
      </StyledTitleError>
    ),
    content: (
      <StyledTextSuccess>
        {typeof message === 'string'
          ? message
          : message?.detail ?? 'Lỗi không xác định'}
      </StyledTextSuccess>
    ),
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

export const NotificationWarning = (message: string) => {
  const modalWarning = Modal.warning({
    title: (
      <StyledTitleWarning>
        <StyledIconX onClick={() => modalWarning.destroy()}>
          <FontAwesomeIcon
            icon={faXmark}
            size="xl"
            style={{ color: 'white' }}
          />
        </StyledIconX>
        <IconError />
        Cảnh báo
      </StyledTitleWarning>
    ),
    content: <StyledTextSuccess>{message}</StyledTextSuccess>,
    icon: null,
    footer: null,
    centered: true,
    styles: { content: { padding: 0 } },
  });

  delay(() => {
    modalWarning.destroy();
  }, 2000);

  return modalWarning;
};
