import React, { useCallback, useEffect, useState } from 'react';
import CModal from '@react/commons/Modal';
import { Col, Form, Row } from 'antd';
import useStorePostCheckList from '../store';
import { ISubDocumentHistoryDTO } from '../types';
import dayjs from 'dayjs';
import { formatDate } from '@react/constants/moment';
import CInput from '@react/commons/Input';
import CTextArea from '@react/commons/TextArea';

interface ComparisonData {
  idNo: string;
  name: string;
  sex: string;
  birthDate: string;
  address: string;
  idIssueDate: string;
  idIssuePlace: string;
}

export const ModalHistory = ({
  open,
  data,
  loading,
}: {
  open: boolean;
  data: ISubDocumentHistoryDTO[];
  loading: boolean;
}) => {
  const { setIsHiddenModalHistory, setIdHistory } = useStorePostCheckList();
  const [form] = Form.useForm();
  const [comparisonData, setComparisonData] = useState<{
    old: ComparisonData;
    new: ComparisonData;
  } | null>(null);

  useEffect(() => {
    if (data && data.length) {
      const newVersion = data[0];
      const oldVersion = data[1] ?? newVersion;
      const formattedData = {
        old: {
          idNo: oldVersion.idNo,
          name: oldVersion.name,
          sex: oldVersion.sex === '1' ? 'Nam' : 'Nữ',
          birthDate: dayjs(oldVersion.birthDate).format(formatDate),
          address: oldVersion.address,
          idIssueDate: dayjs(oldVersion.idIssueDate).format(formatDate),
          idIssuePlace: oldVersion.idIssuePlace,
        },
        new: {
          idNo: newVersion.idNo,
          name: newVersion.name,
          sex: newVersion.sex === '1' ? 'Nam' : 'Nữ',
          birthDate: dayjs(newVersion.birthDate).format(formatDate),
          address: newVersion.address,
          idIssueDate: dayjs(newVersion.idIssueDate).format(formatDate),
          idIssuePlace: newVersion.idIssuePlace,
        },
      };
      setComparisonData(formattedData);
      form.setFieldsValue(formattedData);
    }
  }, [data, form, open]);

  const handleCloseModal = useCallback(() => {
    setIsHiddenModalHistory(false);
    setIdHistory('');
  }, [setIsHiddenModalHistory]);
  useEffect(() => {
    return () => {
      setIsHiddenModalHistory(false);
    };
  }, [setIsHiddenModalHistory]);
  const renderFormItem = (
    field: keyof ComparisonData,
    label: string,
    InputComponent: typeof CInput | typeof CTextArea = CInput
  ) => {
    if (!comparisonData) return null;
    const oldValue = comparisonData.old[field];
    const newValue = comparisonData.new[field];
    const isDifferent = oldValue !== newValue;
    const oldStyle = { backgroundColor: isDifferent ? '#e98887' : undefined };
    const newStyle = { backgroundColor: isDifferent ? '#b8d9f2' : undefined };

    return (
      <>
        <Col className="flex items-center" span={6}>
          <Form.Item colon={false} label={label}></Form.Item>
        </Col>
        <Col className="" span={9}>
          <Form.Item name={['old', field]} colon={false}>
            <InputComponent
              maxLength={InputComponent === CTextArea ? 200 : 50}
              disabled
              style={oldStyle}
            />
          </Form.Item>
        </Col>
        <Col className="" span={9}>
          <Form.Item name={['new', field]} colon={false}>
            <InputComponent
              maxLength={InputComponent === CTextArea ? 200 : 50}
              disabled
              style={newStyle}
            />
          </Form.Item>
        </Col>
      </>
    );
  };

  return (
    <CModal
      loading={loading}
      maskClosable
      open={open}
      width={700}
      title="Lịch sử thay đổi"
      onCancel={handleCloseModal}
      closable={true}
      footer={null}
    >
      <Form disabled form={form}>
        <Row gutter={[32, 16]}>
          <Col span={6}></Col>
          <Col span={9}>
            <strong>Bản cập nhật trước</strong>
          </Col>
          <Col span={9}>
            <strong>Bản cập nhật sau</strong>
          </Col>
          {renderFormItem('idNo', 'Số giấy tờ')}
          {renderFormItem('name', 'Tên khách hàng')}
          {renderFormItem('sex', 'Giới tính')}
          {renderFormItem('birthDate', 'Ngày sinh')}
          {renderFormItem('address', 'Đia chỉ thường trú', CTextArea)}
          {renderFormItem('idIssueDate', 'Ngày cấp')}
          {renderFormItem('idIssuePlace', 'Nơi cấp giấy tờ')}
        </Row>
      </Form>
    </CModal>
  );
};
