import { ConfigProvider, Flex, Modal } from 'antd';
import { createIntl, createIntlCache } from 'react-intl';
import CButton from '@react/commons/Button';
import { Language } from '@react/languages/type';
import useLanguageStore from 'apps/Internal/src/languages/store';
import language from 'apps/Internal/src/languages/translate';
import { themeConfig } from 'apps/Internal/src/configs/ThemeConfig';

interface ModalConfirmProps {
  title?: string;
  message?: string;
  handleConfirm: () => void;
  handleCancel?: () => void;
  closable?: boolean;
  iconType?: 'warning' | 'success';
  isDestroyAll?: boolean;
}

function ModalConfirm(props: ModalConfirmProps) {
  const {
    title = 'Xác nhận',
    message,
    handleConfirm,
    handleCancel,
    closable = true,
  } = props;

  const { type } = useLanguageStore.getState();
  const cache = createIntlCache();
  const intl = createIntl(
    {
      locale: type,
      messages: language[Language[type]],
    },
    cache
  );

  const onConfirm = () => {
    handleConfirm();
    modalConfirm.destroy();
  };

  const onCancel = () => {
    modalConfirm.destroy();
    handleCancel && handleCancel();
  };

  const modalConfirm = Modal.confirm({
    ...props,
    title: (
      <div className="text-lg font-semibold text-center mt-4">
        {intl?.formatMessage({ id: title })}
      </div>
    ),
    icon: null,
    footer: null,
    closable: closable,
    centered: true,
    content: (
      <ConfigProvider
        theme={{
          token: {
            fontFamily: 'Inter',
            colorPrimary: themeConfig.secondary,
          },
        }}
      >
        {message && (
          <div className="font-medium text-center text-base mb-5">
            {intl?.formatMessage({ id: message })}
          </div>
        )}
        <Flex align="center" justify="center" gap={12} className="mb-5">
          <CButton type="default" onClick={onCancel} className="min-w-[120px]">
            {intl?.formatMessage({ id: 'common.no' })}
          </CButton>
          <CButton onClick={onConfirm} className="min-w-[120px]">
            {intl?.formatMessage({ id: 'common.yes' })}
          </CButton>
        </Flex>
      </ConfigProvider>
    ),
  });
  return modalConfirm;
}

export default ModalConfirm;
