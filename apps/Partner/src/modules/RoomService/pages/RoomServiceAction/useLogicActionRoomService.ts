import {
  IModeAction,
  ModalConfirm,
  setFieldError,
  useActionMode,
} from '@vissoft-react/common';
import { Form } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  useGetRoomServiceDetail,
  useCreateRoomService,
  useUpdateRoomService,
} from '../../hooks';
import { IRoomService, IRoomServiceForm, ServiceType } from '../../types';

export const useLogicActionRoomService = () => {
  const [isSubmitBack, setIsSubmitBack] = useState(false);
  const navigate = useNavigate();
  const pathname = useLocation();
  const [form] = Form.useForm();
  const { id } = useParams();
  const actionMode = useActionMode();

  const {
    data: roomServiceDetail,
    isLoading: loadingGetRoomService,
  } = useGetRoomServiceDetail(id);

  useEffect(() => {
    if (roomServiceDetail) {
      form.setFieldsValue({
        ...roomServiceDetail,
        status: roomServiceDetail.status === 1 ? 1 : 0,
      });
    } else if (!id) {
      form.setFieldsValue({ status: 1 });
    }
  }, [form, roomServiceDetail, id, pathname]);

  const handleClose = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const { mutate: createRoomService, isPending: loadingAdd } =
    useCreateRoomService(
      (data: IRoomService) => {
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

  const { mutate: updateRoomService, isPending: loadingUpdate } =
    useUpdateRoomService(
      (data: IRoomService) => {
        navigate(-1);
      },
      (e) => {
        setFieldError(form, e);
      }
    );

  const Title = useMemo(() => {
    switch (actionMode) {
      case IModeAction.READ:
        return 'Xem chi tiết dịch vụ phòng';
      case IModeAction.CREATE:
        return 'Thêm dịch vụ phòng';
      case IModeAction.UPDATE:
        return 'Chỉnh sửa dịch vụ phòng';
      default:
        return 'Thêm dịch vụ phòng';
    }
  }, [actionMode]);

  const handleFinish = useCallback(
    (values: IRoomServiceForm) => {
      const data: IRoomServiceForm = {
        ...values,
        status: values?.status ? 1 : 0,
      };

      if (actionMode === IModeAction.CREATE) {
        createRoomService(data);
      } else if (actionMode === IModeAction.UPDATE) {
        ModalConfirm({
          message: 'Bạn có chắc chắn muốn cập nhật không?',
          handleConfirm: () => {
            if (!id) return;
            updateRoomService({ id, data });
          },
        });
      }
    },
    [actionMode, createRoomService, id, updateRoomService]
  );

  // Watch serviceType để hiển thị/ẩn serviceCode và serviceName
  const serviceType = Form.useWatch('serviceType', form);
  const showOtherFields = serviceType === ServiceType.OTHER;

  return {
    form,
    loadingGetRoomService,
    loadingAdd,
    loadingUpdate,
    handleFinish,
    handleClose,
    Title,
    actionMode,
    setIsSubmitBack,
    showOtherFields,
  };
};

