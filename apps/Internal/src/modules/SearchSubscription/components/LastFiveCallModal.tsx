import { Form } from 'antd';
import { LastFiveCallError, ModalProps } from '../types';
import { CInput, CModal } from '@react/commons/index';
import { useLastFiveCallMutation } from '../hooks/useLastFiveCallMutation';
import { MESSAGE } from '@react/utils/message';
import { FormInstance, Rule } from 'antd/es/form';
import _ from 'lodash';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import { useState } from 'react';

const fields = [
  'phoneNumber1',
  'phoneNumber2',
  'phoneNumber3',
  'phoneNumber4',
  'phoneNumber5',
];

const errorDefault = {
  phoneNumber1: { status: undefined, help: undefined },
  phoneNumber2: { status: undefined, help: undefined },
  phoneNumber3: { status: undefined, help: undefined },
  phoneNumber4: { status: undefined, help: undefined },
  phoneNumber5: { status: undefined, help: undefined },
};

const isdnValidator = (form: FormInstance, fields: string[]): Rule => ({
  validator: (_, value) => {
    const newValue = value?.replace(/\D/g, '');
    if (newValue) {
      if (newValue.length < 9) {
        return Promise.reject(new Error(MESSAGE.G07));
      }
      for (let i = 0; i < fields.length; i++) {
        if (value === form.getFieldValue(fields[i])) {
          return Promise.reject(new Error('Số thuê bao đã tồn tại'));
        }
      }
    }
    return Promise.resolve();
  },
});

const fieldIgnore = (field: string) => {
  return fields.filter((item) => item !== field);
};

const LastFiveCallModal: React.FC<ModalProps> = ({ isOpen, setIsOpen }) => {
  const formInstance = useFormInstance();
  const [form] = Form.useForm();
  const [errors, setErrors] = useState<LastFiveCallError>(errorDefault);
  const { isPending, mutate } = useLastFiveCallMutation();

  const handleFinish = (values: any) => {
    if (!_.values(values).every(_.isEmpty)) {
      const newValues = _.omitBy(values, _.isEmpty) as any;
      mutate(
        {
          ...newValues,
          isdn: formInstance.getFieldValue('isdn'),
        },
        {
          onSettled: (data, err) => {
            if (data || err?.errors?.length) {
              const errors: LastFiveCallError = { ...errorDefault };
              fields.forEach((item) => {
                const error = err?.errors?.find(
                  (item2) => item2.field === item
                );
                (errors as any)[item] = {
                  status: error ? 'error' : undefined,
                  help: error
                    ? error.detail
                    : values[item]
                    ? 'Có liên hệ'
                    : undefined,
                };
              });
              setErrors(errors);
            }
          },
        }
      );
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    setErrors(errorDefault);
    form.resetFields();
  };

  return (
    <CModal
      open={isOpen}
      title="Tra cứu 5 số điện thoại đã liên lạc"
      okText="Tra cứu"
      cancelText="Đóng"
      onOk={form.submit}
      onCancel={handleCancel}
      loading={isPending}
    >
      <Form
        form={form}
        labelCol={{ span: 6 }}
        colon={false}
        onFinish={handleFinish}
        onValuesChange={(changedValues, values) => {
          const changedKey = Object.keys(changedValues)[0];
          const newErrors = {
            ...errors,
            [changedKey]: {
              status: undefined,
              help: undefined,
            },
          };

          delete values[changedKey];
          Object.entries(values).forEach(([key, value]) => {
            if (value === changedValues[changedKey]) {
              (newErrors as any)[key] = {
                status: undefined,
                help: undefined,
              };
            }
          });

          setErrors(newErrors);
        }}
      >
        <Form.Item
          label="Thuê bao 1"
          name="phoneNumber1"
          messageVariables={{ label: 'Số thuê bao' }}
          dependencies={fieldIgnore('phoneNumber1')}
          rules={[isdnValidator(form, fieldIgnore('phoneNumber1'))]}
          validateStatus={errors.phoneNumber1.status}
          help={errors.phoneNumber1.help}
        >
          <CInput placeholder="Nhập số thuê bao" maxLength={11} onlyNumber />
        </Form.Item>
        <Form.Item
          label="Thuê bao 2"
          name="phoneNumber2"
          messageVariables={{ label: 'Số thuê bao' }}
          dependencies={fieldIgnore('phoneNumber2')}
          rules={[isdnValidator(form, fieldIgnore('phoneNumber2'))]}
          validateStatus={errors.phoneNumber2.status}
          help={errors.phoneNumber2.help}
        >
          <CInput placeholder="Nhập số thuê bao" maxLength={11} onlyNumber />
        </Form.Item>
        <Form.Item
          label="Thuê bao 3"
          name="phoneNumber3"
          messageVariables={{ label: 'Số thuê bao' }}
          dependencies={fieldIgnore('phoneNumber3')}
          rules={[isdnValidator(form, fieldIgnore('phoneNumber3'))]}
          validateStatus={errors.phoneNumber3.status}
          help={errors.phoneNumber3.help}
        >
          <CInput placeholder="Nhập số thuê bao" maxLength={11} onlyNumber />
        </Form.Item>
        <Form.Item
          label="Thuê bao 4"
          name="phoneNumber4"
          messageVariables={{ label: 'Số thuê bao' }}
          dependencies={fieldIgnore('phoneNumber4')}
          rules={[isdnValidator(form, fieldIgnore('phoneNumber4'))]}
          validateStatus={errors.phoneNumber4.status}
          help={errors.phoneNumber4.help}
        >
          <CInput placeholder="Nhập số thuê bao" maxLength={11} onlyNumber />
        </Form.Item>
        <Form.Item
          label="Thuê bao 5"
          name="phoneNumber5"
          messageVariables={{ label: 'Số thuê bao' }}
          dependencies={fieldIgnore('phoneNumber5')}
          rules={[isdnValidator(form, fieldIgnore('phoneNumber5'))]}
          validateStatus={errors.phoneNumber5.status}
          help={errors.phoneNumber5.help}
        >
          <CInput placeholder="Nhập số thuê bao" maxLength={11} onlyNumber />
        </Form.Item>
      </Form>
    </CModal>
  );
};

export default LastFiveCallModal;
