import { Col, Form, Row } from 'antd';
import { CInput } from '../../../../../../commons/src/lib/commons';
import { useActiveSubscriptStore } from '../store';
import { useGenCustomerCode } from '../queryHook/useGenCustomerCode';
import { useEffect } from 'react';
import { ActionType } from '@react/constants/app';
import { useGetND13 } from '../queryHook/useGetND13';
import { useCheckSerialSim } from '../queryHook/useCheckSerialSim';

type Props = {
  typeModal: ActionType;
  isFromApprove: boolean;
};

const CustomerInfo: React.FC<Props> = ({ typeModal, isFromApprove }) => {
  const form = Form.useFormInstance();
  const { dataActivationRequest } = useActiveSubscriptStore();
  console.log('dataActivationRequest', dataActivationRequest);
  const { mutate: mutateCheckSerialSim } = useCheckSerialSim(form);

  useEffect(() => {
    if (typeModal === ActionType.EDIT) {
      setTimeout(() => {
        form.validateFields(['phone', 'serialSim']).then((value) => {
          mutateCheckSerialSim({
            serial: value.serialSim,
            isdn: value.phone.substring(1),
          });
        });
      }, 2000);
    }
  }, []);

  return (
    <fieldset>
      <legend>Thông tin khách hàng</legend>
      <Row gutter={12}>
        <Col span={12}>
          <Form.Item
            label="Số hợp đồng/BBXN"
            name="contractNo"
            rules={[
              {
                required: true,
              },
            ]}
            hidden
          >
            <CInput disabled={true} placeholder="Số hợp đồng" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Mã KH"
            name="customerCode"
            // rules={[{ required: true }]}
            hidden
          >
            <CInput disabled={true} placeholder="Mã khách hàng" />
          </Form.Item>
        </Col>
        {isFromApprove && (
          <>
            <Col span={12}>
              <Form.Item label="Tên NVPT" name="empName">
                <CInput disabled={true} placeholder="Tên NVPT" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="User PT" name="empUser">
                <CInput disabled={true} placeholder="User PT" />
              </Form.Item>
            </Col>
          </>
        )}
        <Col span={12}>
          <Form.Item
            label="Số thuê bao"
            name="phone"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <CInput
              disabled={true}
              placeholder="Số thuê bao"
              onlyNumber
              maxLength={10}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Serial SIM"
            name="serialSim"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <CInput
              disabled={true}
              placeholder="Số serial SIM"
              onlyNumber
              maxLength={16}
            />
          </Form.Item>
        </Col>
      </Row>
      <div className="hidden">
        <Form.Item label="" name="pkName" />
      </div>
    </fieldset>
  );
};

export default CustomerInfo;
