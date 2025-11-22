import { Form } from 'antd';
import { useCallback, useState } from 'react';
import { useUploadRoomPaymentFile } from '../../hooks';
import { IRoomPaymentUploadParams } from '../../types';
import { useQueryClient } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from '../../../../../src/constants/query-key';

export const useLogicUploadRoomPayment = (onClose: () => void) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { mutate: uploadFile, isPending: loadingUpload } = useUploadRoomPaymentFile(
    (data) => {
      // Success - close modal and refresh list
      form.resetFields();
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.ROOM_PAYMENT_LIST],
      });
      onClose();
    },
    (errors) => {
      // Error handling is done in the hook
      console.error('Upload errors:', errors);
    }
  );

  const handleSubmit = useCallback(
    (values: { file: any; month: number; year: number }) => {
      const fileList = values.file;
      if (!fileList || fileList.length === 0) {
        form.setFields([
          {
            name: 'file',
            errors: ['Vui lòng chọn file Excel'],
          },
        ]);
        return;
      }

      const file = fileList[0]?.originFileObj || fileList[0];
      if (!file) {
        form.setFields([
          {
            name: 'file',
            errors: ['Vui lòng chọn file Excel'],
          },
        ]);
        return;
      }

      const uploadData: IRoomPaymentUploadParams = {
        file,
        month: values.month,
        year: values.year,
      };

      uploadFile(uploadData);
    },
    [form, uploadFile]
  );

  const handleDownloadTemplate = useCallback(() => {
    // Create a simple Excel template
    const templateData = [
      ['Mã phòng', 'Số điện sử dụng', 'Số nước sử dụng', 'Số xe'],
      ['P001', '100', '10', '1'],
      ['P002', '150', '15', '2'],
    ];

    // Convert to CSV for simplicity (can be enhanced to use Excel library)
    const csvContent = templateData.map((row) => row.join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'room-payment-template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  return {
    form,
    loadingUpload,
    handleSubmit,
    handleDownloadTemplate,
  };
};

