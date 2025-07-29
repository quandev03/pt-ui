import { CModal } from '@react/commons/index';
import { Form } from 'antd';
import { useRef } from 'react';
import { useDetailContract } from '../queryHook/useDetailContract';
import { useActiveSubscriptStore } from '../store';

export interface Props {
  onSubmit?: (value: string) => void;
  isOpen: boolean;
  isSigned: boolean;
  setIsOpen: (value: boolean) => void;
  isND13?: boolean;
  pdfUrl?: Blob;
}

const ModalPdf: React.FC<Props> = ({
  isOpen,
  setIsOpen,
  isSigned,
  isND13,
  pdfUrl,
}) => {
  console.log('🚀 ~ pdfUrl:', pdfUrl);
  const form = Form.useFormInstance();
  const documentRef = useRef(null);
  const { isSignSuccess } = useActiveSubscriptStore();

  const { data, isFetching } = useDetailContract({
    id: pdfUrl ? '' : form.getFieldValue('contractNo') || '',
    isSigned,
    isND13,
  });

  const handleCancel = () => {
    setIsOpen(false);
  };
  const changeHeightTable = () => {
    const top =
      document?.querySelector('#report-embed')?.getBoundingClientRect().top ||
      0;

    return window.innerHeight - top - 80;
  };
  return (
    <CModal
      title="Biên bản xác nhận/ Hợp đồng"
      open={isOpen}
      loading={isFetching}
      width={840}
      onCancel={handleCancel}
      footer={null}
    >
      <div id="report-embed" ref={documentRef}>
        <iframe
          width="100%"
          height={changeHeightTable()}
          src={!isSignSuccess && pdfUrl ? pdfUrl : (data as any)}
          title="title"
          key={Math.random()}
        />
      </div>
    </CModal>
  );
};

export default ModalPdf;
