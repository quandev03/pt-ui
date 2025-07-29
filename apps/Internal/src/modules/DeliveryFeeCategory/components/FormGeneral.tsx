import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import {
  CButtonClose,
  CButtonDelete,
  CButtonEdit,
  CButtonSave,
  CButtonSaveAndAdd,
} from '@react/commons/Button';
import { CInputNumber, CModalConfirm, WrapperPage } from '@react/commons/index';
import CInput from '@react/commons/Input';
import CSelect from '@react/commons/Select';
import { Text, TitleHeader } from '@react/commons/Template/style';
import { AnyElement } from '@react/commons/types';
import { ActionsTypeEnum, ActionType } from '@react/constants/app';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import { MESSAGE } from '@react/utils/message';
import validateForm from '@react/utils/validator';
import { Card, Col, Form, Row, Space } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import { ParamsOption } from 'apps/Internal/src/components/layouts/types';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import { includes } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useArea } from '../../Order/queryHooks';
import {
  useAddDeliveryFeeCategory,
  useDeleteDeliveryFeeCategory,
  useGetDetailDeliveryFeeCategory,
  useUpdateDeliveryFeeCategory,
} from '../hooks';
import { RowStyle, StyleTableForm } from '../page/style';
import { IDeliveryFees, PayloadAddDeliveryFee } from '../types';
import CustomPaymentMethodSelect from './CustomPaymentMethodSelect';
import { useGetSaleChannels } from '../hooks/useGetSaleChannels';

type Props = {
  type: ActionType;
};

