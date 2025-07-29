import {
  faMagnifyingGlass,
  faRotateLeft,
  faUpload,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CButton from '@react/commons/Button';
import { CRangePicker } from '@react/commons/index';
import CPagination from '@react/commons/Pagination';
import CSelect from '@react/commons/Select';
import {
  RowHeader,
  TitleHeader,
  Wrapper,
  WrapperButton,
} from '@react/commons/Template/style';
import { DateFormat } from '@react/constants/app';
import { formatDateEnglishV2 } from '@react/constants/moment';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import { prefixReportService } from '@react/url/app';
import { Button, Card, Col, Form, Row, Spin } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import dayjs from 'dayjs';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDownloadReport } from '../hook/useDownloadReport';
import {
  IParamsReportReportInventory,
  useGetContentReportInventory,
} from '../hook/useGetContentReportInventory';
import { useGetCurrentOrganization } from '../hook/useGetCurrentOrganization';

const ReportInventory = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const params: any = decodeSearchParams(searchParams);

  const defaultDate = useMemo(() => {
    return [dayjs().subtract(29, 'day'), dayjs()];
  }, []);

  const { data: content, isLoading } = useGetContentReportInventory({
    ...queryParams({
      ...params,
      includeChildren: params.includeChildren ?? 'true',
      fromDate: params.fromDate
        ? dayjs(params.fromDate).format(formatDateEnglishV2)
        : defaultDate[0].format(formatDateEnglishV2),
      toDate: params.toDate
        ? dayjs(params.toDate).format(formatDateEnglishV2)
        : defaultDate[1].format(formatDateEnglishV2),
    }),
  });

  useEffect(() => {
    if (params.fromDate && params.toDate) {
      form.setFieldsValue({
        period: [
          dayjs(params.fromDate, formatDateEnglishV2),
          dayjs(params.toDate, formatDateEnglishV2),
        ],
      });
    }
    if (params.orgId) {
      form.setFieldsValue({
        orgId: params.orgId,
      });
    }
  }, []);

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
  const includeChildren = useWatch('includeChildren', form);
  const { data: listOrganization = [], isPending: loadingOrganization } =
    useGetCurrentOrganization();

  const handleSubmit = (values: IParamsReportReportInventory) => {
    const { period, orgId, includeChildren } = values;
    setSearchParams({
      ...params,
      page: 0,
      orgId,
      queryTime: dayjs().format(DateFormat.TIME),
      includeChildren: Boolean(includeChildren),
      fromDate: dayjs(period[0]).format(formatDateEnglishV2),
      toDate: dayjs(period[1]).format(formatDateEnglishV2),
    });
  };

  const { mutate: downloadReport } = useDownloadReport();

  const handleDownload = () => {
    downloadReport({
      payload: {
        ...params,
        period: undefined,
        format: 'XLSX',
        fromDate: dayjs(params.fromDate).format(formatDateEnglishV2),
        toDate: dayjs(params.toDate).format(formatDateEnglishV2),
      },
      url: `${prefixReportService}/inventory-reports/export`,
    });
  };

  const optionListOrganization = useMemo(() => {
    if (listOrganization) {
      return listOrganization.map((item) => ({
        label: item.orgName,
        value: item.orgId,
      }));
    }
    return [];
  }, [listOrganization]);

  useEffect(() => {
    if (listOrganization && listOrganization.length > 0) {
      const currentOrg = listOrganization.find((item) => item.isCurrent);
      if (currentOrg) {
        const orgId = params.orgId ? Number(params.orgId) : currentOrg.orgId;
        form.setFieldsValue({
          orgId,
        });
        setSearchParams({
          ...params,
          orgId,
        });
      }
    }
  }, [listOrganization]);

  const handleRefresh = () => {
    form.resetFields();
    const values = form.getFieldsValue();
    setSearchParams({
      ...params,
      ...values,
      period: defaultDate,
      page: 0,
      orgId: listOrganization.find((item) => item.isCurrent)?.orgId,
      queryTime: dayjs().format(DateFormat.TIME),
      includeChildren: true,
    });
  };

  return (
    <Wrapper>
      <TitleHeader>Báo cáo xuất nhập tồn</TitleHeader>
      <RowHeader>
        <Form
          onFinish={handleSubmit}
          form={form}
          initialValues={{
            period: defaultDate,
            orgId: listOrganization.find((item) => item.isCurrent)?.orgId,
            includeChildren: 1,
          }}
        >
          <Row gutter={[8, 8]}>
            <Col>
              <Form.Item name="includeChildren" className="!w-[230px]">
                <CSelect
                  loading={loadingOrganization}
                  options={[
                    { value: 0, label: 'Theo từng kho' },
                    { value: 1, label: 'Kho hiện tại và các kho con' },
                  ]}
                  placeholder={'Chọn kho'}
                  allowClear={false}
                />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item className="min-w-60" name="orgId">
                <CSelect
                  loading={loadingOrganization}
                  options={optionListOrganization}
                  placeholder={'Chọn kho'}
                  allowClear={false}
                  className="w-full"
                />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item name="period">
                <CRangePicker allowClear={false} className="w-full" />
              </Form.Item>
            </Col>
            <Col>
              <WrapperButton>
                <CButton
                  icon={<FontAwesomeIcon icon={faMagnifyingGlass} />}
                  htmlType="submit"
                >
                  Tìm kiếm
                </CButton>
                <FontAwesomeIcon
                  icon={faRotateLeft}
                  size="lg"
                  className="cursor-pointer self-center"
                  onClick={handleRefresh}
                  title="Làm mới"
                />
              </WrapperButton>
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
          {includeChildren ? null : (
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
                content?.pagination.total
                  ? Number(content?.pagination.total)
                  : 0
              }
            />
          )}
        </Card>
      </Spin>
    </Wrapper>
  );
};

export default ReportInventory;
