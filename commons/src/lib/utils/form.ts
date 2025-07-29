import { FieldErrorsType } from '@react/commons/types';
import { FormInstance } from 'antd';

const getFormError = (
  form: FormInstance,
  errors: FieldErrorsType[],
  field?: string | (string | number)[]
) => {
  if (errors?.length > 0) {
    form.setFields(
      errors.map((item: FieldErrorsType) => {
        return {
          name: [field ?? item.field],
          errors: [item.detail],
        };
      })
    );
  }
};

const resetFormError = (form: FormInstance, fields: any[] = []) => {
  form.setFields(
    fields.map((field) => ({
      name: field,
      errors: [],
    }))
  );
};

const resetAndSetFieldsValue = (
  form: FormInstance,
  values: { [key: string]: any }
) => {
  form.resetFields();
  form.setFieldsValue(values);
};

const formInstance = {
  getFormError,
  resetFormError,
  resetAndSetFieldsValue,
};
export default formInstance;
