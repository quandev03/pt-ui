import CModal from '@react/commons/Modal';
import React, { useRef } from 'react';

type Props = {
  isOpen: boolean;
  src: string;
  setIsOpen: (isOpen: boolean) => void;
  title?: string;
};
const ModalPdf: React.FC<Props> = ({ isOpen, setIsOpen, src, title }) => {
  console.log('src', src);
  const documentRef = useRef(null);
  const changeHeightTable = () => {
    const top =
      document?.querySelector('#report-embed')?.getBoundingClientRect().top ||
      0;

    return window.innerHeight - top - 80;
  };
  const handleClose = () => {
    setIsOpen(false);
    URL.revokeObjectURL(src);
  };
  return (
    <CModal
      title={title ?? 'Giấy ủy quyền'}
      open={isOpen}
      width={840}
      onCancel={handleClose}
      footer={null}
    >
      <div id="report-embed" ref={documentRef}>
        <iframe
          width="100%"
          height={changeHeightTable()}
          src={src}
          title="title"
          key={Math.random()}
        />
      </div>
    </CModal>
  );
};
export default ModalPdf;
