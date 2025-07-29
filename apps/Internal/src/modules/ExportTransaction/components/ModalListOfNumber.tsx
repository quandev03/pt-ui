import { Flex, Form, Row, Tooltip } from 'antd';
import { Text } from '@react/commons/Template/style';
import CTableSearch from '@react/commons/Table';
import { useCallback, useEffect, useState } from 'react';
import useModal from '../store/useModal';
import { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus } from '@fortawesome/free-solid-svg-icons';
import { IParamsRequest } from '@react/commons/types';
import CButton from '@react/commons/Button';
import { ELEMENT_MODE } from '../constant';
import { IItemProduct } from '../type';
import { useGetNumber } from '../hooks/useGetNumber';
import { debounce } from 'lodash';
import CInput from '@react/commons/Input';
import useGetDataProduct from '../store/useGetDataProduct';
import { useGetToSerial } from '../hooks/useGetToSerial';

type Props = {
  selectMode: string;
  fileError: string | null;
  validator: (data: IItemProduct[]) => void;
  setFileError: (data: string | null) => void;
  setRefesh: (data: boolean) => void;
  refesh: boolean;
};
const ListOfNumber = (props: Props) => {
  const { selectMode, fileError, validator, setFileError, setRefesh, refesh } =
    props;
  const [form] = Form.useForm();

  const [params, setParams] = useState<IParamsRequest>({
    page: 0,
    size: 10,
  });

  const { data: dataNumber } = useGetNumber();
  const { setIsOpen } = useModal();

  const { listProducts, setListProducts } = useGetDataProduct();
  const { mutate: getLastSerial } = useGetToSerial();

  const handleShowModal = useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  const handleRemoveItem = (index: number) => {
    const newData = listProducts.filter((item: any) => item.id !== index);
    setListProducts(newData);
  };
  const handleChangeTable = useCallback(
    (pagination: TablePaginationConfig) => {
      setParams({
        ...params,
        page: (pagination.current as number) - 1,
        size: pagination.pageSize as number,
      });
    },
    [params]
  );

  const debouncedChangeHandler = useCallback(
    debounce(
      (
        id: number,
        field: 'fromSerial' | 'toSerial' | 'productUom',
        value: string,
        setListProducts
      ) => {
        const newList = listProducts.map((item: IItemProduct) => {
          if (item.id === id) {
            const updatedItem = {
              ...item,
              [field]: value,
            };

            const fromSerial = field === 'fromSerial' ? value : item.fromSerial;
            const productUom = field === 'productUom' ? value : item.productUom;

            if (updatedItem.fromSerial && updatedItem.productUom) {
              const serialFirst = Number(fromSerial);
              const quantity = Number(productUom);
              getLastSerial(
                {
                  serialFirst,
                  quantity,
                },
                {
                  onSuccess: (data: any) => {
                    const updatedList = newList.map((product: any) => {
                      if (product.id === id) {
                        return {
                          ...product,
                          toSerial: data.toString(),
                        };
                      }
                      return product;
                    });
                    setListProducts(updatedList);
                  },
                }
              );
            }
            return updatedItem;
          }
          return item;
        });
        setListProducts(newList);
      },
      1000
    ),
    [listProducts, setListProducts]
  );

  const handleChangeValue = useCallback(
    (id: number, field: 'fromSerial' | 'toSerial' | 'productUom') =>
      (e: any) => {
        const value = e.target.value;
        debouncedChangeHandler(id, field, value, setListProducts);
      },
    [debouncedChangeHandler, listProducts, setListProducts]
  );

  const isValidNumber = (number: string) => {
    const exists = dataNumber.some((item: any) => {
      item.id === number;
    });
    if (exists) return true;
    return false;
  };

  const columns: ColumnsType<any> = [
    {
      title: 'STT',
      dataIndex: 'id',
      width: 60,
      align: 'left',
      render(value, record, index) {
        return (
          <Tooltip title={index + 1} placement="topLeft">
            {index + 1}
          </Tooltip>
        );
      },
    },
    {
      title: 'Mã sản phẩm',
      dataIndex: 'productCode',
      width: 150,
      align: 'left',
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            {value}
          </Tooltip>
        );
      },
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'productName',
      width: 200,
      align: 'left',
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            {value}
          </Tooltip>
        );
      },
    },
    {
      title: 'Số lượng',
      dataIndex: 'productUom',
      width: 150,
      align: 'left',
      render: (value, record) => {
        return (
          <Form.Item
            name={`productUom-${record.id}`}
            key={`productUom-${record.id}-${value}`}
            rules={[
              {
                validator: (_, value) => {
                  if (!value) {
                    return Promise.reject(
                      new Error('Số lượng không được để trống')
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <CInput
              onlyNumber
              maxLength={11}
              max="11"
              defaultValue={value}
              value={value}
              onChange={handleChangeValue(record?.id, 'productUom')}
            />
          </Form.Item>
        );
      },
    },
    {
      title: 'Serial đầu',
      dataIndex: 'fromSerial',
      width: 250,
      align: 'left',
      render: (value, record, index) => {
        return (
          <Form.Item
            name={`fromSerial-${record.id}`}
            rules={[
              {
                validator: (_, value) => {
                  if (!value) {
                    return Promise.reject(
                      new Error('Serial đầu không được để trống')
                    );
                  }
                  if (isValidNumber(value)) {
                    return Promise.reject(new Error('Serial đầu đã tồn tại'));
                  }
                  if (!/^84/.test(value) || value.length !== 16) {
                    return Promise.reject(
                      new Error('Serial không đúng định dạng')
                    );
                  }
                  setFileError('');
                  return Promise.resolve();
                },
              },
            ]}
          >
            <CInput
              onChange={handleChangeValue(record?.id, 'fromSerial')}
              maxLength={16}
              onlyNumber
              max="16"
              disabled={selectMode === ELEMENT_MODE.FILE}
              defaultValue={value}
              value={value}
            />
          </Form.Item>
        );
      },
    },
    {
      title: 'Serial cuối',
      dataIndex: 'toSerial',
      width: 250,
      align: 'left',
      render: (value, record, index) => {
        console.log('a duc', value);
        return (
          <Form.Item
            name={`toSerial-${record.id}`}
            key={`toSerial-${record.id}-${value}`}
            rules={[
              {
                validator: (_, value) => {
                  if (!value) {
                    return Promise.reject(
                      new Error('Serial cuối không được để trống')
                    );
                  }
                  if (isValidNumber(value)) {
                    return Promise.reject(new Error('Serial cuối đã tồn tại'));
                  }
                  if (!/^84/.test(value) || value.length !== 16) {
                    return Promise.reject(
                      new Error('Serial không đúng định dạng')
                    );
                  }
                  setFileError('');
                  return Promise.resolve();
                },
              },
            ]}
          >
            <CInput
              onChange={handleChangeValue(record?.id, 'toSerial')}
              maxLength={16}
              max="16"
              onlyNumber
              disabled
              defaultValue={value}
              value={value}
            />
          </Form.Item>
        );
      },
    },
    {
      title: '',
      dataIndex: '',
      key: 'x',
      render: (_, record) =>
        listProducts.length >= 1 && selectMode === ELEMENT_MODE.SINGLE ? (
          <FontAwesomeIcon
            icon={faMinus}
            onClick={() => handleRemoveItem(record.id)}
            className="mr-2 cursor-pointer"
            size="lg"
            title="Xóa"
          />
        ) : null,
    },
  ];

  const validatorValue = listProducts.filter((item) => {
    const isValidItem = item.fromSerial && item.toSerial && item.productUom;
    if (Array.isArray(item.children) && item.children.length > 0) {
      const isValidChildren = item.children.every(
        (child) => child.fromSerial && child.toSerial && child.productUom
      );
      return isValidItem && isValidChildren;
    }
    return isValidItem;
  });

  const handleReset = () => {
    form.resetFields();
  };

  useEffect(() => {
    if (refesh && selectMode === ELEMENT_MODE.SINGLE) {
      handleReset();
      setRefesh(false);
    }
  }, [refesh, selectMode]);

  return (
    <Form form={form}>
      <Row className="flex justify-between items-center my-5">
        <Text className="!font-bold !text-xl">Danh sách số</Text>
        {selectMode === ELEMENT_MODE.SINGLE && (
          <CButton type="primary" onClick={() => handleShowModal()}>
            Chọn sản phẩm
          </CButton>
        )}
      </Row>
      <Form.Item
        name="tableValue"
        help={
          fileError ||
          validator(listProducts) ||
          validatorValue.length === 0 ? (
            <p style={{ color: 'red' }}>{fileError}</p>
          ) : (
            false
          )
        }
      >
        <Flex justify="end" align="end" gap={12}>
          <CTableSearch
            dataSource={listProducts || []}
            columns={columns}
            rowKey="id"
            className="dynamic-table"
            pagination={{
              current: params.page + 1,
              pageSize: params.size,
              total: listProducts.length ?? 0,
            }}
            onChange={handleChangeTable}
          />
        </Flex>
      </Form.Item>
    </Form>
  );
};
export default ListOfNumber;
