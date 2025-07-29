import { CRangePicker } from '@react/commons/DatePicker';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import CInput from '@react/commons/Input';
import CSelect from '@react/commons/Select';
import { BtnGroupFooter, RowHeader } from '@react/commons/Template/style';
import { Col, Form, Row } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import dayjs from 'dayjs';
import { memo, useEffect } from 'react';
import { ActionsTypeEnum, DateFormat } from '@react/constants/app';
import includes from 'lodash/includes';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import CButton, { CButtonExport } from '@react/commons/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useExportMutation } from 'apps/Internal/src/hooks/useExportMutation';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';

export const statusOptions = [
  {
    label: 'Chưa xử lý',
    value: 0,
  },
  {
    label: 'Đã xử lý',
    value: 1,
  },
  {
    label: 'Từ chối',
    value: 4,
  },
];

export const requestTypeOptions = [
  {
    label: 'WEB',
    value: 'WEB',
  },
  {
    label: 'APP',
    value: 'APP',
  },
  {
    label: 'BCSS',
    value: 'BCSS',
  },
];

export const payStatusOptions = [
  {
    label: 'Chưa thanh toán',
    value: '0',
  },
  {
    label: 'Đã thanh toán',
    value: '1',
  },
];

export const Header = memo(() => {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const [form] = Form.useForm();
  const actionByRole = useRolesByRouter();
  const navigate = useNavigate();

  const { isPending: isLoadingExport, mutate: exportMutate } =
    useExportMutation();

  const items: ItemFilter[] = [
    {
      label: 'Trạng thái xử lý',
      value: (
        <Form.Item name="status" className="min-w-[160px]">
          <CSelect
            placeholder="Trạng thái xử lý"
            options={statusOptions}
            showSearch={false}
          />
        </Form.Item>
      ),
    },
    {
      label: 'Kênh',
      value: (
        <Form.Item className="min-w-[160px]" name="requestType">
          <CSelect
            placeholder="Kênh"
            showSearch={false}
            options={requestTypeOptions}
          />
        </Form.Item>
      ),
    },
    {
      label: 'Mã đơn hàng',
      value: (
        <Form.Item className="min-w-[160px]" name="saleOrderNo">
          <CInput placeholder="Nhập mã đơn hàng" maxLength={50} />
        </Form.Item>
      ),
    },
    {
      label: 'Trạng thái thanh toán',
      value: (
        <Form.Item className="min-w-[160px]" name="payStatus">
          <CSelect
            placeholder="Trạng thái thanh toán"
            options={payStatusOptions}
            showSearch={false}
          />
        </Form.Item>
      ),
    },
    {
      label: 'Ngày tạo yêu cầu',
      showDefault: true,
      value: (
        <Form.Item name={'rangePicker'}>
          <CRangePicker placeholder={['Từ ngày', 'Đến ngày']} />
        </Form.Item>
      ),
    },
  ];

  useEffect(() => {
    if (!params.filters) {
      setSearchParams({
        ...params,
        filters: '4',
      });
    }
    if (!!params.filters && !params.isCallApi) {
      setSearchParams({
        ...params,
        fromDate: dayjs().subtract(29, 'day').format(DateFormat.DEFAULT_V4),
        toDate: dayjs().format(DateFormat.DEFAULT_V4),
        isCallApi: 'true',
      });
    }
  }, [params.filters, params.queryTime]);

  useEffect(() => {
    if (params) {
      form.setFieldsValue({
        ...params,
        rangePicker:
          params.fromDate || params.toDate
            ? [
                params.fromDate
                  ? dayjs(params.fromDate, DateFormat.DEFAULT_V4)
                  : undefined,
                params.toDate
                  ? dayjs(params.toDate, DateFormat.DEFAULT_V4)
                  : undefined,
              ]
            : undefined,
      });
    }
  }, [params]);

  const handleFinish = (values: any) => {
    setSearchParams({
      ...params,
      ...values,
      page: 0,
      status: values.status,
      payStatus: values.payStatus,
      requestType: values.requestType,
      queryTime: dayjs().format(DateFormat.DATE_TIME),
      fromDate: values.rangePicker
        ? dayjs(values.rangePicker[0]).format(DateFormat.DEFAULT_V4)
        : undefined,
      toDate: values.rangePicker
        ? dayjs(values.rangePicker[1]).format(DateFormat.DEFAULT_V4)
        : undefined,
    });
  };

  const handleExportData = () => {
    exportMutate({
      uri: `${prefixCustomerService}/change-sim/export`,
      filename: 'danh_sach_doi_sim.xlsx',
      params: queryParams(params),
    });
  };

  return (
    <RowHeader>
      <Form
        form={form}
        onFinish={handleFinish}
        initialValues={{ auditStatus: '' }}
      >
        <Row gutter={[8, 8]}>
          <Col>
            <CFilter
              searchComponent={
                <Form.Item name="isdn">
                  <CInput
                    placeholder="Nhập số thuê bao, số liên hệ"
                    maxLength={11}
                    onlyNumber
                  />
                </Form.Item>
              }
              items={items}
            />
          </Col>
          <BtnGroupFooter>
            {includes(actionByRole, ActionsTypeEnum.CREATE) && (
              <CButton
                icon={<FontAwesomeIcon icon={faPlus} />}
                onClick={() => navigate(pathRoutes.listOfRequestsChangeSimAdd)}
              >
                Tạo yêu cầu
              </CButton>
            )}
            {includes(actionByRole, ActionsTypeEnum.EXPORT_EXCEL) && (
              <CButtonExport
                onClick={handleExportData}
                loading={isLoadingExport}
              />
            )}
          </BtnGroupFooter>
        </Row>
      </Form>
    </RowHeader>
  );
});
