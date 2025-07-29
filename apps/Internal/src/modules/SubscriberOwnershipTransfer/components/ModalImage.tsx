import { Modal } from 'antd';

export interface Props {
  isOpen: boolean;
  src: string;
  onCancel: () => void;
}

const ModalImage: React.FC<Props> = ({ isOpen, onCancel, src }) => {
  return (
    <Modal
      title={null}
      open={isOpen}
      loading={false}
      width={840}
      onCancel={onCancel}
      footer={null}
      // closable={false}
      centered
      modalRender={() => (
        <img src={src} className="rounded-3xl" alt="thong-tin-khach-hang" />
      )}
    />
  );
};

export default ModalImage;
