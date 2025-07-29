import { Modal } from 'antd';

type Props = {
  isOpen: boolean;
  src: string;
  setIsOpen: (isOpen: boolean) => void;
};
const ModalImage: React.FC<Props> = ({ isOpen, setIsOpen, src }) => {
  const handleClose = () => {
    setIsOpen(false);
    URL.revokeObjectURL(src);
  };
  return (
    <Modal
      title={null}
      open={isOpen}
      loading={true}
      width={840}
      onCancel={handleClose}
      footer={null}
      centered
      modalRender={() => (
        <img
          src={src}
          className="rounded-3xl absolute left-1/2 translate-x-[-50%] translate-y-[-50%]"
          alt="Ảnh đính kèm"
        />
      )}
      className="flex justify-center"
    />
  );
};
export default ModalImage;
