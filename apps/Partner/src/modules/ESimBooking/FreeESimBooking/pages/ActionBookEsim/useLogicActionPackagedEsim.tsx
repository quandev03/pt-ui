import {
  AnyElement,
  decodeSearchParams,
  formatQueryParams,
  IFieldErrorsItem,
  IModeAction,
  IParamsRequest,
  useActionMode,
} from '@vissoft-react/common';
import { Form } from 'antd';
import { useCallback, useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useBookFreeEsim } from '../../hooks/useBookFreeEsim';
import { useGetListFreeEsimBooking } from '../../hooks/useGetListFreeEsimBooking';
// We still need this to get the package IDs
import { useGetPackageCodes } from '../../hooks/usePackageCodes';
import { IBookFreeEsimPayload } from '../../types';

export const useLogicActionPackagedEsim = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const actionMode = useActionMode();
  const [form] = Form.useForm();
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);

  const { data: listEsimBooked } = useGetListFreeEsimBooking(
    formatQueryParams<IParamsRequest>(params)
  );

  // Get the list of packages to access their IDs
  const { data: packageCodeList } = useGetPackageCodes();

  const onSuccess = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const onError = useCallback(
    (errorField: IFieldErrorsItem[]) => {
      // This is great for handling validation errors from the backend!
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
    if (!packageCodeList) {
      console.error('Package list is not available for submission.');
      return;
    }

    const transformedPackages = values.packages
      .map((formPackage: { packageCode: string; quantity: number }) => {
        const fullPackageDetails = packageCodeList.find(
          (p) => p.pckCode === formPackage.packageCode
        );

        if (!fullPackageDetails) {
          return null;
        }
        return {
          id: fullPackageDetails.id,
          packageCode: formPackage.packageCode,
          quantity: formPackage.quantity,
        };
      })
      .filter(Boolean);

    // This part is now correct
    const payload: IBookFreeEsimPayload = {
      requests: transformedPackages,
      note: values.note || '',
    };

    console.log('✅ Submitting final payload to /esim/book:', payload);
    bookFreeEsim(payload);
  };

  const handleClose = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return {
    id,
    Title,
    form,
    actionMode,
    handleClose,
    handleFinish,
    bookingInProcess,
    listEsimBooked,
  };
};
