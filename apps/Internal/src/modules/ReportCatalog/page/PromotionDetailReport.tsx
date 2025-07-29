import { faSearch, faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import { CInput } from '@react/commons/index';
import CPagination from '@react/commons/Pagination';
import CSelect from '@react/commons/Select';
import { RowHeader, TitleHeader, Wrapper } from '@react/commons/Template/style';
import { ActionsTypeEnum, DateFormat } from '@react/constants/app';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import { prefixReportService } from '@react/url/app';
import { Button, Card, Form, Spin, Tooltip } from 'antd';
import { ParamsOption } from 'apps/Internal/src/components/layouts/types';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import dayjs from 'dayjs';
import { includes } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDownloadReport } from '../hook/useDownloadReport';
import { useGetContentPromotionDetailReport } from '../hook/useGetContentPromotionDetailReport';
import { IParamsPromotionSummaryReport } from '../hook/useGetContentPromotionSummaryReport';

const PromotionDetailReport = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const actionByRole = useRolesByRouter();
  const [form] = Form.useForm();

  const { data: content, isLoading } = useGetContentPromotionDetailReport({
    ...queryParams({
      ...params,
    }),
  });

  const { PROMOTION_PROGRAM_PROM_METHOD = [] } =
    useGetDataFromQueryKey<ParamsOption>([REACT_QUERY_KEYS.GET_PARAMS]);

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

  const handleSubmit = (values: IParamsPromotionSummaryReport) => {
    setSearchParams({
      ...params,
      ...values,
      page: 0,
      queryTime: dayjs().format(DateFormat.TIME),
    });
  };

  const { mutate: downloadReport } = useDownloadReport();

  const handleDownload = () => {
    downloadReport({
      payload: {
        ...params,
        filters: undefined,
        format: 'XLSX',
      },
      url: `${prefixReportService}/promotion-report/export`,
    });
  };

  const handleRefresh = () => {
    form.resetFields();
    setSearchParams({
      ...params,
      page: '0',
      size: '20',
      queryTime: dayjs().format(DateFormat.TIME),
      q: '',
      promotionType: '',
    });
  };

  const items: ItemFilter[] = [
    {
      label: 'Loại mã',
      showDefault: true,
      value: (
        <Form.Item className="min-w-52" name="promotionType">
          <CSelect
            options={PROMOTION_PROGRAM_PROM_METHOD}
            placeholder={'Chọn loại mã'}
            className="w-full"
          />
        </Form.Item>
      ),
    },
  ];

  useEffect(() => {
    form.setFieldsValue({
      ...params,
    });
  }, []);

  return (
    <Wrapper>
      <TitleHeader>Báo cáo chi tiết mã khuyến mại</TitleHeader>
      <RowHeader>
        <Form onFinish={handleSubmit} form={form}>
          <CFilter
            items={items}
            onRefresh={handleRefresh}
            searchComponent={
              <Tooltip
                title="Nhập tên mã KM, mã khuyến mại, mã đơn hàng để tìm kiếm"
                placement="topLeft"
              >
                <Form.Item name="q" className="min-w-72">
                  <CInput
                    maxLength={50}
                    placeholder="Nhập tên mã KM, mã khuyến mại, mã đơn hàng để tìm kiếm"
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

export default PromotionDetailReport;
