import { CInput, CInputNumber, TableDynamic } from '@react/commons/index';
import { ActionsTypeEnum, ActionType } from '@react/constants/app';
import formInstance from '@react/utils/form';
import validateForm, { serialSimReg } from '@react/utils/validator';
import { Form } from 'antd';
import Column from 'antd/lib/table/Column';
import { uniqBy } from 'lodash';
import { useState } from 'react';
import ModalProduct from '../../MerchantOrder/components/ModalProduct';
import { ProductType } from '../types';

interface Props {
  actionType: ActionsTypeEnum | ActionType;
  name?: string;
  isImport?: boolean;
  data?: any[];
}

const TableProduct: React.FC<Props> = ({
  actionType,
  name = 'products',
  isImport = true,
  data = [],
}) => {
  const form = Form.useFormInstance();
  const isViewType = actionType === ActionType.VIEW;
  const [isOpenProduct, setIsOpenProduct] = useState<boolean>(false);
  const { [name]: dataTable = [] }: { [name: string]: ProductType[] } =
    Form.useWatch((e) => e, form) ?? {};

  const setListProduct = (data: ProductType[]) => {
    form.setFieldValue(
      name,
      dataTable[0]?.id ? uniqBy(dataTable.concat(data), 'id') : data
    );
  };
  const handleBlurSerial = (idx: number) => {
    const fromSerial = dataTable[idx]?.fromSerial;
    const quantity = dataTable[idx]?.quantity;
    const isCheckRepeatSerial = dataTable.some((e, index: number) => {
      if (e.fromSerial && fromSerial && e.toSerial && index !== idx)
        return e.fromSerial <= fromSerial && fromSerial <= e.toSerial;
      return false;
    });

    if (isCheckRepeatSerial)
      form.setFields([
        {
          name: ['products', idx, 'fromSerial'],
          errors: ['Dải serial đã chọn trước đó'],
        },
      ]);
    else {
      formInstance.resetFormError(form, [['products', idx, 'fromSerial']]);
      const curToSerial =
        quantity && fromSerial ? +fromSerial + quantity - 1 : undefined;
      form.setFieldValue([name, idx, 'toSerial'], curToSerial);
      form.validateFields([[name, idx, 'toSerial']]);
    }
  };
  const handleClearSerial = (idx: number) => {
    form.setFieldValue([name, idx, 'toSerial'], 0);
  };
  return (
    <>
      <TableDynamic
        name="products"
        label="sản phẩm"
        disabled={isViewType}
        handleChoose={!isImport ? () => setIsOpenProduct(true) : undefined}
        isHiddenAction={isImport}
      >
        <Column
          dataIndex="productName"
          title={<div>Tên sản phẩm</div>}
          width={175}
          render={(value, record: any, index: number) => (
            <Form.Item name={[index, 'productName']}>
              <div>{value}</div>
            </Form.Item>
          )}
        />
        <Column
          width={135}
          dataIndex="productUom"
          title={<div>Đơn vị</div>}
          align="left"
          render={(value, record: any, index: number) => (
            <Form.Item name={[index, 'productUom']}>
              <div>{value}</div>
            </Form.Item>
          )}
        />
        <Column
          width={200}
          dataIndex="quantity"
          title={<div>Số lượng</div>}
          align="left"
          render={(value, record, idx) => {
            return (
              <Form.Item
                name={[idx, 'quantity']}
                validateTrigger={['onChange', 'onBlur']}
                rules={
                  [
                    record.fromSerial ? validateForm.required : undefined,
                    validateForm.maxNumber(
                      data[idx]?.quantity,
                      'Số lượng sản phẩm của phiếu vượt quá số lượng đơn hàng'
                    ),
                    validateForm.minNumber(
                      1,
                      'Số lượng phải lớn hơn hoặc bằng 1'
                    ),
                  ] as any[]
                }
              >
                <CInput
                  onlyNumber
                  onBlur={() => handleBlurSerial(idx)}
                  maxLength={9}
                  disabled={isViewType}
                  placeholder="Số lượng"
                  type="number"
                  preventSpace
                />
              </Form.Item>
            );
          }}
        />
        <Column
          dataIndex="fromSerial"
          title={<div>Serial đầu</div>}
          width={200}
          render={(value, record: any, idx: number) => {
            return (
              <Form.Item
                name={[idx, 'fromSerial']}
                messageVariables={{ label: 'Serial đầu' }}
                rules={[
                  //@ts-ignore
                  record?.quantity ? validateForm.required : undefined,
                  validateForm.serialSim,
                ]}
              >
                <CInput
                  onlyNumber
                  type="number"
                  onBlur={() => handleBlurSerial(idx)}
                  onClear={() => handleClearSerial(idx)}
                  maxLength={16}
                  disabled={isViewType}
                  placeholder="Serial đầu"
                  preventSpace
                />
              </Form.Item>
            );
          }}
        />

        <Column
          dataIndex="toSerial"
          title="Serial cuối"
          width={200}
          render={(value, record: any, idx: number) => (
            <Form.Item
              messageVariables={{ label: 'Serial cuối' }}
              name={[idx, 'toSerial']}
              rules={[validateForm.serialSim]}
            >
              <CInputNumber disabled placeholder="Serial cuối" />
            </Form.Item>
          )}
        />
      </TableDynamic>
      <ModalProduct
        isOpen={isOpenProduct}
        setIsOpen={setIsOpenProduct}
        setListProduct={setListProduct}
      />
    </>
  );
};

export default TableProduct;
