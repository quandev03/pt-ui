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
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetRegulatoryReportKey } from '../hooks/useGetContentReport';
import { IParamsReportRegulatory } from '../type';
const Header = () => {
  const [form] = Form.useForm();
  const { handleSearch } = useSearchHandler(useGetRegulatoryReportKey);
  const [searchParams, setSearchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { mutate: downloadFile } = useExportReport();
  const idTypes = [
    {
      label: 'CCCD',
      value: 'CCCD',
    },
    {
      label: 'CMND',
      value: 'CMND',
    },
  ];
  const custTypeOptions = [
    {
      label: 'Cá nhân',
      value: 'Cá nhân',
    },
    {
      label: 'Khách hàng doanh nghiệp',
      value: 'Khách hàng doanh nghiệp',
    },
  ];
  const statusOptions = [
    {
      label: 'Đang hoạt động',
      value: 'Đang hoạt động',
    },
    {
      label: 'Chặn 1 chiều',
      value: 'Chặn 1 chiều',
    },
    {
      label: 'Chặn 2 chiều',
      value: 'Chặn 2 chiều',
    },
    {
      label: 'Đã hủy',
      value: 'Đã hủy',
    },
  ];
  const items: ItemFilter[] = [
    {
      label: 'Loại khách hàng',
      value: (
        <Form.Item name={'custType'} className="w-52">
          <CSelect
            placeholder="Loại khách hàng"
            options={custTypeOptions}
            showSearch={false}
          />
        </Form.Item>
      ),
    },
    {
      label: 'Loại GTTT',
      value: (
        <Form.Item name={'idType'} className="w-32">
          <CSelect
            placeholder="Loại GTTT"
            options={idTypes}
            showSearch={false}
            fieldNames={{ label: 'code', value: 'value' }}
          />
        </Form.Item>
      ),
    },
    {
      label: 'Trạng thái thuê bao',
      value: (
        <Form.Item name={'activeStatus'} className="w-52">
          <CSelect
            placeholder="Trạng thái thuê bao"
            options={statusOptions}
            showSearch={false}
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
      });
    }
  }, [params]);
  const handleSubmit = (values: IParamsReportRegulatory) => {
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
    const downloadUrl = `${prefixReportService}/government-reports/export`;
    const filename = `Bao_cao_co_quan_quan_ly_nha_nuoc-${dayjs().format(
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
        <CFilter items={items} validQuery={useGetRegulatoryReportKey} />
      </Form>
      <RowButton>
        <CButtonExport onClick={handleExportExcel} />
      </RowButton>
    </RowHeader>
  );
};
export default Header;
