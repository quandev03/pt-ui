import { AnyElement, NotificationError } from '@vissoft-react/common';
import { Form } from 'antd';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetFile } from '../../hooks/useGetFile';
import { useSubmitData } from '../../hooks/useSubmitData';
import useCheckData from '../../hooks/useCheckData';

export const useLogicBulkSalePackageAction = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [openOtp, setOpenOtp] = useState<boolean>(false);
  const { mutate: downloadFile } = useGetFile();

  const { mutate: checkData, isPending: loadingCheckData } = useCheckData(
    () => {
      setOpenOtp(true);
    }
  );
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

  const handleSubmitAndCheckFile = useCallback(
    (values: AnyElement) => {
      const file = values.attachment;
      if (!file) {
        NotificationError({ message: 'Vui lòng tải lên một file.' });
        return;
      }

      const formData = new FormData();
      formData.append('attachment', file);

      checkData(formData);
    },
    [checkData]
  );

  const handleConfirmWithPin = useCallback(
    (pinCode: string) => {
      const validFile = form.getFieldValue('attachment');
      const formData = new FormData();
      formData.append('attachment', validFile);
      formData.append('pinCode', pinCode);
      addPackageBulk(formData);
    },
    [addPackageBulk, form]
  );

  return {
    form,
    handleClose,
    handleDownloadTemplate,
    handleCancel,
    openOtp,
    handleCloseOtp,
    handleSubmitAndCheckFile,
    handleConfirmWithPin,
    loadingCheckData,
    loadingAddBulk,
  };
};
