import { ConfigProvider, Flex, Modal } from 'antd';
import { createIntl, createIntlCache } from 'react-intl';
import { themeConfig } from 'apps/Partner/src/configs/ThemeConfig';
import CButton from '@react/commons/Button';
import language from 'apps/Partner/src/languages/translate';
import useLanguageStore from 'apps/Partner/src/languages/store';
import { Language } from '@react/languages/type';

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
    isDestroyAll = true,
  } = props;
  const { confirm, destroyAll } = Modal;
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
    isDestroyAll && destroyAll();
  };

  const onCancel = () => {
    destroyAll();
    handleCancel && handleCancel();
  };

  confirm({
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
}

export default ModalConfirm;
