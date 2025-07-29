import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CButton, { CButtonClose } from '@react/commons/Button';
import { CNumberInput } from '@react/commons/index';
import CSelect from '@react/commons/Select';
import { TitleHeader } from '@react/commons/Template/style';
import { Col, Form, Row, Spin } from 'antd';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useCallback, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HistoryChangeDebtLimits from '../components/HistoryChangeDebtLimits';
import { useSupportGetPartnerLimitsId } from '../hooks';

const CreditLimitsDebt = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { id } = useParams();

  const {
    mutate: getPartnerLimitsId,
    isPending: loadingPartnerLimitsId,
    data: partnerLimits,
  } = useSupportGetPartnerLimitsId((data) => {
    form.setFieldsValue({
      ...data,
      remainingLimit: data.limitAmount - data.debtTotalAmount,
      orgId: data.orgId,
    });
  });

  useEffect(() => {
    if (id) {
      getPartnerLimitsId(id);
    }
  }, [id]);
  const handleClose = useCallback(() => {
    navigate(-1);
  }, [navigate]);
  const handleDebtAdjustment = () => {
    navigate(pathRoutes.partnerDebtAdjustment(id));
  };
  const optionOrganization = useMemo(() => {
    if (!partnerLimits) {
      return [];
    }
    return [
      {
        label: partnerLimits.orgName,
        value: partnerLimits.orgId,
      },
    ];
  }, [partnerLimits, id]);
  return (
    <div className="flex flex-col w-full h-full  ">
      <TitleHeader>{'Chi tiết công nợ'}</TitleHeader>
      <Spin spinning={loadingPartnerLimitsId}>
        <Form
          form={form}
          labelCol={{ flex: '130px' }}
          labelWrap
          colon={false}
          validateTrigger={['onSubmit']}
        >
          <div className="bg-white rounded-[10px] px-6 pt-4 pb-8">
            <Row gutter={30}>
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
                    options={optionOrganization}
                    disabled={true}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Hạn mức"
                  name="limitAmount"
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
                  <CNumberInput
                    placeholder="Nhập hạn mức"
                    addonAfter="VND"
                    disabled
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Công nợ"
                  name="debtTotalAmount"
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
                  <CNumberInput
                    placeholder="Nhập công nợ"
                    addonAfter="VND"
                    disabled
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Hạn mức còn lại"
                  name="remainingLimit"
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
                  <CNumberInput
                    placeholder="Nhập hạn mức còn lại"
                    addonAfter="VND"
                    disabled
                  />
                </Form.Item>
              </Col>
            </Row>
            <div className="bg-white rounded-md mt-7">
              <HistoryChangeDebtLimits
                orgId={String(partnerLimits?.orgId) ?? ''}
                isSearchMode
                title="Lịch sử công nợ"
                onReload={() => {
                  if (id) {
                    getPartnerLimitsId(id);
                  }
                }}
              />
            </div>
          </div>
          <div className="flex gap-4 flex-wrap justify-end mt-7">
            <CButton
              onClick={handleDebtAdjustment}
              icon={<FontAwesomeIcon icon={faPencil} />}
            >
              Điều chỉnh công nợ
            </CButton>
            <CButtonClose onClick={handleClose} />
          </div>
        </Form>
      </Spin>
    </div>
  );
};

export default CreditLimitsDebt;
