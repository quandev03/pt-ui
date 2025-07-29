/* eslint-disable @typescript-eslint/no-empty-function */
import { Form } from 'antd';
import validateForm from '@react/utils/validator';
import { memo, useEffect } from 'react';
import {
  Cadastral,
  useArea,
} from 'apps/Internal/src/modules/ListOfDepartment/queryHook/useArea';
import Select from '@react/commons/Select';

interface CadastralSelectProps {
  required?: boolean;
  formName: {
    province: string;
    district: string;
    village: string;
  };
  prefixLabel?: string;
  disabled?: boolean;
  onChangeProp: () => void;
}

const CadastralSelect: React.FC<CadastralSelectProps> = memo(
  ({
    required = true,
    formName,
    prefixLabel = '',
    disabled = false,
    onChangeProp,
  }) => {
    const form = Form.useFormInstance();
    const provinceCode = Form.useWatch(formName.province, form);
    const districtCode = Form.useWatch(formName.district, form);
    const villageCode = Form.useWatch(formName.village, form);
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
      getMutateProvinces('');
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      if (provinceCode) {
        const area = optionsProvinces?.filter(
          (item: Cadastral) => item.areaCode === provinceCode
        )[0];
        if (!area) return;
        if (formName.province === 'transfereeCity') {
          form.setFieldsValue({
            ccdvvt: area.providerAreaCode,
          });
        }
        else{
          form.setFieldsValue({
            ccdvvtOwnershipTransfer: area.providerAreaCode,
          });
        }
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
            filterOption={(input, options: any) =>
              (options?.areaName ?? '')
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            showSearch
            onChange={(value, option: any) => {
              onChangeProp();
              if (!option?.id) {
                getMutateDistrict(undefined);
              }
              getMutateWard(undefined);
              form.resetFields([formName.district]);
              form.resetFields([formName.village]);
            }}
            disabled={disabled}
          />
        </Form.Item>

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
            onChange={(value, option: any) => {
              onChangeProp();
              form.resetFields([formName.village]);
              if (!option?.id) {
                getMutateWard(undefined);
              }
            }}
            disabled={disabled}
          />
        </Form.Item>

        <Form.Item
          label={`${prefixLabel} Xã/ Phường`}
          name={formName.village}
          rules={
            required && optionsWard?.length
              ? [validateForm.required]
              : undefined
          }
        >
          <Select
            loading={loadingWard}
            fieldNames={{ label: 'areaName', value: 'areaCode' }}
            placeholder={`${prefixLabel} Xã/ Phường`}
            filterOption={(input, options: any) =>
              (options?.areaName ?? '')
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            options={optionsWard as any}
            showSearch
            onChange={() => onChangeProp()}
            disabled={disabled}
          />
        </Form.Item>
        <Form.Item label="" name="ccdvvt" hidden></Form.Item>
      </>
    );
  }
);

export default CadastralSelect;
