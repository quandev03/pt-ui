import { CModal } from '@vissoft-react/common';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import React, { FC, useRef } from 'react';

type Props = {
  open: boolean;
  onClose: (isND13: boolean) => void;
  title: string;
  isND13: boolean;
};
const ModalPreviewPdf: FC<Props> = ({ open, onClose, title, isND13 }) => {
  const documentRef = useRef(null);
  const form = useFormInstance();
  const contractUrl = form.getFieldValue('contractUrl');
  const degree13Url = form.getFieldValue('degree13Url');
  return (
    <CModal
      open={open}
      title={title}
      onCancel={() => onClose(isND13)}
      width={800}
      footer={null}
      destroyOnHidden
    >
      <div className="w-full h-[70vh]" id="report-embed" ref={documentRef}>
        <iframe
          src={isND13 ? degree13Url : contractUrl}
          title={title}
          width="100%"
          className="h-full"
        />
      </div>
    </CModal>
  );
};
export default React.memo(ModalPreviewPdf);
