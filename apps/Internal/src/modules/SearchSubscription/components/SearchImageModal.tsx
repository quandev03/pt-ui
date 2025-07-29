import { CButtonClose } from '@react/commons/Button';
import { CModal, CViewLinkInput } from '@react/commons/index';
import { Form } from 'antd';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useIsAdmin } from '../hooks/useIsAdmin';
import { useSearchImageQuery } from '../hooks/useSearchImageQuery';
import useSubscriptionStore from '../store';
import { ModalProps } from '../types';
import FileModal from './FileModal';
import IdentificationModal from './IdentificationModal';
import InformationChangeImage from './InformationChangeImage';
import Show from '@react/commons/Template/Show';

const SearchImageModal: React.FC<ModalProps> = ({ isOpen, setIsOpen }) => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const isAdmin = useIsAdmin();
  const { isIdentification } = useSubscriptionStore();
  const [isOpenIdentification, setIsOpenIdentification] = useState(false);
  const [isOpenFile, setIsOpenFile] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const { isFetching, data } = useSearchImageQuery(id ?? '', isOpen);
  const [checkFileCommitmentContract, setCheckFileCommitmentContract] =
    useState(false);
  useEffect(() => {
    if (isOpen && data) {
      if (data.fileCommitmentContract) {
        setCheckFileCommitmentContract(true);
      }
      form.setFieldsValue({
        ...data,
        regulation13: data.fileRegulation13,
      });
    }
  }, [isOpen, data]);
  const handleOpenFile = (name: string) => {
    setFieldName(name);
    if (isAdmin || isIdentification) {
      setIsOpenFile(true);
    } else {
      setIsOpenIdentification(true);
    }
  };
  const handleCancel = () => {
    setIsOpen(false);
    form.resetFields();
  };

  return (
    <CModal
      open={isOpen}
      width={600}
      title="Xem ảnh đang hiệu lực của thuê bao"
      footer={[<CButtonClose onClick={handleCancel} />]}
      onCancel={handleCancel}
      loading={isFetching}
    >
      <Form form={form} labelCol={{ span: 8 }} colon={false} labelWrap disabled>
        <InformationChangeImage
          label="Ảnh GTTT (mặt trước)"
          src={data?.frontId ?? ''}
          date={data?.timeFrontId}
        />
        <InformationChangeImage
          label="Ảnh GTTT (mặt sau)"
          src={data?.backId ?? ''}
          date={data?.timeBackId}
        />
        <InformationChangeImage
          label="Ảnh chân dung"
          src={data?.portrait ?? ''}
          date={data?.timePortrait}
        />
        <Show.When isTrue={!!data?.videoCallCapture}>
          <InformationChangeImage
            label="Ảnh video call"
            src={data?.videoCallCapture ?? ''}
            date={data?.timeVideoCallCapture ?? ''}
          />
        </Show.When>
        <Form.Item label="Nghị định 13" name="regulation13">
          <CViewLinkInput
            children="Biên bản xác nhận NĐ13"
            onView={() => handleOpenFile('regulation13')}
          />
        </Form.Item>
        <Form.Item label="File BBXN/Hợp đồng" name="fileContract">
          <CViewLinkInput
            children="File BBXN/Hợp đồng"
            onView={() => handleOpenFile('fileContract')}
          />
        </Form.Item>
        {checkFileCommitmentContract && (
          <Form.Item label="Bản cam kết" name="fileCommitmentContract">
            <CViewLinkInput
              onView={() => handleOpenFile('fileCommitmentContract')}
              children="Bản cam kết"
            />
          </Form.Item>
        )}
      </Form>
      <IdentificationModal
        isOpen={isOpenIdentification}
        setIsOpen={setIsOpenIdentification}
        callback={() => setIsOpenFile(true)}
      />
      <FileModal
        isOpen={isOpenFile}
        setIsOpen={setIsOpenFile}
        name={fieldName}
        urlCommitmentContract={form.getFieldsValue().fileCommitmentContract}
      />
    </CModal>
  );
};

export default SearchImageModal;
