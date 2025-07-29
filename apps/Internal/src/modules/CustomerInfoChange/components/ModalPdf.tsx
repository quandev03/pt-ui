import { CModal } from '@react/commons/index';
import { Form } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useDetailContract } from '../hooks/useDetailContract';
import { useLocation } from 'react-router-dom';

export interface Props {
  onSubmit?: (value: string) => void;
  isOpen: boolean;
  isSigned: boolean;
  setIsOpen: (value: boolean) => void;
  isCommit?: boolean;
  title?: string;
  isND13?: boolean
}

const ModalPdf: React.FC<Props> = ({
  isOpen,
  setIsOpen,
  isSigned,
  isCommit=false,
  title,
  isND13 = false
}) => {
  const form = Form.useFormInstance();
  const documentRef = useRef(null);
  const location = useLocation();
  const [tableHeight, setTableHeight] = useState(0);
  const { data, isFetching } = useDetailContract({
    id: form.getFieldValue('contractId') || '',
    isSigned,
    isCommit,
    pathname: location.pathname,
    isND13: isND13
  });

  const handleCancel = () => {
    setIsOpen(false);
  };

  const blob = new Blob([data], { type: 'application/pdf' });
  const blobUrl = URL.createObjectURL(blob);
  const handleChangeHeight = () => {
    setTableHeight(window.innerHeight - 200);
  };

  useEffect(() => {
    handleChangeHeight();
    window.addEventListener('resize', handleChangeHeight);
    return () => {
      window.removeEventListener('resize', handleChangeHeight);
    };
  }, [isFetching]);

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(blobUrl);
    };
  }, []);

  const renderTitle = () => {
    if (title) return title;
    return isCommit ? 'Bảm cam kết chính chủ' : 'Biên bản xác nhận/ Hợp đồng';
  };

  return (
    <CModal
      title={renderTitle()}
      open={isOpen}
      loading={isFetching}
      width={840}
      onCancel={handleCancel}
      footer={null}
    >
      <div id="report-embed" ref={documentRef}>
        <iframe
          width="100%"
          height={tableHeight}
          src={blobUrl}
          title="title"
          key={Math.random()}
        />
      </div>
    </CModal>
  );
};

export default ModalPdf;
