import { CButtonClose } from '@react/commons/Button';
import { CNumberInput } from '@react/commons/index';
import { TitleHeader } from '@react/commons/Template/style';
import { Col, Form, Row, Spin } from 'antd';
import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HistoryChangeDebtLimits from '../components/HistoryChangeDebtLimits';
import { useSupportGetPartnerLimitsId } from '../hooks';

const CreditLimitsDebt = ({ view }: { view: boolean }) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const { mutate: getPartnerLimitsId, isPending: loadingPartnerLimitsId } =
    useSupportGetPartnerLimitsId((data) => {
      form.setFieldsValue({
        ...data,
        remainingLimit: data.limitAmount - data.debtTotalAmount,
      });
    });

  useEffect(() => {
    if (view) {
      getPartnerLimitsId();
    }
  }, [view]);
  return (
    <div className="flex flex-col w-full h-full  ">
      <TitleHeader>{'Quản lý công nợ'}</TitleHeader>
      <Spin spinning={loadingPartnerLimitsId}>
        <Form
          form={form}
          labelCol={{ flex: '130px' }}
          labelWrap
          colon={false}
          validateTrigger={['onSubmit']}
        >
          <div className="bg-white rounded-[10px] px-6 pt-4 pb-8">
            <Row gutter={24}>
              <Col span={8}>
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
              <Col span={8}>
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
              <Col span={8}>
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
                isSearchMode
                title="Lịch sử công nợ"
                onReload={() => {
                  if (view) {
                    getPartnerLimitsId();
                  }
                }}
              />
            </div>
          </div>
        </Form>
      </Spin>
    </div>
  );
};

export default CreditLimitsDebt;
