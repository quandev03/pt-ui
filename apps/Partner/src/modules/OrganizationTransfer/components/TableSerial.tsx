import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, CTable } from '@react/commons/index';
import { Col, Flex, Form, FormListOperation } from 'antd';
import Column from 'antd/lib/table/Column';
import { ReactNode, useEffect } from 'react';
import { ISerialType } from '../types';

interface Props {
  name: string;
  label?: string;
  disabled?: boolean;
  children: ReactNode;
  handleChoose?: () => void;
  isHiddenAction?: boolean;
}

const TableSerial: React.FC<Props> = ({
  label,
  name = 'products',
  children,
  handleChoose,
  disabled,
  isHiddenAction = false,
}) => {
  const form = Form.useFormInstance();
  const dataTable = Form.useWatch(name, form) ?? [{}];

  useEffect(() => {
    form.setFieldsValue({ [name]: [{}] });
  }, []);
  const handleRemoveItem = (
    remove: FormListOperation['remove'],
    index: number,
    record: ISerialType
  ) => {
    const filteredProducts = dataTable.filter((item:ISerialType) => 
      !(String(item.id ?? item.productId) === String(record.id))
    );
    form.setFieldValue(name, filteredProducts);
  };
  const handleAddItem = (add: FormListOperation['add']) => {
    add({});
  };
  return (
    <Form.List name={name}>
      {(_, { add, remove }) => (
        <>
          {label && (
            <Col className="flex justify-between items-center mt-4" span={24}>
              <strong className="text-base">{`Danh sách ${label}`}</strong>
              {!disabled && handleChoose && (
                <Button
                  onClick={handleChoose}
                  icon={<FontAwesomeIcon icon={faPlus} />}
                >
                  {`Chọn ${label}`}
                </Button>
              )}
            </Col>
          )}
          <Col className="mb-4 mt-4" span={24}>
            <Flex justify="end" align="end" gap={12}>
              <CTable
                rowKey={'id'}
                dataSource={dataTable}
                loading={false}
                scroll={undefined}
                className="dynamic-table"
              >
                <Column
                  width={50}
                  dataIndex="stt"
                  title={'STT'}
                  render={(_, record, index) => {
                    const allRecords = dataTable;
                    if (!record.productCode && Object.keys(record).length !== 0) {
                      return null;
                    }
                    const invalidRecordsCount = allRecords
                      .slice(0, index)
                      .filter((r: any) => !r.productCode && Object.keys(r).length !== 0)
                      .length;
                    return index - invalidRecordsCount + 1;
                  }}
                />
                {children}
                <Column
                  dataIndex="id"
                  title=""
                  align="center"
                  width={75}
                  hidden={disabled || isHiddenAction}
                  render={(_, record: any, index: number) => {
                    if (!record.productCode && Object.keys(record).length !== 0) {
                      return null;
                    }
                    return (
                      <Flex justify="end" gap={12}>
                        {dataTable.length > 1 && (
                          <FontAwesomeIcon
                            icon={faMinus}
                            onClick={() => handleRemoveItem(remove, index,record)}
                            className="mr-2 cursor-pointer"
                            size="lg"
                            title="Xóa"
                          />
                        )}
                      </Flex>
                    );
                  }}
                />
              </CTable>
              {!disabled && !isHiddenAction && (
                <FontAwesomeIcon
                  icon={faPlus}
                  onClick={() => handleAddItem(add)}
                  size="lg"
                  className="cursor-pointer mb-[18px]"
                  title="Thêm"
                />
              )}
            </Flex>
          </Col>
        </>
      )}
    </Form.List>
  );
};

export default TableSerial;
