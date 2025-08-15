import {
  AnyElement,
  decodeSearchParams,
  IFieldErrorsItem,
  IModeAction,
  useActionMode,
} from '@vissoft-react/common';
import { Form } from 'antd';
import { useCallback, useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { IBookFreeEsimPayload } from '../../types';
import { useBookFreeEsim } from '../../hooks/useBookFreeEsim';

export const useLogicActionPackagedEsim = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const actionMode = useActionMode();
  const [form] = Form.useForm();
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);

  const onSuccess = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const onError = useCallback(
    (errorField: IFieldErrorsItem[]) => {
      form.setFields(
        errorField.map((error) => ({
          name: error.field,
          errors: [error.detail],
        }))
      );
    },
    [form]
  );

  const { mutate: bookFreeEsim, isPending: bookingInProcess } = useBookFreeEsim(
    onSuccess,
    onError
  );
  const Title = useMemo(() => {
    switch (actionMode) {
      case IModeAction.READ:
        return 'Xem chi tiết GD đặt hàng eSIM';
      case IModeAction.CREATE:
        return 'Đặt hàng eSIM';
      default:
        return 'Xem chi tiết GD đặt hàng eSIM';
    }
  }, [actionMode]);

  const handleFinish = (values: AnyElement) => {
    console.log('Original form values:', values);
    const payload: IBookFreeEsimPayload = values.packages;
    bookFreeEsim(payload);
  };

  const handleClose = useCallback(() => {
    navigate(-1);
  }, [navigate]);
  return {
    Title,
    form,
    actionMode,
    handleClose,
    handleFinish,
    bookingInProcess,
  };
};
