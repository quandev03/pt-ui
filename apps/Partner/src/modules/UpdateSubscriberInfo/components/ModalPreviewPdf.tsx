import { CModal } from '@vissoft-react/common';
import { FC } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  url: string;
  title: string;
};
const ModalPreviewPdf: FC<Props> = ({ open, onClose, url, title }) => {
  return (
    <CModal
      open={open}
      title={title}
      onCancel={onClose}
      width={800}
      footer={null}
    >
      <div className="w-full h-[70vh]">
        <iframe src={url} title={title} className="w-full h-full" />
      </div>
    </CModal>
  );
};
export default ModalPreviewPdf;
