import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CButton from '@react/commons/Button';
import CTable from '@react/commons/Table';
import Show from '@react/commons/Template/Show';
import { BtnGroupFooter, Text } from '@react/commons/Template/style';
import { Col, Form, Row, Tooltip } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import { ColumnsType } from 'antd/es/table';
import ModalSelectNumber from 'apps/Internal/src/components/ModalSelectNumber';
import React, { useEffect, useState } from 'react';
import { ServicePackageItem } from '../../ListOfServicePackage/types';
import { IStockIsdn } from '../types';
type SingleSelectionProps = {
  hideAction: boolean;
  listNumberSelected: IStockIsdn[];
  setListNumberSelected: React.Dispatch<React.SetStateAction<IStockIsdn[]>>;
};
const SingleSelection: React.FC<SingleSelectionProps> = ({
  hideAction,
  listNumberSelected,
  setListNumberSelected,
}) => {
  const form = Form.useFormInstance();
  const stockId = useWatch('stockId', form);

  const [open, setOpen] = useState(false);

  const showSelectNumberModal = () => {
    setOpen(true);
  };
  const handleCancel = () => {
    setOpen(false);
  };

  useEffect(() => {
    form.setFieldsValue({
      isdn: listNumberSelected.map((item) => item.isdn),
    });
  }, [listNumberSelected, form]);

  const columns: ColumnsType<ServicePackageItem> = [
    {
      title: 'STT',
      align: 'left',
      fixed: 'left',
      width: 50,
      render(_, record, index) {
        return <Text>{index + 1}</Text>;
      },
    },
    {
      title: 'Số',
      dataIndex: 'isdn',
      width: 210,
      align: 'left',
      render(value, record, index) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Nhóm số',
      dataIndex: 'groupCode',
      width: 210,
      align: 'left',
      render(value, record) {
        const text = value ? `Nhóm ${value}` : '';
        return (
          <Tooltip title={text} placement="topLeft">
            <Text>{text}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Định dạng số',
      dataIndex: 'generalFormat',
      width: 210,
      align: 'left',
      render(value) {
        const text = value ?? '';
        return (
          <Tooltip title={text} placement="topLeft">
            <Text>{text}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: '',
      align: 'center',
      width: 100,
      fixed: 'right',
      render(_, __, index) {
        return (
          <div className="flex">
            {!hideAction ? (
              <>
                {listNumberSelected.length > 1 ? (
                  <FontAwesomeIcon
                    fontSize={20}
                    icon={faMinus}
                    onClick={() =>
                      setListNumberSelected(
                        listNumberSelected.filter((_, i) => i !== index)
                      )
                    }
                    className="mr-6 cursor-pointer"
                  />
                ) : null}
              </>
            ) : null}
          </div>
        );
      },
    },
  ];

  const handleSave = (selectedRows: IStockIsdn[]) => {
    setOpen(false);
    setListNumberSelected(selectedRows);
  };

  return (
    <>
      <Row className="my-5">
        <Col>
          <strong>Danh sách số</strong>
        </Col>
        <Show.When isTrue={!hideAction}>
          <BtnGroupFooter>
            <CButton
              onClick={showSelectNumberModal}
              icon={<FontAwesomeIcon icon={faPlus} size="lg" />}
              disabled={!stockId}
            >
              Chọn số
            </CButton>
          </BtnGroupFooter>
        </Show.When>
      </Row>
      <CTable
        id="common-table"
        className="dynamic-table !w-full"
        columns={columns}
        rowClassName="editable-row align-top"
        dataSource={listNumberSelected}
        pagination={false}
        scroll={{ y: 500 }}
      />
      <ModalSelectNumber
        open={open}
        defaultSelected={listNumberSelected}
        onCancel={handleCancel}
        onSave={handleSave}
        nameField="stockId"
      />
    </>
  );
};

export default SingleSelection;
