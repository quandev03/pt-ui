import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CButtonExport } from '@react/commons/Button';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import {
  CInput,
  CPagination,
  CRangePicker,
  CSelect,
} from '@react/commons/index';
import { TitleHeader } from '@react/commons/Template/style';
import { formatDate, formatDateEnglishV2 } from '@react/constants/moment';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import { filterFalsy } from '@react/utils/index';
import { Card, Col, Form, Row, Spin, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  PACKAGE_SALES_REPORT_QUERY_KEY,
  useDownloadReport,
  useListPackageSalesReport,
} from '../hooks/usePackageSalesReport';
import { getListType, IType } from '../types';
import { Wrapper } from './style';
import { ActionsTypeEnum } from '@react/constants/app';
import { includes } from 'lodash';
import { useRolesByRouter } from 'apps/Partner/src/hooks/useRolesByRouter';

const PackageSalesReportPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const actionByRole = useRolesByRouter();
  const { data: content, isLoading } = useListPackageSalesReport({
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
  const listType = useMemo(() => {
    return getListType();
  }, []);
  const saleType = useMemo(() => {
    if (!listType) return [];
    return listType
      .filter((item) => item.value === 'SALE_TYPE')
      .map((item: IType) => {
        return { label: item.name, value: item.code };
      });
  }, [listType]);
  const paymentType = useMemo(() => {
    if (!listType) return [];
    return listType
      .filter((item) => item.value === 'PAYMENT_TYPE')
      .map((item: IType) => {
        return { label: item.name, value: item.code };
      });
  }, [listType]);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState(0);
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
      label: 'Hình thức bán gói',
      value: (
        <Form.Item name="saleType" className={'!w-72'}>
          <CSelect
            placeholder="Hình thức bán gói"
            options={saleType}
            allowClear={false}
            onKeyDown={(e) => e.preventDefault()}
          />
        </Form.Item>
      ),
    },
    {
      label: 'Hình thức thanh toán',
      value: (
        <Form.Item name="paymentType" className={'!w-72'}>
          <CSelect
            placeholder="Hình thức thanh toán"
            options={paymentType}
            allowClear={false}
            onKeyDown={(e) => e.preventDefault()}
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
          <CRangePicker format={formatDate} allowClear={false} />
        </Form.Item>
      ),
      showDefault: true,
    },
  ];

  useEffect(() => {
    form.setFieldsValue(params);
  }, [form, params]);

  const { mutate: downloadReport } = useDownloadReport();

  const handleDownload = () => {
    downloadReport({ ...params, format: 'XLSX' });
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
      <TitleHeader>Báo cáo bán gói cho thuê bao</TitleHeader>
      <div className={'flex justify-between flex-wrap mb-4 gap-4'}>
        <Form form={form} onFinish={handleSearch} className={'flex-1'}>
          <Row gutter={8}>
            <Col span={5}>
              <Tooltip
                title="Nhập Số thuê bao/ User thực hiện"
                placement="right"
                overlayClassName="quickSearchOverlay"
              >
                <Form.Item name="q" label="">
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
                items={filterPackageSalesReport}
                validQuery={PACKAGE_SALES_REPORT_QUERY_KEY.LIST}
              />
            </Col>
          </Row>
        </Form>
        {includes(actionByRole, ActionsTypeEnum.EXPORT_EXCEL) && (
          <CButtonExport onClick={handleDownload} />
        )}
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

export default PackageSalesReportPage;
