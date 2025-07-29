import { CButtonExport } from '@react/commons/Button';
import { CRangePicker } from '@react/commons/DatePicker';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import CSelect from '@react/commons/Select';
import { RowButton, RowHeader } from '@react/commons/Template/style';
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
import { useGetPrecheckReportKey } from '../hooks/useGetContentReport';
import { IParamsReportPrecheck } from '../type';
import { useGetApplicationConfig } from 'apps/Internal/src/hooks/useGetApplicationConfig';
import { ModelStatus } from '@react/commons/types';
const Header = () => {
  const [form] = Form.useForm();
  const { handleSearch } = useSearchHandler(useGetPrecheckReportKey);
  const [searchParams, setSearchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const [preapproveUserKey, setPreapproveUserKey] = useState('');
  const { data: preapprovedUser = [] } = useGetInterPartnerUsers({
    isPartner: false,
    q: preapproveUserKey,
  });
  const [partnerKey, setPartnerKey] = useState('');
  const { data: partnerOptions = [] } = useGetAllClients({
    page: 0,
    size: 20,
    q: partnerKey,
  });
  const { data: preapprovalStatus = [] } = useGetDataAppPickList(
    'SUBSCRIBER_ACTIVE_REQUEST',
    'APPROVE_STATUS'
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
  const handleSearchPreapproveUser = debounce((value: string) => {
    setPreapproveUserKey(value);
  }, 600);
  const handleSearchOrg = debounce((value: string) => {
    setPartnerKey(value);
  }, 600);
  const handleClearOrg = () => {
    setPartnerKey('');
  };
  const handleClearActivator = () => {
    setPreapproveUserKey('');
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
      label: 'User tiền kiểm',
      value: (
        <Form.Item name={'userName'} className="w-52">
          <CSelect
            placeholder="User tiền kiểm"
            options={preapprovedUser}
            fieldNames={{
              label: 'preferredUsername',
              value: 'preferredUsername',
            }}
            filterOption={(input, options: any) =>
              (options?.username ?? '')
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            onSearch={handleSearchPreapproveUser}
            onClear={handleClearActivator}
          />
        </Form.Item>
      ),
    },
    {
      label: 'Trạng thái tiền kiểm',
      value: (
        <Form.Item name={'status'} className="w-52">
          <CSelect
            placeholder="Trạng thái tiền kiểm"
            options={preapprovalStatus}
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
        fromDate: dayjs().subtract(29, 'day').format(formatDate),
        toDate: dayjs().format(formatDate),
        filters: '4',
      });
    }
  }, [params.fromDate]);
  useEffect(() => {
    if (params) {
      const fromDate = dayjs(params.fromDate, formatDate);
      const toDate = dayjs(params.toDate, formatDate);
      const { status, ...rest } = params;
      form.setFieldsValue({
        ...rest,
        rangePicker: [fromDate, toDate],
        ...(status && { status: status }),
      });
    }
  }, [params]);
  const handleSubmit = (values: IParamsReportPrecheck) => {
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
  const handleExportExcel = () => {
    const downloadUrl = `${prefixReportService}/pre-approve-reports/export`;
    const filename = `Bao_cao_tien_kiem-${dayjs().format(
      'DDMMYYYYHHmmss'
    )}.xlsx`;
    downloadFile({
      uri: downloadUrl,
      params: queryParams({ ...params, size: undefined, format: 'XLSX' }),
      filename: filename,
    });
  };
  return (
    <RowHeader>
      <Form onFinish={handleSubmit} form={form}>
        <CFilter items={items} validQuery={useGetPrecheckReportKey} />
      </Form>
      <RowButton>
        <CButtonExport onClick={handleExportExcel} />
      </RowButton>
    </RowHeader>
  );
};
export default Header;
