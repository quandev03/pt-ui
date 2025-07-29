import ModalDraggable from '@react/commons/Modal/Draggable';
import { Form } from 'antd';
import { useCallback, useRef } from 'react';
import { useDetailContract } from '../hooks/useDetailContract';
import useCensorshipStore from '../store';
import Iframe from './Iframe';
import { CloseCircleOutlined, FilePdfOutlined } from '@ant-design/icons';

export interface Props {
  onSubmit?: (value: string) => void;
  isOpen: boolean;
  isSigned: boolean;
  setIsOpen: (value: boolean) => void;
  isND13?: boolean;
  pdfUrl?: string;
  title?: string;
}

const ModalPdf: React.FC<Props> = ({
  isOpen,
  setIsOpen,
  isSigned,
  isND13,
  pdfUrl,
  title = 'Biên bản xác nhận/ Hợp đồng',
}) => {
  const form = Form.useFormInstance();
  const documentRef = useRef(null);
  const { isSignSuccess } = useCensorshipStore();
  const { data, isFetching } = useDetailContract({
    id: form.getFieldValue('contractId') || '',
    isSigned,
    isND13,
  });
  const handleCancel = (url: string) => {
    setIsOpen(false);
    if (!pdfUrl) URL.revokeObjectURL(url);
  };

  const blob = new Blob([data], {
    type: 'application/pdf',
  });
  const url =
    (!isSignSuccess || isND13) && pdfUrl ? pdfUrl : URL.createObjectURL(blob);
  const changeHeightTable = useCallback(() => {
    const top =
      document?.querySelector('#report-embed')?.getBoundingClientRect().top ||
      0;
    return window.innerHeight - top - 80;
  }, []);

  return (
    <ModalDraggable
      title={title}
      open={isOpen}
      loading={isFetching}
      width={1200}
      onCancel={() => handleCancel(url)}
      footer={null}
    >
      <div id="report-embed" ref={documentRef}>
        <Iframe iframeUrl={url} changeHeightTable={changeHeightTable} />
      </div>
    </ModalDraggable>
  );
};

export default ModalPdf;
