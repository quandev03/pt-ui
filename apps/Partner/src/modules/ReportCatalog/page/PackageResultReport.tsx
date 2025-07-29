import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import { CInput, CRangePicker, CTable } from '@react/commons/index';
import { RowHeader, TitleHeader } from '@react/commons/Template/style';
import { AnyElement, ParamsOption } from '@react/commons/types';
import { decodeSearchParams } from '@react/helpers/utils';
import useSearchHandler from '@react/hooks/useSearchHandler';
import { Col, Form, Row } from 'antd';
import { useDownloadSaleFile } from 'apps/Partner/src/hooks/useGetFileDownload';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getColumnsTableReportPackageResult } from '../constants';
import useGetReportPackageResult, {
  REPORT_PACKAGE_RESULT_QUERY_KEY,
} from '../hooks/useGetReportPackageResult';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import { REACT_QUERY_KEYS } from 'apps/Partner/src/constants/querykeys';
const PackageResultReport = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const {mutate:downloadFile} = useDownloadSaleFile()
  const handleDownloadFile = useCallback((uri:string)=>{
    downloadFile({
      uri:uri
    })
  },[downloadFile]);
  const { BATCH_PACKAGE_SALE_STATUS = [] } =
  useGetDataFromQueryKey<ParamsOption>([REACT_QUERY_KEYS.GET_PARAMS]);
  const columns = useMemo(() => {
    return getColumnsTableReportPackageResult(params,handleDownloadFile,BATCH_PACKAGE_SALE_STATUS);
  }, [params,handleDownloadFile,BATCH_PACKAGE_SALE_STATUS]);
  const { data: dataReport, isLoading } = useGetReportPackageResult(params);
  const dataTable = useMemo(() => {
    if (!dataReport) return [];
    return dataReport;
  }, [dataReport]);
  const [form] = Form.useForm();
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
  const items: ItemFilter[] = [
    {
      label: 'Ngày thực hiện',
      value: (
        <Form.Item rules={[{ validator: validateDateRange }]} name="time" className="w-70">
          <CRangePicker allowClear={false} placeholder={['Từ ngày', 'Đến ngày']} />
        </Form.Item>
      ),
      showDefault:true,
    },
  ];
  const { handleSearch } = useSearchHandler(REPORT_PACKAGE_RESULT_QUERY_KEY);
 useEffect(() => {
    if (params) {
      const { startDate, endDate } = params;
      const from = startDate ? dayjs(startDate) : dayjs().subtract(29, 'day');
      const to = endDate ? dayjs(endDate) : dayjs();
      form.setFieldsValue({
        time: [from, to],
      });
    }
  }, [params]);
  const handleSubmit = 
    (values: AnyElement) => {
      setSearchParams({
        ...params,
        ...values,
      startDate: dayjs(values.time?.[0]).toISOString(),
      endDate: dayjs(values.time?.[1]).toISOString(),
      page: 0,
      });
      handleSearch(searchParams);
    };
  return (
    <>
      <TitleHeader>Báo cáo kết quả bán gói theo lô</TitleHeader>
      <RowHeader>
        <Form form={form} onFinish={handleSubmit}>
          <Row gutter={[8, 8]}>
            <Col>
              <CFilter
                validQuery={REPORT_PACKAGE_RESULT_QUERY_KEY}
                searchComponent={
                  <Form.Item label="" name="q" className="!mb-0">
                    <CInput
                      placeholder="Nhập tên file/ user thực hiện"
                      maxLength={100}
                      prefix={<FontAwesomeIcon icon={faSearch} />}
                    />
                  </Form.Item>
                }
                items={items}
              />
            </Col>
          </Row>
        </Form>
      </RowHeader>
      <CTable
        loading={isLoading}
        pagination={{
          total: dataTable?.totalElements,
        }}
        columns={columns}
        dataSource={dataTable.content ?? []}
        otherHeight={60}
      />
    </>
  );
};

export default PackageResultReport;
