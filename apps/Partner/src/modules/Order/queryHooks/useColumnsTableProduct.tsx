import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CInput from '@react/commons/Input';
import { Text } from '@react/commons/Template/style';
import { ACTION_MODE_ENUM } from '@react/commons/types';
import { formatCurrencyVND } from '@react/helpers/utils';
import useActionMode from '@react/hooks/useActionMode';
import { Form, Tooltip } from 'antd';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import { ColumnsType } from 'antd/es/table';
import validateForm from 'apps/Partner/src/utils/validator';
import { useSupportGetCalculateDiscount } from '.';
import SelectProduct from '../components/SelectProduct';
import useOrderStore from '../stores';
import { IProductInOrder } from '../types';

const useColumnsTableProduct = (): ColumnsType<IProductInOrder> => {
  const form = useFormInstance();
  const products: IProductInOrder[] = Form.useWatch('products', form) ?? [];
  const actionMode = useActionMode();

  const { calculateInfo, setCalculateInfo, setShowValidDiscount } =
    useOrderStore();

  const { mutate: getCalculateDiscountAction } = useSupportGetCalculateDiscount(
    (data) => {
      const isDiscountValid =
        data.amountAdditionalDiscount > data.amountProduct;
      setShowValidDiscount(isDiscountValid);

      const updatedProducts = data.orderDetailInfos.map((product) => {
        const currentProduct = products.find(
          (item) => item?.productId === product?.productId
        );
        const result: IProductInOrder = { ...currentProduct, ...product };
        const preferentialLinesCurrent = data.preferentialLines.filter(
          (item) => item?.productId === product?.productId
        );
        preferentialLinesCurrent.forEach((item) => {
          if (item.discountType === 1) {
            result.packageDiscountAmount = item.amount;
          } else if (item.discountType === 2) {
            result.simDiscountAmount = item.amount;
          }
        });
        return result;
      });
      form.setFieldValue('products', updatedProducts);
      setCalculateInfo(data);
    }
  );

  const handleRemove = (index: number) => () => {
    const isNeedCall = products[index].quantity && products[index].productId;
    const newProducts = products.filter((_, idx) => idx !== index);
    newProducts.forEach((_, index) => {
      form.validateFields([['products', index, 'quantity']]);
      form.validateFields([['products', index, 'productId']]);
    });
    if (isNeedCall) {
      getCalculateDiscountAction({
        orderDetailInfos: newProducts,
        amountAdditionalDiscount: calculateInfo?.amountAdditionalDiscount ?? 0,
      });
    } else {
      form.setFieldValue('products', newProducts);
    }
  };

  const handleAdd = () => {
    const newProducts = [
      ...products,
      {
        productCode: null,
        productName: '',
        productUOM: '',
        quantity: 1,
        price: 0,
        simDiscountAmount: 0,
        packageDiscountAmount: 0,
        amountTotal: 0,
        amountDiscount: 0,
        vat: 0,
      },
    ];
    form.setFieldValue('products', newProducts);
  };

  return [
    {
      title: 'STT',
      align: 'left',
      width: 50,
      fixed: 'left',
      render(_, __, index) {
        return <Text>{index + 1}</Text>;
      },
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'productName',
      width: 160,
      align: 'left',
      fixed: 'left',
      render(_, __, index) {
        return <SelectProduct index={index} />;
      },
    },
    {
      title: 'Mã sản phẩm',
      dataIndex: 'productCode',
      width: 130,
      align: 'left',
      fixed: 'left',
      render(value) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Đơn vị',
      dataIndex: 'productUOM',
      width: 80,
      align: 'left',
      render(value) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      width: 100,
      align: 'left',
      render(_, __, index) {
        return (
          <Form.Item
            name={[index, 'quantity']}
            rules={[validateForm.required]}
            validateTrigger={['onSubmit']}
          >
            <CInput
              placeholder="Số lượng"
              disabled={actionMode === ACTION_MODE_ENUM.VIEW}
              onlyNumber
              maxLength={9}
              allowClear={false}
            />
          </Form.Item>
        );
      },
    },
    {
      title: 'Đơn giá',
      dataIndex: 'price',
      width: 120,
      align: 'right',
      render(value) {
        return (
          <Tooltip title={formatCurrencyVND(value ?? 0)} placement="topRight">
            <Text>{formatCurrencyVND(value ?? 0)}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Chiết khấu SIM',
      dataIndex: 'simDiscountAmount',
      width: 150,
      align: 'right',
      render(value) {
        return (
          <Tooltip title={formatCurrencyVND(value ?? 0)} placement="topRight">
            <Text>{formatCurrencyVND(value ?? 0)}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Chiết khấu gói',
      dataIndex: 'packageDiscountAmount',
      width: 150,
      align: 'right',
      render(value) {
        return (
          <Tooltip title={formatCurrencyVND(value ?? 0)} placement="topRight">
            <Text>{formatCurrencyVND(value ?? 0)}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Thành tiền trước CK',
      width: 150,
      align: 'right',
      render(_, record) {
        const text =
          Number(record.amountTotal ?? 0) + Number(record.amountDiscount ?? 0);
        return (
          <Tooltip title={formatCurrencyVND(text ?? 0)} placement="topRight">
            <Text>{formatCurrencyVND(text ?? 0)}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Thành tiền sau CK',
      dataIndex: 'amountTotal',
      width: 150,
      align: 'right',
      render(value) {
        return (
          <Tooltip title={formatCurrencyVND(value ?? 0)} placement="topRight">
            <Text>{formatCurrencyVND(value ?? 0)}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Thuế VAT',
      dataIndex: 'vat',
      width: 100,
      align: 'right',
      render(value = 0) {
        return (
          <Tooltip title={value + '%'} placement="topRight">
            <Text>{value}%</Text>
          </Tooltip>
        );
      },
    },

    {
      title: '',
      align: 'center',
      width: 100,
      fixed: 'right',
      render(_, __, index) {
        return (
          <div className="flex mt-1">
            {products.length > 1 && actionMode !== ACTION_MODE_ENUM.VIEW && (
              <FontAwesomeIcon
                fontSize={16}
                icon={faMinus}
                onClick={handleRemove(index)}
                className="mr-6 cursor-pointer"
              />
            )}
            {index === products.length - 1 &&
            actionMode !== ACTION_MODE_ENUM.VIEW ? (
              <FontAwesomeIcon
                fontSize={16}
                icon={faPlus}
                onClick={() => handleAdd()}
                className="mr-6 cursor-pointer"
              />
            ) : null}
          </div>
        );
      },
    },
  ];
};

export default useColumnsTableProduct;
