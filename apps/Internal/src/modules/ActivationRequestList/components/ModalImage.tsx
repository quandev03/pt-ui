import { Modal } from 'antd';

export interface Props {
  isOpen: boolean;
  src: string;
  setIsOpen: (value: boolean) => void;
}

const ModalImage: React.FC<Props> = ({ isOpen, setIsOpen, src }) => {
  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <Modal
      title={null}
      open={isOpen}
      loading={false}
      width={840}
      onCancel={handleCancel}
      footer={null}
      centered
      modalRender={() => (
        <img src={src} className="rounded-3xl" alt="thong-tin-khach-hang" />
      )}
    ></Modal>
  );
};

export default ModalImage;
