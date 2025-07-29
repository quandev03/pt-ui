import { serialRegex } from '@react/constants/regex';
import { Rule } from 'antd/es/form';
import { useWatch } from 'antd/es/form/Form';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import { FC, useState } from 'react';
import {
  ArrowIcon,
  RangeNumberPicker,
  RangePickerFrom,
  RangePickerTo,
  StyleFormItem,
} from './styled,';

export interface IRangeNumber {
  name: [string, string];
  placeholder: [string, string];
  width?: string;
  maxLength?: number;
  rules?: [Rule[], Rule[]];
}

export const RangeNumber: FC<IRangeNumber> = ({
  name,
  placeholder,
  width = '350px',
  maxLength,
  rules,
}) => {
  return (
    <RangeNumberPicker width={width}>
      <StyleFormItem name={name[0]} rules={rules ? rules[0] : undefined}>
        <RangePickerFrom
          placeholder={placeholder[0]}
          onlyNumber
          allowClear={false}
          maxLength={maxLength}
          className="numberFrom"
        />
      </StyleFormItem>
      <ArrowIcon />
      <StyleFormItem name={name[1]} rules={rules ? rules[1] : undefined}>
        <RangePickerTo
          placeholder={placeholder[1]}
          onlyNumber
          allowClear={false}
          maxLength={maxLength}
          className="numberTo"
        />
      </StyleFormItem>
    </RangeNumberPicker>
  );
};

export const RangeNumberSerial: FC<IRangeNumber> = ({
  name,
  placeholder,
  width = '400px',
}) => {
  const [fromSerial, toSerial] = name;
  const [placeholderFromSerial, placeholderToSerial] = placeholder;
  const form = useFormInstance();
  const fromSerialValue = useWatch(fromSerial, form);
  const [isErrorTo, setIsErrorTo] = useState(false);

  return (
    <RangeNumberPicker width={width} className={`min-w-[400px]`}>
      <StyleFormItem
        name={fromSerial}
        rules={[
          {
            validator(rule, value, callback) {
              if (!value) {
                return Promise.resolve();
              }
              if (value && value.length !== 16) {
                return Promise.reject('Serial không đúng định dạng');
              }
              if (!serialRegex.test(value)) {
                return Promise.reject('Serial không đúng định dạng');
              }
              return Promise.resolve();
            },
          },
        ]}
      >
        <RangePickerFrom
          placeholder={placeholderFromSerial}
          onlyNumber
          allowClear={false}
          maxLength={16}
          className={`numberFrom`}
          onBlur={() => {
            form.validateFields([toSerial]);
          }}
        />
      </StyleFormItem>
      <ArrowIcon />
      <StyleFormItem
        name={toSerial}
        className={`${isErrorTo ? 'customErrorMessage' : ''}`}
        rules={[
          {
            validator(rule, value, callback) {
              if (!value) {
                setIsErrorTo(false);
                return Promise.resolve();
              }
              if (value && value.length !== 16) {
                return Promise.reject('Serial không đúng định dạng');
              }
              if (!serialRegex.test(value)) {
                return Promise.reject('Serial không đúng định dạng');
              }
              if (
                fromSerialValue &&
                serialRegex.test(fromSerialValue) &&
                serialRegex.test(value) &&
                fromSerialValue > value
              ) {
                setIsErrorTo(true);
                return Promise.reject(
                  'Dải serial từ phải nhỏ hơn hoặc bằng Dải serial đến'
                );
              }
              setIsErrorTo(false);
              return Promise.resolve();
            },
          },
        ]}
      >
        <RangePickerTo
          placeholder={placeholderToSerial}
          onlyNumber
          allowClear={false}
          maxLength={16}
          className="numberTo"
        />
      </StyleFormItem>
    </RangeNumberPicker>
  );
};
