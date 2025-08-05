import {
  decodeSearchParams,
  formatQueryParams,
  IFieldErrorsItem,
  IModeAction,
  IParamsRequest,
  useActionMode,
} from '@vissoft-react/common';
import { useCallback, useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { IBookFreeEsim } from '../../types';
import { useBookFreeEsim } from '../../hooks/useBookFreeEsim';
import { Form } from 'antd';
import { useGetListFreeEsimBooking } from '../../hooks/useGetListFreeEsimBooking';

export const useLogicActionUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const actionMode = useActionMode();
  const [form] = Form.useForm();
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);

  const onSuccess = useCallback(() => {
    navigate(-1); // Navigate back on success
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
  const { data: getFreeEsimList, isPending: loadingEsimList } =
    useGetListFreeEsimBooking(formatQueryParams<IParamsRequest>(params));

  const Title = useMemo(() => {
    console.log('action mode is: ', actionMode);
    switch (actionMode) {
      case IModeAction.READ:
        return 'Xem chi tiết book GD eSIM miễn phí';
      case IModeAction.CREATE:
        return 'Book eSIM miễn phí';
      default:
        return 'Xem chi tiết book GD eSIM miễn phí';
    }
  }, [actionMode]);

  const handleFinish = useCallback(
    (values: IBookFreeEsim) => {
      form.setFieldsValue({
        ...values,
        id: actionMode === IModeAction.CREATE ? id : undefined,
        quantity: values.quantity,
        packageCode: values.pckCode,
      });
      bookFreeEsim(values);
    },

    [actionMode, bookFreeEsim, form, id]
  );

  const handleClose = useCallback(() => {
    navigate(-1);
  }, [navigate]);
  return {
    Title,
    actionMode,
    handleFinish,
    handleClose,
    bookingInProcess,
    bookFreeEsim,
    form,
    getFreeEsimList,
    loadingEsimList,
  };
};
