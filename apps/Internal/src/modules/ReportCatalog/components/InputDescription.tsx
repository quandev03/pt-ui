import { EditOutlined, SaveOutlined } from '@ant-design/icons';
import CInput from '@react/commons/Input';
import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { useUpdateReportOnPackagePurchase } from '../hook/useReportOnPackagePurchase';
import { MESSAGE } from '@react/utils/message';
import ModalConfirm from 'apps/Internal/src/components/modalConfirm';
import { Tooltip } from 'antd';

interface IReportOnPackagePurchaseItem {
  orderCode: string;
  isdn: string;
  pckName: string;
  pckCode: string;
  price: number;
  registeredPckTime: string;
  payStatus: number;
  createdDate: string;
  channelName: string;
  description: string;
  orderId: string;
}

const Container = styled.div`
  position: relative;
  display: inline-block;
  height: 60px;
  .ant-input-affix-wrapper {
    margin-top: 17px;
  }
`;
const IconButton = styled.div`
  position: absolute;
  bottom: 9px;
  right: 8px;
  font-size: 20px;
  cursor: pointer;
  z-index: 100;
`;

interface IInputDescriptionProps {
  record: IReportOnPackagePurchaseItem;
}

const ErrorMessage = styled.div`
  color: #ff4d4f;
  font-size: 14px;
  position: absolute;
  left: 0;
  margin-top: 2px;
  z-index: 1;
`;

export const InputDescription: React.FC<IInputDescriptionProps> = ({
  record,
}) => {
  const [checkEdit, setCheckEdit] = useState(false);
  const [description, setDescription] = useState(record.description);
  const [errorMessage, setErrorMessage] = useState('');

  const { mutate: update } = useUpdateReportOnPackagePurchase(() => {
    setCheckEdit(false);
    setErrorMessage('');
  });

  const handleUpdate = useCallback(
    (data: { orderId: string; description: string }) => {
      update(data);
    },
    [update]
  );

  const handleSave = () => {
    if (!description) {
      setErrorMessage(MESSAGE.G06);
      return;
    }
    const data = {
      orderId: record.orderId,
      description,
    };
    ModalConfirm({
      message: 'common.confirmUpdate',
      handleConfirm: () => {
        handleUpdate(data);
      },
    });
  };
  return (
    <Container>
      <Tooltip title={!checkEdit ? record.description : ''} placement="topLeft">
        <CInput
          required
          disabled={!checkEdit}
          maxLength={100}
          value={description}
          allowClear={false}
          onChange={(e) => {
            setDescription(e.target.value);
            setErrorMessage('');
          }}
          onBlur={(e) => {
            setDescription(e.target.value.trim());
          }}
          className="mt-[17px] pr-8"
        />
      </Tooltip>
      <IconButton>
        {checkEdit ? (
          <SaveOutlined onClick={handleSave} />
        ) : (
          <EditOutlined
            onClick={() => {
              setCheckEdit(true);
              setErrorMessage('');
            }}
          />
        )}
      </IconButton>
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </Container>
  );
};
