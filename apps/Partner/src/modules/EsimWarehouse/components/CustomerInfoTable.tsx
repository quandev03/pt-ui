import { CInput, formatDate } from '@vissoft-react/common';
import { Col, Form, Row } from 'antd';
import { useGetCusomerInfo } from '../hooks/useGetCustomerInfo';
import { useEffect, useMemo } from 'react';
import dayjs from 'dayjs';
import { useGetParamsOption } from '../../../hooks/useGetParamsOption';

interface CustomerInfoTableProps {
  subId: string | undefined;
}

export const CustomerInfoTable = ({ subId }: CustomerInfoTableProps) => {
  const [form] = Form.useForm();

  const { data: getParams } = useGetParamsOption();

  const subsGender = useMemo(() => {
    if (!getParams?.SUBSCRIBER_GENDER) {
      return [];
    }
    return getParams.SUBSCRIBER_GENDER.map((item) => ({
      code: item.code,
      label: item.value,
    }));
  }, [getParams]);
  console.log('🚀 ~ CustomerInfoTable ~ subsGender:', subsGender);

  const { data: customerInfo } = useGetCusomerInfo(subId);

  useEffect(() => {
    if (customerInfo) {
      const genderLabel =
        subsGender.find((item) => item.code === String(customerInfo.gender))
          ?.label || 'Không xác định';

      form.setFieldsValue({
        ...customerInfo,
        nationality: customerInfo.nationality,
        typeDocument: customerInfo.typeDocument
          ? customerInfo.typeDocument
          : 'Hộ chiếu',
        contractCode: customerInfo.contractCode,
        gender: genderLabel,
        customerCode: customerInfo.customerCode,
        fullName: customerInfo.fullName,
        birthOfDate: customerInfo.birthOfDate
          ? dayjs(customerInfo.birthOfDate).format(formatDate)
          : '',
        idNoExpireDate: customerInfo.idNoExpireDate
          ? dayjs(customerInfo.idNoExpireDate).format(formatDate)
          : '',
        issuePlace: customerInfo.issuePlace,
        idNumber: customerInfo.idNumber,
      });
    }
  }, [customerInfo, form, subsGender]);

  return (
    <Form labelAlign="left" colon={false} form={form} disabled={true}>
      <Row gutter={[20, 0]}>
        <Col span={24} md={12}>
          <Form.Item
            labelCol={{ span: 7 }}
            label="Mã hợp đồng"
            name="contractCode"
          >
            <CInput />
          </Form.Item>
        </Col>
        <Col span={24} md={12}>
          <Form.Item
            labelCol={{ span: 7 }}
            label="Mã khách hàng"
            name="customerCode"
          >
            <CInput />
          </Form.Item>
        </Col>
        <Col span={24} md={12}>
          <Form.Item
            labelCol={{ span: 7 }}
            label="Loại giấy tờ"
            name="typeDocument"
          >
            <CInput />
          </Form.Item>
        </Col>
        <Col span={24} md={12}>
          <Form.Item labelCol={{ span: 7 }} label="Họ và tên" name="fullName">
            <CInput />
          </Form.Item>
        </Col>
        <Col span={24} md={12}>
          <Form.Item labelCol={{ span: 7 }} label="Giới tính" name="gender">
            <CInput />
          </Form.Item>
        </Col>
        <Col span={24} md={12}>
          <Form.Item
            labelCol={{ span: 7 }}
            label="Ngày sinh"
            name="birthOfDate"
          >
            <CInput />
          </Form.Item>
        </Col>
        <Col span={24} md={12}>
          <Form.Item labelCol={{ span: 7 }} label="Số hộ chiếu" name="idNumber">
            <CInput />
          </Form.Item>
        </Col>
        <Col span={24} md={12}>
          <Form.Item
            labelCol={{ span: 7 }}
            label="Ngày cấp"
            name="idNoExpireDate"
          >
            <CInput />
          </Form.Item>
        </Col>
        <Col span={24} md={12}>
          <Form.Item
            labelCol={{ span: 7 }}
            label="Ngày hết hạn"
            name="serialSim"
          >
            <CInput />
          </Form.Item>
        </Col>
        <Col span={24} md={12}>
          <Form.Item
            labelCol={{ span: 7 }}
            label="Quốc tịch"
            name="nationality"
          >
            <CInput />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};
