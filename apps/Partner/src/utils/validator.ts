import { Rule } from 'antd/lib/form';
import { MESSAGE } from './message';

const phoneRegExp = /^((0776|0777|0778|0779)\d{6})|(051\d{7})$/;

const required = {
  required: true,
  message: MESSAGE.G21,
};

const maxLength = (max: number): Rule => ({
  max,
  message: MESSAGE.G34(max),
});

const phoneNumber: Rule = { pattern: phoneRegExp, message: MESSAGE.G23 };

const lengthNumber = (len: number) => ({
  len,
  message: MESSAGE.G23,
});

const validateForm = {
  required,
  maxLength,
  phoneNumber,
  lengthNumber,
};

export default validateForm;
