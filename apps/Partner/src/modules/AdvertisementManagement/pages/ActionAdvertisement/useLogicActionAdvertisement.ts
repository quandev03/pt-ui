import {
  IModeAction,
  ModalConfirm,
  cleanUpString,
  setFieldError,
  useActionMode,
} from '@vissoft-react/common';
import { Form } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  useGetAdvertisementDetail,
  useSupportCreateAdvertisement,
  useSupportGetAdvertisement,
  useSupportUpdateAdvertisement,
} from '../../hooks';
import { IFormAdvertisement, AdvertisementStatus } from '../../types';
import dayjs from 'dayjs';
import { baseApiUrl } from '../../../../../src/constants';
import { RcFile } from 'antd/es/upload';

export const useLogicActionAdvertisement = () => {
  const [isSubmitBack, setIsSubmitBack] = useState(false);
  const navigate = useNavigate();
  const pathname = useLocation();
  const [form] = Form.useForm();
  const { id } = useParams();
  const actionMode = useActionMode();

  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

  const {
    mutate: getAdvertisementAction,
    isPending: loadingGetAdvertisement,
    data: advertisementDetail,
  } = useSupportGetAdvertisement((advertisement) => {
    setImageUrl(advertisement.imageUrl);
    form.setFieldsValue({
      ...advertisement,
      startDate: advertisement.startDate ? dayjs(advertisement.startDate) : null,
      endDate: advertisement.endDate ? dayjs(advertisement.endDate) : null,
      image: advertisement.imageUrl
        ? [
            {
              uid: '-1',
              name: 'image.jpg',
              status: 'done',
              url: advertisement.imageUrl.startsWith('http')
                ? advertisement.imageUrl
                : `${baseApiUrl}/${advertisement.imageUrl}`,
            },
          ]
        : [],
    });
  });

  useEffect(() => {
    if (id) {
      getAdvertisementAction(id);
    } else {
      form.setFieldsValue({ status: AdvertisementStatus.DRAFT });
    }
  }, [form, getAdvertisementAction, id, pathname]);

  const { mutate: createAdvertisement, isPending: loadingAdd } =
    useSupportCreateAdvertisement(
      () => {
        if (isSubmitBack) {
          handleClose();
        } else {
          form.resetFields();
          form.setFieldValue('status', AdvertisementStatus.DRAFT);
        }
      },
      (e) => {
        setFieldError(form, e);
      }
    );

  const { mutate: updateAdvertisement, isPending: loadingUpdate } =
    useSupportUpdateAdvertisement(
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
        return 'Xem chi tiết quảng cáo';
      case IModeAction.CREATE:
        return 'Tạo quảng cáo';
      case IModeAction.UPDATE:
        return 'Chỉnh sửa quảng cáo';
      default:
        return 'Tạo quảng cáo';
    }
  }, [actionMode]);

  const handleFinish = useCallback(
    (values: IFormAdvertisement) => {
      const imageFileList = form.getFieldValue('image');
      const imageFile =
        imageFileList && imageFileList.length > 0
          ? imageFileList[0]?.originFileObj || imageFileList[0]
          : null;

      // Check if image is a new file (has originFileObj) or existing (has url)
      const isNewImage = imageFile && (imageFile as any).originFileObj;

      const data: any = {
        title: cleanUpString(values.title),
        content: cleanUpString(values.content),
        startDate: values.startDate
          ? dayjs(values.startDate).format('YYYY-MM-DDTHH:mm:ss')
          : '',
        endDate: values.endDate
          ? dayjs(values.endDate).format('YYYY-MM-DDTHH:mm:ss')
          : '',
        status: values.status,
      };

      // Only include imageUrl if we're not uploading a new image
      if (!isNewImage && imageUrl) {
        data.imageUrl = imageUrl;
      }

      if (actionMode === IModeAction.CREATE) {
        createAdvertisement({
          data,
          imageFile: isNewImage ? (imageFile as RcFile) : null,
        });
      } else if (actionMode === IModeAction.UPDATE) {
        ModalConfirm({
          title: 'Xác nhận',
          message: 'Bạn có chắc chắn muốn cập nhật không?',
          handleConfirm: () => {
            if (!id) return;
            updateAdvertisement({
              id,
              data,
              imageFile: isNewImage ? (imageFile as RcFile) : null,
            });
          },
        });
      }
    },
    [actionMode, createAdvertisement, id, updateAdvertisement, form, imageUrl]
  );

  const handleClose = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return {
    form,
    loadingGetAdvertisement,
    advertisementDetail,
    loadingAdd,
    loadingUpdate,
    handleFinish,
    handleClose,
    Title,
    actionMode,
    setIsSubmitBack,
  };
};

