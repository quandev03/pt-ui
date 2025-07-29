import { ActionType } from '@react/constants/app';
import { FormInstance, Input } from 'antd';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { ProductDTO } from '../type';

interface TotalAmountCellProps {
  value: string;
  typeModal: string;
  listProduct: ProductDTO[];
  setListProduct: any;
  setListSerialNumber: any;
  record: any;
  fetchSerialNumber: (product: ProductDTO) => any;
  form: FormInstance,
  index: number
}

const StartSerial: React.FC<TotalAmountCellProps> = ({
  value,
  typeModal,
  record,
  listProduct,
  setListProduct,
  setListSerialNumber,
  fetchSerialNumber,
  form,
  index
}) => {
  const [string, setString] = useState<string>('')
  const [error, setError] = useState<string>('')
  useEffect(() => {
    if (form) {
      const formValue = form.getFieldValue(`fromSerial-${index}`);
      setString(formValue || value);
    } else {
      setString(value)
    }
  }, [value, form, index])
  const debouncedChangeHandler = useCallback(
    debounce(
      (
        id: number,
        field: 'fromSerial' | 'quantity',
        value: string,
        setListProducts
      ) => {
        const filterdListProduct = listProduct.filter((item: any) => item.id !== undefined);

        const newList = filterdListProduct.map((item: ProductDTO) => {
          if (item.id === id) {
            const updatedItem = {
              ...item,
              [field]: value,
            };
            return updatedItem;
          }
          return item;
        });

        const productCalculation = newList.filter(
          (item: any) => item.fromSerial && item.quantity
        );
        if (productCalculation.length > 0) {
          const fetchSerialNumbers = async () => {
            try {
              const responses = await Promise.all(
                productCalculation.map(fetchSerialNumber)
              );
              const listSerialNumber = responses.flatMap((response: any) => response);

              setListSerialNumber(listSerialNumber)

            } catch (error) {
              console.log(error);
            }
          };
          fetchSerialNumbers();
        }
        setListProducts(newList);
      },
      800
    ),
    [listProduct]
  );
  const handleChangeValue = useCallback(
    (
      id: number,
      field: 'fromSerial'
    ) =>
      (e: any) => {
        const value = e.target.value;
        setString(value)
        form.setFieldsValue({ [`fromSerial-${index}`]: value })
        if (!value) {
          setError('Không được để trống trường này');
        } else if (!/^84/.test(value) || value.length !== 16) {
          setError('Serial đầu không đúng định dạng');
        } else {
          setError('');
        }
        debouncedChangeHandler(id, field, value, setListProduct);
      },
    [debouncedChangeHandler, form]
  );

  return (
    <div className='flex flex-col'>
      <Input
        disabled={typeModal === ActionType.VIEW || !record.checkSerial}
        placeholder={'Nhập serial đầu'}
        maxLength={16}
        value={record.checkSerial ? string : undefined}
        onChange={handleChangeValue(record.id, 'fromSerial')}
        onBlur={(e) => undefined}
        onKeyPress={(e) => {
          if (!/[0-9]/.test(e.key)) {
            e.preventDefault();
          }
        }}
        className={`${error ? 'border-red-500 hover:border-red-300 focus:border-red-500' : ''}`}
        style={{ color: "black" }}
      />
      {error ? (<span className='text-m text-[#ff4d4f]'>{error}</span>) : null}
    </div>
  )
}

export default StartSerial
