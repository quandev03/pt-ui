import { Button, CModal, NotificationSuccess } from '@react/commons/index';
import { Form } from 'antd';
import { useForm } from 'antd/es/form/Form';
import ModalConfirm from 'apps/Internal/src/components/modalConfirm';
import { Key, useEffect, useState } from 'react';
import { Flex, Progress } from 'antd';
import type { ProgressProps } from 'antd';
import { useAcceptFn } from '../queryHook/useAccept';
import React from 'react';
import { random } from 'lodash';
type Props = {
  isOpenProcess: boolean;
  setIsOpenProcess: (value: boolean) => void;
  selectedRowKeys: Key[];
  setSelectedRowKeys: (value: Key[]) => void;
  isPassSensor: boolean;
};
const twoColors: ProgressProps['strokeColor'] = {
  '0%': '#108ee9',
  '100%': '#87d068',
};

const AcceptModal: React.FC<Props> = ({
  isOpenProcess,
  setIsOpenProcess,
  selectedRowKeys,
  setSelectedRowKeys,
  isPassSensor,
}) => {
  const [form] = useForm();
  let numSuccess = 0;
  const lastNoti = () => {
    NotificationSuccess(
      `Đã phê duyệt và kích hoạt thành công ${form.getFieldValue(
        'numSuccess'
      )}/${totalKeys}!`
    );
    form.setFieldValue('progress', 0);
    setIsOpenProcess(false);
    setSelectedRowKeys([]);
  }
  const { mutate: acceptMutate, mutateAsync: acceptMutateAsync } = useAcceptFn(
    (data, variables) => {
      numSuccess++;
      form.setFieldValue('numSuccess', numSuccess);
      NotificationSuccess('Phê duyệt yêu cầu kích hoạt thành công');

      if (variables.isLast) {
        setTimeout(() => {
          lastNoti()
        }, 3000)
      }
    },
    (data, variables) => {
      if (variables.isLast) {
        setTimeout(() => {
          lastNoti()
        }, 3000)
      }
    }
  );
  const [progress, setProgress] = useState(0);
  const [hasCalledApi, setHasCalledApi] = useState(false);
  const totalKeys = selectedRowKeys.length;
  const mounted = React.useRef(false);
  let processedCount = 0;

  const processAutoGather = async (id: any, i: number, length: number) => {
    return new Promise((resolve, reject) => {
      console.log(`Calling API for ID: ${id}`);
      console.log(`Successfully called API for ID: ${id}`);
      form.setFieldValue('listIds', [id]);
      if (!isOpenProcess) {
        return;
      }

      acceptMutateAsync({ ...form.getFieldsValue(), isLast: i === length });
      processedCount++;
      const percentage = Math.round((processedCount / totalKeys) * 100);
      const time = random(70000, 120000);
      console.log('TIME CHECKKKKKKKKKKK', time);
      if (i !== length) {
        setTimeout(() => {
          return resolve(true);
        }, time);
      } else {
        setTimeout(() => {
          return resolve(true);
        }, 1000);
      }
      setProgress(percentage);
      form.setFieldValue('progress', processedCount);
    });
  };

  const callApiSequentially = async () => {
    processedCount = 0;
    try {
      for (let i = 0; i < selectedRowKeys.length && mounted.current; i++) {
        const id = selectedRowKeys[i];
        await processAutoGather(id, i + 1, selectedRowKeys.length);
      }
      form.setFieldValue('progress', processedCount);
      // if (mounted.current) {

      // }
    } catch (error) {
      console.error(`Error calling API with ID`, error);
    }
  };

  const handleCancel = () => {
    ModalConfirm({
      message:
        'Bạn có chắc chắn muốn dừng phê duyệt các yêu cầu kích hoạt này?',
      handleConfirm: () => {
        setSelectedRowKeys([]);
        setIsOpenProcess(false);
        NotificationSuccess(
          `Đã phê duyệt và kích hoạt thành công ${form.getFieldValue(
            'numSuccess'
          )}/${totalKeys}!`
        );
        setProgress(0);
        form.setFieldValue('progress', 0);
      },
    });
  };

  useEffect(() => {
    if (isOpenProcess && selectedRowKeys.length > 0 && !hasCalledApi) {
      setHasCalledApi(true);
      // callApiSequentially();
      setHasCalledApi(false);
    }
  }, [isOpenProcess]);
  useEffect(() => {
    if (isPassSensor) {
      form.setFieldValue('passSensor', true);
    } else {
      form.setFieldValue('passSensor', false);
    }
    mounted.current = true;
    callApiSequentially();
    return () => {
      mounted.current = false;
    };
  }, []);

  return (
    <CModal
      title={'Phê duyệt yêu cầu kích hoạt'}
      open={isOpenProcess}
      onCancel={handleCancel}
      footer={[
        <Button key="close" type="default" onClick={handleCancel}>
          Dừng phê duyệt
        </Button>,
      ]}
    >
      <Form form={form} colon={false} layout="vertical">
        <Form.Item label="" name="listIds" hidden />
        <Form.Item label="" name="isLast" initialValue={false} hidden />
        <Form.Item label="" name="passSensor" hidden />
        <Form.Item label="" name="progress" hidden />
        <Form.Item label="" name="numSuccess" hidden initialValue={0} />
      </Form>
      <Flex vertical gap="middle">
        <Flex gap="small" wrap>
          Đã phê duyệt {form.getFieldValue('progress')}/{totalKeys} yêu cầu kích
          hoạt:
        </Flex>
        <Progress percent={progress} strokeColor={twoColors} />
      </Flex>
    </CModal>
  );
};

export default AcceptModal;
