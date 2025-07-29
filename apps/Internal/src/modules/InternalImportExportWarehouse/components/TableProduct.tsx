import { CInput } from '@react/commons/index';
import { ActionsTypeEnum, ActionType } from '@react/constants/app';
import { MESSAGE } from '@react/utils/message';
import validateForm from '@react/utils/validator';
import { Form } from 'antd';
import Column from 'antd/lib/table/Column';
import { debounce } from 'lodash';
import { useCallback, useEffect } from 'react';
import { useFilterSerial } from '../hook/useFilterSerial';
import { IDataProduct, ISerialItem } from '../type';
import TableDynamicInternalWarehouse from './TableDynamicInternalWarehouse';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import { ParamsOption } from '@react/commons/types';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
interface Props {
    actionType: ActionsTypeEnum | ActionType;
    name?: string;
    isImport?: boolean;
    data?: any[];
    listProduct: IDataProduct[];
    listSerialNumber: ISerialItem[];
    setListProduct: any;
    setListSerialNumber: any;
    orgId: number;
}

const TableProduct: React.FC<Props> = ({
    actionType,
    name = 'products',
    data = [],
    listProduct,
    setListProduct,
    orgId
}) => {
    const form = Form.useFormInstance();
    const isViewType = actionType === ActionType.VIEW;
    const handleClearSerial = (idx: number) => {
        form.setFieldValue([name, idx, 'toSerial'], null);
    };
    useEffect(() => {
        form.setFieldValue(
            name,
            data
        );
    }, [data])
    const { mutateAsync: suggestSerialNumber } = useFilterSerial((data) => {
        return data;
    });
    const { PRODUCT_PRODUCT_UOM } =
    useGetDataFromQueryKey<ParamsOption>([
      REACT_QUERY_KEYS.GET_PARAMS,
    ]) ?? {};
    const debouncedChangeHandler = useCallback(
        debounce(
            (
                id: number,
                field: 'fromSerial' | 'quantity',
                value: string,
            ) => {
                const filterdListProduct = listProduct.filter((item: IDataProduct) => item.id);
                const newList = filterdListProduct.filter((item: IDataProduct) => {
                    return item.id === id
                }).map((item: IDataProduct) => {
                    return {
                        productId: item.productId,
                        orgId: orgId,
                        quantity: item.quantity,
                        fromSerial: Number(value)
                    }
                });
                if (newList.length > 0) {
                    const fetchSerialNumbers = async () => {
                        try {
                            const responses = await suggestSerialNumber(newList)
                            const findIndex = listProduct.findIndex((item: IDataProduct) => item.productId === responses[0].productId && item.id)
                            const findIndexEnd = listProduct.length - 1 - [...listProduct].reverse().findIndex((item: IDataProduct) =>
                                item.productId === responses[0].productId
                            );
                            if (findIndex !== -1 && findIndexEnd !== -1) {
                                const item = {
                                    ...listProduct[findIndex],
                                    fromSerial: responses[0].fromSerial,
                                    toSerial: responses[0].toSerial,
                                }

                                const before = listProduct.slice(0, findIndex);
                                const after = listProduct.slice(findIndexEnd + 1);

                                const childrenItems = Array.isArray(responses[0].serialChildrenList) && responses[0].serialChildrenList.length > 0 ?
                                    responses[0].serialChildrenList.map((serial: any) => ({
                                        productId: serial.productId,
                                        fromSerial: serial.fromSerial,
                                        toSerial: serial.toSerial,
                                        quantity: serial.quantity,
                                        orgId: responses[0].orgId,
                                        checkSerial: true,
                                        productCode: listProduct.find((product: any) => product.productId === serial.productId)?.productCode,
                                    })) : [];

                                setListProduct([...before, item, ...childrenItems, ...after]);
                            }
                        } catch (error) {
                            console.log(error);
                        }
                    };
                    fetchSerialNumbers();
                }
            },
            1000
        ),
        [listProduct]
    );
    const handleChangeValue = useCallback(
        (
            id: number,
            field: 'fromSerial' | 'quantity'
        ) =>
            (e: any) => {
                const value = e.target.value;
                if (value && validateForm.serialSim.pattern?.test(value)) {
                    debouncedChangeHandler(id, field, value);
                }
            },
        [debouncedChangeHandler]
    );
    return (
        <TableDynamicInternalWarehouse
            name={name}
            label="sản phẩm"
            disabled={isViewType}
            isHiddenAction={true}
        >
            <Column
                dataIndex="productName"
                title={<div>Tên sản phẩm</div>}
                width={175}
                ellipsis={{ showTitle: false }}
                render={(value, record: any, index: number) => (
                    <Form.Item name={[index, 'productName']}>
                        <div>{value}</div>
                    </Form.Item>
                )}
            />
            <Column
                dataIndex="productCode"
                title={<div>Mã sản phẩm</div>}
                width={175}
                ellipsis={{ showTitle: false }}
                render={(value, record: any, index: number) => (
                    record.id || actionType === ActionType.VIEW || !record.checkSerial ?
                        <Form.Item name={[index, 'productCode']}>
                            <div>{value}</div>
                        </Form.Item>
                        : <></>
                )}
            />
            <Column
                width={135}
                dataIndex="productUOM"
                title={<div>Đơn vị</div>}
                align="left"
                ellipsis={{ showTitle: false }}
                render={(value, record: any, index: number) => (
                    <Form.Item name={[index, 'productUOM']}>
                         <div>{PRODUCT_PRODUCT_UOM?.find((e) => String(e.value) === String(value))?.label}</div>
                    </Form.Item>
                )}
            />
            <Column
                width={200}
                dataIndex="quantity"
                title={<div>Số lượng</div>}
                align="left"
                ellipsis={{ showTitle: false }}
                render={(value, record, idx) => {
                    return (
                        <Form.Item
                            name={[idx, 'quantity']}
                            rules={[
                                validateForm.maxNumber(
                                    data[idx]?.quantity,
                                    'Số lượng sản phẩm của phiếu vượt quá số lượng đơn hàng'
                                ),
                                validateForm.minNumber(
                                    1,
                                    'Vui lòng kiểm tra lại, phiếu nhập cần có ít nhất 1 sản phẩm được nhập'
                                ),
                            ]}
                        >
                            <CInput
                                disabled
                                onlyNumber
                                maxLength={9}
                                placeholder="Số lượng"
                                type="number"
                            />
                        </Form.Item>
                    );
                }}
            />
            <Column
                dataIndex="fromSerial"
                title={<div>Serial đầu</div>}
                width={200}
                render={(value, record: any, idx: number) => (
                    <Form.Item
                        name={[idx, 'fromSerial']}
                        messageVariables={{ label: 'Serial đầu' }}
                        rules={[
                            {
                                required: record.checkSerial,
                                message: MESSAGE.G06
                            },
                            validateForm.serialSim
                        ]}
                    >
                        <CInput
                            readOnly={actionType === ActionType.VIEW}
                            onChange={handleChangeValue(record.id, 'fromSerial')}
                            disabled={!record.id || !record.checkSerial}
                            onlyNumber
                            type="number"
                            onClear={() => handleClearSerial(idx)}
                            maxLength={16}
                            placeholder="Serial đầu"
                        />
                    </Form.Item>
                )}
            />
            <Column
                dataIndex="toSerial"
                title="Serial cuối"
                width={200}
                render={(value, record: any, idx: number) => (
                    <Form.Item
                        rules={[
                            {
                                validator: () => {
                                    if (record.checkSerial && record.id && record.fromSerial && !record.toSerial) {
                                        return Promise.reject(
                                            new Error('Số lượng serial trong kho không đủ')
                                        )
                                    }
                                    return Promise.resolve()
                                }
                            }
                        ]}
                        name={[idx, 'toSerial']}>
                        <CInput disabled placeholder="Serial cuối" />
                    </Form.Item>
                )}
            />
        </TableDynamicInternalWarehouse >
    );
};

export default TableProduct;
