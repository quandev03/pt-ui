import { CInput, DebounceSelect, TableDynamic } from '@react/commons/index';
import { ActionsTypeEnum, ActionType } from '@react/constants/app';
import validateForm from '@react/utils/validator';
import { Form } from 'antd';
import Column from 'antd/lib/table/Column';
import { useMemo } from 'react';
import { useMutateListProduct } from '../hook/useGetListProduct';
import { ProductType } from '../type';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import { ParamsOption } from '@react/commons/types';

interface Props {
    actionType: ActionsTypeEnum | ActionType;
    name?: string;
}

const TableProduct: React.FC<Props> = ({ actionType, name = 'productInventories' }) => {
    const form = Form.useFormInstance();
    const isViewType = actionType === ActionType.VIEW;
    const { [name]: dataTable = [{}] }: { [name: string]: any[] } =
        Form.useWatch((e) => e, form) ?? {};
    const { mutateAsync: mutateListProduct, data: listProduct = [] } =
        useMutateListProduct();
    const listCurrentProduct = useMemo(
        () => (value: string) => {
            const selectedProductId = dataTable
                ?.map((e) => e.productCode)
                ?.filter((c) => c !== value);
            return listProduct.map((d) => ({
                ...d,
                disabled: selectedProductId.includes(d.value),
            }));
        },
        [listProduct, dataTable]
    );
    const { PRODUCT_PRODUCT_UOM } =
    useGetDataFromQueryKey<ParamsOption>([
        REACT_QUERY_KEYS.GET_PARAMS,
    ]) ?? {};
    const handleSelectProduct = (option: ProductType, idx: number) => {
        const productItem = form.getFieldValue([name, idx]);
        form.setFieldValue([name, idx], { ...productItem, ...option });
    };
    const handleClearProduct = () => {
        form.setFieldValue('productInventories', [{}]);
    };
    return (
        <TableDynamic
            name="productInventories"
            label="sản phẩm"
            disabled={isViewType}
        >
            <Column
                width={155}
                dataIndex="productCode"
                title={"Mã sản phẩm"}
                align="left"
                render={(value, record: any, index) => (
                    <Form.Item
                        name={[index, 'productCode']}
                        rules={[validateForm.required]}
                    >
                        <DebounceSelect
                            placeholder="Chọn mã sản phẩm"
                            fetchOptions={mutateListProduct}
                            disabled={isViewType}
                            onSelect={(value, option) =>
                                handleSelectProduct(option as ProductType, index)
                            }
                            getCurrentList={listCurrentProduct(value)}
                            onClear={handleClearProduct}
                            allowClear={false}
                        />
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
                width={155}
                dataIndex="productUom"
                title={<div>Đơn vị</div>}
                align="left"
                render={(value, record: any, index: number) => (
                    <Form.Item name={[index, 'productUom']}>
                          <div>{PRODUCT_PRODUCT_UOM?.find((e) => String(e.value) === String(value))?.label}</div>
                    </Form.Item>
                )}
            />
            <Column
                width={145}
                dataIndex="quantity"
                title={"Số lượng"}
                align="left"
                render={(value, __, idx) => {
                    return (
                        <Form.Item
                            name={[idx, 'quantity']}
                            rules={[
                                validateForm.required,
                                validateForm.minNumber(1, 'Số lượng phải lớn hơn 0'),
                            ]}
                        >
                            <CInput
                                placeholder="Số lượng"
                                maxLength={9}
                                disabled={isViewType}
                                onlyNumber
                            />
                        </Form.Item>
                    );
                }}
            />
        </TableDynamic>
    );
};

export default TableProduct;
