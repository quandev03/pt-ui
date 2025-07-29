import CInput from '@react/commons/Input';
import CSelect from '@react/commons/Select';
import { ActionType } from '@react/constants/app';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import validateForm from '@react/utils/validator';
import { Col, Form, Row } from 'antd';
import { ParamsOption } from 'apps/Internal/src/components/layouts/types';
import CadastralSelect from 'apps/Internal/src/components/Select/CadastralSelect';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { OrgUnitType } from 'apps/Internal/src/hooks/useListOrgPartnerPublic';
import { FC } from 'react';
import { useSerialNew } from '../../../hooks/useSerialNew';
import useStoreListOfRequestsChangeSim from '../../../store';
import { ReceiptMethodType } from '../../../types';
import { SimTypeEnum } from './ChangeSim';
import { StatusChangeSimEnum } from '../../../hooks/useView';

type Props = {
  typeModal: ActionType;
};

const ConsigneeInfor: FC<Props> = ({ typeModal }) => {
  const form = Form.useFormInstance();
  const simType = Form.useWatch('simType', form);
  const requestType = Form.useWatch('requestType', form);
  const status = Form.useWatch('status', form);
  const receiptMethod = Form.useWatch('receiptMethod', form);

  const listOrgUnit =
    useGetDataFromQueryKey<OrgUnitType[]>([
      'organization-unit/addresses',
      {
        'org-type': 'NBO',
        'org-sub-type': '04',
      },
    ]) ?? [];

  const { mutate: mutateSerialNew } = useSerialNew();

  const getSerialNew = ({ stockIdNew, simTypeNew }: any) => {
    const stockIdCheck = stockIdNew;
    const simTypeCheck = simTypeNew || simType;
    if (stockIdCheck && simTypeCheck) {
      mutateSerialNew({
        stockId: stockIdCheck,
        simType: simTypeCheck,
      });
    }
  };

  const { disableForm } = useStoreListOfRequestsChangeSim();
  const {
    SERVICE_SHIPPING_METHOD = [],
    CHANGE_SIM_ONLINE_RECEIVE_METHOD = [],
    CHANGE_SIM_ONLINE_DELIVERY_METHOD = [],
  } = useGetDataFromQueryKey<ParamsOption>([REACT_QUERY_KEYS.GET_PARAMS]);

  const onlineChangeSim = requestType !== 'BCSS';
  const disabledField =
    (!onlineChangeSim || status !== 0) && //  0 Chưa xử lý
    (disableForm || typeModal === ActionType.VIEW);

  if (simType === SimTypeEnum.PhysicalSim)
    return (
      <fieldset className="bg-white">
        <legend>Thông tin người nhận hàng</legend>

        <Row gutter={12}>
          <Col span={12}>
            <Form.Item
              label="Họ và tên người nhận"
              name="receiverName"
              rules={[validateForm.required]}
            >
              <CInput
                placeholder="Nhập họ và tên người nhận"
                maxLength={200}
                disabled={disabledField}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={
                onlineChangeSim
                  ? 'Số điện thoại nhận hàng'
                  : 'Số điện thoại liên hệ'
              }
              name="receiverPhone"
              dependencies={['isdn']}
              rules={[
                validateForm.required,
                {
                  min: 10,
                  message: 'Số thuê bao không đúng định dạng',
                },
                {
                  max: 11,
                  message: 'Số thuê bao không đúng định dạng',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || !value.includes(getFieldValue('isdn'))) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        'Thông tin số điện thoại liên hệ phải khác thông tin số đổi SIM'
                      )
                    );
                  },
                }),
              ]}
            >
              <CInput
                placeholder={
                  onlineChangeSim
                    ? 'Nhập số điện thoại nhận hàng'
                    : 'Nhập số điện thoại liên hệ'
                }
                maxLength={12}
                onlyNumber
                disabled={disabledField}
              />
            </Form.Item>
          </Col>
          {onlineChangeSim && (
            <Col span={12}>
              <Form.Item
                label="Hình thức nhận hàng"
                name="receiptMethod"
                rules={[validateForm.required]}
              >
                <CSelect
                  disabled={disabledField}
                  options={CHANGE_SIM_ONLINE_RECEIVE_METHOD}
                  placeholder="Hình thức nhận hàng"
                  allowClear={false}
                  onChange={() => {
                    form.setFieldsValue({
                      stockId: null,
                      serial: '',
                    });
                  }}
                />
              </Form.Item>
            </Col>
          )}
          {simType === SimTypeEnum.PhysicalSim &&
            onlineChangeSim &&
            receiptMethod === ReceiptMethodType.HOME && (
              <Col span={12}>
                <Form.Item
                  label="Hình thức vận chuyển"
                  name="deliveryMethod"
                  rules={[validateForm.required]}
                >
                  <CSelect
                    disabled={disabledField}
                    options={
                      onlineChangeSim
                        ? CHANGE_SIM_ONLINE_DELIVERY_METHOD
                        : SERVICE_SHIPPING_METHOD
                    }
                    placeholder="Hình thức vận chuyển"
                    allowClear={false}
                  />
                </Form.Item>
              </Col>
            )}
          {(receiptMethod === ReceiptMethodType.HOME ||
            typeModal === ActionType.ADD ||
            (requestType === 'BCSS' &&
              simType === SimTypeEnum.PhysicalSim)) && (
            <Col span={12}>
              <Form.Item
                label="Địa chỉ nhận hàng"
                name="receiverAddress"
                rules={[validateForm.required]}
              >
                <CInput
                  placeholder="Địa chỉ nhận hàng"
                  maxLength={255}
                  disabled={disabledField}
                />
              </Form.Item>
            </Col>
          )}
          {(receiptMethod === ReceiptMethodType.HOME ||
            typeModal === ActionType.ADD ||
            (requestType === 'BCSS' &&
              simType === SimTypeEnum.PhysicalSim)) && (
            <CadastralSelect
              disabled={
                requestType === 'BCSS'
                  ? simType === SimTypeEnum.PhysicalSim
                    ? typeModal === ActionType.ADD
                      ? false
                      : true
                    : true
                  : status === StatusChangeSimEnum.REJECTED ||
                    status === StatusChangeSimEnum.APPROVED
              }
              col={{
                props: {
                  span: 12,
                },
              }}
              formName={{
                province: 'province',
                district: 'district',
                village: 'precinct',
              }}
            />
          )}
          {receiptMethod === ReceiptMethodType.SHOP && (
            <Col span={12}>
              <Form.Item
                label="Địa chỉ nhận hàng"
                name="storeAddress"
                rules={[validateForm.required]}
              >
                <CSelect
                  disabled={disabledField}
                  fieldNames={{ label: 'fullAddress', value: 'fullAddress' }}
                  options={listOrgUnit}
                  placeholder="Địa chỉ nhận hàng"
                  allowClear={false}
                  onChange={(value, option: any) => {
                    form.setFieldsValue({
                      stockId: option?.orgId,
                    });
                    getSerialNew({ stockIdNew: option?.orgId });
                  }}
                />
              </Form.Item>
            </Col>
          )}

          <Col span={12}>
            <Form.Item label="Phí ship" name="ship" initialValue={0}>
              <CInput placeholder="Phí ship" maxLength={10} disabled />
            </Form.Item>
          </Col>
        </Row>
      </fieldset>
    );
};

export default ConsigneeInfor;
