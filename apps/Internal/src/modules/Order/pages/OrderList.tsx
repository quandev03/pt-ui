import { faSearch, faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CRangePicker } from '@react/commons/DatePicker';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import CInput from '@react/commons/Input';
import CSelect from '@react/commons/Select';
import CTable from '@react/commons/Table';
import { TitleHeader } from '@react/commons/Template/style';
import { ACTION_MODE_ENUM } from '@react/commons/types';
import { ActionsTypeEnum } from '@react/constants/app';
import { formatDateEnglishV2, formatDateISO } from '@react/constants/moment';
import {
  cleanParams,
  decodeSearchParams,
  queryParams,
} from '@react/helpers/utils';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import useSearchHandler from '@react/hooks/useSearchHandler';
import { prefixReportService } from '@react/url/app';
import { Button, Form, Tooltip } from 'antd';
import { ParamsOption } from 'apps/Internal/src/components/layouts/types';
import ModalViewApprovalProcess from 'apps/Internal/src/components/ModalViewApprovalProcess';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useGetAllPartner } from 'apps/Internal/src/hooks/useGetAllPartner';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import dayjs, { Dayjs } from 'dayjs';
import { includes } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ModalAction from '../components/ModalAction';
import { getColumnsTableOrder } from '../constants';
import { useDownloadReport, useGetOrders } from '../queryHooks';
import useOrderStore from '../stores';
import { IDataOrder } from '../types';
import { useDecryptOperationsId } from 'apps/Internal/src/hooks/useDecryptOperationsId';

