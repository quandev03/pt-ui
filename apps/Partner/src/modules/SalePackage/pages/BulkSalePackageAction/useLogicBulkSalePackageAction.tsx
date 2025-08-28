import { AnyElement, NotificationError } from '@vissoft-react/common';
import { Form } from 'antd';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetFile } from '../../hooks/useGetFile';
import { useSubmitData } from '../../hooks/useSubmitData';

export const useLogicBulkSalePackageAction = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [openOtp, setOpenOtp] = useState<boolean>(false);
  const { mutate: downloadFile } = useGetFile();
  const { mutate: addPackageBulk, isPending: loadingAddBulk } = useSubmitData(
    () => {
      handleCancel();
    }
  );

  const handleCancel = useCallback(() => {
    form.resetFields();
    setOpenOtp(false);
    navigate(-1);
  }, [form, navigate]);

  const handleClose = useCallback(() => navigate(-1), [navigate]);
  const handleCloseOtp = useCallback(() => setOpenOtp(false), []);

  const handleDownloadTemplate = useCallback(() => {
    downloadFile();
  }, [downloadFile]);

  const handleSubmitAttachment = useCallback(
    (values: AnyElement) => {
      const file = values.attachment;
      if (!file) {
        NotificationError({ message: 'Vui lòng tải lên một file.' });
        return;
      }
      // Directly call API here, no OTP modal
      const formData = new FormData();
      formData.append('attachment', file);
      addPackageBulk(formData);
    },
    [addPackageBulk]
  );

  return {
    form,
    handleClose,
    handleDownloadTemplate,
    handleCancel,
    openOtp,
    handleCloseOtp,
    handleSubmitAttachment,
    loadingAddBulk,
  };
};
