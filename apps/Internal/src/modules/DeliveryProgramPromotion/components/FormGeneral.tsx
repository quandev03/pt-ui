import {
  CButtonClose,
  CButtonDelete,
  CButtonEdit,
  CButtonSave,
  CButtonSaveAndAdd,
} from '@react/commons/Button';
import CDatePicker from '@react/commons/DatePicker';
import { CInputNumber, CModalConfirm, WrapperPage } from '@react/commons/index';
import CInput from '@react/commons/Input';
import CSelect from '@react/commons/Select';
import { TitleHeader } from '@react/commons/Template/style';
import { AnyElement } from '@react/commons/types';
import { ActionsTypeEnum, ActionType, DateFormat } from '@react/constants/app';
import { formatDateBe } from '@react/constants/moment';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import { MESSAGE } from '@react/utils/message';
import validateForm from '@react/utils/validator';
import { Card, Col, Form, Radio, Row, Space } from 'antd';
import { ParamsOption } from 'apps/Internal/src/components/layouts/types';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useAddDeliveryProgramPromotion,
  useDeleteDeliveryProgramPromotion,
  useGetDetailDeliveryProgramPromotion,
  useUpdateDeliveryProgramPromotion,
} from '../hooks';
import { RowStyle } from '../page/style';
import {
  FormValuesAddShippingPromotion,
  IPromotionMethod,
  PayloadAddShippingPromotion,
} from '../types';
import { includes } from 'lodash';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';

type Props = {
  type: ActionType;
};

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const promotionMethodOptions = [
  { label: 'Giảm theo %', value: IPromotionMethod.PERCENT },
  { label: 'Đồng giá phí vận chuyển', value: IPromotionMethod.FLAT_PRICE },
];

