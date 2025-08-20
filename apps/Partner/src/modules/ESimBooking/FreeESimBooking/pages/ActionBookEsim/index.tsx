import {
  AnyElement,
  CButton,
  CInputNumber,
  CTextArea,
  IModeAction,
  TitleHeader,
} from '@vissoft-react/common';
import { Col, Form, Row, Spin } from 'antd';
import { memo, useEffect, useRef, useCallback } from 'react';
import { useLogicActionPackagedEsim } from './useLogicActionPackagedEsim';
import { useGetPackageCodes } from '../../hooks/usePackageCodes';
import EsimPackagedBookForm from '../../components/EsimPackagedBookForm';
import { useGetDebitLimit } from '../../../../../hooks/useGetDebitLimit';
import { useGetEsimDetails } from '../../hooks/useGetEsimDetails';

export const ActionPackagedEsim = memo(() => {
  const {
    id,
    Title,
    form,
    handleClose,
    actionMode,
    handleFinish,
    bookingInProcess,
  } = useLogicActionPackagedEsim();

  const { data: packageCodeList } = useGetPackageCodes();
  const { data: debitLimitData } = useGetDebitLimit();
  const originalDebitLimit = useRef(0);

  const { data: esimDetailsData, isLoading: isLoadingDetails } =
    useGetEsimDetails(id);

  const packageOptions = packageCodeList?.map((pkg) => ({
    key: pkg.id,
    value: pkg.pckCode,
    label: pkg.pckCode,
    price: pkg.packagePrice,
  }));

  useEffect(() => {
    if (actionMode === IModeAction.CREATE && debitLimitData) {
      originalDebitLimit.current = debitLimitData.debitLimit;
      form.setFieldsValue({
        temporaryLimit: debitLimitData.debitLimit,
        mbfLimit: debitLimitData.debitLimitMbf,
      });
    }
  }, [actionMode, debitLimitData, form]);
  useEffect(() => {
    if (actionMode === IModeAction.CREATE && packageOptions?.length === 1) {
      form.setFieldsValue({
        note: esimDetailsData?.note || '',
        packages: [{ packageCode: packageOptions[0].value }],
      });
    }
  }, [actionMode, esimDetailsData?.note, form, packageOptions]);

  useEffect(() => {
    if (actionMode === IModeAction.READ && esimDetailsData) {
      form.resetFields();

      const formattedPackages = esimDetailsData.saleOrderLines.map((line) => ({
        quantity: line.quantity,
        packageCode: line.pckCode,
      }));
      const noteValue = esimDetailsData.note || '';

      form.setFieldsValue({
        note: noteValue,
        packages: formattedPackages,
      });
    }
  }, [actionMode, form, esimDetailsData]);

  const handleValuesChange = useCallback(
    (changedValues: AnyElement, allValues: AnyElement) => {
      if (
        changedValues.packages &&
        packageCodeList &&
        packageCodeList.length > 0
      ) {
        let totalCost = 0;
        allValues.packages?.forEach((pkgItem: AnyElement) => {
          if (pkgItem && pkgItem.packageCode && pkgItem.quantity) {
            const fullPackage = packageCodeList.find(
              (p) => p.pckCode === pkgItem.packageCode
            );
            if (fullPackage) {
              totalCost += fullPackage.packagePrice * pkgItem.quantity;
            }
          }
        });
        const newTemporaryLimit = originalDebitLimit.current - totalCost;
        form.setFieldsValue({ temporaryLimit: newTemporaryLimit });
      }
    },
    [form, packageCodeList]
  );

  if (actionMode === IModeAction.READ && isLoadingDetails) {
    return (
      <div className="flex justify-center items-center w-full h-full">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full">
      <TitleHeader>{Title}</TitleHeader>
      <Form
        form={form}
        onFinish={handleFinish}
        onValuesChange={handleValuesChange}
        colon={false}
        labelAlign="left"
      >
        <Row gutter={[24, 0]}>
          {actionMode === IModeAction.CREATE && (
            <>
              <Col span={12}>
                <Form.Item
                  label="Hạn mức tạm tính"
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                  name="temporaryLimit"
                >
                  <CInputNumber
                    disabled
                    style={{ width: '100%', color: 'black' }}
                    formatter={(value) =>
                      value
                        ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
                          ' ₫'
                        : ''
                    }
                    parser={(value: AnyElement) => value.replace(/\s?₫|,/g, '')}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Hạn mức với MBF"
                  name="mbfLimit"
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                >
                  <CInputNumber
                    disabled
                    style={{ width: '100%', color: 'black' }}
                    formatter={(value) =>
                      value
                        ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
                          ' ₫'
                        : ''
                    }
                    parser={(value: AnyElement) => value.replace(/\s?₫|,/g, '')}
                  />
                </Form.Item>
              </Col>
            </>
          )}

          <Col span={24} style={{ marginTop: 11 }}>
            <Form.Item label="Ghi chú" name="note" labelCol={{ span: 3 }}>
              <CTextArea
                placeholder="Nhập ghi chú"
                disabled={actionMode === IModeAction.READ}
                rows={4}
              />
            </Form.Item>
          </Col>
        </Row>

        <div className="bg-white p-5 rounded-md mt-4">
          <EsimPackagedBookForm />
        </div>

        <div className="flex gap-4 flex-wrap justify-end mt-7">
          {actionMode === IModeAction.CREATE && (
            <CButton
              onClick={() => {
                form.submit();
              }}
              loading={bookingInProcess}
            >
              Thực hiện
            </CButton>
          )}
          <CButton onClick={handleClose} type="default">
            Hủy
          </CButton>
        </div>
      </Form>
    </div>
  );
});
