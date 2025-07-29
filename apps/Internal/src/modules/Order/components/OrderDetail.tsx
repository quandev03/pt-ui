import { CDatePicker } from '@react/commons/index';
import CInput from '@react/commons/Input';
import CSelect from '@react/commons/Select';
import CTextArea from '@react/commons/TextArea';
import { ACTION_MODE_ENUM } from '@react/commons/types';
import { formatDate } from '@react/constants/moment';
import { cleanUpString } from '@react/helpers/utils';
import useActionMode from '@react/hooks/useActionMode';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import validateForm from '@react/utils/validator';
import { Col, Form, Row } from 'antd';
import { ParamsOption } from 'apps/Internal/src/components/layouts/types';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import {
  ReasonCodeEnum,
  useListReasonCatalogService,
  useReasonCatalogService,
} from 'apps/Internal/src/hooks/useReasonCatalogService';
import { memo, useEffect, useMemo } from 'react';
import { useArea, useSupportPartnerInfo } from '../queryHooks';
import useOrderStore from '../stores';

const OrderDetail = () => {
  const actionMode = useActionMode();
  const form = Form.useFormInstance();
  const {
    SALE_ORDER_STATUS = [],
    SALE_ORDER_SHIPPING_METHOD = [],
    SALE_ORDER_PAYMENT_OPTION = [],
  } = useGetDataFromQueryKey<ParamsOption>([REACT_QUERY_KEYS.GET_PARAMS]);
  const reasonId = Form.useWatch('reasonId', form);
  const { data: vnskyInfor } = useSupportPartnerInfo({ vnskyInfo: true });
  const optionReason = useListReasonCatalogService(
    actionMode === ACTION_MODE_ENUM.VIEW,
    reasonId,
    ReasonCodeEnum.NPP_CREATE_ORDER
  );

  const optionsWarehouse = useMemo(() => {
    if (SALE_ORDER_STATUS) return SALE_ORDER_STATUS;
    return [];
  }, [SALE_ORDER_STATUS]);
  const provinceCode = Form.useWatch('provinceCode', form);
  const districtCode = Form.useWatch('districtCode', form);
  const {
    provinceSelected,
    setProvinceSelected,
    districtSelected,
    setDistrictSelected,
  } = useOrderStore();

  const { isFetching: loadingProvinces, data: provinces } = useArea(
    'provinces',
    ''
  );
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
  useEffect(() => {
    const province = optionsProvinces.find(
      (item) => item.value === provinceCode
    );
    if (province) {
      setProvinceSelected(province.id.toString());
    }
  }, [
    actionMode,
    form,
    optionsProvinces,
    provinceCode,
    provinces,
    setProvinceSelected,
  ]);

  const { isFetching: loadingDistrict, data: districts } = useArea(
    'districts',
    provinceSelected
  );
  const optionsDistricts = useMemo(() => {
    if (!districts || !provinceCode) {
      return [];
    }
    return districts.map((district) => ({
      label: district.areaName,
      value: district.areaCode,
      id: district.id,
    }));
  }, [districts, provinceCode]);

  useEffect(() => {
    const districtCode = form.getFieldValue('districtCode');
    const district = optionsDistricts.find(
      (item) => item.value === districtCode
    );
    if (district) {
      setDistrictSelected(district.id.toString());
    }
  }, [actionMode, form, districts, setDistrictSelected, optionsDistricts]);

  const { isFetching: loadingArea, data: area } = useArea(
    'area',
    districtSelected
  );
  const optionsArea = useMemo(() => {
    if (!area || !provinceCode || !districtCode) {
      return [];
    }
    return area.map((area) => ({
      label: area.areaName,
      value: area.areaCode,
      id: area.id,
    }));
  }, [area, provinceCode, districtCode]);

  return (
    <Row gutter={[30, 0]}>
      {actionMode === ACTION_MODE_ENUM.VIEW && (
        <Col span={12}>
          <Form.Item
            label="Mã đơn hàng"
            name="orderNo"
            required
            rules={[
              {
                validator(_, value) {
                  if (!value) {
                    return Promise.reject('Không được để trống trường này');
                  } else {
                    return Promise.resolve();
                  }
                },
              },
            ]}
          >
            <CInput disabled />
          </Form.Item>
        </Col>
      )}
      <Col span={12}>
        <Form.Item
          label="Kho xuất"
          required
          rules={[
            {
              validator(_, value) {
                if (!value) {
                  return Promise.reject('Không được để trống trường này');
                } else {
                  return Promise.resolve();
                }
              },
            },
          ]}
        >
          <CInput disabled value={vnskyInfor ? vnskyInfor.orgName : 'VNSKY'} />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label="Kho nhận"
          name="orgName"
          required
          rules={[
            {
              validator(_, value) {
                if (!value) {
                  return Promise.reject('Không được để trống trường này');
                } else {
                  return Promise.resolve();
                }
              },
            },
          ]}
        >
          <CSelect
            placeholder="Chọn kho nhập"
            options={optionsWarehouse}
            disabled
          />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label="Ngày tạo đơn" name="createdDate">
          <CDatePicker disabled format={formatDate} className="w-full" />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label="Hình thức thanh toán"
          name="paymentOption"
          required
          rules={[
            {
              validator(_, value) {
                if (!value) {
                  return Promise.reject('Không được để trống trường này');
                } else {
                  return Promise.resolve();
                }
              },
            },
          ]}
        >
          <CSelect
            options={SALE_ORDER_PAYMENT_OPTION}
            disabled={actionMode === ACTION_MODE_ENUM.VIEW}
          />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label="Hình thức vận chuyển"
          name="shippingMethod"
          required
          rules={[
            {
              validator(_, value) {
                if (!value) {
                  return Promise.reject('Không được để trống trường này');
                } else {
                  return Promise.resolve();
                }
              },
            },
          ]}
        >
          <CSelect
            options={SALE_ORDER_SHIPPING_METHOD}
            disabled={actionMode === ACTION_MODE_ENUM.VIEW}
          />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label="SĐT nhận hàng"
          name="receiverPhone"
          rules={[validateForm.required]}
        >
          <CInput
            disabled={actionMode === ACTION_MODE_ENUM.VIEW}
            placeholder="Nhập SĐT nhận hàng"
            onlyNumber
          />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label="Lý do" name="reasonId">
          <CSelect
            options={optionReason}
            disabled={actionMode === ACTION_MODE_ENUM.VIEW}
          />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label="Địa chỉ giao hàng"
          name="customerAddress"
          required
          rules={[
            {
              validator(_, value) {
                if (!value) {
                  return Promise.reject('Không được để trống trường này');
                } else {
                  return Promise.resolve();
                }
              },
            },
          ]}
        >
          <CInput
            placeholder="Nhập địa chỉ giao hàng"
            maxLength={200}
            disabled={actionMode === ACTION_MODE_ENUM.VIEW}
            onInput={(e: any) =>
              (e.target.value = cleanUpString(e.target.value))
            }
          />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label="Tỉnh/Thành phố" name="provinceCode">
          <CSelect
            placeholder="Nhập Tỉnh/Thành phố"
            options={optionsProvinces}
            disabled={actionMode === ACTION_MODE_ENUM.VIEW}
            loading={loadingProvinces}
            onChange={(_, option: any) => {
              if (option) {
                setProvinceSelected(option.id);
                form.setFieldValue('districtCode', null);
                form.setFieldValue('wardCode', null);
              } else {
                setProvinceSelected('');
                form.setFieldValue('districtCode', null);
                form.setFieldValue('wardCode', null);
              }
            }}
          />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label="Quận/Huyện" name="districtCode">
          <CSelect
            placeholder="Nhập Quận/Huyện"
            options={optionsDistricts}
            loading={loadingDistrict}
            disabled={actionMode === ACTION_MODE_ENUM.VIEW}
            onChange={(_, option: any) => {
              if (option) {
                setDistrictSelected(option.id);
                form.setFieldValue('wardCode', null);
              } else {
                setDistrictSelected('');
                form.setFieldValue('wardCode', null);
              }
            }}
          />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label="Xã/Phường" name="wardCode">
          <CSelect
            placeholder="Nhập Xã/Phường"
            options={optionsArea}
            loading={loadingArea}
            disabled={actionMode === ACTION_MODE_ENUM.VIEW}
          />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label="Ghi chú" name="description">
          <CTextArea
            disabled={actionMode === ACTION_MODE_ENUM.VIEW}
            onBlur={(e) => {
              const value = form.getFieldValue('description');
              form.setFieldValue('description', cleanUpString(value));
            }}
            maxLength={200}
          />
        </Form.Item>
      </Col>
    </Row>
  );
};

export default memo(OrderDetail);