const FormGeneral = ({ type }: Props) => {
  const actionByRole = useRolesByRouter();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const {
    DELIVERY_PROGRAM_PROMOTION_CHANNEL = [],
    DELIVERY_PROGRAM_PROMOTION_DELIVERY_PAYMENT_METHOD = [],
    DELIVERY_PROGRAM_PROMOTION_DELIVERY_METHOD = [],
  } = useGetDataFromQueryKey<ParamsOption>([REACT_QUERY_KEYS.GET_PARAMS]);
  const handleClose = useCallback(() => {
    form.resetFields();
    navigate(-1);
  }, [form, navigate]);

  const handleCloseAddSave = useCallback(() => {
    form.resetFields();
    form.setFieldValue('promotionMethod', IPromotionMethod.PERCENT);
    setPromotionMethod(IPromotionMethod.PERCENT);
  }, [form]);

  const handleCloseModal = useCallback(() => {
    handleClose();
  }, [handleClose]);

  const { mutate: onCreate, isPending: loadingAdd } =
    useAddDeliveryProgramPromotion(() => {
      if (submitType === 'saveAndAdd') {
        handleCloseAddSave();
      } else {
        handleClose();
      }
    }, form);
  const { mutate: onUpdate, isPending: isLoadingUpdate } =
    useUpdateDeliveryProgramPromotion(handleClose);
  const { mutate: onDelete } = useDeleteDeliveryProgramPromotion(handleClose);

  const { id } = useParams();
  const {
    isFetching: isLoadingDetail,
    data: detailShippingPromotion,
    isSuccess: isGetDetailSuccess,
  } = useGetDetailDeliveryProgramPromotion(id ?? '');

  const [submitType, setSubmitType] = useState<string>('');

  const [promotionMethod, setPromotionMethod] = useState<IPromotionMethod>(
    IPromotionMethod.PERCENT
  );

  useEffect(() => {
    if (isGetDetailSuccess && detailShippingPromotion) {
      form.setFieldsValue({
        ...detailShippingPromotion,
        deliveryMethod: detailShippingPromotion.deliveryMethod
          ? detailShippingPromotion.deliveryMethod
              .split(',')
              .map((item) => item?.trim())
          : '',
        channel: detailShippingPromotion.channel
          ? detailShippingPromotion.channel
              .split(',')
              .map((item) => item?.trim())
          : '',
        deliveryPaymentMethod: detailShippingPromotion.deliveryPaymentMethod
          ? detailShippingPromotion.deliveryPaymentMethod
              .split(',')
              .map((item) => item?.trim())
          : '',
        startDate: dayjs(detailShippingPromotion.startDate),
        endDate: dayjs(detailShippingPromotion.endDate),
      });
      setPromotionMethod(
        detailShippingPromotion.promotionMethod === IPromotionMethod.PERCENT
          ? IPromotionMethod.PERCENT
          : IPromotionMethod.FLAT_PRICE
      );
    }
  }, [isGetDetailSuccess, detailShippingPromotion]);

  const handleChangePromotionMethod = (val: IPromotionMethod) => {
    setPromotionMethod(val);
  };

  const handleFinishForm = (val: FormValuesAddShippingPromotion) => {
    const data: PayloadAddShippingPromotion = {
      ...val,
      deliveryMethod:
        val.deliveryMethod && val.deliveryMethod.length > 0
          ? val.deliveryMethod.join(',')
          : '',
      channel:
        val.channel && val.channel.length > 0 ? val.channel.join(',') : '',
      deliveryPaymentMethod:
        val.deliveryPaymentMethod && val.deliveryPaymentMethod.length > 0
          ? val.deliveryPaymentMethod.join(',')
          : '',
      promotionMethod: promotionMethod,
      startDate: dayjs(val.startDate).format(formatDateBe),
      endDate: dayjs(val.endDate).format(formatDateBe),
      minPrice: Number(val.minPrice),
      percentDiscount:
        promotionMethod === IPromotionMethod.PERCENT
          ? Number(val.percentDiscount)
          : undefined,
      flatDeliveryPrice:
        promotionMethod === IPromotionMethod.FLAT_PRICE
          ? Number(val.flatDeliveryPrice)
          : undefined,
    };
    if (type === ActionType.ADD) {
      onCreate(data as AnyElement);
    }
    if (type === ActionType.EDIT) {
      CModalConfirm({
        message: MESSAGE.G04,
        onOk: () => {
          onUpdate({
            id: detailShippingPromotion?.id
              ? String(detailShippingPromotion?.id)
              : '',
            data: data,
          });
        },
      });
    }
  };

  const handleDelete = () => {
    CModalConfirm({
      message: 'Bạn có chắc chắn muốn xóa CTKM vận chuyển này không?',
      onOk: () => id && onDelete(id),
    });
  };

  const validateStartDate = {
    validator(_: any, value: string, __: any) {
      if (value) {
        const endDate = form.getFieldValue('endDate');
        if (!dayjs(value).isAfter(endDate) && !!endDate) {
          form.setFields([
            {
              name: 'endDate',
              errors: undefined,
            },
          ]);
        }
        if (dayjs(value).isAfter(endDate) && !!endDate) {
          form.setFields([
            {
              name: 'endDate',
              errors: undefined,
            },
          ]);
          return Promise.reject(
            'Thời gian bắt đầu không được lớn hơn thời gian kết thúc'
          );
        }
      }
      return Promise.resolve();
    },
  };

  const validateEndDate = {
    validator(_: any, value: string, __: any) {
      if (value) {
        const startDate = form.getFieldValue('startDate');
        if (!dayjs(startDate).isAfter(value) && !!startDate) {
          form.setFields([
            {
              name: 'startDate',
              errors: undefined,
            },
          ]);
        }

        if (dayjs(startDate).isAfter(value) && !!startDate) {
          form.setFields([
            {
              name: 'startDate',
              errors: undefined,
            },
          ]);
          return Promise.reject(
            'Thời gian kết thúc không được nhỏ hơn thời gian bắt đầu'
          );
        }
      }
      return Promise.resolve();
    },
  };

  const renderTitle = () => {
    switch (type) {
      case ActionType.ADD:
        return 'Tạo CTKM vận chuyển';
      case ActionType.EDIT:
        return 'Chỉnh sửa CTKM vận chuyển';
      case ActionType.VIEW:
        return 'Xem chi tiết CTKM vận chuyển';
      default:
        return '';
    }
  };

  const handleKeyPress = (e: any) => {
    if (!/[0-9]/.test(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <WrapperPage>
      <TitleHeader>{renderTitle()}</TitleHeader>
      <Form
        form={form}
        {...layout}
        onFinish={handleFinishForm}
        disabled={type === ActionType.VIEW}
        initialValues={{
          promotionMethod: promotionMethod,
        }}
      >
        <Card className="mb-5" loading={isLoadingDetail}>
          <RowStyle gutter={[24, 0]}>
            <Col span={24}>
              <h3 className="title-blue">Thông tin chung</h3>
            </Col>
            <Col span={24} xl={12}>
              <Form.Item
                name="programName"
                label="Tên CTKM"
                labelCol={{ md: 8, xl: 8, span: 24 }}
                wrapperCol={{ md: 16, xl: 16, span: 24 }}
                rules={[validateForm.required]}
              >
                <CInput maxLength={100} placeholder="Nhập tên CTKM" />
              </Form.Item>
            </Col>
          </RowStyle>

          <RowStyle gutter={[24, 0]}>
            <Col span={24}>
              <h3 className="title-blue">Điều kiện áp dụng</h3>
            </Col>
            <Col span={24} xl={12}>
              <Form.Item
                name="promotionMethod"
                label="Khuyến mãi"
                labelCol={{ md: 10, xl: 8, span: 24 }}
                wrapperCol={{ md: 16, xl: 16, span: 24 }}
              >
                <Radio.Group
                  options={promotionMethodOptions}
                  onChange={(e) => {
                    handleChangePromotionMethod(e.target.value);
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={24} xl={12}>
              <Form.Item
                name="channel"
                label="Áp dụng cho kênh"
                labelCol={{ md: 8, xl: 8, span: 24 }}
                wrapperCol={{ md: 16, xl: 16, span: 24 }}
                rules={[validateForm.required]}
              >
                <CSelect
                  options={DELIVERY_PROGRAM_PROMOTION_CHANNEL}
                  placeholder="Chọn kênh áp dụng"
                  mode="multiple"
                />
              </Form.Item>
            </Col>
            <Col span={24} xl={12}>
              <Form.Item
                name="deliveryPaymentMethod"
                label="Áp dụng cho HT thanh toán"
                labelCol={{ md: 8, xl: 8, span: 24 }}
                wrapperCol={{ md: 16, xl: 16, span: 24 }}
                rules={[validateForm.required]}
              >
                <CSelect
                  options={DELIVERY_PROGRAM_PROMOTION_DELIVERY_PAYMENT_METHOD}
                  placeholder="Chọn HTTT"
                  mode="multiple"
                />
              </Form.Item>
            </Col>
            <Col span={24} xl={12}>
              <Form.Item
                name="deliveryMethod"
                label="Áp dụng cho HT vận chuyển"
                labelCol={{ md: 8, xl: 8, span: 24 }}
                wrapperCol={{ md: 16, xl: 16, span: 24 }}
                rules={[validateForm.required]}
              >
                <CSelect
                  options={DELIVERY_PROGRAM_PROMOTION_DELIVERY_METHOD}
                  placeholder="Chọn HTVC"
                  mode="multiple"
                />
              </Form.Item>
            </Col>
            <Col span={24} xl={12}>
              <Form.Item
                name="minPrice"
                label="Giá trị đơn hàng tối thiểu"
                labelCol={{ md: 8, xxl: 8, span: 24 }}
                wrapperCol={{ md: 16, span: 24 }}
                rules={[validateForm.required]}
              >
                <CInputNumber
                  controls={false}
                  maxLength={13}
                  max={9999999999}
                  placeholder="Nhập giá trị đơn hàng tối thiểu"
                  className="w-100"
                  onKeyPress={handleKeyPress}
                  formatter={(value) =>
                    value
                      ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
                      : ''
                  }
                  parser={(value) => (value ? value.replace(/\./g, '') : '')}
                />
              </Form.Item>
            </Col>
            {promotionMethod === IPromotionMethod.FLAT_PRICE && (
              <Col span={24} xl={12}>
                <Form.Item
                  name="flatDeliveryPrice"
                  label="Phí vận chuyển đồng giá"
                  labelCol={{ md: 8, xxl: 8, span: 24 }}
                  wrapperCol={{ md: 16, span: 24 }}
                  rules={[validateForm.required]}
                >
                  <CInputNumber
                    controls={false}
                    maxLength={13}
                    max={9999999999}
                    placeholder="Nhập phí vận chuyển đồng giá"
                    className="w-100"
                    onKeyPress={handleKeyPress}
                    formatter={(value) =>
                      value
                        ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
                        : ''
                    }
                    parser={(value) => (value ? value.replace(/\./g, '') : '')}
                  />
                </Form.Item>
              </Col>
            )}
            {promotionMethod === IPromotionMethod.PERCENT && (
              <Col span={24} xl={12}>
                <Form.Item
                  name="percentDiscount"
                  label="Giảm giá"
                  labelCol={{ md: 8, xl: 8, span: 24 }}
                  wrapperCol={{ md: 16, xl: 16, span: 24 }}
                  rules={[validateForm.required]}
                >
                  <CInputNumber
                    controls={false}
                    maxLength={3}
                    max={100}
                    placeholder="Nhập % giảm giá"
                    className="w-100"
                    onKeyPress={handleKeyPress}
                    formatter={(value) =>
                      value
                        ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
                        : ''
                    }
                    parser={(value) => (value ? value.replace(/\./g, '') : '')}
                  />
                </Form.Item>
              </Col>
            )}
            <Col span={24} xl={12}>
              <Form.Item
                label="Thời gian bắt đầu"
                name="startDate"
                labelCol={{ md: 8, xl: 8, span: 24 }}
                wrapperCol={{ md: 16, xl: 16, span: 24 }}
                rules={[validateForm.required, validateStartDate]}
              >
                <CDatePicker
                  format={DateFormat.DATE_TIME_NO_SECOND}
                  placeholder="Nhập thời gian bắt đầu"
                  showTime={true}
                />
              </Form.Item>
            </Col>
            <Col span={24} xl={12}>
              <Form.Item
                label="Thời gian kết thúc"
                name="endDate"
                labelCol={{ md: 8, xl: 8, span: 24 }}
                wrapperCol={{ md: 16, xl: 16, span: 24 }}
                rules={[validateForm.required, validateEndDate]}
              >
                <CDatePicker
                  format={DateFormat.DATE_TIME_NO_SECOND}
                  placeholder="Nhập thời gian kết thúc"
                  showTime={true}
                />
              </Form.Item>
            </Col>
          </RowStyle>
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
                      detailShippingPromotion?.id &&
                        navigate(
                          pathRoutes.deliveryPromotionscategoryEdit(
                            detailShippingPromotion?.id
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
