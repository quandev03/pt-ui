import { CModal } from '@react/commons/index';
import { useRef } from 'react';
import useActivateM2M from '../store';

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
  pdfUrl,
}) => {
  const documentRef = useRef(null);
  const { isSignSuccess } = useActivateM2M();

  const handleCancel = (url: string) => {
    setIsOpen(false);
    URL.revokeObjectURL(url);
  };

  const blob = new Blob([!isSignSuccess && pdfUrl ? pdfUrl : ""], {
    type: 'application/pdf',
  });
  const url = URL.createObjectURL(blob);
  const changeHeightTable = () => {
    const top =
      document?.querySelector('#report-embed')?.getBoundingClientRect().top ||
      0;

    return window.innerHeight - top - 80;
  };

  return (
    <CModal
      title="Thông tin ủy quyền"
      open={isOpen}
      width={840}
      onCancel={() => handleCancel(url)}
      footer={null}
    >
      <div id="report-embed" ref={documentRef}>
        <iframe
          width="100%"
          height={changeHeightTable()}
          src={url}
          title="title"
          key={Math.random()}
        />
      </div>
    </CModal>
  );
};

export default ModalPdf;
