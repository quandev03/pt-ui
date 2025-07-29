import { Modal } from 'antd';

export interface Props {
  isOpen: boolean;
  src: string;
  setIsOpen: (value: boolean) => void;
}

const ModalImage: React.FC<Props> = ({ isOpen, setIsOpen, src }) => {
  const handleCancel = () => {
    setIsOpen(false);
    URL.revokeObjectURL(src);
  };

  return (
    <Modal
      title={null}
      open={isOpen}
      loading={false}
      width={840}
      onCancel={handleCancel}
      footer={null}
      // closable={false}
      centered
      modalRender={() => (
        <img
          src={src}
          className="rounded-3xl absolute left-1/2 translate-x-[-50%] translate-y-[-50%]"
          alt="thong-tin-khach-hang"
        />
      )}
    ></Modal>
  );
};

export default ModalImage;
