import { CButtonExport } from '@react/commons/Button';
import { CRangePicker } from '@react/commons/DatePicker';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import CPagination from '@react/commons/Pagination';
import CSelect from '@react/commons/Select';
import { RowButton, RowHeader, Wrapper } from '@react/commons/Template/style';
import { DateFormat } from '@react/constants/app';
import { formatDate, formatDateEnglishV2 } from '@react/constants/moment';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import useSearchHandler from '@react/hooks/useSearchHandler';
import { prefixReportService } from '@react/url/app';
import { Card, Form, Spin, TreeSelect } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useExportReport } from 'apps/Internal/src/hooks/useExportReport';
import { useGetApplicationConfig } from 'apps/Internal/src/hooks/useGetApplicationConfig';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { debounce } from 'lodash';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  useGetDetailFeedback,
  useGetDetailFeedbackKey,
} from '../hooks/useGetDetailFeedback';
import { useFetchFeedbackTypes } from '../hooks/useGetFeedbackType';
import { useInfinityFeedbackCreator } from '../hooks/useInfinityFeedbackCreator';

const FeedbackDetail = () => {
  const [form] = useForm();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { handleSearch } = useSearchHandler(useGetDetailFeedbackKey);
  const { data: content, isLoading } = useGetDetailFeedback({
    ...queryParams(params),
  });
  const { mutate: downloadFile } = useExportReport();
  const { data: feedbackTypes = [], isFetching: isLoadingFeedbackType } =
    useFetchFeedbackTypes();
  const { data: channels = [] } = useGetApplicationConfig('FEEDBACK_CHANNEL');
  const { data: statusOptions = [] } = useGetApplicationConfig(
    'FEEDBACK_REQUEST_STATUS'
  );
  const { data: priorityOptions = [] } = useGetApplicationConfig(
    'FEEDBACK_SLA_CONFIG'
  );
  const [creatorName, setCreatorName] = useState('');
  const {
    data: feedbackCreators = [],
    fetchNextPage,
    hasNextPage,
  } = useInfinityFeedbackCreator({
    page: 0,
    size: 20,
    userName: creatorName,
  });
  const handleCreatorSearch = useCallback(
    debounce((value: string) => {
      setCreatorName(value);
    }, 800),
    [fetchNextPage]
  );
  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const target = event.target as HTMLDivElement;
      if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
        if (hasNextPage) {
          fetchNextPage();
        }
      }
    },
    [fetchNextPage, hasNextPage]
  );
  const mapChildren = (arr: any[] | undefined, parent: any) => {
    if (!arr) return;
    const newArr = arr
      ?.filter(
        (item) =>
          item.parentId === parent ||
          (!arr?.some((val: any) => val.id === item.parentId) &&
            parent === null)
      )
      ?.reduce((acc, item) => {
        acc.push({ ...item, children: mapChildren(arr, item.id) });
        return acc;
      }, []);
    return newArr?.length > 0 ? newArr : undefined;
  };
  const feedbackTypeToTreeData = (arr: any[], isDisableByLevel = false) => {
    if (!arr) return;
    return arr?.map((e) => ({
      ...e,
      value: e.id,
      title: e.typeName,
      disabled: isDisableByLevel ? e?.level !== 4 : false,
    }));
  };
  const getBaseFeedbackType = useMemo(() => {
    return mapChildren(feedbackTypeToTreeData(feedbackTypes || []), null);
  }, [isLoadingFeedbackType]);

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
    {
      label: 'Loại phản ánh',
      value: (
        <Form.Item name={'feedbackTypeId'} className="w-72">
          <TreeSelect
            showSearch
            style={{ width: '100%' }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder="Loại phản ánh"
            allowClear
            treeData={getBaseFeedbackType}
            treeNodeFilterProp="title"
          />
        </Form.Item>
      ),
    },
    {
      label: 'Kênh phản ánh',
      value: (
        <Form.Item name={'feedbackChannel'} className="w-44">
          <CSelect
            placeholder="Kênh phản ánh"
            options={channels}
            fieldNames={{ label: 'name', value: 'name' }}
            filterOption={(input, option) => {
              const label = option?.name || '';
              return label.toLowerCase().includes(input.toLowerCase());
            }}
          />
        </Form.Item>
      ),
    },
    {
      label: 'Người tạo',
      value: (
        <Form.Item name={'createdBy'} className="w-52">
          <CSelect
            placeholder="Người tạo"
            options={feedbackCreators}
            onSearch={handleCreatorSearch}
            onPopupScroll={handleScroll}
          />
        </Form.Item>
      ),
    },
    {
      label: 'Độ ưu tiên',
      value: (
        <Form.Item name={'priorityLevel'} className="w-32">
          <CSelect
            placeholder="Độ ưu tiên"
            options={priorityOptions}
            fieldNames={{ label: 'name', value: 'code' }}
            showSearch={false}
          />
        </Form.Item>
      ),
    },
    {
      label: 'Trạng thái',
      value: (
        <Form.Item name={'status'} className="w-32">
          <CSelect
            placeholder="Trạng thái"
            options={statusOptions}
            fieldNames={{ label: 'name', value: 'code' }}
            filterOption={(input, option) => {
              const label = option?.name || '';
              return label.toLowerCase().includes(input.toLowerCase());
            }}
          />
        </Form.Item>
      ),
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
      const { status, ...rest } = params;
      form.setFieldsValue({
        ...rest,
        ...(status && { status: status + '' }),
        ...(params.feedbackTypeId && {
          feedbackTypeId: +params.feedbackTypeId,
        }),
        rangePicker: [fromDate, toDate],
      });
    }
  }, [params]);
  const handleRefresh = () => {
    form.resetFields();
    setSearchParams({
      tab: 'feedbackDetail',
      fromDate: dayjs().subtract(29, 'day').format(formatDateEnglishV2),
      toDate: dayjs().format(formatDateEnglishV2),
      filters: '0',
    });
  };
  const handleSubmit = (values: any) => {
    handleSearch({
      ...values,
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
      uri: `${prefixReportService}/feedback/detail/export`,
      params: queryParams({ ...rest, format: 'XLSX' }),
      filename: `Bao_cao_phan_anh_chi_tiet-${dayjs().format(
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
            validQuery={useGetDetailFeedbackKey}
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
export default FeedbackDetail;