const OrderList = () => {
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);

  const listRoles = useRolesByRouter();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { orderDetail, setOrderDetail, typeAction, setTypeAction } =
    useOrderStore();
  const { data: idDecrypt } = useDecryptOperationsId(
    orderDetail?.id ? String(orderDetail.id) : ''
  );
  const [openModalViewApprovalProcess, setOpenModalViewApprovalProcess] =
    useState(false);

  const { data: orders, isLoading: loadingTable } = useGetOrders(
    queryParams(
      cleanParams({
        ...params,
        fromDate: params.fromDate
          ? dayjs(params.fromDate).format(formatDateISO)
          : dayjs().subtract(1, 'month').startOf('day').format(formatDateISO),
        toDate: params.toDate
          ? dayjs(params.toDate).endOf('day').format(formatDateISO)
          : dayjs().endOf('day').format(formatDateISO),
      })
    )
  );

  const { handleSearch } = useSearchHandler(REACT_QUERY_KEYS.ORDERS);

  const {
    SALE_ORDER_PAYMENT_OPTION = [],
    SALE_ORDER_STATUS = [],
    SALE_ORDER_APPROVAL_STATUS = [],
  } = useGetDataFromQueryKey<ParamsOption>([REACT_QUERY_KEYS.GET_PARAMS]);

  const dataTable = useMemo(() => {
    if (!orders) {
      return [];
    }
    return orders.content;
  }, [orders]);

  const { data: orgUnit = [] } = useGetAllPartner();

  const items: ItemFilter[] = useMemo(() => {
    return [
      {
        label: 'Đối tác',
        value: (
          <Form.Item label="" name="orgId" className="w-48 mb-0">
            <CSelect
              options={orgUnit}
              placeholder="Chọn đối tác"
              mode="multiple"
              maxRow={3}
            />
          </Form.Item>
        ),
      },
      {
        label: 'Trạng thái đơn hàng',
        value: (
          <Form.Item label="" name="orderStatus" className="w-48 mb-0">
            <CSelect
              options={SALE_ORDER_STATUS}
              placeholder="Trạng thái đơn hàng"
            />
          </Form.Item>
        ),
      },
      {
        label: 'Trạng thái phê duyệt',
        value: (
          <Form.Item label="" name="approvalStatus" className="w-48 mb-0">
            <CSelect
              options={SALE_ORDER_APPROVAL_STATUS}
              placeholder="Trạng thái phê duyệt"
            />
          </Form.Item>
        ),
      },
      {
        label: 'Từ ngày - Đến ngày',
        showDefault: true,
        value: (
          <Form.Item label="" name="time" className="w-80 mb-0">
            <CRangePicker />
          </Form.Item>
        ),
      },
    ];
  }, [SALE_ORDER_STATUS, orgUnit, SALE_ORDER_APPROVAL_STATUS]);

  const handleViewProcessApproved = (record: IDataOrder) => {
    setOrderDetail(record);
    setOpenModalViewApprovalProcess(true);
  };

  const handleAction = useCallback(
    (action: ACTION_MODE_ENUM, record: IDataOrder) => {
      switch (action) {
        case ACTION_MODE_ENUM.VIEW:
          return navigate(pathRoutes.viewOrder(record.id));
        case ACTION_MODE_ENUM.Approved:
          setOrderDetail(record);
          setTypeAction('APPROVED');
          return;
        case ACTION_MODE_ENUM.Reject:
          setOrderDetail(record);
          setTypeAction('REJECT');
          return;
        default:
          break;
      }
    },
    [navigate]
  );

  const handleFinish = (values: Record<string, string | Dayjs[]>) => {
    const { time, ...payload } = values;
    if (time) {
      const [fromDate, toDate] = time as Dayjs[];
      payload.fromDate = fromDate?.format(formatDateISO);
      payload.toDate = toDate?.endOf('day').format(formatDateISO);
    }
    if (
      payload.orgId &&
      Array.isArray(payload.orgId) &&
      payload.orgId.length > 0
    ) {
      payload.orgId = payload.orgId.join(',');
    }
    handleSearch(payload);
  };

  useEffect(() => {
    form.setFieldsValue({
      ...params,
      orgId: params.orgId
        ? params.orgId.split(',').map((id: string) => Number(id))
        : [],
    });

    if (params.fromDate && params.toDate) {
      form.setFieldValue('time', [
        dayjs(params.fromDate, formatDateISO),
        dayjs(params.toDate, formatDateISO),
      ]);
    }
  }, [params]);

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
      url: `${prefixReportService}/sale-order-partner/export`,
    });
  };

  return (
    <div>
      <TitleHeader>Danh sách đơn đặt hàng</TitleHeader>
      <div className="flex flex-wrap justify-between">
        <Form
          form={form}
          onFinish={handleFinish}
          validateTrigger={['onSubmit', 'onBlur']}
          initialValues={{
            time: [dayjs().subtract(29, 'day'), dayjs()],
          }}
        >
          <CFilter
            items={items}
            validQuery={REACT_QUERY_KEYS.ORDERS}
            searchComponent={
              <Tooltip title="Nhập mã đơn hàng" placement="right">
                <Form.Item label="" name="q" className="!mb-0">
                  <CInput
                    placeholder="Nhập mã đơn hàng"
                    maxLength={100}
                    prefix={<FontAwesomeIcon icon={faSearch} />}
                    onBlur={() => {
                      const value = form.getFieldValue('q');
                      if (value) {
                        form.setFieldValue('q', value.trim());
                      }
                    }}
                  />
                </Form.Item>
              </Tooltip>
            }
          />
        </Form>
        {includes(listRoles, ActionsTypeEnum.EXPORT_EXCEL) && (
          <Button
            icon={<FontAwesomeIcon icon={faUpload} />}
            type="primary"
            onClick={handleDownload}
          >
            Xuất excel
          </Button>
        )}
      </div>
      <div className="mt-8">
        <CTable
          columns={getColumnsTableOrder(
            params,
            listRoles,
            SALE_ORDER_STATUS,
            SALE_ORDER_APPROVAL_STATUS,
            SALE_ORDER_PAYMENT_OPTION,
            handleAction,
            handleViewProcessApproved
          )}
          dataSource={dataTable}
          loading={loadingTable}
          rowKey={'id'}
          pagination={{
            total: orders?.totalElements,
          }}
        />
      </div>
      <ModalAction
        data={orderDetail}
        onClose={() => {
          setOrderDetail(undefined);
          setTypeAction('');
        }}
        type={typeAction}
      />
      <ModalViewApprovalProcess
        objectName="SALE_ORDER"
        id={idDecrypt}
        open={openModalViewApprovalProcess}
        onClose={() => {
          setOpenModalViewApprovalProcess(false);
        }}
      />
    </div>
  );
};
export default OrderList;
