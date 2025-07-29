import { CButtonClose } from '@react/commons/Button';
import CModal from '@react/commons/Modal';
import { Spin } from 'antd';
import { useGetFileESim } from '../queryHooks';
import ButtonDownload from '@react/commons/Button/ButtonDownload';

interface IModalESim {
  onClose: () => void;
  nameFile: {
    name: string;
    id: number | string;
  };
}

export const ModalESim = ({ onClose, nameFile }: IModalESim) => {
  const { mutate: getESimFile, isPending: loadingDownload } = useGetFileESim(
    () => {
      onClose();
    }
  );
  const handleDownload = () => {
    getESimFile({ id: nameFile.id, fileName: nameFile.name });
  };

  return (
    <CModal
      open={!!nameFile.name && !!nameFile.id}
      onCancel={onClose}
      footer={null}
      closeIcon
    >
      <Spin spinning={loadingDownload}>
        <div className="text-center w-full font-bold text-base my-3">
          Danh sách mã QR eSIM{' '}
        </div>
        <div className="text-center text-lg font-bold text-primary mb-4 italic cursor-pointer">
          {nameFile.name}
        </div>
        <div className="flex justify-center items-center gap-4">
          <CButtonClose
            type="default"
            className="min-w-[120px]"
            onClick={onClose}
          >
            Đóng
          </CButtonClose>
          <ButtonDownload className="min-w-[120px]" onClick={handleDownload}>
            Tải file
          </ButtonDownload>
        </div>
      </Spin>
    </CModal>
  );
};
