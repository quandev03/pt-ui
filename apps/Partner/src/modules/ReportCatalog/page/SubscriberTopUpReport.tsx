import { CPagination } from '@react/commons/index';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import { Card, Spin } from 'antd';
import { useSearchParams } from 'react-router-dom';
import { Wrapper } from './style';
import { useEffect, useRef, useState } from 'react';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CFilter from '@react/commons/Filter';
import { CInput } from '@react/commons/index';
import { TitleHeader } from '@react/commons/Template/style';
import { filterFalsy } from '@react/utils/index';
import { Col, Form, Row, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { formatDateEnglishV2 } from '@react/constants/moment';
import { CButtonExport } from '@react/commons/Button';
import {
  SUBSCRIBER_TOPUP_REPORT_QUERY_KEY,
  useDownloadReport,
  useListSubscriberTopUpReport,
} from '../hooks/useSubscriberTopUpReport';
import { filterSubscriberTopUpReport } from '../constants';

const SubscriberTopUpReportPage: React.FC = () => {
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
    form.setFieldsValue(params);
  }, [form, params]);

  const { mutate: downloadReport } = useDownloadReport();

  const handleDownload = () => {
    downloadReport({
      ...params,
      format: 'XLSX'
    });
  };

  const handleSearch = (values: any) => {
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
      <TitleHeader>Báo cáo nạp tiền cho thuê bao</TitleHeader>
      <div className={'flex justify-between flex-wrap mb-4 gap-4'}>
        <Form form={form} onFinish={handleSearch} className={'flex-1'}>
          <Row gutter={8}>
            <Col span={5}>
              <Tooltip
                title="Nhập Số thuê bao/ User thực hiện"
                placement="right"
                overlayClassName="quickSearchOverlay"
              >
                <Form.Item name="valueSearch" label="">
                  <CInput
                    maxLength={50}
                    placeholder="Nhập Số thuê bao/ User thực hiện"
                    prefix={<FontAwesomeIcon icon={faSearch} />}
                  />
                </Form.Item>
              </Tooltip>
            </Col>
            <Col>
              <CFilter
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
