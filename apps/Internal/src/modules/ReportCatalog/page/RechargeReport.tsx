import { faSearch, faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import { CInput, CRangePicker, CTable } from '@react/commons/index';
import { TitleHeader, Wrapper } from '@react/commons/Template/style';
import { formatDate, formatDateEnglishV2 } from '@react/constants/moment';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import { filterFalsy } from '@react/utils/index';
import { Button, Col, Form, Row } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { getColumnsTableRechargeReport } from '../constants';
import {
  RECHARGE__REPORT_QUERY_KEY,
  useDownloadReport,
  useRechargeReport,
} from '../hook/useRechargeReport';
import useSearchHandler from '@react/hooks/useSearchHandler';

const RechargeReport: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { data: content, isFetching } = useRechargeReport({
    ...queryParams({
      ...params,
      fromDate: params.fromDate
        ? dayjs(params.fromDate).format(formatDateEnglishV2)
        : dayjs().subtract(29, 'day').format(formatDateEnglishV2),
      toDate: params.toDate
        ? dayjs(params.toDate).format(formatDateEnglishV2)
        : dayjs().format(formatDateEnglishV2),
    }),
  });
  const dataTable = useMemo(() => {
    if (!content) return;
    return content;
  }, [content]);
  const { handleSearch } = useSearchHandler(RECHARGE__REPORT_QUERY_KEY.LIST);
  const [form] = Form.useForm();
  const today = dayjs();
  const defaultFromDate = today.subtract(29, 'day').startOf('day');
  const defaultToDate = today.endOf('day');

  const validateDateRange = (_: any, value: string | any[]) => {
    if (!value || value.length < 2) {
      return Promise.resolve();
    }
    const [fromDate, toDate] = value;
    const diff = dayjs(toDate).diff(dayjs(fromDate), 'day');
    if (diff < 0) {
      return Promise.reject(new Error('Từ ngày không được lớn hơn Đến ngày'));
    }
    if (diff > 30) {
      return Promise.reject(
        new Error('Thời gian tìm kiếm không được vượt quá 30 ngày')
      );
    }
    return Promise.resolve();
  };
  const filterPackageSalesReport: ItemFilter[] = [
    {
      label: 'Thời gian',
      value: (
        <Form.Item
          name="time"
          className={'!w-72'}
          initialValue={[defaultFromDate, defaultToDate]}
          rules={[{ validator: validateDateRange }]}
        >
          <CRangePicker format={formatDate} allowClear={false} />
        </Form.Item>
      ),
      showDefault: true,
    },
  ];

  useEffect(() => {
    form.setFieldsValue({
      ...params,
      paymentStatus: params.paymentStatus,
    });
  }, [form, params]);

  const { mutate: downloadReport } = useDownloadReport();

  const handleDownload = () => {
    downloadReport({ ...params, format: 'XLSX' });
  };

  const handleSubmit = (values: any) => {
    setSearchParams(
      filterFalsy({
        ...params,
        ...values,
        page: 0,
        paymentStatus: values.paymentStatus,
        fromDate:
          values.time && values.time[0]
            ? dayjs(values.time[0]).format(formatDateEnglishV2)
            : undefined,
        toDate:
          values.time && values.time[1]
            ? dayjs(values.time[1]).format(formatDateEnglishV2)
            : undefined,
        time: undefined,
      })
    );
    handleSearch(params);
  };
  const columns = useMemo(() => {
    return getColumnsTableRechargeReport(params);
  }, [params]);
  return (
    <Wrapper>
      <TitleHeader>Báo cáo nạp tiền</TitleHeader>
      <div className={'flex justify-between flex-wrap mb-5 gap-4'}>
        <Form form={form} onFinish={handleSubmit} className={'flex-1'}>
          <Row gutter={8}>
            <Col>
              <CFilter
                searchComponent={
                  <Form.Item name="valueSearch" label="">
                    <CInput
                      maxLength={50}
                      placeholder="Nhập mã đơn hàng VNSKY, số điện thoại"
                      prefix={<FontAwesomeIcon icon={faSearch} />}
                    />
                  </Form.Item>
                }
                items={filterPackageSalesReport}
                validQuery={RECHARGE__REPORT_QUERY_KEY.LIST}
              />
            </Col>
          </Row>
        </Form>
        <div>
          <Button
            icon={<FontAwesomeIcon icon={faUpload} />}
            type="primary"
            onClick={handleDownload}
          >
            Xuất báo cáo
          </Button>
        </div>
      </div>
      <CTable
        loading={isFetching}
        pagination={{
          total: dataTable?.totalElements ?? 0,
        }}
        columns={columns}
        dataSource={dataTable?.content ?? []}
        otherHeight={20}
      />
    </Wrapper>
  );
};

export default RechargeReport;
