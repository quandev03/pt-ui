import CInput from '@react/commons/Input';
import CSelect from '@react/commons/Select';
import { ACTION_MODE_ENUM } from '@react/commons/types';
import useActionMode from '@react/hooks/useActionMode';
import { Col, Form, Row } from 'antd';
import { useArea } from 'apps/Internal/src/hooks/useArea';
import { useEffect, useMemo } from 'react';
import usePartnerStore from '../stores';
import validateForm from '@react/utils/validator';

const Address = () => {
  const actionMode = useActionMode();
  const form = Form.useFormInstance();
  const provinceCode = Form.useWatch('provinceCode', form);
  const districtCode = Form.useWatch('districtCode', form);
  const {
    provinceSelected,
    districtSelected,
    setDistrictSelected,
    setProvinceSelected,
  } = usePartnerStore();

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

  const { isFetching: loadingDistrict, data: districts } = useArea(
    'districts',
    provinceSelected
  );
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

  const { isFetching: loadingArea, data: area } = useArea(
    'area',
    districtSelected
  );
  const optionsArea = useMemo(() => {
    if (!area || !districtSelected || !provinceSelected) {
      return [];
    }
    return area.map((area) => ({
      label: area.areaName,
      value: area.areaCode,
      id: area.id,
    }));
  }, [area, provinceSelected, districtSelected]);

  useEffect(() => {
    if (actionMode === ACTION_MODE_ENUM.VIEW && optionsProvinces.length > 0) {
      const province = optionsProvinces.find((p) => p.value === provinceCode);
      if (province) {
        setProvinceSelected(province.id.toString());
      }
    }
  }, [actionMode, optionsProvinces, provinceCode]);

  useEffect(() => {
    if (actionMode === ACTION_MODE_ENUM.VIEW && optionsDistricts.length > 0) {
      const district = optionsDistricts.find((p) => p.value === districtCode);
      if (district) {
        setDistrictSelected(district.id.toString());
      }
    }
  }, [actionMode, optionsDistricts, districtCode]);

  const requiredWardCode = useMemo(() => {
    if (!!districtCode && optionsArea.length === 0) {
      return false;
    }
    return true;
  }, [districtSelected, optionsArea]);

  return (
    <div className="border rounded-md p-5 relative">
      <div className="text-lg !text-[#076AB3] font-bold bg-white absolute -top-[15px]">
        <div>Địa chỉ nhận hàng</div>
      </div>
      <Row gutter={[40, 0]}>
        <Col span={12}>
          <Form.Item
            label="Địa chỉ"
            name="address"
            required
            labelCol={{ span: 5 }}
            rules={[validateForm.required]}
          >
            <CInput
              placeholder="Nhập địa chỉ "
              maxLength={250}
              disabled={actionMode === ACTION_MODE_ENUM.VIEW}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Tỉnh/Thành phố"
            name="provinceCode"
            required
            labelCol={{ span: 5 }}
            rules={[validateForm.required]}
          >
            <CSelect
              placeholder="Chọn Tỉnh/Thành phố"
              options={optionsProvinces}
              loading={loadingProvinces}
              disabled={actionMode === ACTION_MODE_ENUM.VIEW}
              onChange={(_, option: any) => {
                if (option) {
                  setProvinceSelected(option.id);
                  setDistrictSelected('');
                } else {
                  setProvinceSelected('');
                }
                form.setFieldValue('districtCode', null);
                form.setFieldValue('wardCode', null);
              }}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Quận/Huyện"
            name="districtCode"
            required
            labelCol={{ span: 5 }}
            rules={[validateForm.required]}
          >
            <CSelect
              placeholder="Chọn Quận/Huyện"
              options={optionsDistricts}
              loading={loadingDistrict}
              disabled={actionMode === ACTION_MODE_ENUM.VIEW}
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
            required={requiredWardCode}
            labelCol={{ span: 5 }}
            rules={[
              {
                validator(_, value) {
                  if (!value && requiredWardCode) {
                    return Promise.reject('Không được để trống trường này');
                  } else {
                    return Promise.resolve();
                  }
                },
              },
            ]}
          >
            <CSelect
              placeholder="Chọn Phường/Xã"
              options={optionsArea}
              loading={loadingArea}
              disabled={actionMode === ACTION_MODE_ENUM.VIEW}
            />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
};

export default Address;
