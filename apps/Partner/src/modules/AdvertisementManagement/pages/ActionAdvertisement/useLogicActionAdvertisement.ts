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
  useAdvertisementImageBlobUrl,
} from '../../hooks';
import { IFormAdvertisement, AdvertisementStatus } from '../../types';
import dayjs from 'dayjs';
import { RcFile } from 'antd/es/upload';
import { UploadFile } from 'antd';

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
    });
  });

  // Fetch ảnh hiện có để hiển thị trong form upload
  const { data: imageBlobUrl } = useAdvertisementImageBlobUrl(
    advertisementDetail?.imageUrl
  );

  // Convert blob URL thành UploadFile format để hiển thị trong Upload component
  useEffect(() => {
    if (advertisementDetail?.imageUrl && imageBlobUrl) {
      const fileName = advertisementDetail.imageUrl.split('/').pop() || 'image.jpg';
      const fileList: UploadFile[] = [
        {
          uid: `existing-${Date.now()}`,
          name: fileName,
          status: 'done' as const,
          url: imageBlobUrl,
          thumbUrl: imageBlobUrl,
        } as UploadFile,
      ];
      form.setFieldValue('image', fileList);
    } else if (advertisementDetail && !advertisementDetail.imageUrl) {
      // Nếu không có ảnh, set empty array
      form.setFieldValue('image', []);
    }
  }, [advertisementDetail, imageBlobUrl, form]);

  // Cleanup blob URL khi component unmount hoặc khi advertisement detail thay đổi
  useEffect(() => {
    return () => {
      if (imageBlobUrl && imageBlobUrl.startsWith('blob:')) {
        window.URL.revokeObjectURL(imageBlobUrl);
      }
    };
  }, [imageBlobUrl]);

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
      let imageFile: File | null = null;

      // Extract file from Upload component
      if (imageFileList && imageFileList.length > 0) {
        const fileItem = imageFileList[0];
        // Check if it's a new file (has originFileObj) or existing (has url)
        if (fileItem?.originFileObj) {
          // New file from upload
          imageFile = fileItem.originFileObj as File;
        } else if (fileItem instanceof File) {
          // Direct File object
          imageFile = fileItem;
        }
        // If fileItem has url, it's an existing image, don't send file
      }

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
      if (!imageFile && imageUrl) {
        data.imageUrl = imageUrl;
      }

      if (actionMode === IModeAction.CREATE) {
        createAdvertisement({
          data,
          imageFile: imageFile,
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
              imageFile: imageFile,
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

