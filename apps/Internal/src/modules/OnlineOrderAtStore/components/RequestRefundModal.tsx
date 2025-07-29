import { CButtonClose, CButtonSave } from '@react/commons/Button';
import { CInput, CModal } from '@react/commons/index';
import validateForm from '@react/utils/validator';
import { useQueryClient } from '@tanstack/react-query';
import { Flex, Form, Select, Tooltip } from 'antd';
import { debounce } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  REACT_QUERY_KEYS_ONLINE_ORDER_AT_STORE,
  useInfinityScrollUser,
  useRefundOrderAtStore,
} from '../queryHooks';
import useOrderStore from '../stores';
import { IParamsUserRefund } from '../types';

interface Props {
  onRefundSuccess?: () => void;
}

export const RequestRefundModal: React.FC<Props> = ({ onRefundSuccess }) => {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const { record, isOpenRefundModal, closeRefundModal } = useOrderStore();
  const [params, setParams] = useState<IParamsUserRefund>({
    page: 0,
    q: '',
    size: 20,
  });
  const { mutate: onRefund } = useRefundOrderAtStore(() => {
    handleCancel();
    onRefundSuccess && onRefundSuccess();
  });

  const {
    data: userList = [],
    fetchNextPage: userFetchNextPage,
    hasNextPage: userHasNextPage,
    isLoading,
    refetch,
  } = useInfinityScrollUser(params);

  const handleFinish = (values: any) => {
    record?.id && onRefund({ id: record?.id, receiveUser: values.receiveUser });
  };

  const handleCancel = () => {
    closeRefundModal();
    form.resetFields();
  };

  useEffect(() => {
    if (isOpenRefundModal && record) {
      form.setFieldsValue({
        orderNo: record.orderNo,
        amountTotal: record.amountTotal,
      });
    }
  }, [record, isOpenRefundModal]);

  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const target = event.target as HTMLDivElement;
      if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
        if (userHasNextPage && !isLoading) {
          userFetchNextPage();
        }
      }
    },
    [userFetchNextPage, userHasNextPage, isLoading]
  );

  const debouncedSearch = useCallback(
    debounce((value) => {
      if (value) {
        setParams({
          page: 0,
          size: 20,
          q: value,
        });
      } else {
        resetQuery();
      }
    }, 500),
    []
  );

  const resetQuery = () => {
    setParams({
      page: 0,
      size: 20,
      q: '',
    });
    queryClient.resetQueries({
      queryKey: [
        REACT_QUERY_KEYS_ONLINE_ORDER_AT_STORE.GET_LIST_USER_REFUND,
        { page: 0, size: 20, q: '' },
      ],
    });
    refetch();
  };

  const optionUser = useMemo(() => {
    if (!userList) return [];
    return userList.map((item) => ({
      label: item.username,
      value: item.username,
    }));
  }, [userList]);

  const handleSearchValue = (value: string) => {
    debouncedSearch(value);
  };

  return (
    <CModal
      open={isOpenRefundModal}
      title={'Gửi yêu cầu hoàn tiền'}
      footer={[
        <Flex justify="end" gap={12} className="w-full">
          <CButtonClose type="default" onClick={handleCancel} />
          <CButtonSave onClick={form.submit} htmlType="submit" />
        </Flex>,
      ]}
      width={800}
      onCancel={handleCancel}
    >
      <Form
        form={form}
        labelCol={{ span: 8 }}
        colon={false}
        onFinish={handleFinish}
      >
        <Form.Item label="Mã đơn hàng" name="orderNo">
          <CInput disabled placeholder="Mã đơn hàng" value={record?.orderNo} />
        </Form.Item>
        <Form.Item label="Tổng tiền hoàn" name="amountTotal">
          <CInput disabled placeholder="Tổng tiền hoàn" />
        </Form.Item>
        <Form.Item
          label="Người nhận yêu cầu hoàn tiền"
          name="receiveUser"
          rules={[validateForm.required]}
        >
          <Select
            options={optionUser}
            mode="multiple"
            onPopupScroll={handleScroll}
            showSearch
            placeholder="Người nhận yêu cầu hoàn tiền"
            onSearch={handleSearchValue}
            filterOption={false}
            onBlur={resetQuery}
            maxTagCount={5}
            maxTagPlaceholder={(omittedValues) => (
              <Tooltip
                styles={{ root: { pointerEvents: 'none' } }}
                title={omittedValues.map(({ label }) => label).join(', ')}
              >
                <span>...</span>
              </Tooltip>
            )}
          />
        </Form.Item>
      </Form>
    </CModal>
  );
};
