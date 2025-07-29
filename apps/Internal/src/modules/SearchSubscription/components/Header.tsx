import { CButtonExport } from '@react/commons/Button';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import CInput from '@react/commons/Input';
import CSelect from '@react/commons/Select';
import { RowHeader, TitleHeader } from '@react/commons/Template/style';
import { ModelStatus } from '@react/commons/types';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import { MESSAGE } from '@react/utils/message';
import { Form } from 'antd';
import { useExportMutation } from 'apps/Internal/src/hooks/useExportMutation';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useIsAdmin } from '../hooks/useIsAdmin';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import useSearchHandler from '@react/hooks/useSearchHandler';
import { prefixCustomerService } from '@react/url/app';
import dayjs from 'dayjs';
import { DateFormat } from '@react/constants/app';
import { serialSimReg } from '@react/utils/validator';
import { usePrefixIsdnRegex } from 'apps/Internal/src/hooks/usePrefixIsdnQuery';

const Header = ({ isFetching }: { isFetching: boolean }) => {
  const [form] = Form.useForm();
  const isAdmin = useIsAdmin();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { handleSearch } = useSearchHandler(
    REACT_QUERY_KEYS.GET_LIST_SUBSCRIPTION
  );
  const prefixIsdn = usePrefixIsdnRegex();
  const { isPending, mutate } = useExportMutation();
  const [isMounted, setIsMounted] = useState(false);

  useLayoutEffect(() => {
    setSearchParams({
      ...params,
      filters: params.filters || isAdmin ? 3 : 2,
    });
  }, [isAdmin]);

  useEffect(() => {
    params && form.setFieldsValue(params);
  }, [params]);

  useEffect(() => {
    form.resetFields();
  }, [isAdmin]);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  const handleFinish = (values: any) => {
    handleSearch({
      ...values,
      serial: values.serial,
      idNo: values.idNo,
      enterprise: values.enterprise,
      status: values.status,
      isSearch: 'true',
    });
  };

  const handleExport = () => {
    mutate({
      uri: `${prefixCustomerService}/search-request/export-excel/${isAdmin ? 'admin' : 'cskh'
        }`,
      filename: `danh_sach_thue_bao-${dayjs().format(DateFormat.EXPORT)}.xlsx`,
      params: queryParams(params),
    });
  };

  const items: ItemFilter[] = [
    {
      label: 'Số serial SIM',
      value: (
        <Form.Item
          name="serial"
          messageVariables={{ label: 'Số serial SIM' }}
          rules={
            isAdmin
              ? []
              : [
                {
                  validator: (_, value) => {
                    const newValue = value?.replace(/\D/g, '');
                    if (newValue && !serialSimReg.test(newValue)) {
                      return Promise.reject(new Error(MESSAGE.G07));
                    }
                    return Promise.resolve();
                  },
                },
              ]
          }
          className="w-48"
        >
          <CInput placeholder="Nhập số serial SIM" maxLength={16} onlyNumber />
        </Form.Item>
      ),
    },
    {
      label: 'Số GTTT',
      value: (
        <Form.Item
          name="idNo"
          messageVariables={{ label: 'Số GTTT' }}
          className="w-48"
          rules={
            isAdmin
              ? []
              : [
                {
                  validator: (_, value) => {
                    const newValue = value?.replace(/\D/g, '');
                    if (newValue && newValue.length < 9) {
                      return Promise.reject(new Error(MESSAGE.G07));
                    }
                    return Promise.resolve();
                  },
                },
              ]
          }
        >
          <CInput placeholder="Nhập số GTTT" maxLength={12} onlyNumber />
        </Form.Item>
      ),
    },
    {
      label: 'Tên doanh nghiệp',
      value: (
        <Form.Item name="enterprise" className="w-48">
          <CInput placeholder="Nhập tên doanh nghiệp" maxLength={100} />
        </Form.Item>
      ),
    },
    {
      showDefault: true,
      label: 'Trạng thái thuê bao',
      value: (
        <Form.Item name="status" className="w-40">
          <CSelect
            placeholder="Trạng thái thuê bao"
            showSearch={false}
            options={[
              {
                label: 'Đang hoạt động',
                value: ModelStatus.ACTIVE,
              },
              {
                label: 'Đã hủy',
                value: ModelStatus.INACTIVE,
              },
            ]}
          />
        </Form.Item>
      ),
    },
  ].filter((item) => (isAdmin ? item : item.label !== 'Tên doanh nghiệp'));

  return (
    <>
      <TitleHeader>Tra cứu thuê bao</TitleHeader>
      <RowHeader>
        <Form
          form={form}
          onFinish={handleFinish}
          disabled={isFetching || !isMounted}
        >
          <CFilter
            items={items}
            validQuery={REACT_QUERY_KEYS.GET_LIST_SUBSCRIPTION}
            searchComponent={
              <Form.Item
                name="isdn"
                messageVariables={{ label: 'Số thuê bao' }}
                className="w-44"
                validateFirst
                rules={isAdmin ? [] : [prefixIsdn]}
              >
                <CInput
                  placeholder="Nhập số thuê bao"
                  maxLength={11}
                  onlyNumber
                />
              </Form.Item>
            }
          />
        </Form>
        {isAdmin && (
          <CButtonExport loading={isPending} onClick={handleExport} />
        )}
      </RowHeader>
    </>
  );
};

export default Header;
