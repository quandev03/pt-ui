import { CButtonExport } from '@react/commons/Button';
import { CRangePicker } from '@react/commons/DatePicker';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import CSelect from '@react/commons/Select';
import { RowButton, RowHeader } from '@react/commons/Template/style';
import { DateFormat } from '@react/constants/app';
import { formatDate } from '@react/constants/moment';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import useSearchHandler from '@react/hooks/useSearchHandler';
import { prefixReportService } from '@react/url/app';
import { Form } from 'antd';
import { useExportReport } from 'apps/Internal/src/hooks/useExportReport';
import { useGetAllClients } from 'apps/Internal/src/hooks/useGetAllClients';
import { useGetInterPartnerUsers } from 'apps/Internal/src/hooks/useGetInterPartnerUsers';
import dayjs from 'dayjs';
import { debounce } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetActivateReportKey } from '../hooks/useGetContentReport';
import { IParamsReportActivate } from '../type';
import { useGetApplicationConfig } from 'apps/Internal/src/hooks/useGetApplicationConfig';
import { ModelStatus } from '@react/commons/types';
const Header = () => {
  const [form] = Form.useForm();
  const { handleSearch } = useSearchHandler(useGetActivateReportKey);
  const [searchParams, setSearchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const [activatorKey, setActivatorKey] = useState('');
  const { data: activators = [] } = useGetInterPartnerUsers({
    q: activatorKey,
  });
  const [partnerKey, setPartnerKey] = useState('');
  const { data: partnerOptions = [] } = useGetAllClients({
    page: 0,
    size: 20,
    q: partnerKey,
  });
  const { mutate: downloadFile } = useExportReport();
  const { data: optionsActiveChannel } = useGetApplicationConfig(
    'REPORT_PARAM_ACTIVE_CHANNEL'
  );
  const activateChannels = useMemo(() => {
    if (optionsActiveChannel) {
      return optionsActiveChannel
        ?.filter((item) => Number(item.status) === ModelStatus.ACTIVE)
        ?.map((item) => ({
          label: item.name,
          value: item.value,
        }));
    }
    return [];
  }, [optionsActiveChannel]);
  const handleSearchActivator = debounce((value: string) => {
    setActivatorKey(value);
  }, 600);
  const handleSearchOrg = debounce((value: string) => {
    setPartnerKey(value);
  }, 600);
  const handleClearOrg = () => {
    setPartnerKey('');
  };
  const handleClearActivator = () => {
    setActivatorKey('');
  };
  const items: ItemFilter[] = [
    {
      label: 'Kênh kích hoạt',
      value: (
        <Form.Item name={'activeChannel'} className="w-36">
          <CSelect
            placeholder="Kênh kích hoạt"
            options={activateChannels}
            showSearch={false}
          />
        </Form.Item>
      ),
    },
    {
      label: 'Kênh phân phối',
      value: (
        <Form.Item name={'orgName'} className="w-40">
          <CSelect
            placeholder="Kênh phân phối"
            options={partnerOptions}
            showSearch={true}
            fieldNames={{ label: 'name', value: 'name' }}
            onSearch={handleSearchOrg}
            onClear={handleClearOrg}
            filterOption={(input, options: any) =>
              (options?.name ?? '').toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>
      ),
    },
    {
      label: 'User kích hoạt',
      value: (
        <Form.Item name={'createdBy'} className="w-52">
          <CSelect
            placeholder="User kích hoạt"
            options={activators}
            fieldNames={{
              label: 'preferredUsername',
              value: 'preferredUsername',
            }}
            showSearch={true}
            filterOption={(input, options: any) =>
              (options?.username ?? '')
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            onSearch={handleSearchActivator}
            onClear={handleClearActivator}
          />
        </Form.Item>
      ),
    },
    {
      label: 'Ngày kích hoạt',
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
        fromDate: dayjs().subtract(29, 'day').format(formatDate),
        toDate: dayjs().format(formatDate),
        filters: '3',
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
        approveStatus: params.approveStatus ? +params.approveStatus : undefined,
      });
    }
  }, [params]);
  const handleSubmit = (values: IParamsReportActivate) => {
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
      uri: `${prefixReportService}/active-reports/export`,
      params: queryParams({ ...params, format: 'XLSX' }),
      filename: `Bao_cao_kich_hoat-${dayjs().format(DateFormat.EXPORT)}.xlsx`,
    });
  };
  return (
    <RowHeader>
      <Form onFinish={handleSubmit} form={form}>
        <CFilter items={items} validQuery={useGetActivateReportKey} />
      </Form>
      <RowButton>
        <CButtonExport onClick={handleDownload} />
      </RowButton>
    </RowHeader>
  );
};
export default Header;
