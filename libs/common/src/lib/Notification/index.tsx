import { Modal } from 'antd';
import delay from 'lodash/delay';
import { CheckCircle, CircleX, TriangleAlert, X } from 'lucide-react';
import {
  StyledIconX,
  StyledModalErrorWrapper,
  StyledModalErrorIcon,
  StyledModalErrorTitle,
  StyledModalErrorContent,
  StyledModalSuccessWrapper,
  StyledModalSuccessIcon,
  StyledModalSuccessTitle,
  StyledModalSuccessContent,
  StyledModalWarningWrapper,
  StyledModalWarningIcon,
  StyledModalWarningTitle,
  StyledModalWarningContent,
} from './styles';
import { CommonError } from '../../types';

export interface ErrMessage {
  detail: string;
  message?: string;
  title?: string;
}

export const NotificationSuccess = (message: string, timeDelay?: number) => {
  const modalSuccess: ReturnType<typeof Modal.success> = Modal.success({
    title: null,
    content: (
      <StyledModalSuccessWrapper>
        <StyledIconX
          style={{
            top: 12,
            right: 12,
            background: 'rgba(1,187,0,0.85)',
            borderRadius: '50%',
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
          }}
          onClick={() => modalSuccess.destroy()}
        >
          <X size={20} style={{ color: 'white' }} />
        </StyledIconX>
        <StyledModalSuccessIcon>
          <CheckCircle />
        </StyledModalSuccessIcon>
        <StyledModalSuccessTitle>Thành công</StyledModalSuccessTitle>
        <StyledModalSuccessContent>{message}</StyledModalSuccessContent>
      </StyledModalSuccessWrapper>
    ),
    maskClosable: true,
    icon: null,
    footer: null,
    centered: true,
    styles: { content: { padding: 0, background: 'transparent' } },
  });

  delay(() => {
    modalSuccess.destroy();
  }, timeDelay ?? 2000);

  return modalSuccess;
};

export const NotificationError = ({
  message,
  title,
  timeDelay = 3000,
}: {
  message: string | CommonError;
  title?: string;
  timeDelay?: number;
}) => {
  const modalError: ReturnType<typeof Modal.error> = Modal.error({
    title: null,
    content: (
      <StyledModalErrorWrapper>
        <StyledIconX
          style={{
            top: 12,
            right: 12,
            background: 'rgba(229,22,22,0.85)',
            borderRadius: '50%',
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
          }}
          onClick={() => modalError.destroy()}
        >
          <X size={20} style={{ color: 'white' }} />
        </StyledIconX>
        <StyledModalErrorIcon>
          <CircleX />
        </StyledModalErrorIcon>
        <StyledModalErrorTitle>{title ?? 'Thất bại'}</StyledModalErrorTitle>
        <StyledModalErrorContent>
          {typeof message === 'string'
            ? message
            : message?.detail ?? 'Lỗi không xác định'}
        </StyledModalErrorContent>
      </StyledModalErrorWrapper>
    ),
    maskClosable: true,
    icon: null,
    footer: null,
    centered: true,
    styles: { content: { padding: 0, background: 'transparent' } },
  });

  delay(() => {
    modalError.destroy();
  }, timeDelay);

  return modalError;
};

export const NotificationWarning = (message: string) => {
  const modalWarning: ReturnType<typeof Modal.warning> = Modal.warning({
    title: null,
    content: (
      <StyledModalWarningWrapper>
        <StyledIconX
          style={{
            top: 12,
            right: 12,
            background: 'rgba(250,173,20,0.85)',
            borderRadius: '50%',
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
          }}
          onClick={() => modalWarning.destroy()}
        >
          <X size={20} style={{ color: 'white' }} />
        </StyledIconX>
        <StyledModalWarningIcon>
          <TriangleAlert />
        </StyledModalWarningIcon>
        <StyledModalWarningTitle>Cảnh báo</StyledModalWarningTitle>
        <StyledModalWarningContent>{message}</StyledModalWarningContent>
      </StyledModalWarningWrapper>
    ),
    icon: null,
    footer: null,
    centered: true,
    styles: { content: { padding: 0, background: 'transparent' } },
  });

  delay(() => {
    modalWarning.destroy();
  }, 2000);

  return modalWarning;
};
