import { faSearch, faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import { CInput, CRangePicker } from '@react/commons/index';
import CPagination from '@react/commons/Pagination';
import CSelect from '@react/commons/Select';
import { RowHeader, TitleHeader, Wrapper } from '@react/commons/Template/style';
import { ActionsTypeEnum, DateFormat } from '@react/constants/app';
import { formatDateEnglishV2 } from '@react/constants/moment';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import { prefixReportService } from '@react/url/app';
import { Button, Card, Form, Spin, Tooltip } from 'antd';
import { ParamsOption } from 'apps/Internal/src/components/layouts/types';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDownloadReport } from '../hook/useDownloadReport';
import {
  IParamsOnlineOrderDetailReport,
  useGetContentOnlineOrderDetailReport,
} from '../hook/useGetContentOnlineOrderDetailReport';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import { includes } from 'lodash';
import { useListChannles } from '../../OnlineOrderCS/queryHooks';

const OnlineOrderDetailReport = () => {
  const { data: optionSalesChannel, isPending: loadingSaleChannel } = useListChannles();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const actionByRole = useRolesByRouter();
  const { data: content, isLoading } = useGetContentOnlineOrderDetailReport({
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

  const {
    SALE_ORDER_DELIVERY_STATUS = [],
    SALE_ORDER_DELIVERY_PARTNER_CODE = [],
  } = useGetDataFromQueryKey<ParamsOption>([REACT_QUERY_KEYS.GET_PARAMS]);

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

  const [form] = Form.useForm();

  const handleSubmit = (values: IParamsOnlineOrderDetailReport) => {
    const { period, orgId, ...res } = values;
    setSearchParams({
      ...params,
      ...res,
      page: 0,
      queryTime: dayjs().format(DateFormat.TIME),
      fromDate:
        period && period[0]
          ? dayjs(period[0]).format(formatDateEnglishV2)
          : dayjs().subtract(29, 'day').format(formatDateEnglishV2),
      toDate:
        period && period[1]
          ? dayjs(period[1]).format(formatDateEnglishV2)
          : dayjs().format(formatDateEnglishV2),
    });
  };

  const { mutate: downloadReport } = useDownloadReport();

  const handleDownload = () => {
    downloadReport({
      payload: {
        ...params,
        filters: undefined,
        fromDate: params.fromDate
          ? dayjs(params.fromDate).format(formatDateEnglishV2)
          : dayjs().subtract(29, 'day').format(formatDateEnglishV2),
        toDate: params.toDate
          ? dayjs(params.toDate).format(formatDateEnglishV2)
          : dayjs().format(formatDateEnglishV2),
        format: 'XLSX',
      },
      url: `${prefixReportService}/online-order/export`,
    });
  };

  const handleRefresh = () => {
    form.resetFields();
    const values = form.getFieldsValue();
    setSearchParams({
      ...params,
      ...values,
      page: 0,
      size: 20,
      queryTime: dayjs().format(DateFormat.TIME),
      fromDate: dayjs().subtract(29, 'day').format(formatDateEnglishV2),
      toDate: dayjs().format(formatDateEnglishV2),
      period: undefined,
    });
  };

  useEffect(() => {
    form.setFieldsValue({
      ...params,
      status: params.status ? String(params.status) : null,
    });
    if (params.fromDate && params.toDate) {
      form.setFieldValue('period', [
        dayjs(params.fromDate),
        dayjs(params.toDate),
      ]);
    }
  }, []);

  const items: ItemFilter[] = [
    {
      label: 'Trạng thái đơn hàng',
      showDefault: true,
      value: (
        <Form.Item className="min-w-52" name="status">
          <CSelect
            options={SALE_ORDER_DELIVERY_STATUS}
            placeholder={'Chọn trạng thái đơn hàng'}
            className="w-full"
            allowClear
          />
        </Form.Item>
      ),
    },
    {
      label: 'Đơn vị vận chuyển',
      value: (
        <Form.Item className="min-w-52" name="partner">
          <CSelect
            options={SALE_ORDER_DELIVERY_PARTNER_CODE}
            placeholder={'Chọn đơn vị vận chuyển'}
            className="w-full"
            allowClear
          />
        </Form.Item>
      ),
    },
    {
      label: 'Kênh mua',
      value: (
        <Form.Item name="saleChannel" className={'!w-40'}>
          <CSelect
            options={optionSalesChannel}
            loading={loadingSaleChannel}
            placeholder="Chọn kênh mua"
            filterOption={(input: any, option: any) =>
              (option?.label?.toLowerCase() ?? '').includes(
                input?.toLowerCase()
              )
            }
            filterSort={(optionA: any, optionB: any) =>
              (optionA?.label ?? '')
                .toLowerCase()
                .localeCompare((optionB?.label ?? '').toLowerCase())
            }
          />
        </Form.Item>
      ),
    },
    {
      label: 'Chọn thời gian',
      showDefault: true,
      value: (
        <Form.Item name="period">
          <CRangePicker allowClear={false} className="w-full" />
        </Form.Item>
      ),
    },
  ];

  return (
    <Wrapper>
      <TitleHeader>Báo cáo chi tiết đơn hàng online</TitleHeader>
      <RowHeader>
        <Form
          onFinish={handleSubmit}
          form={form}
          initialValues={{
            period: [dayjs().subtract(29, 'day'), dayjs()],
          }}
        >
          <CFilter
            items={items}
            onRefresh={handleRefresh}
            searchComponent={
              <Tooltip
                title="Nhập mã đơn hàng, SĐT, số liên hệ để tìm kiếm"
                placement="topLeft"
              >
                <Form.Item name="q" className="min-w-72">
                  <CInput
                    maxLength={100}
                    placeholder="Nhập mã đơn hàng, SĐT, số liên hệ để tìm kiếm"
                    prefix={<FontAwesomeIcon icon={faSearch} />}
                  />
                </Form.Item>
              </Tooltip>
            }
          />
        </Form>
        {includes(actionByRole, ActionsTypeEnum.EXPORT_EXCEL) && (
          <Button
            icon={<FontAwesomeIcon icon={faUpload} />}
            type="primary"
            onClick={handleDownload}
          >
            Xuất báo cáo
          </Button>
        )}
      </RowHeader>
      <Spin spinning={isLoading}>
        <Card
          className="w-full"
          style={{
            height: (iframeHeight > 652 ? 652 : iframeHeight) + 80 + 'px',
          }}
        >
          <iframe
            ref={iframeRef}
            title="report"
            srcDoc={content?.data}
            style={{
              width: '100%',
              height: (iframeHeight > 640 ? 640 : iframeHeight) + 'px',
              border: '0',
            }}
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

export default OnlineOrderDetailReport;
