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
import { Form } from 'antd';
import { useGetListPackagedsimBooking } from '../../hooks/useGetListFreeEsimBooking';
import { useGetPackageCodes } from '../../hooks/usePackageCodes';
import { IBookPackagedEsim } from '../../types';
import { useBookPackagedEsim } from '../../hooks/useBookPackagedEsim';

export const useLogicActionPackagedEsim = () => {
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

  const { mutate: bookPackagedEsim, isPending: bookingInProcess } =
    useBookPackagedEsim(onSuccess, onError);
  const { data: getPackagedEsimList, isPending: loadingEsimList } =
    useGetListPackagedsimBooking(formatQueryParams<IParamsRequest>(params));

  const { data: packageCodeList } = useGetPackageCodes();
  const packageOptions = packageCodeList?.map((pkg) => ({
    key: pkg.id,
    value: pkg.pckCode,
    label: pkg.pckCode,
  }));

  const Title = useMemo(() => {
    switch (actionMode) {
      case IModeAction.READ:
        return 'Xem chi tiết book GD eSIM kèm gói hohoho';
      case IModeAction.CREATE:
        return 'Book eSIM kèm gói';
      default:
        return 'Xem chi tiết book GD eSIM kèm gói';
    }
  }, [actionMode]);

  const handleFinish = useCallback(
    (values: IBookPackagedEsim) => {
      console.log('🚀 ~ useLogicActionPackagedEsim ~ values:', values);
      form.setFieldsValue({
        ...values,
        id: actionMode === IModeAction.CREATE ? id : undefined,
        quantity: values.quantity,
        packageCode: values.pckCode,
      });
      bookPackagedEsim(values);
    },

    [actionMode, bookPackagedEsim, form, id]
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
    bookPackagedEsim,
    form,
    getPackagedEsimList,
    loadingEsimList,
    packageOptions,
  };
};
