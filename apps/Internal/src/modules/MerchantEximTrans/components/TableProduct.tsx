import { TableDynamic } from '@react/commons/index';
import { ActionsTypeEnum, ActionType } from '@react/constants/app';
import { Form } from 'antd';
import Column from 'antd/lib/table/Column';
import { uniqBy } from 'lodash';
import { useState } from 'react';
import ModalProduct from '../../MerchantOrder/components/ModalProduct';
import { ProductType } from '../types';

interface Props {
  actionType: ActionsTypeEnum | ActionType;
  name?: string;
  isExport?: boolean;
}

const TableProduct: React.FC<Props> = ({
  actionType,
  name = 'products',
  isExport = false,
}) => {
  const form = Form.useFormInstance();
  const isViewType = actionType === ActionType.VIEW;
  const [isOpenProduct, setIsOpenProduct] = useState<boolean>(false);
  const { [name]: dataTable = [] } = Form.useWatch((e) => e, form) ?? {};

  const setListProduct = (data: ProductType[]) => {
    form.setFieldValue(
      name,
      dataTable[0]?.id ? uniqBy(dataTable.concat(data), 'id') : data
    );
  };

  return (
    <>
      <TableDynamic
        name="products"
        label="sản phẩm"
        disabled={isViewType}
        isHiddenAction={!isExport}
      >
        <Column
          dataIndex="productCode"
          title={<div>Mã sản phẩm</div>}
          width={145}
          render={(value, record: any, index: number) => (
            <Form.Item name={[index, 'productCode']}>
              <div>{value}</div>
            </Form.Item>
          )}
        />
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
          width={105}
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
          width={115}
          dataIndex="quantity"
          title={<div>Số lượng</div>}
          align="left"
          render={(value, __, idx) => (
            <Form.Item name={[idx, 'quantity']} rules={[]}>
              <div>{value}</div>
            </Form.Item>
          )}
        />
        <Column
          dataIndex="fromSerial"
          title={<div>Serial đầu</div>}
          align="center"
          width={200}
          render={(value, record: any, idx: number) => (
            <Form.Item name={[idx, 'fromSerial']} rules={[]}>
              <div>{value}</div>
            </Form.Item>
          )}
        />

        <Column
          dataIndex="toSerial"
          title="Serial cuối"
          align="center"
          width={200}
          render={(value, record: any, idx: number) => (
            <Form.Item name={[idx, 'toSerial']}>
              <div>{value}</div>
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
