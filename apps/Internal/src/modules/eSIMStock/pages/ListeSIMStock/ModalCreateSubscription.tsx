import {
  AnyElement,
  CButtonClose,
  CButtonSave,
  CDatePicker,
  CModal,
  CSelect,
  TitleHeader,
  validateForm,
} from '@vissoft-react/common';
import { Card, Col, Descriptions, Empty, Form, Row, Spin } from 'antd';
import { useGetAllOrganizationUnit } from 'apps/Internal/src/hooks/useGetAllPartners';
import { useCallback, useMemo, useState } from 'react';
import { useGetAllPackage, useRegisterService } from '../../hooks';
import { IPackage } from '../../types';
import dayjs, { Dayjs } from 'dayjs';

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

type FormValues = {
  orgId: string;
  packageCode: string;
  startTime?: Dayjs;
};

const formatCurrency = (value?: number) => {
  if (value === undefined || value === null) return '--';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value);
};

const flattenPartners = (data?: AnyElement[]): { label: string; value: string }[] => {
  if (!data) return [];
  const result: { label: string; value: string }[] = [];
  const traverse = (nodes?: AnyElement[]) => {
    nodes?.forEach((node) => {
      result.push({ label: node.title, value: node.value });
      if (node.children?.length) {
        traverse(node.children);
      }
    });
  };
  traverse(data);
  return result;
};

export const ModalCreateSubscription = ({ open, onClose, onSuccess }: Props) => {
  const [form] = Form.useForm<FormValues>();
  const { data: organizationTree, isLoading: loadingPartners } =
    useGetAllOrganizationUnit();
  const { data: packageList, isLoading: loadingPackages } = useGetAllPackage();
  const [selectedPackage, setSelectedPackage] = useState<IPackage>();

  const partnerOptions = useMemo(
    () => flattenPartners(organizationTree as AnyElement[]),
    [organizationTree]
  );

  const packageOptions = useMemo(
    () =>
      packageList?.map((pkg) => ({
        label: `${pkg.pckName} (${pkg.pckCode})`,
        value: pkg.pckCode,
      })) ?? [],
    [packageList]
  );

  const handlePackageChange = useCallback(
    (value?: string) => {
      if (!value) {
        setSelectedPackage(undefined);
        return;
      }
      const target = packageList?.find((pkg) => pkg.pckCode === value);
      setSelectedPackage(target);
    },
    [packageList]
  );

  const { mutate: registerService, isPending: submitting } = useRegisterService(
    () => {
      form.resetFields();
      setSelectedPackage(undefined);
      onClose();
      onSuccess();
    }
  );

  const handleSubmit = (values: FormValues) => {
    registerService({
      organizationUnitId: values.orgId,
      packageProfileId: values.packageCode,
      startTime: values.startTime ? dayjs(values.startTime).toISOString() : undefined,
    });
  };

  return (
    <CModal
      open={open}
      title={<TitleHeader>Thêm đăng ký dịch vụ</TitleHeader>}
      footer={null}
      onCancel={onClose}
      width={900}
      destroyOnClose
    >
      <Spin spinning={loadingPartners || loadingPackages || submitting}>
        <Form
          form={form}
          layout="vertical"
          colon={false}
          onFinish={handleSubmit}
          initialValues={{
            startTime: dayjs(),
          }}
        >
          <Card className="mb-6">
            <Row gutter={[24, 0]}>
              <Col span={12}>
                <Form.Item
                  label="Đối tác"
                  name="orgId"
                  rules={[validateForm.required]}
                >
                  <CSelect
                    placeholder="Chọn đối tác"
                    options={partnerOptions}
                    showSearch
                    optionFilterProp="label"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Gói dịch vụ"
                  name="packageCode"
                  rules={[validateForm.required]}
                >
                  <CSelect
                    placeholder="Chọn gói dịch vụ"
                    options={packageOptions}
                    showSearch
                    optionFilterProp="label"
                    onChange={handlePackageChange}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Thời gian bắt đầu" name="startTime">
                  <CDatePicker
                    className="w-full"
                    showTime
                    placeholder="Chọn thời gian bắt đầu"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card title="Thông tin chi tiết gói dịch vụ">
            {selectedPackage ? (
              <Descriptions column={2}>
                <Descriptions.Item label="Mã gói">
                  {selectedPackage.pckCode || '--'}
                </Descriptions.Item>
                <Descriptions.Item label="Tên gói">
                  {selectedPackage.pckName || '--'}
                </Descriptions.Item>
                <Descriptions.Item label="Giá gói">
                  {formatCurrency(selectedPackage.packagePrice)}
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                  {selectedPackage.status === 1 ? 'Hoạt động' : 'Không hoạt động'}
                </Descriptions.Item>
                <Descriptions.Item label="Mô tả" span={2}>
                  {selectedPackage.description || '--'}
                </Descriptions.Item>
              </Descriptions>
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Vui lòng chọn gói dịch vụ để xem chi tiết"
              />
            )}
          </Card>

          <div className="flex justify-end gap-4 mt-8">
            <CButtonSave htmlType="submit" loading={submitting}>
              Lưu
            </CButtonSave>
            <CButtonClose onClick={onClose} />
          </div>
        </Form>
      </Spin>
    </CModal>
  );
};





