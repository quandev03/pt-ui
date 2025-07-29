import {
  CButtonClose,
  CButtonSave,
  CButtonSaveAndAdd,
} from '@react/commons/Button';
import CDatePicker from '@react/commons/DatePicker';
import CInput from '@react/commons/Input';
import CSelect from '@react/commons/Select';
import CTable from '@react/commons/Table';
import Show from '@react/commons/Template/Show';
import { RowButton, Text, TitleHeader } from '@react/commons/Template/style';
import CTextArea from '@react/commons/TextArea';
import { FieldErrorsType, ParamsOption } from '@react/commons/types';
import { ActionType, DateFormat } from '@react/constants/app';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import validateForm from '@react/utils/validator';
import { Card, Col, Form, Row } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import { ColumnsType } from 'antd/es/table';
import { Tooltip } from 'antd/lib';
import { NumberProcessType } from 'apps/Internal/src/constants/constants';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import {
  ReasonCodeEnum,
  useListReasonCatalogService,
} from 'apps/Internal/src/hooks/useReasonCatalogService';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAddEximDistributor } from '../queryHook/useAddEximDistributor';
import { useDetailDeliveryNote } from '../queryHook/useDetailDeliveryNote';
import { useDetailEximDistributor } from '../queryHook/useDetailEximDistributor';
import { useDetailStockIsdn } from '../queryHook/useDetailStockIsdn';
import { useListDeliveryNote } from '../queryHook/useListDeliveryNote';
import { useSuggestSerialNumber } from '../queryHook/useSuggestSerialNumber';
import { IColumnListProduct, IListSerialNumber, ProductDTO } from '../type';
import StartSerial from './StartSerial';

type Props = {
  typeModal: ActionType;
};

