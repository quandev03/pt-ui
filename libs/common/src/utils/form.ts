import { FormInstance } from 'antd';
import { IFieldErrorsItem } from '../types';

export const setFieldError = (
  form: FormInstance,
  errors: IFieldErrorsItem[]
) => {
  form.setFields(
    errors.map((item: IFieldErrorsItem) => ({
      name: item.field,
      errors: [item.detail],
    }))
  );
};
