import { faMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CInput from '@react/commons/Input';
import { Text } from '@react/commons/Template/style';
import { ACTION_MODE_ENUM } from '@react/commons/types';
import { MESSAGE } from '@react/utils/message';
import { Form, Tooltip } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import { ColumnsType } from 'antd/es/table';
import { IOption } from 'apps/Internal/src/components/layouts/types';
import { useCallback, useState } from 'react';
import { IItemProduct, ISerialItem, TypePage } from '../type';
import { useFilterSerial } from './useFilterSerial';
import { serialRegex } from '@react/constants/regex';

const validSerial = (value: string) => {
  return serialRegex.test(value);
};

const useColumnsProducts = (
  type: TypePage,
  PRODUCT_PRODUCT_UOM: IOption[],
  actionMode?: ACTION_MODE_ENUM
): ColumnsType<IItemProduct> => {
  const form = useFormInstance();
  const dataTable: IItemProduct[] = useWatch('products', form) ?? [];
  const orgId = useWatch('orgId', form) ?? '';
  const isViewType = actionMode === ACTION_MODE_ENUM.VIEW;
  const [isSerialChange, setIsSerialChange] = useState(false);

  const mapDataTable = useCallback(
    (dataTable: IItemProduct[], data: ISerialItem[]) => {
      return dataTable.map((item, index, array) => {
        const dataSelected = data.find(
          (serial) => String(item.id) === String(serial.productId)
        );
        return {
          ...item,
          ...dataSelected,
          toSerial:
            dataSelected && (dataSelected.checkSerial || item.checkSerial)
              ? dataSelected.toSerial
              : '',
          children:
            dataSelected && (dataSelected.checkSerial || item.checkSerial)
              ? dataSelected.serialChildrenList?.map((i) => ({
                  ...i,
                  productCode: item.productCode,
                }))
              : [],
        };
      });
    },
    []
  );

  const mapErrors = useCallback(
    (dataTable: IItemProduct[], type: TypePage, data: ISerialItem[]) => {
      return dataTable.map((item, index) => {
        const dataSelected = data.find(
          (serial) => String(item.id) === String(serial.productId)
        );

        // Get existing quantity errors if any
        const currentError = form.getFieldError([
          'products',
          index,
          'quantity',
        ]);
        let errors = currentError?.length ? [...currentError] : [];

        const hasNoSerialChildren =
          dataSelected?.serialChildrenList?.length === 0;
        const isExportType = type === TypePage.EXPORT;

        // Handle serial change errors
        if (isSerialChange) {
          if (hasNoSerialChildren && isExportType) {
            errors = ['Serial không tồn tại trong kho'];
          } else {
            form.setFields([
              {
                name: ['products', index, 'quantity'],
                errors: [],
              },
            ]);
            errors = [];
          }
          return {
            name: ['products', index, 'fromSerial'],
            errors,
          };
        }

        // Handle quantity errors
        if (hasNoSerialChildren && isExportType) {
          errors = ['Số lượng sản phẩm trong kho không đủ'];
        } else {
          form.setFields([
            {
              name: ['products', index, 'fromSerial'],
              errors: [],
            },
          ]);
          errors = [];
        }
        return {
          name: ['products', index, 'quantity'],
          errors,
        };
      });
    },
    [isSerialChange]
  );

  const { mutate: fillSerial } = useFilterSerial((data) => {
    console.log('🚀 ~ const{mutate:fillSerial}=useFilterSerial ~ data:', data);
    const result = mapDataTable(dataTable, data);
    const errors = mapErrors(dataTable, type, data);
    form.setFields([
      {
        name: 'products',
        value: result,
      },
      ...errors,
    ]);
  });

  const incrementSerial = (index: number) => () => {
    const fromSerial: string = form.getFieldValue([
      'products',
      index,
      'fromSerial',
    ]);
    const quantity: string = form.getFieldValue([
      'products',
      index,
      'quantity',
    ]);

    if (validSerial(fromSerial) && quantity) {
      const toSerial = Number(quantity) - 1 + Number(fromSerial);
      form.setFieldValue(['products', index, 'toSerial'], toSerial);
      form.validateFields([['products', index, 'toSerial']]);
    } else {
      form.setFieldValue(['products', index, 'toSerial'], '');
    }
  };

  const resetRowWithMessageError = (index: number, message: string) => {
    const products: IItemProduct[] = form.getFieldValue('products') ?? [];
    const newProduct = products.map((item, idx) => {
      if (idx === index) {
        return {
          ...item,
          children: [],
        };
      }
      return item;
    });
    form.setFieldValue('products', newProduct);
    return Promise.reject(message);
  };

  const handleRemoveItem = (id: number) => () => {
    const newListProducts = dataTable.filter((item) => item.id !== id);
    form.setFieldValue('products', newListProducts);
  };

  const handleChangeQuantity =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setIsSerialChange(false);
      const newProducts = dataTable.map((item, idx) => {
        if (idx === index) {
          return {
            ...item,
            quantity: parseInt(value ?? 0),
          };
        }
        return item;
      });
      form.setFieldValue('products', newProducts);
      const productCalculation = newProducts
        .filter((item) => item.quantity)
        .map((item) => ({ ...item, quantity: Number(item.quantity) }));
      if (productCalculation.length > 0) {
        fillSerial(
          productCalculation.map((item) => {
            return {
              productId: item.id as any,
              fromSerial: item.fromSerial as any,
              quantity: item.quantity as any,
              orgId: orgId,
            };
          })
        );
      }
    };

  const handleFillSerial = () => {
    if (type === TypePage.EXPORT && dataTable.length > 0) {
      const productCalculation = dataTable
        .filter((item) => item.quantity)
        .map((item) => ({ ...item, quantity: Number(item.quantity) }));

      if (productCalculation.length > 0) {
        fillSerial(
          productCalculation.map((item) => {
            return {
              productId: item.id as any,
              fromSerial: item.fromSerial as any,
              quantity: item.quantity as any,
              orgId: orgId,
            };
          })
        );
      }
    }
  };

  const handlePasteSerial =
    (index: number) => (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pastedData = e.clipboardData?.getData('text');
      if (pastedData && validSerial(pastedData)) {
        const productCalculation = dataTable
          .filter((item) => item.quantity)
          .map((item, idx) => ({
            ...item,
            fromSerial: idx === index ? pastedData : item.fromSerial,
          }));
        fillSerial(
          productCalculation.map((item) => {
            return {
              productId: item.id as any,
              fromSerial: item.fromSerial as any,
              quantity: item.quantity as any,
              toSerial: item.toSerial as any,
              orgId: orgId,
            };
          })
        );
      }
    };

  const handleChangeSerialInput =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const newProducts = dataTable.map((item, idx) => {
        if (idx === index) {
          return {
            ...item,
            fromSerial: value,
          };
        }
        return item;
      });
      form.setFieldValue('products', newProducts);
      if (validSerial(value)) {
        setIsSerialChange(true);
        fillSerial(
          newProducts.map((item) => {
            return {
              productId: item.id as any,
              fromSerial: item.fromSerial as any,
              quantity: item.quantity as any,
              orgId: orgId,
            };
          })
        );
      }
    };

  return [
    {
      title: 'STT',
      align: 'left',
      width: 60,
      render(_, record, index) {
        if (!record.children && actionMode !== ACTION_MODE_ENUM.VIEW) {
          return null;
        }
        return <Text className="px-0.5">{index + 1}</Text>;
      },
    },
    {
      title: 'Mã sản phẩm',
      dataIndex: 'productCode',
      align: 'left',
      width: 200,
      render(value, record) {
        if (!record.children && actionMode !== ACTION_MODE_ENUM.VIEW) {
          return null;
        }
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },

    {
      title: 'Tên sản phẩm',
      dataIndex: 'productName',
      align: 'left',
      width: 200,
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text> {value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Đơn vị tính',
      dataIndex: 'productUom',
      align: 'left',
      width: 100,
      render: (value) => {
        const label = PRODUCT_PRODUCT_UOM?.find(
          (e: any) => e.value === String(value)
        )?.label;
        return (
          <Tooltip title={label} placement="topLeft">
            <Text> {label}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      align: 'left',
      width: 200,
      render: (value, record, index) => {
        if (!record.children) {
          return (
            <Tooltip title={value} placement="topLeft">
              <CInput disabled value={value} placeholder="Nhập số lượng" />
            </Tooltip>
          );
        }
        return (
          <Form.Item
            name={[index, 'quantity']}
            required={record.checkQuantity}
            rules={[
              {
                validator(rule, value, callback) {
                  if (record.checkQuantity && !value) {
                    return Promise.reject(MESSAGE.G06);
                  }
                  return Promise.resolve();
                },
              },
            ]}
            validateTrigger={['onSubmit']}
          >
            <CInput
              placeholder="Số lượng"
              disabled={isViewType || !record.checkQuantity}
              onlyNumber
              onChange={
                type === TypePage.EXPORT
                  ? handleChangeQuantity(index)
                  : undefined
              }
              allowClear={false}
              maxLength={11}
              onBlur={
                type === TypePage.EXPORT
                  ? handleFillSerial
                  : incrementSerial(index)
              }
            />
          </Form.Item>
        );
      },
    },
    {
      title: 'Serial đầu',
      dataIndex: 'fromSerial',
      align: 'left',
      width: 200,
      render: (value, record, index) => {
        if (!record.children) {
          return (
            <Tooltip title={value} placement="topLeft">
              <CInput disabled value={value} placeholder="Nhập serial đầu" />
            </Tooltip>
          );
        }
        return (
          <Form.Item
            name={[index, 'fromSerial']}
            validateTrigger={['onSubmit']}
            rules={[
              {
                validator(_, value) {
                  if (type === TypePage.EXPORT) {
                    if (!value) {
                      return Promise.resolve();
                    }
                    if (!validSerial(value)) {
                      return resetRowWithMessageError(
                        index,
                        'Serial không đúng định dạng'
                      );
                    }
                    return Promise.resolve();
                  }
                  if (!value && record.checkSerial) {
                    return resetRowWithMessageError(index, MESSAGE.G06);
                  }
                  if (!validSerial(value) && record.checkSerial) {
                    return resetRowWithMessageError(
                      index,
                      'Serial không đúng định dạng'
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <CInput
              placeholder="Nhập serial đầu"
              disabled={isViewType || !record.checkSerial}
              onlyNumber
              maxLength={16}
              onChange={
                type === TypePage.EXPORT
                  ? handleChangeSerialInput(index)
                  : undefined
              }
              allowClear={false}
              onBlur={
                type === TypePage.EXPORT ? undefined : incrementSerial(index)
              }
              onPaste={
                type === TypePage.IMPORT ? undefined : handlePasteSerial(index)
              }
            />
          </Form.Item>
        );
      },
    },
    {
      title: 'Serial cuối',
      dataIndex: 'toSerial',
      align: 'left',
      width: 200,
      render(value, record, index) {
        if (type === TypePage.EXPORT || !record.checkSerial) {
          return (
            <CInput disabled value={value} placeholder="Nhập serial cuối" />
          );
        }
        return (
          <Form.Item
            name={[index, 'toSerial']}
            validateTrigger={['onSubmit']}
            rules={[
              {
                validator(_, __) {
                  if (!validSerial(value) && type === TypePage.IMPORT) {
                    return resetRowWithMessageError(
                      index,
                      'Serial không đúng định dạng'
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <CInput
              placeholder="Nhập serial cuối"
              disabled={true}
              onlyNumber
              maxLength={16}
              allowClear={false}
            />
          </Form.Item>
        );
      },
    },
    {
      title: '',
      dataIndex: '',
      align: 'center',
      width: 100,
      render: (_, record) => {
        if (!record.children) {
          return null;
        }
        return (
          <FontAwesomeIcon
            icon={faMinus}
            onClick={handleRemoveItem(Number(record.id))}
            className="mr-2 cursor-pointer"
            size="lg"
            title="Xóa"
          />
        );
      },
    },
  ];
};

export default useColumnsProducts;
