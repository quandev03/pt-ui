import { CButtonExport } from '@react/commons/Button';
import CDatePicker from '@react/commons/DatePicker';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import CSelect from '@react/commons/Select';
import { RowButton, RowHeader, Wrapper } from '@react/commons/Template/style';
import { DateFormat } from '@react/constants/app';
import { formatDateEnglishV2 } from '@react/constants/moment';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import useSearchHandler from '@react/hooks/useSearchHandler';
import { prefixReportService } from '@react/url/app';
import { Card, DatePicker, Empty, Form, Spin, Tooltip } from 'antd';
import locale from 'antd/es/date-picker/locale/vi_VN';
import { useForm } from 'antd/lib/form/Form';
import { useExportReport } from 'apps/Internal/src/hooks/useExportReport';
import { useGetApplicationConfig } from 'apps/Internal/src/hooks/useGetApplicationConfig';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import updateLocale from 'dayjs/plugin/updateLocale';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  useGetFeedbackChannel,
  useGetFeedbackChannelKey,
} from '../hooks/useGetFeedbackChannel';
import { StyledDatePickerWeek } from '../page/styled';
dayjs.extend(updateLocale);
dayjs.updateLocale('vi', {
  weekStart: 6,
  doy: 6,
});

const FeedbackChannelsReport = () => {
  const [form] = useForm();
  const year = Form.useWatch('year', form);
  const month = Form.useWatch('month', form);
  const [searchParams, setSearchParams] = useSearchParams();
  const { handleSearch } = useSearchHandler(useGetFeedbackChannelKey);
  const params = decodeSearchParams(searchParams);
  const { data: content, isLoading } = useGetFeedbackChannel(
    queryParams(params)
  );
  const { mutate: downloadFile } = useExportReport();
  const { data: channels = [] } = useGetApplicationConfig('FEEDBACK_CHANNEL');
  const disabledWeek = (current: any) => {
    return (
      (current && year && month && current.year() !== year.year()) ||
      (month && current.month() !== month.month())
    );
  };
  useEffect(() => {
    if (!params.fromDate) {
      setSearchParams({
        ...params,
        fromDate: dayjs().startOf('month').format(formatDateEnglishV2),
        toDate: dayjs().endOf('month').format(formatDateEnglishV2),
        filters: '0,1,2',
        timeType: '2',
      });
      form.setFieldsValue({
        year: dayjs(),
        month: dayjs(),
      });
    }
  }, [params.fromDate]);
  const handleChangeYear = () => {
    form.setFieldsValue({
      month: undefined,
      week: undefined,
    });
  };
  const handleChangeMonth = () => {
    form.setFieldsValue({
      week: undefined,
    });
  };
  const items: ItemFilter[] = [
    {
      label: 'Năm',
      value: (
        <Form.Item name={'year'}>
          <CDatePicker
            picker="year"
            format={'[Năm] YYYY'}
            onChange={handleChangeYear}
            allowClear={false}
          />
        </Form.Item>
      ),
      showDefault: true,
    },
    {
      label: 'Tháng',
      value: (
        <Form.Item name={'month'}>
          <CDatePicker
            picker="month"
            format={'[Tháng] M'}
            locale={locale}
            disabled={!year}
            defaultPickerValue={year?.startOf('year')}
            minDate={year?.startOf('year')}
            maxDate={year?.endOf('year')}
            onChange={handleChangeMonth}
          />
        </Form.Item>
      ),
      showDefault: true,
    },
    {
      label: 'Tuần',
      value: (
        <Form.Item name={'week'}>
          <DatePicker
            picker="week"
            disabledDate={disabledWeek}
            disabled={!year || !month}
            defaultPickerValue={month?.startOf('month')}
            minDate={month?.startOf('month')}
            maxDate={month?.endOf('month')}
            format={(date) => {
              if (!date) return '';
              const startOfMonth = date.startOf('month');
              const startDateOfFirstWeek =
                startOfMonth.day() === 6
                  ? startOfMonth
                  : startOfMonth.startOf('week').subtract(1, 'day');
              const weekOfMonth = date.diff(startDateOfFirstWeek, 'week') + 1;
              return `Tuần ${weekOfMonth}`;
            }}
            showWeek={false}
          />
        </Form.Item>
      ),
      showDefault: true,
    },
    {
      label: 'Kênh phản ánh',
      value: (
        <Form.Item name={'channels'} className="w-64">
          <CSelect
            placeholder="Kênh phản ánh"
            options={channels}
            fieldNames={{ label: 'name', value: 'name' }}
            filterOption={(input, option) => {
              const label = option?.name || '';
              return label.toLowerCase().includes(input.toLowerCase());
            }}
            mode="multiple"
            maxTagPlaceholder={(omittedValues) => (
              <Tooltip
                overlayStyle={{ pointerEvents: 'none' }}
                title={omittedValues.map(({ label }) => label).join(', ')}
              >
                <span>...</span>
              </Tooltip>
            )}
          />
        </Form.Item>
      ),
    },
  ];
  const handleRefresh = () => {
    form.resetFields();
    setSearchParams({
      tab: 'feedbackChannel',
      filters: '0,1,2',
    });
  };
  const handleFinish = (values: any) => {
    const { channels } = values;
    let startDate, endDate, timeType;
    if (values.week) {
      let week = values.week;
      if (week.day() === 6) {
        week = week.add(1, 'day');
      }
      const startOfWeek = week.startOf('week').subtract(1, 'day');
      const endOfWeek = week.endOf('week').subtract(1, 'day');
      const startOfMonth = week.startOf('month');
      const endOfMonth = week.endOf('month');
      const fromDate = startOfWeek.isBefore(startOfMonth)
        ? startOfMonth
        : startOfWeek;
      const toDate = endOfWeek.isAfter(endOfMonth) ? endOfMonth : endOfWeek;
      startDate = fromDate.format(formatDateEnglishV2);
      endDate = toDate.format(formatDateEnglishV2);
      timeType = '3';
    } else if (values.month) {
      startDate = values.month.startOf('month').format(formatDateEnglishV2);
      endDate = values.month.endOf('month').format(formatDateEnglishV2);
      timeType = '2';
    } else if (values.year) {
      startDate = values.year.startOf('year').format(formatDateEnglishV2);
      endDate = values.year.endOf('year').format(formatDateEnglishV2);
      timeType = '1';
    }
    handleSearch({
      ...params,
      channels: channels,
      fromDate: startDate,
      toDate: endDate,
      ...(timeType && { timeType: timeType }),
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
    if (!params.timeType) {
      return;
    }
    downloadFile({
      uri: `${prefixReportService}/feedback/feedback-by-channel/export`,
      params: queryParams({ ...rest, format: 'XLSX' }),
      filename: `Bao_cao_kenh_phan_anh-${dayjs().format(
        DateFormat.EXPORT
      )}.xlsx`,
    });
  };
  return (
    <Wrapper>
      <RowHeader>
        <StyledDatePickerWeek />
        <Form form={form} onFinish={handleFinish}>
          <CFilter items={items} onRefresh={handleRefresh} />
        </Form>
        <RowButton>
          <CButtonExport onClick={handleDownload} />
        </RowButton>
      </RowHeader>
      {content ? (
        <Spin spinning={isLoading}>
          <Card
            className="w-full"
            style={{
              height: iframeHeight + 80 + 'px',
              maxHeight: '74vh',
            }}
          >
            <iframe
              ref={iframeRef}
              title="report"
              srcDoc={content?.data}
              style={{
                width: '100%',
                height: iframeHeight + 'px',
                border: '0',
                maxHeight: '64vh',
              }}
            />
          </Card>
        </Spin>
      ) : (
        <div className="h-[60vh] flex justify-center items-center">
          <Empty description="Không có dữ liệu" />
        </div>
      )}
    </Wrapper>
  );
};
export default FeedbackChannelsReport;
