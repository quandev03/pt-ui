/* eslint-disable @typescript-eslint/no-empty-function */
import { Col, Form, Select } from 'antd';
import validateForm from '@react/utils/validator';
import { memo, useEffect } from 'react';
import {
  Cadastral,
  useArea,
} from 'apps/Internal/src/modules/ListOfDepartment/queryHook/useArea';
import { ISubDocument } from '../types';

interface CadastralSelectProps {
  col?: any;
  required?: boolean;
  formName: {
    province: string;
    district: string;
    village: string;
  };
  prefixLabel?: string;
  isEditing?: boolean;
  subDocDetail: ISubDocument | undefined;
}

const CadastralSelect: React.FC<CadastralSelectProps> = memo(
  ({
    col,
    required = true,
    formName,
    prefixLabel = '',
    isEditing = true,
    subDocDetail,
  }) => {
    const form = Form.useFormInstance();
    const provinceCode = Form.useWatch(formName.province, form);
    const districtCode = Form.useWatch(formName.district, form);

    const {
      isPending: loadingProvinces,
      data: optionsProvinces,
      mutate: getMutateProvinces,
    } = useArea();
    const {
      isPending: loadingDistrict,
      data: optionsDistrict,
      mutate: getMutateDistrict,
    } = useArea();
    const {
      isPending: loadingWard,
      data: optionsWard,
      mutate: getMutateWard,
    } = useArea();
    useEffect(() => {
      if (subDocDetail) {
        form.setFieldsValue({
          [formName.province]: subDocDetail.city,
          [formName.district]: subDocDetail.district,
          [formName.village]: subDocDetail.ward,
        });
      }
    }, [subDocDetail]);
    useEffect(() => {
      getMutateProvinces('');
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      if (provinceCode && optionsProvinces) {
        const area = optionsProvinces.filter(
          (item: Cadastral) => item.areaCode === provinceCode
        )[0];
        if (!area) return;
        form.setFieldsValue({
          ccdvvt: area.providerAreaCode,
        });
        getMutateDistrict(area.id);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [optionsProvinces, provinceCode]);

    useEffect(() => {
      if (districtCode) {
        const areaId = optionsDistrict?.filter(
          (item: Cadastral) => item.areaCode === districtCode
        )[0]?.id;
        if (!areaId) return;
        getMutateWard(areaId);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [optionsDistrict, districtCode]);

    return (
      <>
        <Col {...col.props}>
          <Form.Item
            label={`${prefixLabel} Tỉnh/ TP`}
            name={formName.province}
            rules={required ? [validateForm.required] : undefined}
          >
            <Select
              loading={loadingProvinces}
              fieldNames={{ label: 'areaName', value: 'areaCode' }}
              placeholder={`${prefixLabel} Tỉnh/ TP`}
              options={optionsProvinces as any}
              disabled={!isEditing}
              filterOption={(input, options: any) =>
                (options?.areaName ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              showSearch
              onChange={() => {
                form.resetFields([formName.district]);
                form.resetFields([formName.village]);
              }}
            />
          </Form.Item>
        </Col>
        <Col {...col.props}>
          <Form.Item
            label={`${prefixLabel} Quận/ Huyện`}
            name={formName.district}
            rules={required ? [validateForm.required] : undefined}
          >
            <Select
              loading={loadingDistrict}
              fieldNames={{ label: 'areaName', value: 'areaCode' }}
              placeholder={`${prefixLabel} Quận/ Huyện`}
              options={optionsDistrict as any}
              filterOption={(input, options: any) =>
                (options?.areaName ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              showSearch
              disabled={!isEditing}
              onChange={() => form.resetFields([formName.village])}
            />
          </Form.Item>
        </Col>
        <Col {...col.props}>
          <Form.Item
            label={`${prefixLabel} Xã/ Phường`}
            name={formName.village}
            rules={
              optionsWard && optionsWard?.length > 0
                ? [validateForm.required]
                : undefined
            }
          >
            <Select
              fieldNames={{ label: 'areaName', value: 'areaCode' }}
              placeholder={`${prefixLabel} Xã/ Phường`}
              filterOption={(input, options: any) =>
                (options?.areaName ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={optionsWard as any}
              showSearch
              disabled={!isEditing}
              loading={loadingWard}
            />
          </Form.Item>
        </Col>
        <Form.Item label="" name="ccdvvt" hidden></Form.Item>
      </>
    );
  }
);

export default CadastralSelect;
