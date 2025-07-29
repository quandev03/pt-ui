import { UploadOutlined } from '@ant-design/icons';
import PreviewPDF from '@react/commons/PreviewPDF';
import { MESSAGE } from '@react/utils/message';
import { Button, Form, Input, Spin, Upload } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import { useGetImage } from 'apps/Internal/src/components/layouts/queryHooks';
import React, { memo, useEffect, useMemo, useState } from 'react';
import useCensorshipStore from '../../store';
import ModalImage from '../ModalImage';

interface CUploadProps {
  name: string[];
  label: string;
  urlImage: string;
  isProfilePicture?: boolean;
  contentWatermark?: string;
  isOld?: boolean;
}

export const PreviewContact: React.FC<CUploadProps> = ({
  name,
  label,
  urlImage,
  isProfilePicture = false,
  contentWatermark = 'VNSKY',
  isOld = true,
}) => {
  const form = Form.useFormInstance();
  const { isOffSign } = useCensorshipStore();
  const fileContractOff = useWatch('fileContractOff', form);

  const fileContractOffUrl = useMemo(() => {
    if (!fileContractOff) return '';
    const blob = new Blob([fileContractOff], { type: fileContractOff.type });
    const url = URL.createObjectURL(blob);
    return url;
  }, [fileContractOff]);

  const { data: imageBlobUrl, isLoading } = useGetImage(
    urlImage,
    isProfilePicture
  );
  const isContractPdf = useMemo(() => {
    if (imageBlobUrl && typeof imageBlobUrl === 'object') {
      return imageBlobUrl.isPdf;
    }
    return false;
  }, [imageBlobUrl]);
  const pdfUrl = useMemo(() => {
    if (imageBlobUrl && typeof imageBlobUrl === 'object') {
      return (imageBlobUrl as any).url;
    }
    return imageBlobUrl;
  }, [imageBlobUrl]);
  const [openPreviewPDF, setOpenPreviewPDF] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      if (!isContractPdf) {
        URL.revokeObjectURL(imageBlobUrl as string);
      }
    };
  }, [imageBlobUrl, isContractPdf]);

  const handlePreview = () => {
    if (imageBlobUrl) {
      setIsOpen(true);
    }
  };
  const handleUpload = (file: File) => {
    form.setFieldsValue({
      fileContractOff: file,
    });
    return false;
  };
  const renderContent = useMemo(() => {
    if (!isOld && isOffSign && !fileContractOffUrl) {
      return (
        <Upload
          showUploadList={false}
          beforeUpload={handleUpload}
          accept={'.pdf, application/pdf'}
          multiple={false}
          maxCount={1}
        >
          <Button
            className="w-[124px] h-[35px] rounded-[5px]"
            type="primary"
            icon={<UploadOutlined />}
          />
        </Upload>
      );
    } else if (!isOld && isOffSign && !!fileContractOffUrl) {
      return (
        <div>
          <div
            className="border-2 flex items-center justify-center rounded-2xl mt-1 mb-3 object-cover image-frame image-frame cursor-pointer w-full "
            style={{ aspectRatio: '16 / 9' }}
            onClick={() => {
              setOpenPreviewPDF(true);
            }}
          >
            <div
              className="absolute top-0 left-0 h-full bg-transparent cursor-pointer"
              style={{ width: 'calc(100% - 20px)' }}
            />
            <iframe
              width="100%"
              src={fileContractOffUrl}
              title="title"
              height={'100%'}
              key={Math.random()}
            />
          </div>
        </div>
      );
    } else if (isContractPdf) {
      return (
        <div>
          <div
            className="border-2 flex items-center justify-center rounded-2xl mt-1 mb-3 object-cover image-frame image-frame cursor-pointer w-full "
            style={{ aspectRatio: '16 / 9' }}
            onClick={() => {
              setOpenPreviewPDF(true);
            }}
          >
            <div
              className="absolute top-0 left-0 h-full bg-transparent cursor-pointer"
              style={{ width: 'calc(100% - 20px)' }}
            />
            <iframe
              width="100%"
              src={pdfUrl ? pdfUrl : (imageBlobUrl as string)}
              title="title"
              height={'100%'}
              key={Math.random()}
            />
          </div>
        </div>
      );
    } else if (!isContractPdf) {
      return (
        <div>
          <img
            title={'Cập nhật ảnh'}
            alt="avatar"
            src={imageBlobUrl as string}
            className="border-2 rounded-2xl mt-1 object-cover image-frame cursor-pointer w-full"
            style={{ aspectRatio: '16 / 9' }}
            onClick={handlePreview}
          />
          <p className="text-black text-sm text-center rounded-2xl font-bold">
            {contentWatermark}
          </p>
        </div>
      );
    }
    return null;
  }, [imageBlobUrl, isContractPdf, isOffSign, fileContractOffUrl]);

  return (
    <Form.Item
      label={label}
      name={name}
      rules={[
        {
          required: true,
          message: MESSAGE.G06,
        },
      ]}
    >
      <Spin spinning={isLoading}>{renderContent}</Spin>

      <Form.Item name={'fileContractOff'} hidden>
        <Input />
      </Form.Item>

      <ModalImage
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        src={imageBlobUrl as string}
        title={label}
        isProfilePicture={isProfilePicture}
      />
      <PreviewPDF
        file={
          !isOld && fileContractOffUrl
            ? fileContractOffUrl
            : pdfUrl
            ? pdfUrl
            : (imageBlobUrl as string)
        }
        open={openPreviewPDF}
        title={label}
        onClose={() => setOpenPreviewPDF(false)}
      />
    </Form.Item>
  );
};

export default memo(PreviewContact);
