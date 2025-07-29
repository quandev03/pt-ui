import { CModal } from '@react/commons/index';
import { Form } from 'antd';
import { useEffect, useRef, useState } from 'react';
import {
  ContractTypeEnum,
  useDetailContract,
} from '../hooks/useDetailContract';
import useOwnershipTransferStore from '../store';

export interface Props {
  onSubmit?: (value: string) => void;
  isOpen: boolean;
  isSign: boolean;
  setIsOpen: (value: boolean) => void;
  isND13?: boolean;
  title?: string;
  contractType: ContractTypeEnum;
}

const ModalPdf: React.FC<Props> = ({
  isOpen,
  setIsOpen,
  isSign,
  isND13,
  title,
  contractType,
}) => {
  const { typeOfGenContract } = useOwnershipTransferStore();
  const form = Form.useFormInstance();
  const documentRef = useRef(null);
  const [tableHeight, setTableHeight] = useState(0);
  const { data, isFetching } = useDetailContract({
    id: form.getFieldValue('contractId') || '',
    isSign,
    typeContract: contractType,
  });

  const handleCancel = () => {
    setIsOpen(false);
  };

  const blob = new Blob([data], { type: 'application/pdf' });
  const blobUrl = URL.createObjectURL(blob);
  const handleChangeHeight = () => {
    setTableHeight(window.innerHeight - 200);
  };

  useEffect(() => {
    handleChangeHeight();
    window.addEventListener('resize', handleChangeHeight);
    return () => {
      window.removeEventListener('resize', handleChangeHeight);
    };
  }, [isFetching]);

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(blobUrl);
    };
  }, []);

  const renderTitle = () => {
    if (title) return title;
    const temp =
      typeOfGenContract === ContractTypeEnum.YEU_CAU
        ? 'Phiếu yêu cầu chuyển quyền sở hữu thuê bao'
        : typeOfGenContract === ContractTypeEnum.CAM_KET
        ? 'Bản cam kết'
        : '';

    return isND13
      ? 'Biên bản xác nhận NĐ13'
      : temp
      ? temp
      : 'Biên bản xác nhận/ Hợp đồng';
  };

  return (
    <CModal
      title={renderTitle()}
      open={isOpen}
      loading={isFetching}
      width={840}
      onCancel={handleCancel}
      footer={null}
    >
      <div id="report-embed" ref={documentRef}>
        <iframe
          width="100%"
          height={tableHeight}
          src={blobUrl}
          title="title"
          key={Math.random()}
        />
      </div>
    </CModal>
  );
};

export default ModalPdf;
