import { Form, Spin } from 'antd';
import { MESSAGE } from '@react/utils/message';
import React, { memo, useEffect, useMemo, useState } from 'react';
import ModalImage from './ModalImage';
import { useGetImage } from 'apps/Internal/src/components/layouts/queryHooks';
import PreviewPDF from '@react/commons/PreviewPDF';

interface CUploadProps {
  name: string[];
  label: string;
  urlImage: string;
  isProfilePicture?: boolean;
  contentWatermark?: string;
}

export const ShowUploadImage: React.FC<CUploadProps> = ({
  name,
  label,
  urlImage,
  isProfilePicture = false,
  contentWatermark = 'VNSKY',
}) => {
  const isPDF = useMemo(() => {
    return (
      urlImage.toLocaleLowerCase().endsWith('.pdf') ||
      urlImage.toLocaleLowerCase().endsWith('.PDF')
    );
  }, [urlImage]);
  const { data: imageBlobUrl, isLoading } = useGetImage(
    urlImage,
    isProfilePicture,
    isPDF
  );
  const [openPreviewPDF, setOpenPreviewPDF] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      if (!isPDF) {
        URL.revokeObjectURL(imageBlobUrl as string);
      }
    };
  }, [imageBlobUrl, isPDF]);

  const handlePreview = () => {
    if (imageBlobUrl) {
      setIsOpen(true);
    }
  };

  const renderContent = useMemo(() => {
    if (imageBlobUrl && isPDF) {
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
              src={imageBlobUrl as string}
              title="title"
              height={'100%'}
              key={Math.random()}
            />
          </div>
        </div>
      );
    } else if (imageBlobUrl && !isPDF) {
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
  }, [imageBlobUrl, isPDF]);

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
      <ModalImage
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        src={(imageBlobUrl as string) || ''}
        title={label}
        isProfilePicture={isProfilePicture}
      />
      <PreviewPDF
        file={imageBlobUrl as string}
        open={openPreviewPDF}
        title={label}
        onClose={() => setOpenPreviewPDF(false)}
      />
    </Form.Item>
  );
};

export default memo(ShowUploadImage);
