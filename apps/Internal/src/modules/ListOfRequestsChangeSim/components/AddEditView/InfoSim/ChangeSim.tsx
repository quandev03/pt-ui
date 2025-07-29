import { faRotateRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CButton from '@react/commons/Button';
import CInput from '@react/commons/Input';
import CSelect from '@react/commons/Select';
import CTextArea from '@react/commons/TextArea';
import { ActionType } from '@react/constants/app';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import { MESSAGE } from '@react/utils/message';
import validateForm from '@react/utils/validator';
import { Col, Form, Row } from 'antd';
import { ParamsOption } from 'apps/Internal/src/components/layouts/types';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import {
  queryKeyGetOrgUnitByUser,
  useGetOrgByUser,
} from 'apps/Internal/src/hooks/useGetOrgByUser';
import { useReasonCustomerService } from 'apps/Internal/src/hooks/useReasonList';
import { ReasonChangeSimEnum } from 'apps/Internal/src/modules/ListOfRequestsChangeSim/hooks/useGenContractChangeSim';
import useStoreListOfRequestsChangeSim from 'apps/Internal/src/modules/ListOfRequestsChangeSim/store';
import { FC, useEffect, useMemo, useState } from 'react';
import { useSerialNew } from '../../../hooks/useSerialNew';
import {
  OrganizationUnitTypeEnum,
  OrgSubTypeEnum,
  ReceiptMethodType,
} from '../../../types';
import { payStatusOptions } from '../../Header';
import { OrgUnitType } from '../../../hooks/useListOrgUnit';
import { useGetAllOrganizationUnitActive } from '../../../hooks/useGetAllOrganizationUnitActive';
import Show from '@react/commons/Template/Show';

export enum SimTypeEnum {
  PhysicalSim = '1',
  Esim = '2',
}
type Props = {
  typeModal: ActionType;
};

const ChangeSim: FC<Props> = ({ typeModal }) => {
  const form = Form.useFormInstance();
  const simType = Form.useWatch('simType', form);
  const reason = Form.useWatch('reason', form);
  const stockId = Form.useWatch('stockId', form);
  const status = Form.useWatch('status', form);
  const requestType = Form.useWatch('requestType', form);
  const enableResetSerial = Form.useWatch('enableResetSerial', form);
  const receiptMethod = Form.useWatch('receiptMethod', form);
  const { disableForm, setIsPendingSerialNew } =
    useStoreListOfRequestsChangeSim();
  const onlineChangeSim = requestType !== 'BCSS';
  const disabledField =
    (!onlineChangeSim || status !== 0) && //  0 Chưa xử lý
    (disableForm || typeModal === ActionType.VIEW);
  const { data: orgByUser } = useGetOrgByUser();
  const {
    COMBINE_KIT_SIM_TYPE = [],
    SERVICE_SHIPPING_METHOD = [],
    CHANGE_SIM_ONLINE_DELIVERY_METHOD = [],
    ORGANIZATION_UNIT_ORG_SUB_TYPE = [],
  } = useGetDataFromQueryKey<ParamsOption>([REACT_QUERY_KEYS.GET_PARAMS]);

  const { data: dataReason } = useReasonCustomerService(
    onlineChangeSim ? 'CHANGE_SIM_ONLINE' : 'CHANGE_SIM'
  );
  const [orgType, setOrgType] = useState<string>('');
  const { data: allOrganizationUnitActive = [] } =
    useGetAllOrganizationUnitActive(orgType);
  const listOrgUnitAddresses =
    useGetDataFromQueryKey<OrgUnitType[]>([
      'organization-unit/addresses',
      {
        'org-type': 'NBO',
        'org-sub-type': '04',
      },
    ]) ?? [];

  const { mutate: mutateSerialNew, isPending: isPendingSerialNew } =
    useSerialNew();

  const getSerialNew = ({ stockIdNew, simTypeNew }: any) => {
    const stockIdCheck = stockIdNew || stockId;
    const simTypeCheck = simTypeNew || simType;
    if (stockIdCheck && simTypeCheck) {
      mutateSerialNew({
        stockId: stockIdCheck,
        simType: simTypeCheck,
      });
    }
  };
  const optionStock = useMemo(() => {
    if (
      (receiptMethod === ReceiptMethodType.HOME &&
        simType === SimTypeEnum.PhysicalSim &&
        onlineChangeSim) ||
      (simType === SimTypeEnum.PhysicalSim && !receiptMethod && onlineChangeSim)
    ) {
      return orgByUser?.map((item) => ({
        label: item.orgName,
        value: item.orgId,
      }));
    } else if (
      (orgType === OrganizationUnitTypeEnum.ESIM_ONLINE && onlineChangeSim) ||
      (orgType === OrganizationUnitTypeEnum.STORE && onlineChangeSim)
    ) {
      return allOrganizationUnitActive;
    } else if (!onlineChangeSim) {
      return orgByUser?.map((item) => ({
        label: item.orgName,
        value: item.orgId,
      }));
    }
    return [];
  }, [
    orgByUser,
    simType,
    receiptMethod,
    allOrganizationUnitActive,
    onlineChangeSim,
  ]);
  useEffect(() => {
    if (
      simType === SimTypeEnum.PhysicalSim &&
      receiptMethod === ReceiptMethodType.SHOP
    ) {
      const orgSubType = ORGANIZATION_UNIT_ORG_SUB_TYPE.find(
        (item) => item.value === OrganizationUnitTypeEnum.STORE
      );
      setOrgType(String(orgSubType?.value ?? ''));
    } else if (simType === SimTypeEnum.Esim && onlineChangeSim) {
      const orgSubType = ORGANIZATION_UNIT_ORG_SUB_TYPE.find(
        (item) => item.value === OrganizationUnitTypeEnum.ESIM_ONLINE
      );
      setOrgType(String(orgSubType?.value ?? ''));
    }
  }, [simType, receiptMethod, ORGANIZATION_UNIT_ORG_SUB_TYPE]);
  useEffect(() => {
    setIsPendingSerialNew(isPendingSerialNew);
  }, [isPendingSerialNew, setIsPendingSerialNew]);
  return (
    <fieldset className="bg-white">
      <legend>Thông tin đổi SIM</legend>

      <Row gutter={12}>
        <Col span={12}>
          <Form.Item
            label="Kênh đổi SIM"
            name="requestType"
            rules={[validateForm.required]}
          >
            <CInput
              placeholder="Kênh đổi SIM"
              disabled
              // value={onlineChangeSim ? 'Web,App' : 'BCSS'}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Loại mặt hàng"
            name="simType"
            rules={[validateForm.required]}
          >
            <CSelect
              options={COMBINE_KIT_SIM_TYPE}
              placeholder="Loại mặt hàng"
              allowClear={false}
              disabled={disabledField}
              onChange={(value) => {
                getSerialNew({ simTypeNew: value });
                if (value === SimTypeEnum.Esim) {
                  form.setFieldsValue({
                    receiverName: '',
                    receiverPhone: '',
                    receiverAddress: '',
                    storeAddress: '',
                    province: null,
                    district: null,
                    precinct: null,
                    provinceName: '',
                    deliveryMethod: '',
                  });
                }
                if (value === SimTypeEnum.PhysicalSim) {
                  form.setFieldsValue({
                    deliveryMethod: 'FAST', //Chuyển phát nhanh
                  });
                  form.validateFields(['email']);
                }
              }}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={12}>
        <Col span={12}>
          <Form.Item
            label="Mã kho"
            name="stockId"
            rules={[validateForm.required]}
          >
            <CSelect
              disabled={disabledField}
              options={optionStock}
              placeholder="Mã kho"
              allowClear={false}
              onChange={(value) => {
                const item = listOrgUnitAddresses.find(
                  (item) => item.orgId === value
                );

                if (item) {
                  form.setFieldsValue({
                    storeAddress: item.fullAddress,
                  });
                }
                getSerialNew({ stockIdNew: value });
              }}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Serial SIM mới"
            name="serial"
            rules={[validateForm.required]}
          >
            <CInput
              placeholder="Serial SIM mới"
              disabled
              addonAfter={
                <CButton type="text" size="small" disabled={!enableResetSerial}>
                  <FontAwesomeIcon
                    onClick={() =>
                      mutateSerialNew({
                        stockId,
                        simType,
                      })
                    }
                    icon={faRotateRight}
                    size="lg"
                  />
                </CButton>
              }
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={12}>
        <Col span={12}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: simType === SimTypeEnum.Esim ? true : false,
                message: MESSAGE.G06,
              },
              validateForm.email,
            ]}
          >
            <CInput
              placeholder="Email"
              disabled={disabledField}
              maxLength={200}
            />
          </Form.Item>
        </Col>
        <Show.When isTrue={typeModal === ActionType.VIEW}>
          <Col span={12}>
            <Form.Item label="SĐT đổi SIM" name="isdn">
              <CInput
                placeholder="SĐT đổi SIM"
                disabled={true}
                maxLength={200}
              />
            </Form.Item>
          </Col>
        </Show.When>
        <Col span={12}>
          {simType === SimTypeEnum.PhysicalSim && !onlineChangeSim && (
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
          )}
        </Col>
      </Row>
      <Row gutter={12}>
        {onlineChangeSim &&
          (simType === SimTypeEnum.Esim || requestType !== 'BCSS') && (
            <Col span={12}>
              <Form.Item
                label="Số điện thoại liên hệ"
                name="phoneNumber"
                dependencies={['isdn']}
                rules={[
                  validateForm.required,
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
                <CInput onlyNumber disabled={disabledField} maxLength={12} />
              </Form.Item>
            </Col>
          )}
        <Col span={12}>
          <Form.Item
            label="Lý do đổi SIM"
            name="reason"
            rules={[validateForm.required]}
          >
            <CSelect
              disabled={disabledField}
              allowClear={false}
              placeholder="Lý do đổi SIM"
              options={dataReason}
              fieldNames={{ label: 'name', value: 'code' }}
              optionRender={(oriOption) =>
                oriOption.label + '(' + oriOption.value + ')'
              }
              filterOption={(input, options: any) =>
                (options?.name ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              onChange={(value, option: any) => {
                form.setFieldsValue({
                  isFreeSim: option.isFreeSim,
                });
                if (option.isFreeSim === true) {
                  form.setFieldsValue({
                    feeAmount: 0,
                  });
                } else {
                  form.setFieldsValue({
                    feeAmount: form.getFieldValue('feeAmountCache'),
                  });
                }
              }}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Phí thay đổi SIM" name="feeAmount">
            <CInput placeholder="Phí thay đổi SIM" disabled />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Mã đơn hàng" name="saleOrderNo">
            <CInput placeholder="Mã đơn hàng" disabled />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Trạng thái thanh toán"
            name="payStatus"
            initialValue={'0'}
          >
            <CSelect
              disabled
              allowClear={false}
              placeholder="Trạng thái thanh toán"
              options={payStatusOptions}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          {reason === ReasonChangeSimEnum.other && (
            <Form.Item
              label="Ghi chú"
              name="note"
              rules={[validateForm.required]}
            >
              <CTextArea
                maxLength={255}
                rows={1}
                placeholder="Nhập ghi chú"
                disabled={disabledField}
              />
            </Form.Item>
          )}
        </Col>
      </Row>
      <Form.Item label="" name="newImsi" hidden />
      <Form.Item label="" name="feeAmountCache" hidden />
      <Form.Item label="" name="lpaData" hidden />
      <Form.Item label="" name="enableResetSerial" hidden />
      <Form.Item label="" name="requestType" hidden />
      <Form.Item label="" name="uuid" hidden />
      <Form.Item label="" name="isFreeSim" hidden />
    </fieldset>
  );
};

export default ChangeSim;
