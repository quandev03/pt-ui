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
import { useGetCriteria } from 'apps/Internal/src/components/layouts/queryHooks';
import { useExportReport } from 'apps/Internal/src/hooks/useExportReport';
import { useGetAllClients } from 'apps/Internal/src/hooks/useGetAllClients';
import { useGetInterPartnerUsers } from 'apps/Internal/src/hooks/useGetInterPartnerUsers';
import dayjs from 'dayjs';
import { debounce } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetCriteriaReportKey } from '../hooks/useGetContentReport';
import { IParamsReportCriteria } from '../type';
import { useGetApplicationConfig } from 'apps/Internal/src/hooks/useGetApplicationConfig';
import { ModelStatus } from '@react/commons/types';
const Header = () => {
  const [form] = Form.useForm();
  const { handleSearch } = useSearchHandler(useGetCriteriaReportKey);
  const [searchParams, setSearchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const [activatorKey, setActivatorKey] = useState('');
  const [moderatorKey, setModeratorKey] = useState('');
  const { data: moderators = [] } = useGetInterPartnerUsers({
    isPartner: false,
    q: moderatorKey,
  });

  const { data: activators = [] } = useGetInterPartnerUsers({
    q: activatorKey,
  });
  const [partnerKey, setPartnerKey] = useState('');
  const { data: partnerOptions = [] } = useGetAllClients({
    page: 0,
    size: 20,
    q: partnerKey,
  });
  const { data: criteriaOptions } = useGetCriteria();
  console.log('criteriaOptions', criteriaOptions);
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
  const handleSearchModerator = debounce((value: string) => {
    setModeratorKey(value);
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
            filterOption={(input, options: any) =>
              (options?.name ?? '').toLowerCase().includes(input.toLowerCase())
            }
            onClear={handleClearOrg}
          />
        </Form.Item>
      ),
    },
    {
      label: 'Tiêu chí vi phạm',
      value: (
        <Form.Item name={'failConditions'} className="w-40">
          <CSelect
            placeholder="Tiêu chí vi phạm"
            options={criteriaOptions}
            showSearch={true}
            filterOption={(input, option: any) => {
              const labelText = React.isValidElement(option?.label)
                ? option.label.props.children
                : option?.label || option?.name || option?.value || '';
              return labelText.toLowerCase().includes(input.toLowerCase());
            }}
          />
        </Form.Item>
      ),
      showDefault: true,
    },
    {
      label: 'User kích hoạt',
      value: (
        <Form.Item name={'activeUser'} className="w-52">
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
      label: 'User kiểm duyệt',
      value: (
        <Form.Item name={'approveUser'} className="w-52">
          <CSelect
            placeholder="User kiểm duyệt"
            options={moderators}
            showSearch={true}
            fieldNames={{ label: 'username', value: 'username' }}
            filterOption={(input, options: any) =>
              (options?.username ?? '')
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            onSearch={handleSearchModerator}
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
    if (!params.from) {
      setSearchParams({
        ...params,
        from: dayjs().subtract(29, 'day').format(formatDate),
        to: dayjs().format(formatDate),
        filters: '2,5',
      });
    }
  }, [params.from]);
  useEffect(() => {
    if (params) {
      const from = dayjs(params.from, formatDate);
      const to = dayjs(params.to, formatDate);
      form.setFieldsValue({
        ...params,
        rangePicker: [from, to],
      });
    }
  }, [params]);
  const handleSubmit = (values: IParamsReportCriteria) => {
    const { rangePicker, ...rest } = values;
    const [from, to] = rangePicker || [];
    handleSearch({
      ...params,
      ...rest,
      from: from?.format(formatDate),
      to: to?.format(formatDate),
      page: 0,
    });
  };
  const handleDownload = () => {
    downloadFile({
      uri: `${prefixReportService}/eight-condition-reports/export`,
      params: queryParams({ ...params, format: 'XLSX' }),
      filename: `Bao_cao_8_tieu_chi-${dayjs().format(DateFormat.EXPORT)}.xlsx`,
    });
  };
  return (
    <RowHeader>
      <Form onFinish={handleSubmit} form={form}>
        <CFilter items={items} validQuery={useGetCriteriaReportKey} />
      </Form>
      <RowButton>
        <CButtonExport onClick={handleDownload} />
      </RowButton>
    </RowHeader>
  );
};
export default Header;
