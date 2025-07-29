import { FC, useEffect, useState } from 'react';

import CDatePicker from '@react/commons/DatePicker';
import {
  CSelect,
  CSwitch,
  CTextArea,
  CUploadFileTemplate,
} from '@react/commons/index';
import CInput from '@react/commons/Input';
import { ActionType, FILE_TYPE } from '@react/constants/app';
import validateForm from '@react/utils/validator';
import { Col, Form, Row } from 'antd';
import {
  useGetPdf,
  useGetPdfBlob,
} from 'apps/Internal/src/components/layouts/queryHooks';
import CadastralSelect from 'apps/Internal/src/components/Select/CadastralSelect';
import { useGetAllAmEmployee } from 'apps/Internal/src/modules/BusinessManagement/hooks/useGetAllAmEmployee';
import { useSaleList } from 'apps/Internal/src/modules/EnterpriseCatalogSaleAM/queryHook/useListSale';

import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import { RangePickerProps } from 'antd/es/date-picker';
import { IUserInfo } from 'apps/Internal/src/components/layouts/types';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import useStoreBusinessManagement from 'apps/Internal/src/modules/BusinessManagement/store';
import dayjs, { Dayjs } from 'dayjs';
import ModalPdf from '../../ModalPdf';

type Props = {
  typeModal: ActionType;
};

