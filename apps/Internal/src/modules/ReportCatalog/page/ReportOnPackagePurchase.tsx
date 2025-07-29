import { faSearch, faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CButtonExport } from '@react/commons/Button';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import { CInput, CRangePicker, CSelect, CTable } from '@react/commons/index';
import { RowHeader, TitleHeader } from '@react/commons/Template/style';
import { AnyElement, ParamsOption } from '@react/commons/types';
import { DateFormat } from '@react/constants/app';
import { formatDateEnglishV2 } from '@react/constants/moment';
import { decodeSearchParams } from '@react/helpers/utils';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import useSearchHandler from '@react/hooks/useSearchHandler';
import { Button, Form, Tooltip } from 'antd';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getColumnsTableReportOnPackagePurchase } from '../constants';
import {
  REPORT_ON_PACKAGE_PURCHASE_QUERY_KEY,
  useDownloadFileReportOnPackagePurchase,
  useGetReportOnPackagePurchase,
} from '../hook/useReportOnPackagePurchase';

const ReportOnPackagePurchase = () => {
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { mutate: downloadFile } = useDownloadFileReportOnPackagePurchase();
  const { SALE_ORDER_PAY_STATUS } = useGetDataFromQueryKey<ParamsOption>([
    REACT_QUERY_KEYS.GET_PARAMS,
  ]);
  const columns = useMemo(() => {
    return getColumnsTableReportOnPackagePurchase(params);
  }, [params]);
  const { data: dataReport, isLoading } = useGetReportOnPackagePurchase({
    ...params,
    fromDate: params.fromDate
      ? dayjs(params.fromDate).format(formatDateEnglishV2)
      : dayjs().subtract(29, 'day').format(formatDateEnglishV2),
    toDate: params.toDate
      ? dayjs(params.toDate).format(formatDateEnglishV2)
      : dayjs().format(formatDateEnglishV2),
  });
  const dataTable = useMemo(() => {
    if (!dataReport) return [];
    return dataReport;
  }, [dataReport]);
  const [form] = Form.useForm();

  const items: ItemFilter[] = [
    {
      label: 'Thời gian',
      value: (
        <Form.Item name="time" className="w-70">
          <CRangePicker
            allowClear={false}
            placeholder={['Từ ngày', 'Đến ngày']}
          />
        </Form.Item>
      ),
      showDefault: true,
    },
    {
      label: 'Trạng thái thanh toán',
      value: (
        <Form.Item name="paymentStatus" className="w-56">
          <CSelect
            onKeyDown={(e) => {
              e.preventDefault();
            }}
            placeholder="Chọn trạng thái thanh toán"
            options={SALE_ORDER_PAY_STATUS}
            allowClear
          />
        </Form.Item>
      ),
    },
  ];

  const { handleSearch } = useSearchHandler(
    REPORT_ON_PACKAGE_PURCHASE_QUERY_KEY
  );

  useEffect(() => {
    form.setFieldsValue({
      ...params,
    });
    if (params.fromDate && params.toDate) {
      form.setFieldValue('time', [
        dayjs(params.fromDate),
        dayjs(params.toDate),
      ]);
    }
  }, []);

  const handleSubmit = (values: AnyElement) => {
    handleSearch({
      ...params,
      ...values,
      fromDate: dayjs(values.time?.[0]).format(formatDateEnglishV2),
      toDate: dayjs(values.time?.[1]).format(formatDateEnglishV2),
      page: 0,
      queryTime: dayjs().format(DateFormat.TIME),
    });
  };

  const handleDownload = useCallback(() => {
    downloadFile(params);
  }, [params]);
  return (
    <>
      <TitleHeader>Báo cáo gói cước</TitleHeader>
      <RowHeader>
        <Form
          form={form}
          onFinish={handleSubmit}
          initialValues={{
            time: [dayjs().subtract(29, 'day'), dayjs()],
          }}
        >
          <CFilter
            searchComponent={
              <Tooltip
                title="Tìm kiếm theo mã đơn hàng, số điện thoại"
                placement="right"
              >
                <Form.Item label="" name="searchValue" className="!mb-0">
                  <CInput
                    placeholder="Nhập mã đơn hàng, số điện thoại"
                    maxLength={50}
                    prefix={<FontAwesomeIcon icon={faSearch} />}
                  />
                </Form.Item>
              </Tooltip>
            }
            items={items}
          />
        </Form>
        <Button
          icon={<FontAwesomeIcon icon={faUpload} />}
          type="primary"
          onClick={handleDownload}
        >
          Xuất báo cáo
        </Button>
      </RowHeader>
      <CTable
        loading={isLoading}
        pagination={{
          total: dataTable.totalElements ?? 0,
        }}
        columns={columns}
        dataSource={dataTable.content ?? []}
        otherHeight={20}
      />
    </>
  );
};

export default ReportOnPackagePurchase;