const ModalAddEditView: React.FC<Props> = ({ typeModal }) => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();

  const [params, setParams] = useState({
    q: '',
    deliveryNoteType: 3,
    deliveryNoteMethod: 1,
    deliveryNoteStatus: 1,
    page: 0,
    size: 10,
  });
  const [optionOrgIsdn, setOptionOrgIsdn] = useState<any[]>([]);
  const [listProduct, setListProduct] = useState<ProductDTO[]>([]);
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [listSerialNumber, setListSerialNumber] = useState<IListSerialNumber[]>(
    []
  );
  const [stockMoveCodeError, setStockMoveCodeError] = useState<boolean>(false);

  const { PRODUCT_PRODUCT_UOM = [] } = useGetDataFromQueryKey<ParamsOption>([
    REACT_QUERY_KEYS.GET_PARAMS,
  ]);
  const { data: detailEximDistributor } = useDetailEximDistributor(id ?? '');
  const disableForm = typeModal === ActionType.VIEW;
  const reasonId = useWatch<NumberProcessType>('reason', form);
  const optionReason = useListReasonCatalogService(
    disableForm,
    reasonId,
    ReasonCodeEnum.NPP_IMPORT_EXPORT
  );

  const { mutate: selectDeliveryNote, data: detailDeliveryNote } =
    useDetailDeliveryNote();
  const { mutate: getDetailStockIsdn, data: detailStockIsdn } =
    useDetailStockIsdn();
  const { isSuccess, data: listDeliveryNote } = useListDeliveryNote(params);
  const { mutate: addEximDistributor } = useAddEximDistributor(form, (data) => {
    if (data.errors[0].field === 'stockMoveCode') {
      setStockMoveCodeError(true);
    }
  });

  const { mutateAsync: suggestSerialNumber } = useSuggestSerialNumber();

  const renderTitle = () => {
    switch (typeModal) {
      case ActionType.ADD:
        return 'Lập GD xuất kho cho Đối tác';
      case ActionType.VIEW:
        return 'Xem chi tiết xuất kho cho Đối tác';
      default:
        return '';
    }
  };

  const optionListDeliveryNote = isSuccess
    ? listDeliveryNote.map((item: any) => ({
        label: item.deliveryNoteCode,
        value: item.id,
      }))
    : [];

  useEffect(() => {
    if (stockMoveCodeError) {
      form.validateFields(['stockMoveCode']);
    }
  }, [stockMoveCodeError]);

  useEffect(() => {
    if (listProduct?.length > 0) {
      const initialValues: { [key: string]: string | number } = {};
      listProduct.forEach((item, index) => {
        if (item.id) {
          initialValues[`fromSerial-${index}`] = item.fromSerial || '';
        }
        initialValues[`quantity-${index}`] = item.quantity || '';
      });
      form.setFieldsValue(initialValues);
    }
  }, [listProduct, form]);
  useEffect(() => {
    if (detailStockIsdn) {
      const options = detailStockIsdn.map((item: any) => ({
        label: item.orgName,
        value: item.id,
      }));
      setOptionOrgIsdn(options);
    }
  }, [detailStockIsdn]);
  useEffect(() => {
    if (optionOrgIsdn) {
      form.setFieldsValue({
        fromOrgName: optionOrgIsdn[0]?.value,
        toOrgName: optionOrgIsdn[1]?.value,
      });
    }
  }, [optionOrgIsdn]);

  useEffect(() => {
    if (listSerialNumber) {
      const flattenedListSerialNumber = listSerialNumber?.flatMap(
        (item: any) => {
          if (!Array.isArray(item?.serialChildrenList)) {
            return [];
          }
          return [...item.serialChildrenList];
        }
      );
      const newList = listProduct.map((item: any) => {
        const matchingSerial = listSerialNumber.find(
          (serialItem: any) => serialItem?.productId === item.id
        );
        if (matchingSerial) {
          return {
            ...item,
            quantity: matchingSerial.quantity,
            fromSerial: matchingSerial.fromSerial,
            toSerial: matchingSerial.toSerial,
          };
        }
        return item;
      });

      const updatedList = newList.flatMap((item) => {
        const matchingSerials = flattenedListSerialNumber.filter(
          (serial) => serial.productId === item.id
        );
        return [item, ...matchingSerials];
      });

      if (JSON.stringify(updatedList) !== JSON.stringify(listProduct)) {
        setListProduct(updatedList);
      }
    }
  }, [listSerialNumber]);
  const fetchSerialNumber = async (product: ProductDTO) => {
    const { productId, quantity, fromSerial, checkSerial } = product;
    if (checkSerial) {
      return await suggestSerialNumber({
        productId,
        orgId: detailDeliveryNote.fromOrgId,
        quantity,
        fromSerial,
        type: 3,
      });
    }
  };
  useEffect(() => {
    const fetchSerialNumbers = async () => {
      if (
        !detailEximDistributor &&
        detailDeliveryNote &&
        listSerialNumber?.length === 0
      ) {
        try {
          const responses = await Promise.all(
            listProduct.map(fetchSerialNumber)
          );
          const listSerialNumber = responses.flatMap(
            (response: any) => response
          );
          setListSerialNumber(listSerialNumber);
        } catch (error) {
          console.log(error);
        }
      }
    };

    fetchSerialNumbers();
  }, [listProduct, detailEximDistributor, detailDeliveryNote]);

  useEffect(() => {
    if (detailDeliveryNote) {
      const initProducts = detailDeliveryNote.deliveryNoteLines.map(
        (item: any) => ({
          ...item,
          ...item.productDTO,
          initialQuantity: item.quantity,
          checkHidden: item.productDTO.checkSerial,
        })
      );
      setListProduct(initProducts);
      form.setFields([
        {
          name: 'deliveryNoteCode',
          value: detailDeliveryNote.deliveryNoteCode,
        },
        {
          name: 'fromOrgName',
          value: detailDeliveryNote.fromOrgName,
        },
        {
          name: 'toOrgName',
          value: detailDeliveryNote.toOrgName,
        },
      ]);
    } else if (detailEximDistributor) {
      const initProducts = detailEximDistributor.stockMoveLineDTOS.map(
        (item: any) => ({
          ...item,
          ...item.productDTO,
        })
      );
      setListProduct(initProducts);
      form.setFields([
        {
          name: 'deliveryNoteCode',
          value: detailEximDistributor.deliveryNoteCode,
        },
        {
          name: 'stockMoveCode',
          value: detailEximDistributor.stockMoveCode,
        },
        {
          name: 'createdDate',
          value: dayjs(detailEximDistributor.createdDate),
        },
        {
          name: 'fromOrgName',
          value: detailEximDistributor.orgName,
        },
        {
          name: 'toOrgName',
          value: detailEximDistributor.ieOrgName,
        },
        {
          name: 'reason',
          value: detailEximDistributor.reasonId,
        },
        {
          name: 'desc',
          value: detailEximDistributor.description,
        },
      ]);
    }
  }, [detailDeliveryNote, detailEximDistributor, form]);

  useEffect(() => {
    if (detailDeliveryNote) {
      const { fromOrgId, toOrgId } = detailDeliveryNote;
      getDetailStockIsdn([fromOrgId, toOrgId]);
    }
  }, [detailDeliveryNote]);

  const handleSubmit = async (value: any) => {
    const listProductWithSerial = listProduct.filter(
      (item) => item.checkSerial
    );
    const listProductWithoutSerial = listProduct.filter(
      (item) => !item.checkSerial
    );

    const updatedListWithoutSerial = listProductWithoutSerial.map((item) => {
      if (item.productId !== undefined && item.productCode === undefined) {
        const matchingItem = listProduct.find((el) => el.id === item.productId);
        if (matchingItem) {
          return {
            ...item,
            productCode: matchingItem.productCode,
          };
        }
      }
      return item;
    });

    const updatedListWithSerial = listProductWithSerial
      .filter((item) => item.productCode === undefined)
      .map((item) => {
        if (item.productId !== undefined) {
          const matchingItem = listProduct.find(
            (el) => el.id === item.productId
          );
          if (matchingItem) {
            return {
              ...item,
              productCode: matchingItem.productCode,
            };
          }
        }
        return item;
      });

    const updatedListProduct = [
      ...updatedListWithoutSerial,
      ...updatedListWithSerial,
    ];

    const data = {
      orgId: detailDeliveryNote.fromOrgId,
      ieOrgId: detailDeliveryNote.toOrgId,
      moveDate: value.createdDate.format('YYYY-MM-DD'),
      moveType: 3,
      status: 1,
      reasonId: value.reason,
      deliveryNoteId: detailDeliveryNote.id,
      deliveryNoteDate: detailDeliveryNote.deliveryNoteDate,
      saleOrderId: detailDeliveryNote.saleOrderId,
      saleOrderDate: detailDeliveryNote.saleOrderDate,
      description: value.desc,
      moveMethod: detailDeliveryNote.deliveryNoteMethod,
      stockMoveCode: form.getFieldValue('stockMoveCode'),
      stockMoveLineDTOS: updatedListProduct.map((product: ProductDTO) => ({
        orgId: detailDeliveryNote.fromOrgId,
        productCode: product.productCode,
        fromSerial: product.fromSerial,
        toSerial: product.toSerial,
        quantity: product.quantity,
        productId: product.productId,
      })),
    };
    addEximDistributor(data, {
      onSuccess: () => {
        setListProduct([]);
      },
      onError: (err: any) => {
        if (err?.errors?.length > 0) {
          form.setFields(
            err.errors.map((item: FieldErrorsType) => {
              const fieldArr = item.field.split('-');
              const productId = fieldArr[0];
              const index = listProduct.findIndex(
                (item: any) =>
                  String(item.productId) === String(productId) && item.id
              );
              return {
                name: `quantity-${index}`,
                errors: [item.detail],
              };
            })
          );
        }
      },
    });
  };

  const handleClose = () => {
    form.resetFields();
    navigate(-1);
  };
  let trueIdIndex = 1;
  const columns: ColumnsType<IColumnListProduct> = [
    {
      title: 'STT',
      align: 'left',
      fixed: 'left',
      width: 50,
      render: (__, record, index) => {
        if (typeModal !== ActionType.VIEW) {
          if (record.id) {
            return <Text>{trueIdIndex++}</Text>;
          }
        } else {
          return <Text>{index + 1}</Text>;
        }
      },
    },
    {
      title: 'Mã sản phẩm',
      dataIndex: 'productCode',
      width: 120,
      align: 'left',
      render: (value, record) => {
        return (
          <Form.Item>
            <Tooltip title={value} placement="topLeft">
              <Text
                style={{ opacity: 1, color: 'inherit' }}
                disabled={typeModal === ActionType.VIEW}
              >
                {value}
              </Text>
            </Tooltip>
          </Form.Item>
        );
      },
    },

    {
      title: 'Tên sản phẩm',
      dataIndex: 'productName',
      width: 120,
      align: 'left',
      render: (value, record) => {
        return (
          <Form.Item>
            <Tooltip title={value} placement="topLeft">
              <Text
                style={{ opacity: 1, color: 'inherit' }}
                disabled={typeModal === ActionType.VIEW}
              >
                {value}
              </Text>
            </Tooltip>
          </Form.Item>
        );
      },
    },

    {
      title: 'Đơn vị tính',
      dataIndex: 'productUom',
      width: 80,
      align: 'left',
      render: (value, record) => {
        if (!value) return null;
        const item: any = PRODUCT_PRODUCT_UOM.find(
          (item: any) => item.value === value
        );

        return (
          <Form.Item>
            <Tooltip title={value} placement="topLeft">
              <Text
                style={{ opacity: 1, color: 'inherit' }}
                disabled={typeModal === ActionType.VIEW}
              >
                {item.label}
              </Text>
            </Tooltip>
          </Form.Item>
        );
      },
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      width: 290,
      align: 'left',
      render: (value, record, index) => {
        return (
          <Form.Item style={{ height: '38px' }} name={`quantity-${index}`}>
            <CInput disabled value={value} />
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
        if (!record.id) {
          return (
            <Tooltip title={value} placement="topLeft">
              <CInput disabled value={value} />
            </Tooltip>
          );
        }
        return (
          <Form.Item
            style={{ height: '36px' }}
            name={`fromSerial-${index}`}
            rules={[
              {
                validator: () => {
                  if (record.checkSerial && !record.fromSerial) {
                    return Promise.reject(
                      new Error('Không được để trống trường này')
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <StartSerial
              value={value}
              typeModal={typeModal}
              record={record}
              listProduct={listProduct}
              setListProduct={setListProduct}
              setListSerialNumber={setListSerialNumber}
              fetchSerialNumber={fetchSerialNumber}
              form={form}
              index={index}
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
        return (
          <Form.Item
            style={{ height: '38px' }}
            name={`toSerial-${index}`}
            rules={[
              {
                validator: () => {
                  if (
                    record.checkSerial &&
                    record.id &&
                    record.fromSerial &&
                    !record.toSerial
                  ) {
                    return Promise.reject(
                      new Error('Số lượng serial trong kho không đủ')
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Tooltip title={value} placement="topLeft">
              <CInput
                className={`${
                  record.id ? 'text-transparent cursor-default' : ''
                }`}
                placeholder={'Nhập serial cuối'}
                disabled
                value={
                  validateForm.serialSim.pattern?.test(record.fromSerial) &&
                  (record.checkSerial || !record.id)
                    ? value
                    : undefined
                }
              />
            </Tooltip>
          </Form.Item>
        );
      },
    },
  ];
  const handleChangeSelect = (value: any) => {
    setListProduct([]);
    setListSerialNumber([]);
    const stockCode = optionListDeliveryNote.find(
      (item: any) => item.value === value
    );
    const stockCodeLabel = stockCode ? stockCode.label.slice(1) : '';

    if (value) {
      selectDeliveryNote(value);
      form.setFieldValue('stockMoveCode', stockCodeLabel);
    } else {
      form.resetFields();
      selectDeliveryNote('');
    }
  };

  const handleSearch = (value: any) => {
    setParams((prev) => ({
      ...prev,
      q: value,
    }));
  };

  return (
    <>
      <TitleHeader>{renderTitle()}</TitleHeader>
      <Form
        form={form}
        onValuesChange={() => {
          setIsFormChanged(true);
        }}
        onFinish={handleSubmit}
        labelCol={{ style: { width: '140px' } }}
        labelAlign="left"
        labelWrap
        colon={false}
      >
        <Card className="mb-6">
          <Row>
            <Col span={10}>
              <Form.Item
                label="Mã phiếu"
                name="deliveryNoteCode"
                rules={[
                  {
                    required: true,
                    message: 'Không được để trống trường này',
                  },
                ]}
              >
                <CSelect
                  placeholder="Nhập mã phiếu xuất"
                  options={optionListDeliveryNote}
                  onChange={handleChangeSelect}
                  onSearch={handleSearch}
                  disabled={typeModal === ActionType.VIEW}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>
        <Card>
          <Row gutter={[30, 0]} className="my-3">
            <Show.When isTrue={typeModal === ActionType.VIEW}>
              <Col span={12}>
                <Form.Item label="Mã GD xuất" name="stockMoveCode">
                  <CInput
                    disabled={true}
                    placeholder="Mã GD xuất"
                    maxLength={50}
                    preventSpace
                    preventVietnamese
                    uppercase
                  ></CInput>
                </Form.Item>
              </Col>
            </Show.When>
            <Col span={12}>
              <Form.Item
                label="Kho xuất"
                name="fromOrgName"
                rules={[
                  {
                    required: true,
                    message: 'Không được để trống trường này',
                  },
                ]}
              >
                <CSelect
                  disabled
                  placeholder="Chọn kho"
                  options={optionOrgIsdn}
                ></CSelect>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Kho nhận"
                name="toOrgName"
                rules={[
                  {
                    required: true,
                    message: 'Không được để trống trường này',
                  },
                ]}
              >
                <CSelect
                  disabled
                  placeholder="Chọn kho"
                  options={optionOrgIsdn}
                ></CSelect>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Ngày lập"
                name="createdDate"
                rules={[
                  {
                    required: true,
                    message: 'Không được để trống trường này',
                  },
                  {
                    validator: (_, value) => {
                      if (
                        value &&
                        dayjs(value).isBefore(
                          detailDeliveryNote.deliveryNoteDate,
                          'day'
                        )
                      ) {
                        return Promise.reject(
                          new Error(
                            'Ngày lập không được nhỏ hơn ngày phiếu xuất'
                          )
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
                initialValue={dayjs()}
              >
                <CDatePicker
                  format={DateFormat.DEFAULT}
                  disabled={typeModal === ActionType.VIEW}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Lý do xuất kho"
                name="reason"
                rules={[
                  {
                    required: true,
                    message: 'Không được để trống trường này',
                  },
                ]}
              >
                <CSelect
                  disabled={typeModal === ActionType.VIEW}
                  placeholder="Chọn lý do xuất kho"
                  options={optionReason}
                ></CSelect>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: 'Không được để trống trường này',
                  },
                ]}
                labelAlign="left"
                label="Ghi chú"
                name="desc"
              >
                <CTextArea
                  maxLength={100}
                  placeholder="Ghi chú"
                  autoSize={{ minRows: 3, maxRows: 5 }}
                  disabled={typeModal === ActionType.VIEW}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row className="mt-6">
            <strong className="text-xl mb-6">Danh sách sản phẩm</strong>
            <CTable columns={columns} dataSource={listProduct} />
          </Row>
        </Card>
        <Row className="justify-end">
          <RowButton className="my-6">
            <Form.Item name="saveForm"></Form.Item>
            {typeModal !== ActionType.VIEW && (
              <>
                <CButtonSaveAndAdd
                  onClick={() => {
                    form.setFieldsValue({
                      saveForm: true,
                    });
                    form.submit();
                  }}
                />
                <CButtonSave htmlType="submit" />
              </>
            )}
            <CButtonClose onClick={handleClose} type="default">
              Đóng
            </CButtonClose>
          </RowButton>
        </Row>
      </Form>
    </>
  );
};

export default ModalAddEditView;
