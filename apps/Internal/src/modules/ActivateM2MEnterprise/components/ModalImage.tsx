import { Form, Modal } from 'antd';

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
    <Form.Item
      labelCol={{
        flex: 'auto',
      }}
      wrapperCol={{
        flex: 'auto',
      }}
      layout="vertical"
      className="w-full"
    >
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
      />
    </Form.Item>
  );
};

export default ModalImage;
