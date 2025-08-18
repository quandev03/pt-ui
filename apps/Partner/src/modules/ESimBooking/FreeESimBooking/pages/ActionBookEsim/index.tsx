import {
  AnyElement,
  CButton,
  CInputNumber,
  CTextArea,
  IModeAction,
  TitleHeader,
} from '@vissoft-react/common';
import { Col, Form, Row } from 'antd';
// 1. Import useRef and useCallback
import { memo, useEffect, useRef, useCallback } from 'react';
import { useLogicActionPackagedEsim } from './useLogicActionPackagedEsim';
import { useGetPackageCodes } from '../../hooks/usePackageCodes';
import EsimPackagedBookForm from '../../components/EsimPackagedBookForm'; // Assuming this is the correct path
import { useGetDebitLimit } from 'apps/Partner/src/hooks/useGetDebitLimit';

export const ActionPackagedEsim = memo(() => {
  const {
    id,
    Title,
    form,
    handleClose,
    actionMode,
    handleFinish,
    bookingInProcess,
    listEsimBooked,
  } = useLogicActionPackagedEsim();

  const { data: packageCodeList } = useGetPackageCodes();
  const { data: debitLimitData } = useGetDebitLimit();
  const originalDebitLimit = useRef(0);

  const packageOptions = packageCodeList?.map((pkg) => ({
    key: pkg.id,
    value: pkg.pckCode,
    label: pkg.pckCode,
    price: pkg.packagePrice,
  }));

  useEffect(() => {
    if (actionMode === IModeAction.CREATE && debitLimitData) {
      // Store the original value in the ref
      originalDebitLimit.current = debitLimitData.debitLimit;

      form.setFieldsValue({
        temporaryLimit: debitLimitData.debitLimit, // Set the initial display value
        mbfLimit: debitLimitData.debitLimitMbf,
      });
    }
  }, [actionMode, debitLimitData, form]);

  useEffect(() => {
    if (actionMode === IModeAction.CREATE && packageOptions?.length === 1) {
      form.setFieldsValue({
        packages: [{ packageCode: packageOptions[0].value }],
      });
    }
  }, [actionMode, form, packageOptions]);

  useEffect(() => {
    if (actionMode === IModeAction.READ && listEsimBooked?.content && id) {
      const esimData = listEsimBooked.content.find(
        (item: AnyElement) => item.id === id
      );
      if (esimData) {
        form.setFieldsValue({
          note: esimData.note,
          packages: [
            {
              quantity: esimData.quantity,
              packageCode: esimData.packageCodes,
            },
          ],
        });
      }
    }
  }, [actionMode, form, id, listEsimBooked?.content]);
  const handleValuesChange = useCallback(
    (changedValues: AnyElement, allValues: AnyElement) => {
      // We only care when the 'packages' array is changed
      if (
        changedValues.packages &&
        packageCodeList &&
        packageCodeList.length > 0
      ) {
        let totalCost = 0;

        // Loop through all package rows in the form
        allValues.packages?.forEach((pkgItem: AnyElement) => {
          // Ensure we have data to work with
          if (pkgItem && pkgItem.packageCode && pkgItem.quantity) {
            const fullPackage = packageCodeList.find((p) => {
              return p.pckCode === pkgItem.packageCode;
            });

            if (fullPackage) {
              totalCost += fullPackage.packagePrice * pkgItem.quantity;
            } else {
              console.error(`❌ No Match Found for "${pkgItem.packageCode}"`);
            }
          }
        });

        console.log('Final Calculated Cost:', totalCost);
        const newTemporaryLimit = originalDebitLimit.current - totalCost;
        form.setFieldsValue({ temporaryLimit: newTemporaryLimit });
      }
    },
    [form, packageCodeList] // Dependencies are correct
  );

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
                  name="mbfLimit" // Renamed from debitLimitMbf
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
          {/* ... The rest of your form ... */}
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
          {/* ... Buttons ... */}
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
