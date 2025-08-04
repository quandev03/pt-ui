import {
  IModeAction,
  ModalConfirm,
  StatusEnum,
  cleanUpString,
  setFieldError,
  useActionMode,
} from '@vissoft-react/common';
import { Form } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  useSupportAddAgency,
  useSupportGetAgency,
  useSupportUpdateUser,
} from '../../hooks';
import { IFormAgency } from '../../types';

export const useLogicActionAgency = () => {
  const [isSubmitBack, setIsSubmitBack] = useState(false);
  const navigate = useNavigate();
  const pathname = useLocation();
  const [form] = Form.useForm();
  const { id } = useParams();
  const actionMode = useActionMode();
  const {
    mutate: getAgencyAction,
    isPending: loadingGetAgency,
    data: agencyDetail,
  } = useSupportGetAgency((agency) => {
    form.setFieldsValue({
      ...agency,
      status:
        agency?.status === StatusEnum.ACTIVE
          ? StatusEnum.ACTIVE
          : StatusEnum.INACTIVE,
    });
  });

  useEffect(() => {
    if (id) {
      getAgencyAction(id);
    } else {
      form.setFieldsValue({ status: true });
    }
  }, [form, getAgencyAction, id, pathname]);

  const { mutate: createAgency, isPending: loadingAdd } = useSupportAddAgency(
    () => {
      if (isSubmitBack) {
        handleClose();
      } else {
        form.resetFields();
        form.setFieldValue('status', 1);
      }
    },
    (e) => {
      setFieldError(form, e);
    }
  );
  const { mutate: updateUser, isPending: loadingUpdate } = useSupportUpdateUser(
    () => {
      navigate(-1);
    },
    (e) => {
      setFieldError(form, e);
    }
  );

  const Title = useMemo(() => {
    switch (actionMode) {
      case IModeAction.READ:
        return 'Xem chi tiết đại lý';
      case IModeAction.CREATE:
        return 'Tạo đại lý';
      case IModeAction.UPDATE:
        return 'Chỉnh sửa đại lý';
      default:
        return 'Tạo đại lý';
    }
  }, [actionMode]);

  const handleFinish = useCallback(
    (values: IFormAgency) => {
      const data: IFormAgency = {
        ...values,
        id: actionMode === IModeAction.UPDATE ? id : undefined,
        status: values?.status ? StatusEnum.ACTIVE : StatusEnum.INACTIVE,
        agencyCode: cleanUpString(values.agencyCode),
        parentId: values.parentId,
      };
      if (actionMode === IModeAction.CREATE) {
        createAgency(data);
      } else if (actionMode === IModeAction.UPDATE) {
        ModalConfirm({
          message: 'Bạn có chắc chắn muốn cập nhật không?',
          handleConfirm: () => {
            updateUser(data);
          },
        });
      }
    },
    [actionMode, createAgency, id, updateUser]
  );

  const handleClose = useCallback(() => {
    navigate(-1);
  }, [navigate]);
  return {
    form,
    loadingGetAgency,
    agencyDetail,
    loadingAdd,
    loadingUpdate,
    handleFinish,
    handleClose,
    Title,
    actionMode,
    setIsSubmitBack,
  };
};
