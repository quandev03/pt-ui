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
import { useGetDataAppPickList } from 'apps/Internal/src/hooks/useGetDataAppPickList';
import { useGetInterPartnerUsers } from 'apps/Internal/src/hooks/useGetInterPartnerUsers';
import dayjs from 'dayjs';
import { debounce } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetCensorshipReportKey } from '../hooks/useGetContentReport';
import { IParamsReportCensorship } from '../type';
import { ModelStatus } from '@react/commons/types';
import { useGetApplicationConfig } from 'apps/Internal/src/hooks/useGetApplicationConfig';
const Header = () => {
  const [form] = Form.useForm();
  const { handleSearch } = useSearchHandler(useGetCensorshipReportKey);
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
  const { data: approvalStatus = [] } = useGetDataAppPickList(
    'SUB_DOCUMENT',
    'APPROVAL_STATUS'
  );
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

  const typeDateOptions = [
    {
      label: 'Ngày kích hoạt',
      value: '1',
    },
    {
      label: 'Thời gian phân công kiểm duyệt',
      value: '2',
    },
  ];
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
  const handleClearModerator = () => {
    setModeratorKey('');
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
            onClear={handleClearModerator}
          />
        </Form.Item>
      ),
    },
    {
      label: 'Trạng thái kiểm duyệt',
      value: (
        <Form.Item name={'approveStatus'} className="w-52">
          <CSelect
            placeholder="Trạng thái kiểm duyệt"
            options={approvalStatus}
            showSearch={false}
          />
        </Form.Item>
      ),
      showDefault: true,
    },
    {
      label: 'Loại ngày',
      value: (
        <>
          <Form.Item name={'dateType'} className="w-64">
            <CSelect
              placeholder="Loại ngày"
              options={typeDateOptions}
              showSearch={false}
              allowClear={false}
            />
          </Form.Item>
          <Form.Item name={'rangePicker'}>
            <CRangePicker
              placeholder={['Từ ngày', 'Đến ngày']}
              format={formatDate}
              allowClear={false}
            />
          </Form.Item>
        </>
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
        filters: '4,5,6',
        dateType: '1',
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
        ...(params.approveStatus && { approveStatus: +params.approveStatus }),
      });
    }
  }, [params]);
  const handleSubmit = (values: IParamsReportCensorship) => {
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
      uri: `${prefixReportService}/approve-subscriber/export`,
      params: queryParams({ ...params, format: 'XLSX' }),
      filename: `Bao_cao_kiem_duyet-${dayjs().format(DateFormat.EXPORT)}.xlsx`,
    });
  };
  return (
    <RowHeader>
      <Form onFinish={handleSubmit} form={form}>
        <CFilter items={items} validQuery={useGetCensorshipReportKey} />
      </Form>
      <RowButton>
        <CButtonExport onClick={handleDownload} />
      </RowButton>
    </RowHeader>
  );
};
export default Header;
