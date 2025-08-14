import { AnyElement, useActionMode } from '@vissoft-react/common';
import { Form } from 'antd';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetFile } from '../../hooks/useGetFile';
import useCheckData from '../../hooks/useCheckData';
import { useSellSinglePackageStore } from '../../store';

export const useLogicBulkSalePackageAction = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const actionMode = useActionMode();
  const [openOtp, setOpenOtp] = useState<boolean>(false);
  const { setCount, reset, setDataGenOtp } = useSellSinglePackageStore();

  const { mutate: checkData, isPending: loadingCheckData } = useCheckData(
    (data: AnyElement) => {
      setCount(120);
      setOpenOtp(true);
      setDataGenOtp(data);
    }
  );
  const handleOpenOtp = useCallback(
    (value: AnyElement) => {
      checkData(value.attachment);
    },
    [checkData]
  );

  const { mutate: downloadFile } = useGetFile();
  const handleDownloadTemplate = useCallback(() => {
    downloadFile();
  }, [downloadFile]);

  const handleCancel = useCallback(() => {
    form.resetFields();
  }, [form]);

  const handleClose = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return {
    form,
    actionMode,
    handleClose,
    handleCancel,
    useGetFile,
    handleDownloadTemplate,
    reset,
    loadingCheckData,
    handleOpenOtp,
    openOtp,
  };
};
