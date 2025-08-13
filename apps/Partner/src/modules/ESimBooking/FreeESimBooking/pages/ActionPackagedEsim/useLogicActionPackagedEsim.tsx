import {
  decodeSearchParams,
  IFieldErrorsItem,
  IModeAction,
  useActionMode,
} from '@vissoft-react/common';
import { Form } from 'antd';
import { useCallback, useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { IBookFreeEsim } from '../../types';

export const useLogicActionPackagedEsim = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const actionMode = useActionMode();
  const [form] = Form.useForm();
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);

  // const onSuccess = useCallback(() => {
  //   navigate(-1);
  // }, [navigate]);

  // const onError = useCallback(
  //   (errorField: IFieldErrorsItem[]) => {
  //     form.setFields(
  //       errorField.map((error) => ({
  //         name: error.field,
  //         errors: [error.detail],
  //       }))
  //     );
  //   },
  //   [form]
  // );

  const Title = useMemo(() => {
    switch (actionMode) {
      case IModeAction.READ:
        return 'Xem chi tiết GD book eSIM';
      case IModeAction.CREATE:
        return 'Book eSIM';
      default:
        return 'Xem chi tiết GD book eSIM';
    }
  }, [actionMode]);

  // const handleFinish = useCallback(
  //   (values: IBookFreeEsim) => {
  //     form.setFieldsValue({
  //       ...values,
  //       id: actionMode === IModeAction.CREATE ? id : undefined,
  //       quantity: values.quantity,
  //       packageCode: values.pckCode,
  //     });
  //     bookFreeEsim(values);
  //   },

  //   [actionMode, form, id]
  // );

  const handleClose = useCallback(() => {
    navigate(-1);
  }, [navigate]);
  return {
    Title,
    form,
    actionMode,
    handleClose,
  };
};
