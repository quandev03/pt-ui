import { Form, Spin } from 'antd';
import { RcFile } from 'antd/lib/upload';
import { MESSAGE } from '@react/utils/message';
import React, { useEffect, useState } from 'react';
import ModalImage from './ModalImage';
import ModalPdf from './ModalPdf';
import {
  useGetImage,
  useGetPdf,
} from 'apps/Internal/src/components/layouts/queryHooks';

export const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
interface CUploadProps {
  name: string;
  label: string;
  url: string;
}

export const CUpload: React.FC<CUploadProps> = ({ name, label, url }) => {
  const [progress] = useState<number>(0);
  const [progressLoading] = useState<boolean>(false);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpenPdf, setIsOpenPdf] = useState<boolean>(false);
  const { data: imageBlobUrl, isLoading } = useGetImage(url);
  const { data: pdfBlobUrl } = useGetPdf(url);
  const setImageHeight = () => {
    document.querySelectorAll('.image-frame').forEach((box: any) => {
      const width = box?.clientWidth;
      box.style.height = `${(width * 3) / 4}px`;
    });
  };

  useEffect(() => {
    setImageHeight();
    window.addEventListener('resize', setImageHeight);
    return () => {
      window.removeEventListener('resize', setImageHeight);
    };
  });

  const handlePreview = () => {
    setIsOpen(true);
  };

  const renderImgs = () => {
    if (imageBlobUrl) {
      return (
        <img
          title={'Cập nhật ảnh'}
          alt=""
          src={imageBlobUrl}
          className="border-2 rounded-2xl mt-1 object-cover image-frame cursor-pointer w-full"
          onClick={handlePreview}
        />
      );
    } else
      return (
        <div className="border-2 flex items-center justify-center rounded-2xl  mt-1 object-cover image-frame"></div>
      );
  };

  return (
    <Form.Item
      label={label}
      name={name}
      labelCol={{
        flex: 'auto',
      }}
      wrapperCol={{
        flex: 'auto',
      }}
      layout="vertical"
      className="w-full"
    >
      <Spin
        spinning={
          (progress > 0 && progress < 100 && progressLoading) || isLoading
        }
      >
        {renderImgs()}
      </Spin>
      {isOpen && (
        <ModalImage
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          src={imageBlobUrl || ''}
        />
      )}

      {isOpenPdf && (
        <ModalPdf
          isOpen={isOpenPdf}
          setIsOpen={setIsOpenPdf}
          isSigned={false}
          pdfUrl={pdfBlobUrl}
        />
      )}
    </Form.Item>
  );
};

export default CUpload;
