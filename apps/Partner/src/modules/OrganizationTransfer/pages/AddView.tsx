import {
  CButtonClose,
  CButtonSave,
  CButtonSaveAndAdd,
} from '@react/commons/Button';
import {
  CDatePicker,
  CSelect,
  CTextArea,
  NotificationSuccess,
} from '@react/commons/index';
import { TitleHeader } from '@react/commons/Template/style';
import { FieldErrorsType } from '@react/commons/types';
import { ActionsTypeEnum, ActionType } from '@react/constants/app';
import { MESSAGE } from '@react/utils/message';
import validateForm from '@react/utils/validator';
import { Card, Col, Flex, Form, Row, Spin } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TableProduct from '../components/TableProduct';
import { useAddOrg } from '../hooks/useAddOrg';
import { useGetOrgExport } from '../hooks/useGetOrgExport';
import { useGetOrgImport } from '../hooks/useGetOrgImport';
import { useViewOrg, useViewOrgById } from '../hooks/useViewOrg';
import { useOrganizationTransferStore } from '../store';
import { ISerialType, IStockMoveLineDTO, ProductType } from '../types';
export interface AddViewProps {
  actionType: ActionsTypeEnum | ActionType;
}

const AddView: React.FC<AddViewProps> = ({ actionType }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id = '' } = useParams();
  const isViewType = actionType === ActionType.VIEW;
  const isAddType = actionType === ActionType.ADD;
  const { mutate: mutateAdd, isPending: isLoadingAdd } = useAddOrg();
  const {
    data: dataWarehouseExport = [],
    isPending: isPendingWarehouseExport,
  } = useGetOrgExport(isAddType ? false : true);
  const {
    data: dataWarehouseImport = [],
    isPending: isPendingWarehouseImport,
  } = useGetOrgImport(isAddType ? false : true);
  const { mutate: getOrgById, isPending: isLoadingView } = useViewOrgById(
    (data) => {
      form.setFieldsValue({
        orgId: String(data.orgId),
        moveDate: dayjs(data.moveDate),
        ieOrgId: String(data.ieOrgId),
        description: data.description,
        products:
          data.stockMoveLineDTOS &&
          data.stockMoveLineDTOS.map((e: IStockMoveLineDTO) => ({
            fromSerial: e.fromSerial,
            toSerial: e.toSerial,
            productName: e.productDTO.productName,
            productUom: e.productDTO.productUom,
            productCode: e.productDTO.productCode,
            quantity: e.quantity,
          })),
      });
    }
  );

  const { setOrgId } = useOrganizationTransferStore((state) => state);
  const stockExport = useWatch('orgId', form);
  const stockImport = useWatch('ieOrgId', form);
  const listWarehouseExport = useMemo(() => {
    if (!dataWarehouseExport) return [];
    return dataWarehouseExport
      .filter((e) => e.orgId !== Number(stockImport))
      .map((e) => ({
        label: e.orgName,
        value: String(e.orgId),
      }));
  }, [dataWarehouseExport, stockImport]);
  const listWarehouseImport = useMemo(() => {
    if (!dataWarehouseImport) return [];
    return dataWarehouseImport
      .filter((e) => e.id !== Number(stockExport))
      .map((e) => ({
        label: e.orgName,
        value: String(e.id),
      }));
  }, [dataWarehouseImport, stockExport]);
  const handleRequestAdd = (payload: any, isSaveAndAdd?: boolean) => {
    mutateAdd(payload, {
      onSuccess: () => {
        NotificationSuccess(isAddType ? MESSAGE.G01 : MESSAGE.G16);
        if (!isSaveAndAdd) {
          window.history.back();
        } else {
          form.resetFields();
        }
      },
      onError: (err: any) => {
        if (err?.errors?.length > 0) {
          form.setFields(
            err.errors.map((item: FieldErrorsType) => {
              const fieldArr = item.field.split('-');
              const productId = fieldArr[0];
              const index = form
                .getFieldValue('products')
                .findIndex(
                  (item: any) =>
                    String(item.id) === String(productId) && item.id
                );
              return {
                name: ['products', index, 'quantity'],
                errors: [item.detail],
              };
            })
          );
        }
      },
    });
  };
  const handleChangeWarehouseExport = useCallback(
    (value: number) => {
      setOrgId(value);
      form.setFieldValue('products', [{}]);
    },
    [setOrgId, form]
  );
  const handleSubmit = useCallback(
    (values: any, isSaveAndAdd?: boolean) => {
      const { products, moveDate, id, ...restValues } = values;
      const moveLines = products
        ?.filter((item: ISerialType) => item.isChild || !item.checkSerial)
        .map(
          ({ toSerial, fromSerial, quantity, id, productId }: ProductType) => ({
            productId: productId ?? id,
            quantity,
            fromSerial: fromSerial ? Number(fromSerial) : null,
            toSerial: toSerial ? Number(toSerial) : null,
          })
        );
      const payload = {
        ...restValues,
        moveDate: dayjs(moveDate).format('YYYY-MM-DD'),
        moveLines,
      };
      handleRequestAdd(payload, isSaveAndAdd);
    },
    [form, handleRequestAdd]
  );

  const handleSaveAndAdd = () => {
    const values = form.getFieldsValue();
    form.validateFields().then(() => handleSubmit(values, true));
  };
  useEffect(() => {
    if (id) {
      getOrgById(id);
    }
  }, [getOrgById, id]);
  const handleFinish = (values: any) => {
    handleSubmit(values);
  };
  const handleClose = () => {
    navigate(-1);
  };
  useEffect(() => {
    return () => {
      form.resetFields();
      setOrgId(undefined);
    };
  }, []);
  return (
    <>
      <TitleHeader>Tạo giao dịch điều chuyển hàng</TitleHeader>
      <Spin spinning={isLoadingAdd || isLoadingView}>
        <Form
          form={form}
          colon={false}
          onFinish={handleFinish}
          labelWrap
          labelCol={{ prefixCls: 'w-[95px]' }}
          initialValues={{
            toOrgId: 1,
            products: [{}],
          }}
        >
          <Card>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="orgId"
                  label="Kho xuất"
                  rules={[validateForm.required]}
                >
                  <CSelect
                    placeholder="Kho xuất"
                    options={listWarehouseExport}
                    disabled={isViewType}
                    loading={isPendingWarehouseExport}
                    allowClear={false}
                    onChange={(value) => {
                      form.setFieldValue('orgId', value);
                      handleChangeWarehouseExport(value);
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="ieOrgId"
                  label="Kho nhận"
                  rules={[validateForm.required]}
                >
                  <CSelect
                    placeholder="Kho nhận"
                    options={listWarehouseImport ?? []}
                    allowClear={false}
                    loading={isPendingWarehouseImport}
                    disabled={isViewType}
                    onChange={(value) => {
                      form.setFieldValue('ieOrgId', value);
                    }}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="moveDate"
                  label="Ngày xuất"
                  rules={[validateForm.required]}
                  initialValue={dayjs()}
                >
                  <CDatePicker disabled={isViewType} />
                </Form.Item>
              </Col>
              <Col span={24} className="mb-2">
                <Form.Item label={'Ghi chú'} name={'description'}>
                  <CTextArea maxLength={200} rows={3} disabled={isViewType} />
                </Form.Item>
              </Col>
              <TableProduct actionType={actionType} />
            </Row>
          </Card>
          <Flex className="w-full mt-4" gap={12} justify="end">
            <>
              {isAddType && (
                <>
                  <CButtonSaveAndAdd
                    loading={false}
                    onClick={handleSaveAndAdd}
                  />
                  <CButtonSave htmlType="submit" loading={false} />
                </>
              )}
            </>
            <CButtonClose
              onClick={handleClose}
              disabled={false}
              type="default"
            />
          </Flex>
        </Form>
      </Spin>
    </>
  );
};

export default AddView;
