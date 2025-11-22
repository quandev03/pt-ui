import {
  AnyElement,
  IModeAction,
  ModalConfirm,
  StatusEnum,
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
  useUploadAgencyImages,
  useImageBlobUrls,
} from '../../hooks';
import { IAgency, IFormAgency } from '../../types';
import { UploadFile } from 'antd';

export const useLogicActionAgency = () => {
  const [isSubmitBack, setIsSubmitBack] = useState(false);
  const [pendingImages, setPendingImages] = useState<File[]>([]);
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

  // Fetch ảnh hiện có để hiển thị trong form upload
  const { data: imageBlobUrls = [] } = useImageBlobUrls(
    agencyDetail?.imageUrls
  );

  // Convert blob URLs thành UploadFile format để hiển thị trong Upload component
  useEffect(() => {
    if (agencyDetail?.imageUrls && imageBlobUrls.length > 0) {
      const fileList: UploadFile[] = imageBlobUrls
        .filter((url) => url) // Chỉ lấy các URL hợp lệ
        .map((url, index) => {
          const originalUrl = agencyDetail.imageUrls?.[index];
          const fileName = originalUrl?.split('/').pop() || `image_${index + 1}.jpg`;
          
          return {
            uid: `existing-${index}-${Date.now()}`,
            name: fileName,
            status: 'done' as const,
            url: url,
            thumbUrl: url,
          } as UploadFile;
        });
      
      form.setFieldValue('images', fileList);
    } else if (agencyDetail && !agencyDetail.imageUrls) {
      // Nếu không có ảnh, set empty array
      form.setFieldValue('images', []);
    }
  }, [agencyDetail, imageBlobUrls, form]);

  // Cleanup blob URLs khi component unmount hoặc khi agency detail thay đổi
  useEffect(() => {
    return () => {
      imageBlobUrls.forEach((url) => {
        if (url && url.startsWith('blob:')) {
          window.URL.revokeObjectURL(url);
        }
      });
    };
  }, [imageBlobUrls]);

  useEffect(() => {
    if (id) {
      getAgencyAction(id);
    } else {
      form.setFieldsValue({ status: true });
    }
  }, [form, getAgencyAction, id, pathname]);

  const handleClose = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const { mutate: uploadImages, isPending: loadingUploadImages } =
    useUploadAgencyImages(
    () => {
        // Sau khi upload ảnh thành công
        setPendingImages([]);
      if (isSubmitBack) {
        handleClose();
      } else {
        form.resetFields();
        form.setFieldValue('status', 1);
        }
      },
      () => {
        // Nếu upload ảnh thất bại, vẫn reset form nếu không phải submit back
        setPendingImages([]);
        if (!isSubmitBack) {
          form.resetFields();
          form.setFieldValue('status', 1);
        }
      }
    );

  const handleUploadImages = useCallback(
    (orgUnitId: string, images: File[]) => {
      if (images && images.length > 0) {
        uploadImages({ orgUnitId, files: images });
      } else {
        // Nếu không có ảnh, chỉ cần reset form
        if (isSubmitBack) {
          handleClose();
        } else {
          form.resetFields();
          form.setFieldValue('status', 1);
        }
      }
    },
    [uploadImages, isSubmitBack, form, handleClose]
  );

  const { mutate: createAgency, isPending: loadingAdd } = useSupportAddAgency(
    (data: IAgency) => {
      // Sau khi tạo phòng thành công, upload ảnh nếu có
      if (pendingImages.length > 0) {
        handleUploadImages(data.id, pendingImages);
      } else {
        // Nếu không có ảnh, reset form
        if (isSubmitBack) {
          handleClose();
        } else {
          form.resetFields();
          form.setFieldValue('status', 1);
        }
      }
    },
    (e) => {
      setFieldError(form, e);
      setPendingImages([]);
    }
  );

  const { mutate: updateUser, isPending: loadingUpdate } = useSupportUpdateUser(
    (data: IAgency) => {
      // Sau khi cập nhật phòng thành công, upload ảnh nếu có
      if (pendingImages.length > 0) {
        handleUploadImages(data.id, pendingImages);
      } else {
        // Nếu không có ảnh, navigate back
      navigate(-1);
      }
    },
    (e) => {
      setFieldError(form, e);
      setPendingImages([]);
    }
  );

  const Title = useMemo(() => {
    switch (actionMode) {
      case IModeAction.READ:
        return 'Xem chi tiết phòng';
      case IModeAction.CREATE:
        return 'Tạo Phòng';
      case IModeAction.UPDATE:
        return 'Chỉnh sửa phòng';
      default:
        return 'Tạo Phòng';
    }
  }, [actionMode]);

  const handleFinish = useCallback(
    (values: IFormAgency) => {
      // Xử lý ảnh từ UploadFile thành File[]
      // Chỉ lấy các ảnh mới (chưa có trên server) - các ảnh có uid bắt đầu bằng "existing-" là ảnh đã có
      let images: File[] = [];
      if (values.images && Array.isArray(values.images)) {
        images = values.images
          .filter((item: any) => {
            // Chỉ lấy ảnh mới (không phải ảnh đã có trên server)
            return !item?.uid?.startsWith('existing-');
          })
          .map((item: any) => {
            // Nếu là UploadFile, lấy originFileObj hoặc file
            if (item?.originFileObj) {
              return item.originFileObj;
            }
            if (item instanceof File) {
              return item;
            }
            return null;
          })
          .filter((file): file is File => file !== null);
      }
      
      // Lưu danh sách ảnh mới để upload sau khi tạo/cập nhật thành công
      setPendingImages(images);
      
      const data: IFormAgency = {
        ...values,
        id: actionMode === IModeAction.UPDATE ? id : undefined,
        status: values?.status ? StatusEnum.ACTIVE : StatusEnum.INACTIVE,
        orgCode: values.orgCode,
        orgName: values.orgName,
        // Bỏ images và parentId khỏi data gửi lên API tạo/cập nhật
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
    [actionMode, createAgency, id, updateUser, handleUploadImages]
  );
  return {
    form,
    loadingGetAgency,
    agencyDetail,
    loadingAdd,
    loadingUpdate,
    loadingUploadImages,
    handleFinish,
    handleClose,
    Title,
    actionMode,
    setIsSubmitBack,
  };
};
