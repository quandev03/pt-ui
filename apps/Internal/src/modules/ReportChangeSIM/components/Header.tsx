import { CButtonExport } from '@react/commons/Button';
import { CRangePicker } from '@react/commons/DatePicker';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import CSelect from '@react/commons/Select';
import { RowButton, RowHeader } from '@react/commons/Template/style';
import { ParamsOption } from '@react/commons/types';
import { DateFormat } from '@react/constants/app';
import { formatDate } from '@react/constants/moment';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import useSearchHandler from '@react/hooks/useSearchHandler';
import { prefixReportService } from '@react/url/app';
import { Form } from 'antd';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { useExportReport } from 'apps/Internal/src/hooks/useExportReport';
import { useGetInterPartnerUsers } from 'apps/Internal/src/hooks/useGetInterPartnerUsers';
import { useReasonCustomerService } from 'apps/Internal/src/hooks/useReasonList';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetChangeSimReportKey } from '../hooks/useGetContentReport';
import { IParamsReportChangeSim } from '../type';
import { debounce } from 'lodash';
const Header = () => {
  const [form] = Form.useForm();
  const { handleSearch } = useSearchHandler(useGetChangeSimReportKey);
  const [searchParams, setSearchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const [activatorKey, setActivatorKey] = useState('');
  const { data: activators = [] } = useGetInterPartnerUsers({
    isPartner: false,
    q: activatorKey,
  });
  const { COMBINE_KIT_SIM_TYPE = [] } = useGetDataFromQueryKey<ParamsOption>([
    REACT_QUERY_KEYS.GET_PARAMS,
  ]);
  const { mutate: downloadFile } = useExportReport();
  const { data: reasonTypes } = useReasonCustomerService('CHANGE_SIM');
  const { data: reasonChangeSim } =
    useReasonCustomerService('CHANGE_SIM_REJECT');
  const processStatusOptions = [
    {
      label: 'Chưa xử lý',
      value: 0,
    },
    {
      label: 'Đã xử lý',
      value: 1,
    },
    {
      label: 'Từ chối',
      value: 4,
    },
  ];
  const changeSimChannelOptions = [
    {
      label: 'WEB',
      value: 'WEB',
    },
    {
      label: 'APP',
      value: 'APP',
    },
    {
      label: 'BCSS',
      value: 'BCSS',
    },
  ];
  const handleSearchChangeSimUser = debounce((value: string) => {
    setActivatorKey(value);
  }, 600);
  const handleClearChangeSimUser = () => {
    setActivatorKey('');
  };
  const items: ItemFilter[] = [
    {
      label: 'Loại mặt hàng',
      value: (
        <Form.Item name={'requestSimType'} className="w-36">
          <CSelect
            placeholder="Loại mặt hàng"
            options={COMBINE_KIT_SIM_TYPE}
            showSearch={false}
          />
        </Form.Item>
      ),
    },
    {
      label: 'Kênh đổi SIM',
      value: (
        <Form.Item name={'changeSimChannel'} className="w-[140px]">
          <CSelect
            placeholder="Kênh đổi SIM"
            options={changeSimChannelOptions}
            showSearch={true}
          />
        </Form.Item>
      ),
    },
    {
      label: 'Loại yêu cầu',
      value: (
        <Form.Item name={'reasonType'} className="w-56">
          <CSelect
            placeholder="Loại yêu cầu"
            options={reasonTypes}
            showSearch={false}
            fieldNames={{ label: 'name', value: 'code' }}
          />
        </Form.Item>
      ),
    },
    {
      label: 'User thực hiện',
      value: (
        <Form.Item name={'changeSimUser'} className="w-52">
          <CSelect
            placeholder="User thực hiện"
            options={activators}
            fieldNames={{ label: 'username', value: 'username' }}
            showSearch={true}
            filterOption={(input, options: any) =>
              (options?.username ?? '')
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            onSearch={handleSearchChangeSimUser}
            onClear={handleClearChangeSimUser}
          />
        </Form.Item>
      ),
    },
    {
      label: 'Trạng thái xử lý',
      value: (
        <Form.Item name={'processStatus'} className="w-52">
          <CSelect
            placeholder="Trạng thái xử lý"
            options={processStatusOptions}
            showSearch={false}
          />
        </Form.Item>
      ),
    },
    {
      label: 'Lý do từ chối',
      value: (
        <Form.Item name={'rejectReason'} className="w-52">
          <CSelect
            placeholder="Lý do từ chối"
            options={reasonChangeSim}
            fieldNames={{ label: 'name', value: 'code' }}
            showSearch={false}
          />
        </Form.Item>
      ),
    },
    {
      label: 'Ngày tạo yêu cầu',
      value: (
        <Form.Item name={'rangePicker'}>
          <CRangePicker
            placeholder={['Từ ngày', 'Đến ngày']}
            format={formatDate}
            allowClear={false}
          />
        </Form.Item>
      ),
      showDefault: true,
    },
  ];
  useEffect(() => {
    if (!params.fromDate) {
      setSearchParams({
        ...params,
        fromDate: dayjs().subtract(6, 'month').format(formatDate),
        toDate: dayjs().format(formatDate),
        filters: '6',
      });
    }
  }, [params.fromDate]);
  useEffect(() => {
    if (params) {
      const fromDate = dayjs(params.fromDate, formatDate);
      const toDate = dayjs(params.toDate, formatDate);
      form.setFieldsValue({
        ...params,
        rangePicker: [fromDate, toDate],
        orgName: params.orgName ? +params.orgName : undefined,
        approveStatus: params.approveStatus ? +params.approveStatus : undefined,
        ...(params.processStatus && { processStatus: +params.processStatus }),
      });
    }
  }, [params]);
  const handleSubmit = (values: IParamsReportChangeSim) => {
    const { rangePicker, ...rest } = values;
    const [from, to] = rangePicker || [];
    handleSearch({
      ...params,
      ...rest,
      fromDate: from?.format(formatDate),
      toDate: to?.format(formatDate),
      page: 0,
    });
  };
  const handleDownload = () => {
    downloadFile({
      uri: `${prefixReportService}/change-sim/export`,
      params: queryParams({ ...params, format: 'XLSX' }),
      filename: `Bao_cao_doi_SIM-${dayjs().format(DateFormat.EXPORT)}.xlsx`,
    });
  };
  return (
    <RowHeader>
      <Form onFinish={handleSubmit} form={form}>
        <CFilter items={items} validQuery={useGetChangeSimReportKey} />
      </Form>
      <RowButton>
        <CButtonExport onClick={handleDownload} />
      </RowButton>
    </RowHeader>
  );
};
export default Header;