const FormGeneral = ({ type }: Props) => {
  const actionByRole = useRolesByRouter();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { data: dataSaleChannels, isPending: loadingSaleChannels } =
    useGetSaleChannels();
  const listSaleChannels = useMemo(() => {
    if (!dataSaleChannels) return [];
    return dataSaleChannels;
  }, [dataSaleChannels]);
  const {
    DELIVERY_FEE_PAYMENT_METHOD = [],
    DELIVERY_FEE_DELIVERY_METHOD = [],
  } = useGetDataFromQueryKey<ParamsOption>([REACT_QUERY_KEYS.GET_PARAMS]);
  const deliveryFees = useWatch('deliveryFees', form) ?? [];
  const codValue = DELIVERY_FEE_PAYMENT_METHOD.find(
    (item) => item?.value === 'COD'
  );
  const someDeliveryFeesCod = deliveryFees.some(
    (item: IDeliveryFees) => item?.paymentMethod === codValue?.value
  );

  const { data: provinces } = useArea('provinces', '');
  const optionsProvinces = useMemo(() => {
    if (!provinces) {
      return [];
    }
    return provinces.map((province) => ({
      label: province.areaName,
      value: province.areaCode,
      id: province.id,
    }));
  }, [provinces]);

  const getFilteredPaymentMethods = (currentIndex: number) => {
    const allValues = form.getFieldsValue();
    const currentDeliveryMethod =
      allValues.deliveryFees?.[currentIndex]?.deliveryMethod;

    if (!currentDeliveryMethod) return DELIVERY_FEE_PAYMENT_METHOD;

    const usedPaymentMethods = allValues.deliveryFees
      ?.filter((_: any, idx: number) => idx !== currentIndex)
      ?.filter(
        (item: IDeliveryFees) => item?.deliveryMethod === currentDeliveryMethod
      )
      ?.map((item: IDeliveryFees) => item.paymentMethod);

    return DELIVERY_FEE_PAYMENT_METHOD.filter(
      (option) => !usedPaymentMethods?.includes(option.value)
    );
  };

  const refreshPaymentMethods = () => {
    const allValues = form.getFieldsValue();

    const updatedValues = allValues.deliveryFees.map(
      (item: IDeliveryFees, index: number) => {
        const validPaymentMethods = getFilteredPaymentMethods(index);

        // Nếu paymentMethod hiện tại không nằm trong danh sách hợp lệ, đặt lại giá trị
        if (
          !validPaymentMethods.find((opt) => opt.value === item.paymentMethod)
        ) {
          return { ...item, paymentMethod: undefined };
        }
        return item;
      }
    );

    form.setFieldsValue({
      ...allValues,
      deliveryFees: updatedValues,
    });
  };

  const handleClose = useCallback(() => {
    form.resetFields();
    navigate(-1);
  }, [form, navigate]);

  const handleCloseAddSave = useCallback(() => {
    form.resetFields();
  }, [form]);

  const handleCloseModal = useCallback(() => {
    handleClose();
  }, [handleClose]);

  const { mutate: onCreate, isPending: loadingAdd } = useAddDeliveryFeeCategory(
    () => {
      if (submitType === 'saveAndAdd') {
        handleCloseAddSave();
      } else {
        handleClose();
      }
    },
    form
  );
  const { mutate: onUpdate, isPending: isLoadingUpdate } =
    useUpdateDeliveryFeeCategory(handleClose);
  const { mutate: onDelete } = useDeleteDeliveryFeeCategory(handleClose);

  const { id } = useParams();
  const {
    isFetching: isLoadingDetail,
    data: detailDeliveryFee,
    isSuccess: isGetDetailSuccess,
  } = useGetDetailDeliveryFeeCategory(id ?? '');

  const [submitType, setSubmitType] = useState<string>('');

  useEffect(() => {
    if (isGetDetailSuccess && detailDeliveryFee) {
      form.setFieldsValue({
        ...detailDeliveryFee,
        deliveryCodFees:
          (detailDeliveryFee?.deliveryFees ?? []).some(
            (item) => item.paymentMethod === 'COD'
          ) &&
            detailDeliveryFee?.deliveryCodFees &&
            detailDeliveryFee?.deliveryCodFees?.length > 0
            ? detailDeliveryFee?.deliveryCodFees
            : [{}],
        saleChannels: detailDeliveryFee.saleChannels ? detailDeliveryFee.saleChannels.split(',') : [],
      });
    }
  }, [isGetDetailSuccess, detailDeliveryFee]);

  const handleFinishForm = (val: PayloadAddDeliveryFee) => {
    const data: PayloadAddDeliveryFee = {
      ...val,
      saleChannels: (val.saleChannels as string[]).join(','),
    };
    if (type === ActionType.ADD) {
      onCreate(data as AnyElement);
    }
    if (type === ActionType.EDIT) {
      CModalConfirm({
        message: MESSAGE.G04,
        onOk: () => {
          onUpdate({
            id: detailDeliveryFee?.id ? String(detailDeliveryFee?.id) : '',
            data: data,
          });
        },
      });
    }
  };

  const handleDelete = () => {
    CModalConfirm({
      message: 'Bạn có chắc chắn muốn xóa cấu hình phí vận chuyển này không?',
      onOk: () => id && onDelete(id),
    });
  };

  const handleKeyPressOnlyNumber = (e: any) => {
    if (!/[0-9]/.test(e.key)) {
      e.preventDefault();
    }
  };

  const columnsDeliveryFees = [
    {
      title: 'STT',
      align: 'left',
      fixed: 'left',
      width: 50,
      render(_: any, __: any, index: number) {
        return <Text className="mt-1.5">{index + 1}</Text>;
      },
    },
    {
      title: 'Hình thức vận chuyển',
      dataIndex: 'deliveryMethod',
      key: 'deliveryMethod',
      width: 270,
      render: (text: any, record: any, index: number) => (
        <Form.Item
          name={[index, 'deliveryMethod']}
          validateTrigger={'onBlur'}
          rules={[validateForm.required]}
        >
          <CSelect
            showSearch={false}
            placeholder="Chọn hình thức vận chuyển"
            options={DELIVERY_FEE_DELIVERY_METHOD}
            onChange={() => {
              refreshPaymentMethods();
            }}
          />
        </Form.Item>
      ),
    },
    {
      title: 'Phương thức thanh toán',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      width: 270,
      render: (text: any, record: any, index: number) => (
        <CustomPaymentMethodSelect
          index={index}
          defaultOption={DELIVERY_FEE_PAYMENT_METHOD}
        />
      ),
    },
    {
      title: 'Phí vận chuyển',
      dataIndex: 'fee',
      key: 'fee',
      width: 270,
      render: (text: any, record: any, index: number) => (
        <Form.Item
          name={[index, 'fee']}
          rules={[validateForm.required]}
          validateTrigger={['onBlur']}
        >
          <CInputNumber
            controls={false}
            maxLength={13}
            max={9999999999}
            placeholder="Nhập phí vận chuyển"
            className="w-100"
            onKeyPress={handleKeyPressOnlyNumber}
            formatter={(value) =>
              value
                ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
                : ''
            }
            parser={(value) => (value ? value.replace(/\./g, '') : '')}
          />
        </Form.Item>
      ),
    },
    {
      key: 'action',
      width: 100,
      render: (
        text: any,
        record: any,
        index: number,
        remove: any,
        add: any
      ) => (
        <>
          {index > 0 && (
            <MinusOutlined
              onClick={() => {
                remove(index);
              }}
              className="cursor-pointer mt-3"
              style={
                type === ActionType.VIEW
                  ? {
                    pointerEvents: 'none',
                    opacity: '0.5',
                    marginRight: '16px',
                  }
                  : { marginRight: '16px' }
              }
            />
          )}
          <PlusOutlined
            onClick={() => add()}
            className="cursor-pointer mt-3"
            style={
              type === ActionType.VIEW
                ? { pointerEvents: 'none', opacity: '0.5' }
                : {}
            }
          />
        </>
      ),
    },
  ];

  const columnsDeliveryCodFees = [
    {
      title: 'STT',
      align: 'left',
      fixed: 'left',
      width: 50,
      render(_: any, __: any, index: number) {
        return <Text className="mt-1.5">{index + 1}</Text>;
      },
    },
    {
      title: 'Giá trị đơn hàng từ',
      dataIndex: 'fromAmount',
      key: 'fromAmount',
      width: 270,
      render: (text: any, record: any, index: number) => (
        <Form.Item
          name={[index, 'fromAmount']}
          validateTrigger={['onBlur']}
          rules={
            someDeliveryFeesCod
              ? [
                validateForm.required,
                {
                  validator: (_, value) => {
                    const deliveryCodFees = form.getFieldValue(
                      'deliveryCodFees'
                    ) as any[];
                    const toAmount =
                      deliveryCodFees &&
                      deliveryCodFees[index] &&
                      deliveryCodFees[index].toAmount;

                    if (toAmount && value && value > toAmount) {
                      return Promise.reject(
                        'Giá trị đơn hàng từ không được lớn hơn giá trị đơn hàng đến'
                      );
                    }
                    toAmount &&
                      form.setFields([
                        {
                          name: ['deliveryCodFees', index, 'toAmount'],
                          errors: undefined,
                        },
                      ]);

                    const numberValue = Number(value);
                    const deliveryCodFeesHasValueFormTo: [number, number][] =
                      deliveryCodFees
                        .filter(
                          (item, idx) =>
                            idx !== index &&
                            item &&
                            item.fromAmount &&
                            item.toAmount
                        )
                        .map((item) => [item.fromAmount, item.toAmount]);
                    const isFail = deliveryCodFeesHasValueFormTo.some(
                      (item) =>
                        item[0] <= numberValue && numberValue <= item[1]
                    );
                    if (isFail) {
                      return Promise.reject(
                        'Giá trị đến không được chồng chéo lên nhau'
                      );
                    }

                    return Promise.resolve();
                  },
                },
              ]
              : undefined
          }
        >
          <CInputNumber
            controls={false}
            maxLength={13}
            max={9999999999}
            placeholder="Nhập giá trị đơn hàng từ"
            className="w-100"
            onKeyPress={handleKeyPressOnlyNumber}
            formatter={(value) =>
              value
                ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
                : ''
            }
            parser={(value) => (value ? value.replace(/\./g, '') : '')}
          />
        </Form.Item>
      ),
    },
    {
      title: 'Giá trị đơn hàng đến',
      dataIndex: 'toAmount',
      key: 'toAmount',
      width: 270,
      render: (text: any, record: any, index: number) => (
        <Form.Item
          name={[index, 'toAmount']}
          rules={
            someDeliveryFeesCod
              ? [
                validateForm.required,
                {
                  validator: (_, value) => {
                    const deliveryCodFees = form.getFieldValue(
                      'deliveryCodFees'
                    ) as any[];
                    const fromAmount =
                      deliveryCodFees &&
                      deliveryCodFees[index] &&
                      deliveryCodFees[index].fromAmount;
                    if (fromAmount && value && value < fromAmount) {
                      return Promise.reject(
                        'Giá trị đơn hàng đến không được nhỏ hơn giá trị đơn hàng từ'
                      );
                    }

                    const numberValue = Number(fromAmount);
                    const deliveryCodFeesHasValueFormTo: [number, number][] =
                      deliveryCodFees
                        .filter(
                          (item, idx) =>
                            idx !== index &&
                            item &&
                            item.fromAmount &&
                            item.toAmount
                        )
                        .map((item) => [item.fromAmount, item.toAmount]);
                    const isFail = deliveryCodFeesHasValueFormTo.some(
                      (item) =>
                        item[0] <= numberValue && numberValue <= item[1]
                    );
                    if (!isFail && fromAmount) {
                      form.setFields([
                        {
                          name: ['deliveryCodFees', index, 'fromAmount'],
                          errors: undefined,
                        },
                      ]);
                    }

                    return Promise.resolve();
                  },
                },
              ]
              : undefined
          }
          validateTrigger={['onBlur']}
        >
          <CInputNumber
            controls={false}
            maxLength={13}
            max={9999999999}
            placeholder="Nhập giá trị đơn hàng đến"
            className="w-100"
            onKeyPress={handleKeyPressOnlyNumber}
            formatter={(value) =>
              value
                ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
                : ''
            }
            parser={(value) => (value ? value.replace(/\./g, '') : '')}
          />
        </Form.Item>
      ),
    },
    {
      title: 'Phí thu hộ',
      dataIndex: 'fee',
      key: 'fee',
      width: 270,
      render: (text: any, record: any, index: number) => (
        <Form.Item
          name={[index, 'fee']}
          rules={someDeliveryFeesCod ? [validateForm.required] : undefined}
          validateTrigger={['onBlur']}
        >
          <CInputNumber
            controls={false}
            maxLength={13}
            max={9999999999}
            placeholder="Nhập phí thu hộ"
            className="w-100"
            onKeyPress={handleKeyPressOnlyNumber}
            formatter={(value) =>
              value
                ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
                : ''
            }
            parser={(value) => (value ? value.replace(/\./g, '') : '')}
          />
        </Form.Item>
      ),
    },
    {
      key: 'action',
      width: 100,
      render: (
        text: any,
        record: any,
        index: number,
        remove: any,
        add: any
      ) => (
        <>
          {index > 0 && (
            <MinusOutlined
              onClick={() => {
                remove(index);
              }}
              className="cursor-pointer mt-3"
              style={
                type === ActionType.VIEW
                  ? {
                    pointerEvents: 'none',
                    opacity: '0.5',
                    marginRight: '16px',
                  }
                  : { marginRight: '16px' }
              }
            />
          )}
          <PlusOutlined
            onClick={() => add()}
            className="cursor-pointer mt-3"
            style={
              type === ActionType.VIEW
                ? { pointerEvents: 'none', opacity: '0.5' }
                : {}
            }
          />
        </>
      ),
    },
  ];

  const renderTitle = () => {
    switch (type) {
      case ActionType.ADD:
        return 'Tạo mới cấu hình phí vận chuyển';
      case ActionType.EDIT:
        return 'Chỉnh sửa cấu hình phí vận chuyển';
      case ActionType.VIEW:
        return 'Xem chi tiết cấu hình phí vận chuyển';
      default:
        return '';
    }
  };

  return (
    <WrapperPage>
      <TitleHeader>{renderTitle()}</TitleHeader>
      <Form
        form={form}
        labelCol={{ style: { width: '160px' } }}
        onFinish={handleFinishForm}
        disabled={type === ActionType.VIEW}
        initialValues={{
          deliveryFees: [{}],
          deliveryCodFees: [{}],
        }}
        onValuesChange={(changedValues, values) => {
          if (
            changedValues?.deliveryFees &&
            changedValues?.deliveryFees.some(
              (item: IDeliveryFees) => item?.paymentMethod === 'COD'
            ) &&
            !values.deliveryCodFees
          ) {
            form.setFieldsValue({
              deliveryCodFees: [{}],
            });
          }
        }}
      >
        <Card className="mb-5" loading={isLoadingDetail}>
          <RowStyle gutter={[24, 0]}>
            <Col span={12}>
              <Form.Item
                name="locationName"
                label="Tên khu vực"
                rules={[validateForm.required]}
              >
                <CInput maxLength={100} placeholder="Nhập tên khu vực" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                rules={[validateForm.required]}
                label="Kênh bán"
                name="saleChannels"
              >
                <CSelect
                  mode="multiple"
                  loading={loadingSaleChannels}
                  options={listSaleChannels}
                  allowClear={false}
                  placeholder="Chọn kênh bán"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Điểm đi"
                name="fromProvince"
                rules={[validateForm.required]}
              >
                <CSelect
                  placeholder="Chọn điểm đi"
                  options={optionsProvinces}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Điểm đến"
                name="toProvinces"
                rules={[validateForm.required]}
              >
                <CSelect
                  placeholder="Chọn điểm đến"
                  options={optionsProvinces}
                  mode="multiple"
                  allowClear
                  maxRow={3}
                />
              </Form.Item>
            </Col>
          </RowStyle>
          <RowStyle gutter={[24, 0]}>
            <Col span={24}>
              <h3 className="title-blue">Cấu hình phí vận chuyển</h3>
            </Col>
            <Col span={24}>
              <Form.List name="deliveryFees">
                {(fields, { add, remove }) => (
                  <StyleTableForm
                    dataSource={fields}
                    rowClassName="align-top"
                    columns={
                      columnsDeliveryFees.map((col) => ({
                        ...col,
                        render:
                          col.render &&
                          ((text: any, record: any, index: number) =>
                            col.render(
                              text,
                              record,
                              fields[index].name,
                              remove,
                              add
                            )),
                      })) as any
                    }
                    pagination={false}
                    rowKey="key"
                  />
                )}
              </Form.List>
            </Col>
          </RowStyle>
          {someDeliveryFeesCod ? (
            <RowStyle gutter={[24, 0]}>
              <Col span={24}>
                <h3 className="title-blue">
                  Cấu hình phí thu hộ đơn hàng COD{' '}
                </h3>
              </Col>
              <Col span={24}>
                <Form.List name="deliveryCodFees">
                  {(fields, { add, remove }) => (
                    <StyleTableForm
                      dataSource={fields}
                      rowClassName="align-top"
                      columns={
                        columnsDeliveryCodFees.map((col) => ({
                          ...col,
                          render:
                            col.render &&
                            ((text: any, record: any, index: number) =>
                              col.render(
                                text,
                                record,
                                fields[index].name,
                                remove,
                                add
                              )),
                        })) as any
                      }
                      pagination={false}
                      rowKey="key"
                    />
                  )}
                </Form.List>
              </Col>
            </RowStyle>
          ) : null}
        </Card>
        <Row justify="end">
          <Space size="middle">
            {type === ActionType.VIEW && (
              <>
                {includes(actionByRole, ActionsTypeEnum.DELETE) && (
                  <CButtonDelete
                    onClick={handleDelete}
                    disabled={false}
                    htmlType="button"
                  />
                )}
                {includes(actionByRole, ActionsTypeEnum.UPDATE) && (
                  <CButtonEdit
                    onClick={() => {
                      detailDeliveryFee?.id &&
                        navigate(
                          pathRoutes.deliveryFeecategoryEdit(
                            detailDeliveryFee?.id
                          )
                        );
                    }}
                    disabled={false}
                    htmlType="button"
                  />
                )}

                <CButtonClose
                  onClick={handleCloseModal}
                  disabled={false}
                  type="default"
                  htmlType="button"
                />
              </>
            )}
            {type === ActionType.ADD && (
              <CButtonSaveAndAdd
                htmlType="submit"
                loading={loadingAdd || isLoadingUpdate}
                onClick={() => setSubmitType('saveAndAdd')}
              />
            )}
            {type !== ActionType.VIEW && (
              <CButtonSave
                htmlType="submit"
                loading={loadingAdd || isLoadingUpdate}
                onClick={() => setSubmitType('save')}
              />
            )}
            {type !== ActionType.VIEW && (
              <CButtonClose
                onClick={handleCloseModal}
                disabled={false}
                type="default"
                htmlType="button"
              />
            )}
          </Space>
        </Row>
      </Form>
    </WrapperPage>
  );
};

export default FormGeneral;
