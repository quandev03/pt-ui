import { CButtonClose, CButtonSave } from '@react/commons/Button';
import CDatePicker from '@react/commons/DatePicker';
import { CNumberInput } from '@react/commons/index';
import CSelect from '@react/commons/Select';
import CTableUploadFile from '@react/commons/TableUploadFile';
import { TitleHeader } from '@react/commons/Template/style';
import CTextArea from '@react/commons/TextArea';
import { IFieldErrorsItem } from '@react/commons/types';
import { Col, Form, Row, Spin } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import {
  ReasonCodeEnum,
  useListReasonCatalogService,
} from 'apps/Internal/src/hooks/useReasonCatalogService';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useSupportCreateDebtAdjustment,
  useSupportGetPartnerLimitsId,
} from '../hooks';
import { IPayloadCreateFormDebtAdjustment } from '../type';
import {
  formatDate,
  formatDateBe,
  formatDateTimeHHmm,
} from '@react/constants/moment';

const DebtAdjustment = () => {
  const [form] = Form.useForm();
  const reasonId = useWatch('reasonId', form);
  const navigate = useNavigate();
  const {
    mutate: getPartnerLimitsId,
    isPending: loadingPartnerLimitsId,
    data: PartnerLimits,
  } = useSupportGetPartnerLimitsId((data) => {
    form.setFieldsValue({
      orgId: data.orgId,
    });
  });
  const { id } = useParams();

  const optionPartner = useMemo(() => {
    if (!PartnerLimits) return [];
    return [
      {
        label: PartnerLimits.orgName,
        value: PartnerLimits.orgId,
      },
    ];
  }, [PartnerLimits]);

  useEffect(() => {
    if (id) {
      getPartnerLimitsId(id);
    }
  }, [id]);

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
  const {
    mutate: createDebtAdjustment,
    isPending: isLoadingCreateDebtAdjustment,
  } = useSupportCreateDebtAdjustment(() => {
    navigate(-1);
  }, setFieldError);

  const reasonsList = useListReasonCatalogService(
    false,
    reasonId,
    ReasonCodeEnum.PARTNER_LIMITS_DEBT
  );

  const handleClose = () => {
    navigate(-1);
  };
  const handleFinish = (values: IPayloadCreateFormDebtAdjustment) => {
    createDebtAdjustment({
      ...values,
      adjustmentDate: dayjs(values.adjustmentDate).format(formatDateBe),
    });
  };

  return (
    <div className="flex flex-col w-full h-full mb-7 ">
      <TitleHeader>Điều chỉnh công nợ</TitleHeader>
      <Spin spinning={loadingPartnerLimitsId || isLoadingCreateDebtAdjustment}>
        <Form
          form={form}
          labelCol={{ span: 6 }}
          labelWrap
          colon={false}
          validateTrigger={['onSubmit']}
          onFinish={handleFinish}
          initialValues={{ adjustmentDate: dayjs() }}
        >
          <div className="bg-white p-5 rounded-md">
            <Row gutter={[30, 0]}>
              <Col span={12}>
                <Form.Item
                  label="Đối tác"
                  name="orgId"
                  required
                  rules={[
                    {
                      validator(_, value) {
                        if (!value || value.length === 0) {
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
                    placeholder="Chọn đối tác"
                    options={optionPartner}
                    disabled={true}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Loại"
                  name="debtType"
                  required
                  rules={[
                    {
                      validator(_, value) {
                        if (!value || value.length === 0) {
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
                    placeholder="Chọn loại"
                    options={[
                      {
                        label: 'Thu',
                        value: '1',
                      },
                      {
                        label: 'Chi',
                        value: '2',
                      },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Số tiền"
                  name="debtAmount"
                  required
                  rules={[
                    {
                      validator(_, value) {
                        if (!value || value.length === 0) {
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
                  <CNumberInput placeholder="Nhập số tiền" addonAfter="VND" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Lý do" name="reasonId">
                  <CSelect placeholder="Chọn lý do" options={reasonsList} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Ngày điều chỉnh"
                  name="adjustmentDate"
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
                  <CDatePicker
                    placeholder="Chọn ngày điều chỉnh"
                    allowClear={false}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label="Ghi chú"
                  name="description"
                  labelCol={{ span: 3 }}
                >
                  <CTextArea placeholder="Nhập ghi chú" maxLength={200} />
                </Form.Item>
              </Col>
              <Col span={24} className="mt-3">
                <CTableUploadFile acceptedFileTypes="*" />
              </Col>
            </Row>
          </div>

          <div className="flex gap-4 flex-wrap justify-end mt-7">
            <CButtonSave
              loading={isLoadingCreateDebtAdjustment}
              onClick={() => {
                form.submit();
              }}
            />
            <CButtonClose onClick={handleClose} />
          </div>
        </Form>
      </Spin>
    </div>
  );
};

export default DebtAdjustment;