const InfoBusiness: FC<Props> = ({ typeModal }) => {
  const form = Form.useFormInstance();
  const currentUser = useGetDataFromQueryKey<IUserInfo>([
    REACT_QUERY_KEYS.GET_PROFILE,
  ]);
  const { positionCode, changedFields } = useStoreBusinessManagement();

  const licenseFilePath = Form.useWatch('licenseFilePath', form);
  const contractFilePath = Form.useWatch('contractFilePath', form);
  const originalLicenseName = Form.useWatch('originalLicenseName', form);
  const originalContractName = Form.useWatch('originalContractName', form);
  const toggleImpactStatus = Form.useWatch('toggleImpactStatus', form);
  const [fileSrc, setFileSrc] = useState<string>('');
  const [isOpenPdf, setIsOpenPdf] = useState(false);

  const { data: dataSales, isLoading: isLoadingDataSales } = useSaleList();

  const dataSalesOptions = dataSales?.map((item: any) => ({
    label: item.fullname + ' - ' + item.username,
    value: item.id,
  }));

  const { data: dataAmEmployee, isLoading: isLoadingAmEmployee } =
    useGetAllAmEmployee();

  const dataAmEmployeeOptions = dataAmEmployee?.map((item: any) => ({
    label: item.fullname + ' - ' + item.username,
    value: item.id,
  }));

  const disabledDate: RangePickerProps['disabledDate'] = (
    startValue: Dayjs
  ) => {
    return dayjs(startValue).isAfter(dayjs().endOf('day'));
  };

  const { data: pdfBlobUrlcontractFilePath } = useGetPdfBlob(contractFilePath);
  const { data: pdfBlobUrlLicenseFilePath } = useGetPdfBlob(licenseFilePath);
  useEffect(() => {
    if (pdfBlobUrlLicenseFilePath) {
      const fileFormBlob = new File(
        [pdfBlobUrlLicenseFilePath],
        originalLicenseName,
        {
          type: 'application/pdf',
        }
      );
      form.setFieldsValue({
        businessLicense: fileFormBlob,
      });
    }
  }, [pdfBlobUrlLicenseFilePath, originalLicenseName]);

  useEffect(() => {
    if (pdfBlobUrlcontractFilePath) {
      const fileFormBlob = new File(
        [pdfBlobUrlcontractFilePath],
        originalContractName,
        {
          type: 'application/pdf',
        }
      );
      form.setFieldsValue({
        contract: fileFormBlob,
      });
    }
  }, [pdfBlobUrlcontractFilePath, originalContractName]);

  useEffect(() => {
    if (positionCode === 0 && dataSales?.length > 0 && currentUser?.id) {
      // 0 NVKD
      const supervisorId = dataSales.filter(
        (item: any) => item.userId === currentUser?.id
      )[0]?.id;
      if (supervisorId) {
        form.setFieldsValue({
          supervisorId: supervisorId,
        });
      }
    }
    if (positionCode === 1 && dataAmEmployee?.length > 0 && currentUser?.id) {
      // 1 NVAM
      const amEmployeeId = dataAmEmployee.filter(
        (item: any) => item.userId === currentUser?.id
      )[0]?.id;
      if (amEmployeeId) {
        form.setFieldsValue({
          amEmployeeIdList: [amEmployeeId],
        });
      }
    }
  }, [
    positionCode,
    dataSales?.length,
    dataAmEmployee?.length,
    currentUser?.id,
  ]);

  const handlePreview = async (value: string) => {
    const file = form.getFieldValue(value);
    if (file.type === FILE_TYPE.pdf) {
      const url = URL.createObjectURL(file);
      setFileSrc(url);
      setIsOpenPdf(true);
    }
  };

  return (
    <fieldset>
      <legend>Thông tin doanh nghiệp</legend>

      <Row gutter={12}>
        <Col span={12}>
          <Form.Item
            label="Mã số thuế"
            name="taxCode"
            rules={[validateForm.required]}
          >
            <CInput placeholder="Nhập mã số thuế" maxLength={13} preventSpace />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Tên doanh nghiệp"
            name="enterpriseName"
            rules={[validateForm.required]}
          >
            <CInput placeholder="Nhập tên doanh nghiệp" maxLength={100} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[validateForm.required]}
          >
            <CInput
              placeholder="Nhập số điện thoại"
              maxLength={11}
              onlyNumber
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Email"
            name="enterpriseEmail"
            rules={[validateForm.email]}
          >
            <CInput placeholder="Email" maxLength={100} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Địa chỉ DN"
            name="address"
            rules={[validateForm.required]}
          >
            <CInput placeholder="Địa chỉ DN" maxLength={500} />
          </Form.Item>
        </Col>
        <CadastralSelect
          col={<Col span={12} />}
          formName={{
            province: 'enterpriseProvince',
            district: 'enterpriseDistrict',
            village: 'enterprisePrecinct',
          }}
        />
        <Col span={12}>
          <Form.Item label="Ngày thành lập DN" name="establishmentDate">
            <CDatePicker
              placeholder="Ngày thành lập DN"
              disabledDate={disabledDate}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Ngày ký hợp đồng" name="contractDate">
            <CDatePicker
              placeholder="Ngày ký hợp đồng"
              disabledDate={disabledDate}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Số hợp đồng" name="contractNumber">
            <CInput placeholder="Nhập số hợp đồng" maxLength={20} />
          </Form.Item>
        </Col>
        <Col
          span={12}
          className={
            changedFields.includes('contractFilePath') &&
            typeModal === ActionType.VIEW_ENTERPRISE_HISTORY
              ? 'fileChanged'
              : ''
          }
        >
          <CUploadFileTemplate
            accept={['application/pdf']}
            name="contract"
            onPreview={() => handlePreview('contract')}
            label="File hợp đồng"
            required={false}
          />
        </Col>
        <Col
          span={12}
          className={
            changedFields.includes('licenseFilePath') &&
            typeModal === ActionType.VIEW_ENTERPRISE_HISTORY
              ? 'fileChanged'
              : ''
          }
        >
          <CUploadFileTemplate
            accept={['application/pdf']}
            name="businessLicense"
            onPreview={() => handlePreview('businessLicense')}
            label="File GPKD"
            required={false}
          />
        </Col>
        <Col span={12}>
          <Form.Item label="Ghi chú" name="note">
            <CTextArea maxLength={200} rows={1} placeholder="Ghi chú" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Người phụ trách"
            name="supervisorId"
            rules={[validateForm.required]}
          >
            <CSelect
              loading={isLoadingDataSales}
              options={dataSalesOptions}
              placeholder="Người phụ trách"
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Nhân viên AM" name="amEmployeeIdList">
            <CSelect
              mode="multiple"
              loading={isLoadingAmEmployee}
              options={dataAmEmployeeOptions}
              placeholder="Nhân viên AM"
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Hoạt động"
            name="status"
            valuePropName="checked"
            initialValue={true}
          >
            <CSwitch
              disabled={
                typeModal !== ActionType.EDIT || toggleImpactStatus === 0
              }
              checked={true}
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item label="" name="licenseFilePath" hidden />
      <Form.Item label="" name="contractFilePath" hidden />
      <Form.Item label="" name="toggleImpactStatus" hidden />
      <Form.Item label="" name="originalLicenseName" hidden />
      <Form.Item label="" name="originalContractName" hidden />
      <Form.Item label="" name="isChangeBusinessLicense" hidden />
      <Form.Item label="" name="isChangeContract" hidden />
      <ModalPdf
        src={fileSrc}
        isOpen={isOpenPdf}
        setIsOpen={setIsOpenPdf}
        title="File"
      />
    </fieldset>
  );
};

export default InfoBusiness;
