import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, CTable } from '@react/commons/index';
import { Col, Flex, Form, FormListOperation } from 'antd';
import Column from 'antd/lib/table/Column';
import { ReactNode, useEffect } from 'react';
interface Props {
  name: string;
  label?: string;
  disabled?: boolean;
  children: ReactNode;
  handleChoose?: () => void;
  isHiddenAction?: boolean;
}

const TableDynamicInternalWarehouse: React.FC<Props> = ({
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
    index: number
  ) => {
    remove(index);
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
                    const currentIndex = dataTable
                      .filter((row: any) => row.id || !row.checkSerial)
                      .findIndex((row: any) => row === record);

                    if (!disabled && currentIndex !== -1) {
                      return currentIndex + 1;
                    }
                    else if (disabled) {
                      return ++index
                    }
                  }}
                />
                {children}
                <Column
                  dataIndex="id"
                  title=""
                  align="center"
                  width={75}
                  hidden={disabled || isHiddenAction}
                  render={(_, record: any, index: number) => (
                    <Flex justify="end" gap={12}>
                      {dataTable.length > 1 && (
                        <FontAwesomeIcon
                          icon={faMinus}
                          onClick={() => handleRemoveItem(remove, index)}
                          className="mr-2 cursor-pointer"
                          size="lg"
                          title="Xóa"
                        />
                      )}
                    </Flex>
                  )}
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

export default TableDynamicInternalWarehouse;
