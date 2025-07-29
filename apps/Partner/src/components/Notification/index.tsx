import { createIntl, createIntlCache } from 'react-intl';
import useLanguageStore from '../../languages/store';
import language from '../../languages/translate';
import { Language } from '@react/languages/type';
import Swal from 'sweetalert2';

export const NotificationErrorByKey = (key: string) => {
  const { type } = useLanguageStore.getState();
  const cache = createIntlCache();

  const intl = createIntl(
    {
      locale: type,
      messages: language[Language[type]],
    },
    cache
  );

  Swal.fire({
    icon: 'error',
    title: intl.formatMessage({ id: `errorKey.${key}` }),
    showConfirmButton: false,
    timer: 3000,
  });
};

export const NotificationErrorCustom = (message: string) => {
  const { type } = useLanguageStore.getState();
  const cache = createIntlCache();

  const intl = createIntl(
    {
      locale: type,
      messages: language[Language[type]],
    },
    cache
  );

  Swal.fire({
    icon: 'error',
    title: intl?.formatMessage({ id: message }),
    showConfirmButton: false,
    timer: 3000,
  });
};

export const NotificationError = (data: any) => {
  Swal.fire({
    icon: 'error',
    title: data?.detail ?? data?.title ?? data ?? 'Lỗi không xác định',
    showConfirmButton: false,
    timer: 3000,
  });
};

export const NotificationSuccess = (message: string) => {
  Swal.fire({
    icon: 'success',
    title: message,
    showConfirmButton: false,
    timer: 3000,
  });
};
