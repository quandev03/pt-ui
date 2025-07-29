import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CButtonExport } from '@react/commons/Button';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import { CInput, CPagination, CRangePicker, CSelect } from '@react/commons/index';
import { TitleHeader, Wrapper } from '@react/commons/Template/style';
import { formatDate, formatDateEnglishV2 } from '@react/constants/moment';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import { filterFalsy } from '@react/utils/index';
import { Card, Col, Form, Row, Spin } from 'antd';
import { useGetAllPartner } from 'apps/Internal/src/hooks/useGetAllPartner';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SUBSCRIBER_TOPUP_REPORT_QUERY_KEY, useDownloadReport, useListSubscriberTopUpReport } from '../hook/useListSubscriberTopUpReport';
import useSearchHandler from '@react/hooks/useSearchHandler';

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
const SubscriberTopUpReportPage: React.FC = () => {
  const { data: orgUnit = [] } = useGetAllPartner();

  const filterSubscriberTopUpReport: ItemFilter[] = [
    {
      label: 'Đối tác',
      value: (
        <Form.Item label="" name="orgId" className="w-48 mb-0">
          <CSelect
            options={orgUnit}
            placeholder="Chọn đối tác"
          />
        </Form.Item>
      ),
    },
    {
      label: 'Thời gian',
      value: (
        <Form.Item
          name="time"
          className={'!w-72'}
          initialValue={[defaultFromDate, defaultToDate]}
          rules={[{ validator: validateDateRange }]}
        >
          <CRangePicker
            format={formatDate}
            allowClear={false}
          />
        </Form.Item>
      ),
      showDefault: true
    },
  ];
  const { handleSearch } = useSearchHandler(
    SUBSCRIBER_TOPUP_REPORT_QUERY_KEY.LIST
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { data: content, isLoading } =
    useListSubscriberTopUpReport({
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
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState(0);
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue({
      ...params,
      orgId: params.orgId ? Number(params.orgId) : null,
    });
  }, [form, params]);

  const { mutate: downloadReport } = useDownloadReport();

  const handleDownload = () => {
    downloadReport({
      ...params,
      format: 'XLSX'
    });
  };

  const handleSubmit = (values: any) => {
    setSearchParams(
      filterFalsy({
        ...params,
        ...values,
        page: 0,
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

  useEffect(() => {
    const updateIframeHeight = () => {
      if (iframeRef.current) {
        const iframeDocument =
          iframeRef.current.contentDocument ||
          iframeRef.current.contentWindow?.document;

        if (iframeDocument) {
          setIframeHeight(iframeDocument.documentElement.offsetHeight);
        }
      }
    };
    updateIframeHeight();

    if (iframeRef.current) {
      iframeRef.current.addEventListener('load', updateIframeHeight);
    }

    return () => {
      if (iframeRef.current) {
        iframeRef.current.removeEventListener('load', updateIframeHeight);
      }
    };
  }, [content]);

  return (
    <Wrapper>
      <TitleHeader>Báo cáo Đối tác nạp tiền cho thuê bao</TitleHeader>
      <div className={'flex justify-between flex-wrap mb-4 gap-4'}>
        <Form form={form} onFinish={handleSearch} className={'flex-1'}>
          <Row gutter={8}>
            <Col>
              <CFilter
                searchComponent={<Form.Item name="valueSearch" label="">
                  <CInput
                    maxLength={11}
                    placeholder="Nhập Số thuê bao/ User thực hiện"
                    prefix={<FontAwesomeIcon icon={faSearch} />}
                  />
                </Form.Item>}
                items={filterSubscriberTopUpReport}
                validQuery={SUBSCRIBER_TOPUP_REPORT_QUERY_KEY.LIST}
              />
            </Col>
          </Row>
        </Form>
        <div>
          <CButtonExport onClick={handleDownload} />
        </div>
      </div>
      <Spin spinning={isLoading}>
        <Card className="w-full" style={{ height: iframeHeight + 80 + 'px' }}>
          <iframe
            ref={iframeRef}
            title="report"
            srcDoc={content?.data}
            style={{ width: '100%', height: iframeHeight + 'px', border: '0' }}
          />
          <CPagination
            className="mt-5"
            pageSize={
              content?.pagination.pageSize
                ? Number(content?.pagination.pageSize)
                : 20
            }
            current={
              content?.pagination.current
                ? Number(content?.pagination.current) + 1
                : 0
            }
            total={
              content?.pagination.total ? Number(content?.pagination.total) : 0
            }
          />
        </Card>
      </Spin>
    </Wrapper>
  );
};

export default SubscriberTopUpReportPage;
