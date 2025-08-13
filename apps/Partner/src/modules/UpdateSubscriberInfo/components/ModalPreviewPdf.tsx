import { CModal } from '@vissoft-react/common';
import { FC, useEffect, useRef } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  url: string;
  title: string;
};
const ModalPreviewPdf: FC<Props> = ({ open, onClose, url, title }) => {
  const documentRef = useRef(null);
  useEffect(() => {
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [url]);
  return (
    <CModal
      open={open}
      title={title}
      onCancel={onClose}
      width={800}
      footer={null}
    >
      <div className="w-full h-[70vh]" id="report-embed" ref={documentRef}>
        <iframe
          src={url}
          title={title}
          width="100%"
          className="h-full"
          key={Math.random()}
        />
      </div>
    </CModal>
  );
};
export default ModalPreviewPdf;
