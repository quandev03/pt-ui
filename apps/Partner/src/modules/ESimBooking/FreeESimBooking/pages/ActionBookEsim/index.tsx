import {
  AnyElement,
  CButton,
  CInputNumber,
  CTextArea,
  IModeAction,
  TitleHeader,
} from '@vissoft-react/common';
import { Col, Form, Row } from 'antd';
import { memo, useEffect } from 'react';
import { useLogicActionPackagedEsim } from './useLogicActionPackagedEsim';
import EsimPackagedBookForm from '../../components/EsimPackagedBookForm';
import { useGetPackageCodes } from '../../hooks/usePackageCodes';

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
  const packageOptions = packageCodeList?.map((pkg) => ({
    key: pkg.id,
    value: pkg.pckCode,
    label: pkg.pckCode,
  }));

  useEffect(() => {
    if (actionMode === IModeAction.CREATE && packageOptions?.length === 1) {
      form.setFieldsValue({ packageCodes: packageOptions[0].value });
    }
  }, [actionMode, form, packageOptions]);

  // FIX: This useEffect was updated to correctly populate the form in READ mode.
  useEffect(() => {
    if (actionMode === IModeAction.READ && listEsimBooked?.content && id) {
      const esimData = listEsimBooked.content.find(
        (item: any) => item.id === id
      );
      if (esimData) {
        // The form values are set here.
        // 1. Added the missing 'description' field.
        // 2. Kept 'quantity' and 'packageCodes' as they were, assuming they are
        //    used by the EsimPackagedBookForm component. If those fields are nested
        //    in the form structure (e.g., under a 'packages' object), this part
        //    would need to be adjusted to match that structure.
        form.setFieldsValue({
          description: esimData.description || '',
          quantity: esimData.quantity || '',
          packageCodes: esimData.packageCodes || '',
        });
      }
    }
  }, [actionMode, form, id, listEsimBooked?.content]);

  return (
    <div className="flex flex-col w-full h-full">
      <TitleHeader>{Title}</TitleHeader>
      <Form form={form} onFinish={handleFinish} colon={false} labelAlign="left">
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
                    style={{ width: '100%' }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }
                    parser={(value: AnyElement) =>
                      value.replace(/\$\s?|(,*)/g, '')
                    }
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
                    style={{ width: '100%' }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }
                    parser={(value: AnyElement) =>
                      value.replace(/\$\s?|(,*)/g, '')
                    }
                  />
                </Form.Item>
              </Col>
            </>
          )}
          <Col span={24} style={{ marginTop: 11 }}>
            <Form.Item
              label="Ghi chú"
              name="description"
              labelCol={{ span: 3 }}
            >
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
