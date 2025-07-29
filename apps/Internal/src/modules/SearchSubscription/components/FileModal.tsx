import CModal from '@react/commons/Modal';
import { FileModalProps } from '../types';
import { Form } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useGetImage } from 'apps/Internal/src/components/layouts/queryHooks';

const FileModal: React.FC<FileModalProps> = ({
  isOpen,
  setIsOpen,
  name,
  urlCommitmentContract,
}) => {
  const form = Form.useFormInstance();
  const iframeRef = useRef<any>();
  const [iframeHeight, setIframeHeight] = useState(0);
  const [filePath, setFilePath] = useState('');
  const { data } = useGetImage(filePath);
  const isContractPdf = useMemo(() => {
    if (data && typeof data === 'object') {
      return data.isPdf;
    }
    return false;
  }, [data]);
  const pdfUrl = useMemo(() => {
    if (data && typeof data === 'object') {
      return (data as any).url;
    }
    return data;
  }, [data]);
  console.log(pdfUrl, 'pdfUrl');
  useEffect(() => {
    isOpen &&
      setFilePath(
        name === 'fileCommitmentContract'
          ? urlCommitmentContract
          : form.getFieldValue(name)
      );
  }, [isOpen]);
  useEffect(() => {
    handleChangeHeight();
    window.addEventListener('resize', handleChangeHeight);

    return () => {
      window.removeEventListener('resize', handleChangeHeight);
    };
  }, [data]);

  const handleChangeHeight = () => {
    setIframeHeight(window.innerHeight - 205);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <CModal
      open={isOpen}
      width={840}
      title={
        name === 'regulation13'
          ? 'Biên bản xác nhận NĐ13'
          : name === 'fileCommitmentContract'
          ? 'Bản cam kết chính chủ'
          : 'File BBXN/Hợp đồng'
      }
      footer={null}
      onOk={form.submit}
      onCancel={handleCancel}
    >
      {isContractPdf ? (
        <iframe
          ref={iframeRef}
          title="File"
          width="100%"
          height={iframeHeight}
          src={pdfUrl}
        />
      ) : (
        <img src={data} className="rounded-3xl" alt="File" />
      )}
    </CModal>
  );
};

export default FileModal;
