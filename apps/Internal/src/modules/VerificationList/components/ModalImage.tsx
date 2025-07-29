import ModalDraggable from '@react/commons/Modal/Draggable';
import { Modal } from 'antd';

export interface Props {
  isOpen: boolean;
  src?: string;
  setIsOpen: (value: boolean) => void;
  isProfilePicture?: boolean;
  title?: string;
}

const ModalImage: React.FC<Props> = ({
  isOpen,
  setIsOpen,
  src,
  isProfilePicture = false,
  title,
}) => {
  const handleCancel = () => {
    setIsOpen(false);
  };

  return isProfilePicture ? (
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
  ) : (
    <ModalDraggable
      title={title}
      open={isOpen}
      loading={false}
      width={750}
      onCancel={handleCancel}
      footer={null}
      centered
    >
      <img src={src} className="rounded-3xl" alt="thong-tin-khach-hang" />
    </ModalDraggable>
  );
};

export default ModalImage;
