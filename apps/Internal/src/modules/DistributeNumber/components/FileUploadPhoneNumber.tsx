import { PlusOutlined } from '@ant-design/icons';
import CButton from '@react/commons/Button';
import { StyledCommonTable } from '@react/commons/Table/styles';
import { Text } from '@react/commons/Template/style';
import { ACTION_MODE_ENUM } from '@react/commons/types';
import useActionMode from '@react/hooks/useActionMode';
import { Row } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import ModalSelectNumber from 'apps/Internal/src/components/ModalSelectNumber';
import { columnsUploadEachPhoneNumber } from 'apps/Internal/src/modules/DistributeNumber/constants';
import { FC, useCallback, useMemo, useState } from 'react';
import useError from '../store/useError';
import useSelectListPhoneNumber from '../store/useSelectListPhoneNumbers';

const FileUploadPhoneNumber: FC = () => {
  const actionMode = useActionMode();
  const form = useFormInstance();
  const stockId = useWatch('stockId', form);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const { listPhoneNumber, setListPhoneNumber } = useSelectListPhoneNumber();
  const { error } = useError();

  const handleRemoveItem = useCallback(
    (id: number | string) => {
      const newData = listPhoneNumber.filter((item) => item.id !== id);
      setListPhoneNumber(newData);
    },
    [listPhoneNumber]
  );

  const handleCloseModal = () => {
    setIsOpenModal(false);
  };

  const columns = useMemo(() => {
    return columnsUploadEachPhoneNumber({ handleRemoveItem, actionMode });
  }, [actionMode, handleRemoveItem]);

  const handleShowModalAddPhone = () => {
    setIsOpenModal(true);
    return true;
  };

  const handleAddTransferNumber = (data: any) => {
    setListPhoneNumber(data);
    setIsOpenModal(false);
  };

  return (
    <>
      <Row className="flex justify-between items-center mb-3">
        <strong className="text-base">Danh sách số</strong>
        {actionMode === ACTION_MODE_ENUM.CREATE && (
          <CButton
            disabled={!stockId}
            onClick={handleShowModalAddPhone}
            icon={<PlusOutlined />}
          >
            Chọn số
          </CButton>
        )}
      </Row>
      <StyledCommonTable
        dataSource={listPhoneNumber}
        columns={columns}
        locale={{ emptyText: 'Không có dữ liệu' }}
        rowKey="key"
        size="small"
        className="dynamic-table"
        pagination={false}
        scroll={{ y: 500 }}
      />
      {error && (
        <Text className={'mt-1'} style={{ color: '#ff4d4f', fontSize: '14px' }}>
          {error}
        </Text>
      )}
      <ModalSelectNumber
        open={isOpenModal}
        defaultSelected={listPhoneNumber}
        onCancel={handleCloseModal}
        onSave={handleAddTransferNumber}
        nameField="stockId"
      />
    </>
  );
};

export default FileUploadPhoneNumber;
