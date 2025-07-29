import {
  CButtonClose,
  CButtonEdit,
  CButtonSave,
  CButtonSaveAndAdd,
} from '@react/commons/Button';
import {
  CInput,
  CModalConfirm,
  CSwitch,
  CTextArea,
  WrapperPage,
} from '@react/commons/index';
import { TitleHeader } from '@react/commons/Template/style';
import { ActionsTypeEnum, ActionType } from '@react/constants/app';
import { MESSAGE } from '@react/utils/message';
import validateForm from '@react/utils/validator';
import { Card, Col, Form, Row, Space } from 'antd';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useAddPromotionRest,
  useCheckExistsPromotionRest,
  useDetailExecutePromotionRest,
  useGetDetailPromotionRest,
  useUpdatePromotionRest,
} from '../hooks';
import {
  EStatusExecutePromotion,
  EStatusPromotionRest,
  IExecutePromotion,
  PayloadAddPromotionRest,
  PayloadUpdatePromotionRest,
} from '../types';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import { includes } from 'lodash';

type Props = {
  type: ActionType;
};

const layout = {
  labelCol: { flex: '130px' },
};

const FormGeneral = ({ type }: Props) => {
  const actionByRole = useRolesByRouter();
  const navigate = useNavigate();
  const [form] = Form.useForm();
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

  const handleCheckExistSuccess = (data: any, isSubmit?: boolean) => {
    if (!data.result) {
      form.setFields([
        {
          name: 'promotionCode',
          errors: undefined,
        },
      ]);
      isSubmit && form.submit();
    } else {
      form.setFields([
        {
          name: 'promotionCode',
          errors: ['Mã chương trình khuyến mại đã tồn tại trên hệ thống'],
        },
      ]);
    }
  };
  const handleCheckExistError = () => {
    form.setFields([
      {
        name: 'promotionCode',
        errors: ['Có lỗi xảy ra! Vui lòng nhập lại mã CTKM'],
      },
    ]);
  };

  const { mutate: onCreate, isPending: loadingAdd } = useAddPromotionRest(
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
    useUpdatePromotionRest(handleClose);
  const { mutate: onCheckExists, isPending: loadingCheckExists } =
    useCheckExistsPromotionRest(handleCheckExistSuccess, handleCheckExistError);

  const { id } = useParams();
  const {
    isFetching: isLoadingDetail,
    data: detailPromotionRest,
    isSuccess: isGetDetailSuccess,
  } = useGetDetailPromotionRest(id ?? '');

  const { data: detailExecutePromotionRest } = useDetailExecutePromotionRest(
    id ?? ''
  );

  const disabledToggleStatus = useMemo(() => {
    if (type === ActionType.VIEW) return true;
    if (detailExecutePromotionRest && detailExecutePromotionRest.length > 0) {
      if (
        detailExecutePromotionRest.find(
          (item: IExecutePromotion) =>
            item.status === EStatusExecutePromotion.COMPLETED ||
            item.status === EStatusExecutePromotion.CANCELED
        )
      ) {
        return false;
      }
    }
    return true;
  }, [detailExecutePromotionRest]);

  const [submitType, setSubmitType] = useState<string>('');

  useEffect(() => {
    if (isGetDetailSuccess && detailPromotionRest) {
      form.setFieldsValue({
        promotionCode: detailPromotionRest.promotionCode,
        name: detailPromotionRest.name,
        description: detailPromotionRest.description,
        status:
          detailPromotionRest.status === EStatusPromotionRest.ACTIVE
            ? true
            : false,
      });
    }
  }, [isGetDetailSuccess, detailPromotionRest]);

  const handleFinishForm = (val: PayloadAddPromotionRest) => {
    const data = {
      ...val,
      status: val.status
        ? EStatusPromotionRest.ACTIVE
        : EStatusPromotionRest.IN_ACTIVE,
    };
    if (type === ActionType.ADD) {
      onCreate(data);
    }
    if (type === ActionType.EDIT && detailPromotionRest?.id) {
      const dataUpdate: PayloadUpdatePromotionRest = {
        promotionProgramDto: {
          id: detailPromotionRest?.id,
          promotionCode: val.promotionCode,
          name: val.name,
          description: val.description,
          status: val.status
            ? EStatusPromotionRest.ACTIVE
            : EStatusPromotionRest.IN_ACTIVE,
        },
      };
      CModalConfirm({
        message: MESSAGE.G04,
        onOk: () => {
          onUpdate(dataUpdate);
        },
      });
    }
  };

  const renderTitle = () => {
    switch (type) {
      case ActionType.ADD:
        return 'Tạo chương trình khuyến mại';
      case ActionType.EDIT:
        return 'Chỉnh sửa chương trình khuyến mại';
      case ActionType.VIEW:
        return 'Xem chi tiết chương trình khuyến mại';
      default:
        return '';
    }
  };

  const handleCheckExist = (code: string, submitForm?: boolean) => {
    onCheckExists({ promotionCode: code, isSubmitForm: submitForm });
  };

  const handleValidateBeforeSubmit = () => {
    const promotionCode = form.getFieldValue('promotionCode');
    if (promotionCode && type === ActionType.ADD) {
      //thêm mới sẽ kiểm tra mã CTKM đã tồn tại trên hệ thống chưa, trước khi submit
      handleCheckExist(promotionCode, true);
    } else {
      form.submit();
    }
  };

  const handleBlurCheckExist = () => {
    const promotionCode = form.getFieldValue('promotionCode');
    type === ActionType.ADD && //thêm mới sẽ kiểm tra mã CTKM đã tồn tại trên hệ thống chưa
      promotionCode &&
      onCheckExists({ promotionCode: promotionCode, isSubmitForm: false });
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
          status: true,
        }}
      >
        <Card className="mb-5" loading={isLoadingDetail}>
          <Row gutter={[12, 0]}>
            <Col span={24} md={12}>
              <Form.Item
                name={'promotionCode'}
                label="Mã CTKM"
                required
                rules={[
                  {
                    validator(_, value) {
                      if (!value) {
                        return Promise.reject(MESSAGE.G06);
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <CInput
                  maxLength={100}
                  onBlur={handleBlurCheckExist}
                  preventVietnamese
                  preventSpecial
                  uppercase
                  preventSpace
                  disabled={
                    type === ActionType.VIEW ||
                    type === ActionType.EDIT ||
                    loadingCheckExists
                  }
                  placeholder="Nhập mã CTKM"
                />
              </Form.Item>
            </Col>
            <Col span={24} md={12}>
              <Form.Item
                name={'name'}
                label="Tên CTKM"
                required
                rules={[validateForm.required]}
              >
                <CInput maxLength={100} placeholder="Nhập tên CTKM" />
              </Form.Item>
            </Col>
            <Col span={12}></Col>
            <Col span={24}>
              <Form.Item name={'description'} label="Mô tả">
                <CTextArea maxLength={250} rows={3} placeholder="Nhập mô tả" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name={'status'} label="Hoạt động">
                <CSwitch disabled={disabledToggleStatus} />
              </Form.Item>
            </Col>
          </Row>
        </Card>
        <Row justify="end">
          <Space size="middle">
            {type === ActionType.VIEW && (
              <>
                {includes(actionByRole, ActionsTypeEnum.UPDATE) && (
                  <CButtonEdit
                    onClick={() => {
                      detailPromotionRest?.id &&
                        navigate(
                          pathRoutes.promotionRestEdit(detailPromotionRest?.id)
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
                htmlType="button"
                loading={loadingAdd || isLoadingUpdate || loadingCheckExists}
                onClick={() => {
                  setSubmitType('saveAndAdd');
                  handleValidateBeforeSubmit();
                }}
              />
            )}
            {type !== ActionType.VIEW && (
              <CButtonSave
                htmlType="button"
                loading={loadingAdd || isLoadingUpdate || loadingCheckExists}
                onClick={() => {
                  setSubmitType('save');
                  handleValidateBeforeSubmit();
                }}
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
