import { Col, Form, Select } from 'antd';
import { memo, useEffect, useState } from 'react';
import {
  CadastralRequest,
  CadastralType,
  useCadastralQuery,
} from '../../hooks/useCadastralQuery';
import validateForm from '@react/utils/validator';

interface CadastralSelectProps {
  col?: any;
  required?: boolean;
  disabled?: boolean;
  formName: {
    province: string;
    district: string;
    village: string;
  };
}

const CadastralSelect: React.FC<CadastralSelectProps> = memo(
  ({ col, required = true, disabled, formName }) => {
    const [params, setParams] = useState<CadastralRequest>({
      type: CadastralType.PROVINCE,
    });
    const form = Form.useFormInstance();
    const provinceCode = Form.useWatch(formName.province, form);
    const districtCode = Form.useWatch(formName.district, form);

    const { provinces, districts, villages } = useCadastralQuery(params);

    useEffect(() => {
      if (provinces.length && provinceCode) {
        const area = provinces.find(
          ({ areaCode }) => areaCode === provinceCode
        );
        setParams({ type: CadastralType.DISTRICT, parentId: area?.id });
        form.setFieldsValue({
          provinceName: area?.areaName,
        });
      }
    }, [provinces, provinceCode]);

    useEffect(() => {
      if (districts.length && districtCode) {
        const parentId = districts.find(
          ({ areaCode }) => areaCode === districtCode
        );
        setParams({ type: CadastralType.VILLAGE, parentId: parentId?.id });
      }
    }, [districts, districtCode]);

    const handleChangeProvince = () => {
      form.resetFields([formName.district]);
      form.resetFields([formName.village]);
    };

    const handleChangeDistrict = () => {
      form.resetFields([formName.village]);
      setParams({ type: CadastralType.VILLAGE, parentId: '' });
    };

    return (
      <>
        <Col {...col.props}>
          <Form.Item
            label="Tỉnh/ TP"
            name={formName.province}
            rules={required ? [validateForm.required] : undefined}
          >
            <Select
              placeholder="Tỉnh/ TP"
              options={provinces?.map((item) => ({
                label: item.areaName,
                value: item.areaCode,
              }))}
              optionFilterProp="label"
              onChange={handleChangeProvince}
              showSearch
              allowClear
              disabled={disabled}
            />
          </Form.Item>
        </Col>
        <Col {...col.props}>
          <Form.Item
            label="Quận/ Huyện"
            name={formName.district}
            rules={required ? [validateForm.required] : undefined}
          >
            <Select
              placeholder="Quận/ Huyện"
              options={districts?.map((item) => ({
                label: item.areaName,
                value: item.areaCode,
              }))}
              optionFilterProp="label"
              onChange={handleChangeDistrict}
              showSearch
              allowClear
              disabled={!provinceCode || disabled}
            />
          </Form.Item>
        </Col>
        <Col {...col.props}>
          <Form.Item
            label="Phường/ Xã"
            name={formName.village}
            rules={
              villages.length > 0 && required
                ? [validateForm.required]
                : undefined
            }
          >
            <Select
              placeholder="Phường/ Xã"
              options={villages?.map((item) => ({
                label: item.areaName,
                value: item.areaCode,
              }))}
              optionFilterProp="label"
              showSearch
              allowClear
              disabled={!districtCode || disabled}
            />
          </Form.Item>
        </Col>
        <Form.Item label="" name="provinceName" hidden></Form.Item>
      </>
    );
  }
);

export default CadastralSelect;
