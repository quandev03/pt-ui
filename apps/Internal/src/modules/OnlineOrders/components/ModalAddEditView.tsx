import CButton, {
  CButtonClose,
  CButtonEdit,
  CButtonSave,
} from '@react/commons/Button';
import {
  CDatePicker,
  CModalConfirm,
  CSelect,
  WrapperPage,
} from '@react/commons/index';
import CInput from '@react/commons/Input';
import Show from '@react/commons/Template/Show';
import { TitleHeader } from '@react/commons/Template/style';
import { IFieldErrorsItem, ParamsOption } from '@react/commons/types';
import { ActionsTypeEnum, ActionType } from '@react/constants/app';
import { formatDateTime } from '@react/constants/moment';
import { emailRegex, phoneRegex } from '@react/constants/regex';
import { cleanUpPhoneNumber, formatCurrencyVND } from '@react/helpers/utils';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import { MESSAGE } from '@react/utils/message';
import validateForm from '@react/utils/validator';
import { Card, Col, Form, Row, Space, Tooltip } from 'antd';
import Column from 'antd/es/table/Column';
import ModalConfirm from 'apps/Internal/src/components/modalConfirm';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useArea } from 'apps/Internal/src/hooks/useArea';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import dayjs from 'dayjs';
import { includes } from 'lodash';
import {
  FC,
  FocusEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { RowStyle, StyleTableForm } from '../page/style';
import { useSupportGetCoverageArea } from '../queryHook/useGetCoverageArea';
import {
  useCreateOnlineOrder,
  useGetDetailOnlineOrder,
  useUpdateOnlineOrder,
} from '../queryHook/useList';
import useStore from '../store';
import {
  IOnlineOrderProductsSim,
  IOrderOnlinetatus,
  IPayloadUpdateOrder,
  onlineOrderProductsDefault,
  SIM_TYPE,
  TypeChannel,
  TypeSim,
} from '../types';

type Props = {
  typeModal: ActionType;
};

const ModalAddEditView: FC<Props> = ({ typeModal }) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { id: idDetail } = useParams();
  const {
    resetOnlineOrder,
    isValuesChanged,
    setIsValuesChanged,
    provinceSelected,
    setProvinceSelected,
    districtSelected,
    setDistrictSelected,
  } = useStore();
  const listRoles = useRolesByRouter();
  const provinceCode = Form.useWatch('provinceCode', form);
  const districtCode = Form.useWatch('districtCode', form);
  const { mutate: onCreateOrder } = useCreateOnlineOrder(() => {
    refetch();
  });
  const [dataCondition, setDataCondition] = useState([
    { key: 0, ...onlineOrderProductsDefault },
  ]);

  const setFieldError = useCallback(
    (fieldErrors: IFieldErrorsItem[]) => {
      form.setFields(
        fieldErrors.map((item: IFieldErrorsItem) => ({
          name: item.field,
          errors: [item.detail],
        }))
      );
    },
    [form]
  );
  const [coverageAreas, setCoverageAreas] = useState<string[]>([]);
  const { mutate: mutateCoverageArea } = useSupportGetCoverageArea((data) => {
    setCoverageAreas((prev) => [...prev, data.rangeName]);
  });
  const { mutate: updateOnlineOrder, isPending: loadingUpdate } =
    useUpdateOnlineOrder(() => handleClose(), setFieldError);
  const {
    isFetching: isFetchingView,
    data: onlineOrderDetail,
    refetch,
  } = useGetDetailOnlineOrder(idDetail ?? '');

  const {
    SALE_ORDER_DELIVERY_METHOD = [],
    SALE_ORDER_DELIVERY_PARTNER_CODE = [],
  } = useGetDataFromQueryKey<ParamsOption>([REACT_QUERY_KEYS.GET_PARAMS]);

  const optionsDeliveryMethod = useMemo(() => {
    if (typeModal === ActionType.EDIT) {
      return SALE_ORDER_DELIVERY_METHOD.filter(
        (item) => item.value !== 'STORE'
      );
    }
    return SALE_ORDER_DELIVERY_METHOD;
  }, [SALE_ORDER_DELIVERY_METHOD, typeModal]);

  const { isFetching: loadingProvinces, data: provinces } = useArea(
    'provinces',
    ''
  );
  const { isFetching: loadingDistrict, data: districts } = useArea(
    'districts',
    provinceSelected
  );
  const { isFetching: loadingArea, data: area } = useArea(
    'area',
    districtSelected
  );

  const handleBlur = (e: FocusEvent<HTMLInputElement>, field: string) => {
    form.setFieldValue(field, e.target.value.trim());
    form.validateFields([field]);
  };

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

  const optionsDistricts = useMemo(() => {
    if (!districts || !provinceSelected) {
      return [];
    }
    return districts.map((district) => ({
      label: district.areaName,
      value: district.areaCode,
      id: district.id,
    }));
  }, [districts, provinceSelected]);

  const optionsArea = useMemo(() => {
    if (!area || !districtSelected) {
      return [];
    }
    return area.map((area) => ({
      label: area.areaName,
      value: area.areaCode,
      id: area.id,
    }));
  }, [area, districtSelected]);
  useEffect(() => {
    if (optionsProvinces.length > 0) {
      const province = optionsProvinces.find((p) => p.value === provinceCode);
      if (province) {
        setProvinceSelected(province.id.toString());
      }
    }
  }, [optionsProvinces, provinceCode]);

  useEffect(() => {
    if (typeModal === ActionType.VIEW && optionsDistricts.length > 0) {
      const district = optionsDistricts.find((p) => p.value === districtCode);
      if (district) {
        setDistrictSelected(district.id.toString());
      }
    }
  }, [typeModal, optionsDistricts, districtCode]);

  const handleClose = useCallback(() => {
    form.resetFields();
    resetOnlineOrder();
    navigate(-1);
  }, [form, navigate]);

  const handleCloseModal = useCallback(() => {
    handleClose();
  }, [handleClose]);
  const isSimOutbound =
    onlineOrderDetail &&
    onlineOrderDetail.channel === TypeChannel.WebSIMOutbound;
  useEffect(() => {
    if (onlineOrderDetail && !!form) {
      const formattedData = onlineOrderDetail.products.map((item, index) => ({
        key: index,
        ...item,
        coverageRange:
          onlineOrderDetail.channel === TypeChannel.WebSIMOutbound
            ? (mutateCoverageArea(item.coverageRange), item.coverageRange)
            : undefined,
      }));
      setDataCondition(formattedData);
      form.setFieldsValue({
        ...onlineOrderDetail,
        orderTime: dayjs(onlineOrderDetail.orderTime),
        onlineOrderProducts: formattedData,
        deliveryFee: formatCurrencyVND(onlineOrderDetail.deliveryFee || 0),
        productAmount: formatCurrencyVND(onlineOrderDetail.productAmount || 0),
        amountTotal: formatCurrencyVND(onlineOrderDetail.amountTotal || 0),
        discountAmount: formatCurrencyVND(
          onlineOrderDetail.discountAmount || 0
        ),
        partnerDeliveryFee: formatCurrencyVND(
          onlineOrderDetail.partnerDeliveryFee || 0
        ),
        vat: formatCurrencyVND(onlineOrderDetail.vat || 0),
        codAmount: formatCurrencyVND(onlineOrderDetail.codAmount || 0),
      });
    }
  }, [form, onlineOrderDetail, isFetchingView, mutateCoverageArea]);

  const handleFinishForm = useCallback(
    async (values: any) => {
      const data: IPayloadUpdateOrder = {
        id: Number(idDetail),
        address: values.address,
        customerEmail: values.customerEmail,
        customerName: values.customerName,
        customerPhone: values.customerPhone,
        deliveryMethod: values.deliveryMethod,
        deliveryPartner: values.deliveryPartnerCode,
        district: values.districtCode,
        ward: values.wardCode,
        details:
          onlineOrderDetail?.deliveryStatus ===
          IOrderOnlinetatus.NEW_CREATION_FAILED
            ? values.onlineOrderProducts.map(
                (item: IOnlineOrderProductsSim) => {
                  return {
                    id: item.id,
                    skuId: item.skuId,
                    usingDay: item.usingDay,
                  };
                }
              )
            : undefined,
      };
      if (typeModal === ActionType.EDIT) {
        CModalConfirm({
          message: MESSAGE.G04,
          onOk: () => {
            updateOnlineOrder(data);
          },
        });
      }
    },
    [idDetail, typeModal, form, updateOnlineOrder, onlineOrderDetail]
  );

  const renderTitle = () => {
    switch (typeModal) {
      case ActionType.EDIT:
        return 'Chỉnh sửa đơn hàng';
      case ActionType.VIEW:
        return 'Xem chi tiết';
      default:
        return '';
    }
  };

  const storeDeliveryMethod = useMemo(() => {
    const result = SALE_ORDER_DELIVERY_METHOD.find(
      (item) => item.value === 'STORE'
    )?.label;
    return result ?? 'Nhận tại cửa hàng';
  }, [SALE_ORDER_DELIVERY_METHOD]);
  // chỉ cho phép chỉnh sửa đơn hàng với trạng thái tạo mới và ghép kit lỗi
  const canEditMode =
    ((onlineOrderDetail?.channel === TypeChannel.WebSIMOutbound &&
      onlineOrderDetail.deliveryStatus ===
        IOrderOnlinetatus.NEW_CREATION_FAILED) ||
      (onlineOrderDetail?.channel !== TypeChannel.WebSIMOutbound &&
        [
          IOrderOnlinetatus.CREATED,
          IOrderOnlinetatus.COMBINED_KIT_ERROR,
        ].includes(onlineOrderDetail?.deliveryStatus as any))) &&
    onlineOrderDetail?.simType !== SIM_TYPE.ESIM &&
    includes(listRoles, ActionsTypeEnum.UPDATE) &&
    onlineOrderDetail?.deliveryMethodName !== storeDeliveryMethod;
  // check type sim in order
  const checkEsimChanelSOutbound = useMemo(() => {
    return (
      onlineOrderDetail &&
      onlineOrderDetail.channel === TypeChannel.WebSIMOutbound &&
      onlineOrderDetail?.products.every(
        (product) => product.simTypeName === TypeSim.ESIM
      )
    );
  }, [onlineOrderDetail]);
  // status thêm mới thì cho tạo đơn hàng
  const canCreateOrder =
    onlineOrderDetail?.deliveryStatus === IOrderOnlinetatus.CREATED &&
    includes(listRoles, ActionsTypeEnum.CREATE) &&
    onlineOrderDetail?.deliveryMethodName !== storeDeliveryMethod;

  const disableAllForm = typeModal === ActionType.VIEW || !canEditMode;

  const handleCreateOrder = () => {
    ModalConfirm({
      message: 'Bạn chắc chắn muốn tạo đơn giao hàng?',
      handleConfirm: () => {
        onlineOrderDetail?.id && onCreateOrder(onlineOrderDetail.id);
      },
    });
  };
  console.log(dataCondition, 'dataCondition');
  return (
    <WrapperPage>
      <TitleHeader>{renderTitle()}</TitleHeader>
      <Form
        key={typeModal}
        form={form}
        initialValues={{
          onlineOrderProducts: dataCondition,
        }}
        labelCol={{ style: { width: '160px' } }}
        colon={false}
        onFinish={handleFinishForm}
        disabled={disableAllForm}
        onValuesChange={(values) => {
          if (!isValuesChanged) {
            setIsValuesChanged(true);
          }
        }}
      >
        <Card className="mb-5">
          <RowStyle gutter={[24, 0]}>
            <Col span={24}>
              <h3 className="title-blue">Thông tin khách hàng</h3>
            </Col>
            <Col span={12}>
              <Form.Item
                name="customerName"
                label="Tên khách hàng"
                rules={[
                  {
                    required: true,
                    message: MESSAGE.G06,
                  },
                ]}
              >
                <CInput maxLength={100} disabled={disableAllForm} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Số điện thoại"
                name="customerPhone"
                required
                rules={[
                  {
                    validator(_, value) {
                      if (!value) {
                        return Promise.reject('Không được để trống trường này');
                      } else if (!phoneRegex.test(value)) {
                        return Promise.reject(
                          'Số điện thoại chưa đúng định dạng'
                        );
                      } else {
                        return Promise.resolve();
                      }
                    },
                  },
                ]}
              >
                <CInput
                  maxLength={10}
                  disabled={disableAllForm}
                  onlyNumber
                  preventSpace
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={'Email'}
                name="customerEmail"
                required
                rules={[
                  {
                    validator(_, value) {
                      if (!value) {
                        return Promise.reject('Không được để trống trường này');
                      } else if (!emailRegex.test(value)) {
                        return Promise.reject('Email không đúng định dạng');
                      } else {
                        return Promise.resolve();
                      }
                    },
                  },
                ]}
              >
                <CInput
                  placeholder="Nhập email"
                  onBlur={(e) => {
                    handleBlur(e, 'email');
                  }}
                  maxLength={100}
                  disabled={disableAllForm}
                  onInput={(e: any) =>
                    (e.target.value = cleanUpPhoneNumber(e.target.value))
                  }
                />
              </Form.Item>
            </Col>
            <Col span={12}></Col>
            <Show.When isTrue={!checkEsimChanelSOutbound}>
              <Col span={12}>
                <Form.Item
                  label="Địa chỉ"
                  name="address"
                  required
                  rules={[
                    {
                      validator(_, value) {
                        if (!value) {
                          return Promise.reject(
                            'Không được để trống trường này'
                          );
                        } else {
                          return Promise.resolve();
                        }
                      },
                    },
                  ]}
                >
                  <CInput
                    placeholder="Nhập địa chỉ"
                    maxLength={200}
                    disabled={disableAllForm}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Tỉnh/Thành phố"
                  name="provinceCode"
                  required
                  rules={[
                    {
                      validator(_, value) {
                        if (!value) {
                          return Promise.reject(
                            'Không được để trống trường này'
                          );
                        } else {
                          return Promise.resolve();
                        }
                      },
                    },
                  ]}
                >
                  <CSelect
                    placeholder="Nhập Tỉnh/Thành phố"
                    options={optionsProvinces}
                    loading={loadingProvinces}
                    disabled
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Quận/Huyện"
                  name="districtCode"
                  rules={[validateForm.required]}
                >
                  <CSelect
                    placeholder="Nhập Quận/Huyện"
                    options={optionsDistricts}
                    loading={loadingDistrict}
                    disabled={disableAllForm}
                    onChange={(_, option: any) => {
                      if (option) {
                        setDistrictSelected(option.id);
                      } else {
                        setDistrictSelected('');
                      }
                      form.setFieldValue('wardCode', null);
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Xã/Phường"
                  name="wardCode"
                  rules={
                    optionsArea && optionsArea.length > 0
                      ? [validateForm.required]
                      : undefined
                  }
                >
                  <CSelect
                    placeholder="Nhập Xã/Phường"
                    options={optionsArea}
                    loading={loadingArea}
                    disabled={disableAllForm}
                  />
                </Form.Item>
              </Col>
            </Show.When>
          </RowStyle>
          <RowStyle gutter={[24, 0]}>
            <Col span={24}>
              <h3 className="title-blue">Thông tin đơn hàng</h3>
            </Col>
            <Col span={12}>
              <Form.Item name="orderNo" label="Mã đơn hàng">
                <CInput disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="orderTime" label="Thời gian đặt hàng">
                <CDatePicker
                  format={formatDateTime}
                  style={{ width: '100%' }}
                  disabled
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="deliveryStatusName" label="Trạng thái đơn hàng">
                <CInput disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="paymentMethod" label="Phương thức thanh toán">
                <CInput disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="deliveryPartnerCode"
                label="Đơn vị vận chuyển"
                rules={checkEsimChanelSOutbound ? [] : [validateForm.required]}
              >
                <CSelect
                  options={SALE_ORDER_DELIVERY_PARTNER_CODE}
                  style={{ width: '100%' }}
                  disabled={disableAllForm}
                  allowClear={checkEsimChanelSOutbound}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="deliveryMethod"
                label="Phương thức vận chuyển"
                rules={checkEsimChanelSOutbound ? [] : [validateForm.required]}
              >
                <CSelect
                  options={optionsDeliveryMethod}
                  style={{ width: '100%' }}
                  disabled={disableAllForm}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="deliveryFee" label="Phí vận chuyển">
                <CInput disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="partnerDeliveryFee" label="Cước vận chuyển">
                <CInput disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="weight" label="Khối lượng VNSKY">
                <CInput disabled addonAfter="Kg" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="partnerWeight" label="Khối lượng ĐVVC">
                <CInput disabled addonAfter="Kg" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="discountAmount" label="Tiền KM">
                <CInput disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="productAmount" label="Tổng tiền sản phẩm">
                <CInput disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="vat" label="VAT">
                <CInput disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="amountTotal" label="Tổng tiền thanh toán">
                <CInput disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="quantity" label="Số lượng sản phẩm">
                <CInput disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="codAmount" label="Phí thu hộ">
                <CInput disabled />
              </Form.Item>
            </Col>
            {isSimOutbound && (
              <>
                <Col span={12}>
                  <Form.Item
                    name="refEsimOrderNo"
                    label="Mã đơn hàng đối tác(eSIM)"
                  >
                    <CInput disabled />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="refPhysicSimOrderNo"
                    label="Mã đơn hàng đối tác(SIM vật lý)"
                  >
                    <CInput disabled />
                  </Form.Item>
                </Col>
              </>
            )}
          </RowStyle>
          <RowStyle gutter={[24, 0]}>
            <Col span={24}>
              <h3 className="title-blue">Danh sách sản phẩm</h3>
            </Col>
            <Col span={24}>
              <Form.List name="onlineOrderProducts">
                {(fields) => (
                  <StyleTableForm
                    dataSource={fields}
                    // columns={columns}
                    className="dynamic-table"
                    pagination={false}
                    rowKey="key"
                  >
                    <Column
                      dataIndex="serial"
                      title={<div>STT</div>}
                      render={(value, record, index: number) => index + 1}
                    />
                    <Column
                      dataIndex="serial"
                      title={<div>Serial</div>}
                      render={(value, record, index: number) => {
                        const text = dataCondition[index].serial;
                        return (
                          <Tooltip title={text} placement="topLeft">
                            <Form.Item name={[index, 'serial']}>
                              <CInput disabled />
                            </Form.Item>
                          </Tooltip>
                        );
                      }}
                    />
                    {!isSimOutbound && (
                      <>
                        <Column
                          dataIndex="isdn"
                          title={<div>Số thuê bao</div>}
                          render={(value, record, index: number) => {
                            const text = dataCondition[index]?.isdn ?? '';
                            return (
                              <Tooltip title={text} placement="topLeft">
                                <Form.Item name={[index, 'isdn']}>
                                  <CInput disabled />
                                </Form.Item>
                              </Tooltip>
                            );
                          }}
                        />
                        <Column
                          dataIndex="packageName"
                          title={<div>Gói cước</div>}
                          render={(value, record, index: number) => {
                            const text =
                              dataCondition[index]?.packageName ?? '';
                            return (
                              <Tooltip title={text} placement="topLeft">
                                <Form.Item name={[index, 'packageName']}>
                                  <CInput disabled />
                                </Form.Item>
                              </Tooltip>
                            );
                          }}
                        />
                        <Column
                          dataIndex="isdnFee"
                          title={<div>Phí chọn số</div>}
                          render={(value, record, index: number) => {
                            const text = dataCondition[index]?.isdnFee ?? '';
                            return (
                              <Tooltip title={text} placement="topLeft">
                                <Form.Item name={[index, 'isdnFee']}>
                                  <CInput disabled />
                                </Form.Item>
                              </Tooltip>
                            );
                          }}
                        />
                      </>
                    )}
                    {isSimOutbound && (
                      <>
                        <Column
                          dataIndex="skuId"
                          title={<div>SKUID</div>}
                          render={(value, record, index: number) => {
                            const text = dataCondition[index]?.skuId ?? '';
                            return (
                              <Tooltip title={text} placement="topLeft">
                                <Form.Item
                                  layout="horizontal"
                                  rules={[validateForm.required]}
                                  name={[index, 'skuId']}
                                >
                                  <CInput
                                    maxLength={50}
                                    preventVietnamese
                                    uppercase
                                    preventSpace
                                    preventSpecialExceptHyphenAndUnderscore
                                    placeholder="Nhập giá trị thuộc tính"
                                    disabled={disableAllForm}
                                  />
                                </Form.Item>
                              </Tooltip>
                            );
                          }}
                        />
                        <Column
                          dataIndex="usingDay"
                          title={<div>Số ngày sử dụng</div>}
                          render={(value, record, index: number) => {
                            const text = dataCondition[index]?.usingDay
                              ? `${dataCondition[index]?.usingDay} Ngày`
                              : '';
                            return (
                              <Tooltip title={text} placement="topLeft">
                                <Form.Item
                                  rules={[validateForm.required]}
                                  name={[index, 'usingDay']}
                                >
                                  <CInput
                                    placeholder="Nhập giá trị thuộc tính"
                                    maxLength={2}
                                    onlyNumber
                                    suffix="Ngày"
                                    preventNumber0
                                    disabled={disableAllForm}
                                    allowClear={false}
                                  />
                                </Form.Item>
                              </Tooltip>
                            );
                          }}
                        />
                        <Column
                          dataIndex="coverageRange"
                          title={<div>Phạm vi phủ sóng</div>}
                          render={(value, record, index: number) => {
                            const text = coverageAreas?.[index];
                            return (
                              <Tooltip title={text} placement="topLeft">
                                <CInput disabled value={text} />
                              </Tooltip>
                            );
                          }}
                        />
                      </>
                    )}
                    <Column
                      dataIndex="simTypeName"
                      title={<div>Loại SIM</div>}
                      render={(value, record, index: number) => {
                        const text = dataCondition[index]?.simTypeName ?? '';
                        return (
                          <Tooltip title={text} placement="topLeft">
                            <Form.Item name={[index, 'simTypeName']}>
                              <CInput disabled />
                            </Form.Item>
                          </Tooltip>
                        );
                      }}
                    />
                    {isSimOutbound && (
                      <Column
                        dataIndex="note"
                        title={<div>Ghi chú</div>}
                        render={(value, record, index: number) => {
                          const text = dataCondition[index]?.note ?? '';
                          return (
                            <Tooltip title={text} placement="topLeft">
                              <Form.Item name={[index, 'note']}>
                                <CInput disabled />
                              </Form.Item>
                            </Tooltip>
                          );
                        }}
                      />
                    )}
                  </StyleTableForm>
                )}
              </Form.List>
            </Col>
          </RowStyle>
        </Card>
        <Row justify="end" className="mb-20">
          <Space size="middle">
            {typeModal === ActionType.VIEW && (
              <>
                {canEditMode && (
                  <CButtonEdit
                    onClick={() => {
                      navigate(pathRoutes.onlineOrdersEdit(idDetail ?? ''));
                    }}
                    disabled={false}
                  />
                )}
                {canCreateOrder && (
                  <CButton onClick={handleCreateOrder} disabled={false}>
                    Tạo đơn giao hàng
                  </CButton>
                )}
                <CButtonClose
                  onClick={handleCloseModal}
                  disabled={false}
                  type="default"
                />
              </>
            )}
            {typeModal !== ActionType.VIEW && (
              <CButtonSave htmlType="submit" loading={loadingUpdate} />
            )}
            {typeModal !== ActionType.VIEW && (
              <CButtonClose
                onClick={handleCloseModal}
                disabled={false}
                type="default"
              />
            )}
          </Space>
        </Row>
      </Form>
    </WrapperPage>
  );
};

export default ModalAddEditView;
