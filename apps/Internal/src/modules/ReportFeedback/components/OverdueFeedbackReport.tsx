import { CButtonExport } from '@react/commons/Button';
import { CRangePicker } from '@react/commons/DatePicker';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import CPagination from '@react/commons/Pagination';
import { RowButton, RowHeader, Wrapper } from '@react/commons/Template/style';
import { formatDate, formatDateEnglishV2 } from '@react/constants/moment';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import { Card, Form, Spin } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  useGetOverdueFeedback,
  useGetOverdueFeedbackKey,
} from '../hooks/useGetOverdueFeedback';
import useSearchHandler from '@react/hooks/useSearchHandler';
import { useExportReport } from 'apps/Internal/src/hooks/useExportReport';
import { prefixReportService } from '@react/url/app';
import { DateFormat } from '@react/constants/app';

const OverdueFeedbackReport = () => {
  const [form] = useForm();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { handleSearch } = useSearchHandler(useGetOverdueFeedbackKey);
  const { data: content, isLoading } = useGetOverdueFeedback({
    ...queryParams(params),
  });
  const { mutate: downloadFile } = useExportReport();
  const items: ItemFilter[] = [
    {
      label: 'Ngày tạo',
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
        fromDate: dayjs().subtract(29, 'day').format(formatDateEnglishV2),
        toDate: dayjs().format(formatDateEnglishV2),
        filters: '0',
      });
    }
  }, [params.fromDate]);
  useEffect(() => {
    if (params) {
      const fromDate = dayjs(params.fromDate, formatDateEnglishV2);
      const toDate = dayjs(params.toDate, formatDateEnglishV2);
      form.setFieldsValue({
        rangePicker: [fromDate, toDate],
      });
    }
  }, [params]);
  const handleRefresh = () => {
    setSearchParams({
      tab: 'overdueFeedback',
      fromDate: dayjs().subtract(29, 'day').format(formatDateEnglishV2),
      toDate: dayjs().format(formatDateEnglishV2),
      filters: '0',
    });
  };
  const handleSubmit = (values: any) => {
    handleSearch({
      ...params,
      page: 0,
      fromDate: values.rangePicker[0].format(formatDateEnglishV2),
      toDate: values.rangePicker[1].format(formatDateEnglishV2),
    });
  };
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState(0);

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
  const handleDownload = () => {
    const { tab, ...rest } = params;
    downloadFile({
      uri: `${prefixReportService}/feedback/overdue/export`,
      params: queryParams({ ...rest, format: 'XLSX' }),
      filename: `Bao_cao_phan_anh_qua_han-${dayjs().format(
        DateFormat.EXPORT
      )}.xlsx`,
    });
  };
  return (
    <Wrapper>
      <RowHeader>
        <Form form={form} onFinish={handleSubmit}>
          <CFilter
            items={items}
            onRefresh={handleRefresh}
            validQuery={useGetOverdueFeedbackKey}
          />
        </Form>
        <RowButton>
          <CButtonExport onClick={handleDownload} />
        </RowButton>
      </RowHeader>
      <Spin spinning={isLoading}>
        <Card
          className="w-full"
          style={{
            height: iframeHeight + 80 + 'px',
            maxHeight: '76vh',
          }}
        >
          <iframe
            ref={iframeRef}
            title="report"
            srcDoc={content?.data}
            style={{
              width: '100%',
              height: iframeHeight + 'px',
              maxHeight: '66vh',
              border: '0',
            }}
          />
          <CPagination
            className="mt-2"
            pageSize={
              content?.pagination.pageSize ? +content?.pagination.pageSize : 20
            }
            current={
              content?.pagination.current ? +content?.pagination.current + 1 : 1
            }
            total={content?.pagination.total ? +content?.pagination.total : 0}
          />
        </Card>
      </Spin>
    </Wrapper>
  );
};
export default OverdueFeedbackReport;
