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
import { useListOrgUnitNoOption } from 'apps/Internal/src/hooks/useListOrgUnit';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import dayjs from 'dayjs';
import { includes } from 'lodash';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDownloadReport } from '../hook/useDownloadReport';
import { IParamsInventoryExportReport } from '../hook/useGetContentInventoryExportReport';
import { useGetContentInventoryImportReport } from '../hook/useGetContentInventoryImportReport';
import { useListNCC } from '../hook/useListNCC';

enum TypeTransaction {
  ImportInternal = '2',
  ImportNCC = '4',
  ImportOther = '8',
  ImportKIT = '16',
  ImportSIM = '18',
}

const InventoryImportReport = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const actionByRole = useRolesByRouter();
  const { data: content, isLoading } = useGetContentInventoryImportReport({
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

  const { STOCK_MOVE_LOOK_UP_MOVE_TYPE = [] } =
    useGetDataFromQueryKey<ParamsOption>([REACT_QUERY_KEYS.GET_PARAMS]);

  const { data: listNCC = [], isLoading: loadingNCC } = useListNCC();

  const optionsTransactionType = useMemo(() => {
    return STOCK_MOVE_LOOK_UP_MOVE_TYPE.filter(
      (item) =>
        item.value === TypeTransaction.ImportNCC ||
        item.value === TypeTransaction.ImportInternal ||
        item.value === TypeTransaction.ImportOther ||
        item.value === TypeTransaction.ImportKIT ||
        item.value === TypeTransaction.ImportSIM
    );
  }, [STOCK_MOVE_LOOK_UP_MOVE_TYPE]);

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

  const handleSubmit = (values: IParamsInventoryExportReport) => {
    const { period, ...res } = values;
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
      url: `${prefixReportService}/stock-in/export`,
    });
  };

  const { data: listOrgUnit = [], isPending: loadingOrgUnit } =
    useListOrgUnitNoOption({
      status: 1,
    });
  const optionsListOrgUnit = useMemo(() => {
    return listOrgUnit?.map((e) => ({
      value: e.id,
      label: e.orgCode,
    }));
  }, [listOrgUnit]);

  const handleRefresh = () => {
    form.resetFields();
    const values = form.getFieldsValue();
    setSearchParams({
      ...params,
      ...values,
      page: 0,
      size: 20,
      orgId: null,
      queryTime: dayjs().format(DateFormat.TIME),
      fromDate: dayjs().subtract(29, 'day').format(formatDateEnglishV2),
      toDate: dayjs().format(formatDateEnglishV2),
      period: undefined,
    });
  };

  const items: ItemFilter[] = [
    {
      label: 'Chọn kho',
      showDefault: true,
      value: (
        <Form.Item className="min-w-52" name="orgId">
          <CSelect
            loading={loadingOrgUnit}
            options={optionsListOrgUnit}
            placeholder={'Chọn kho'}
            className="w-full"
          />
        </Form.Item>
      ),
    },
    {
      label: 'Chọn NCC',
      value: (
        <Form.Item className="min-w-52" name="supplierCode">
          <CSelect
            loading={loadingNCC}
            options={listNCC}
            placeholder={'Chọn NCC'}
            className="w-full"
          />
        </Form.Item>
      ),
    },
    {
      label: 'Chọn loại giao dịch',
      value: (
        <Form.Item className="min-w-52" name="typeStock">
          <CSelect
            options={optionsTransactionType}
            placeholder={'Chọn loại giao dịch'}
            className="w-full"
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

  useEffect(() => {
    form.setFieldsValue({
      ...params,
      orgId: params.orgId ? Number(params.orgId) : null,
    });
    if (params.fromDate && params.toDate) {
      form.setFieldValue('period', [
        dayjs(params.fromDate),
        dayjs(params.toDate),
      ]);
    }
  }, []);

  return (
    <Wrapper>
      <TitleHeader>Báo cáo nhập kho</TitleHeader>
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
              <Tooltip title="Nhập mã giao dịch nhập kho" placement="topLeft">
                <Form.Item name="stockCode" className="min-w-72">
                  <CInput
                    maxLength={50}
                    placeholder="Nhập mã giao dịch nhập kho"
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

export default InventoryImportReport;
