import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import { NotificationError } from '@react/commons/index';
import CInput from '@react/commons/Input';
import ModalConfirm from 'apps/Internal/src/components/modalConfirm';
import CSelect from '@react/commons/Select';
import CTable from '@react/commons/Table';
import { RowHeader, TitleHeader } from '@react/commons/Template/style';
import { DateFormat, DeliveryOrderType } from '@react/constants/app';
import { formatDateBe } from '@react/constants/moment';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import useSearchHandler from '@react/hooks/useSearchHandler';
import { DatePicker, Form, Tooltip } from 'antd';
import { ParamsOption } from 'apps/Internal/src/components/layouts/types';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import {
  getColumnListTransactionSearchImportExport,
  MoveMethodEnum,
} from 'apps/Internal/src/modules/TransactionSearchImportExport/constants';
import {
  useCancelTransaction,
  useSearchPageByParams,
} from 'apps/Internal/src/modules/TransactionSearchImportExport/hooks';
import {
  IParamsPage,
  TransactionSearchImportExportItem,
} from 'apps/Internal/src/modules/TransactionSearchImportExport/types';
import { Wrapper } from 'apps/Internal/src/modules/UserGroupManagement/page/style';
import dayjs, { Dayjs } from 'dayjs';
import { useCallback, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const { RangePicker } = DatePicker;

const TransactionSearchImportExport = () => {
  const actionByRole = useRolesByRouter();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form] = Form.useForm();
  const params = decodeSearchParams(searchParams);
  const { handleSearch } = useSearchHandler(
    REACT_QUERY_KEYS.TransactionSearchImportExportList
  );
  const { STOCK_MOVE_LOOK_UP_MOVE_TYPE = [], STOCK_MOVE_STATUS = [] } =
    useGetDataFromQueryKey<ParamsOption>([REACT_QUERY_KEYS.GET_PARAMS]);
  const { data, isLoading: loadingTable } = useSearchPageByParams(
    queryParams<IParamsPage>({
      ...params,
      startDateSearch:
        params.startDateSearch ??
        dayjs().subtract(29, 'day').startOf('day').format(formatDateBe),
      endDateSearch:
        params.endDateSearch ?? dayjs().endOf('day').format(formatDateBe),
    })
  );
  useEffect(() => {
    form.setFieldsValue({ ...params });
    if (params.startDateSearch && params.endDateSearch) {
      form.setFieldValue('time', [
        dayjs(params.startDateSearch, formatDateBe),
        dayjs(params.endDateSearch, formatDateBe),
      ]);
    } else {
      form.setFieldValue('time', [dayjs().subtract(29, 'day'), dayjs()]);
    }
  }, []);

  const items: ItemFilter[] = useMemo(() => {
    return [
      {
        label: 'Loại giao dịch',
        value: (
          <Form.Item name="lookUpType" className="w-48 mb-0">
            <CSelect
              options={STOCK_MOVE_LOOK_UP_MOVE_TYPE}
              placeholder="Chọn loại giao dịch"
            />
          </Form.Item>
        ),
      },
      {
        label: 'Ngày lập GD',
        showDefault: true,
        value: (
          <Form.Item name="time" className="mb-0">
            <RangePicker allowClear={false} format={DateFormat.DEFAULT} />
          </Form.Item>
        ),
      },
    ];
  }, [STOCK_MOVE_LOOK_UP_MOVE_TYPE]);

  const handleViewTransaction = useCallback(
    (record: TransactionSearchImportExportItem) => {
      console.log('🚀 ~ TransactionSearchImportExport ~ record:', record);
      const moveMethod = String(record.moveMethod) as MoveMethodEnum;
      const moveType = record.moveType as DeliveryOrderType;
      switch (moveMethod) {
        case MoveMethodEnum.EXPORT:
          if (moveType === DeliveryOrderType.INTERNAL) {
            navigate(
              pathRoutes.transactionSearchInternalExportView(`${record.id}`)
            );
            return;
          } else if (moveType === DeliveryOrderType.OTHER) {
            navigate(pathRoutes.transactionSearchExportView(`${record.id}`));
            return;
          } else if (moveType === DeliveryOrderType.PARTNER) {
            navigate(
              pathRoutes.transactionSearchInternalExportEximDistributor(
                `${record.id}`
              )
            );
            return;
          } else if (moveType === DeliveryOrderType.CRAFT_KIT) {
            if (record.lookUpType == 15) {
              navigate(
                pathRoutes.transactionSearchExportSimView(`${record.id}`)
              );
              return;
            } else {
              navigate(
                pathRoutes.transactionSearchExportKitView(`${record.id}`)
              );
              return;
            }
          } else if (moveType === DeliveryOrderType.CANCEL_CRAFT_KIT) {
            if (record.lookUpType == 18) {
              navigate(
                pathRoutes.transactionSearchExportSimView(`${record.id}`)
              );
              return;
            } else {
              navigate(
                pathRoutes.transactionSearchExportKitView(`${record.id}`)
              );
              return;
            }
          } else {
            NotificationError(
              'Tính năng đang phát triển. Vui lòng thử lại sau'
            );
            return;
          }
        case MoveMethodEnum.IMPORT:
          if (moveType === DeliveryOrderType.INTERNAL) {
            navigate(
              pathRoutes.transactionSearchInternalImportView(`${record.id}`)
            );
            return;
          } else if (moveType === DeliveryOrderType.NCC) {
            navigate(
              pathRoutes.transactionSearchMerchantEximView(`${record.id}`)
            );
            return;
          } else if (moveType === DeliveryOrderType.OTHER) {
            navigate(pathRoutes.transactionSearchImportView(`${record.id}`));
            return;
          } else if (moveType === DeliveryOrderType.PARTNER) {
            navigate(
              pathRoutes.transactionSearchInternalExportEximDistributor(
                `${record.id}`
              )
            );
            return;
          } else if (moveType === DeliveryOrderType.CRAFT_KIT) {
            if (record.lookUpType == 18) {
              navigate(
                pathRoutes.transactionSearchImportSimView(`${record.id}`)
              );
              return;
            } else {
              navigate(
                pathRoutes.transactionSearchImportKitView(`${record.id}`)
              );
              return;
            }
          } else if (moveType === DeliveryOrderType.CANCEL_CRAFT_KIT) {
            if (record.lookUpType == 18) {
              navigate(
                pathRoutes.transactionSearchImportSimView(`${record.id}`)
              );
              return;
            } else {
              navigate(
                pathRoutes.transactionSearchImportKitView(`${record.id}`)
              );
              return;
            }
          } else {
            NotificationError(
              'Tính năng đang phát triển. Vui lòng thử lại sau'
            );
            return;
          }
        default:
          NotificationError('Tính năng đang phát triển. Vui lòng thử lại sau');
      }
    },
    []
  );
  const { mutate: cancelTransaction } = useCancelTransaction();
  const handleCancelTransaction = useCallback(
    (record: TransactionSearchImportExportItem) => {
      ModalConfirm({
        message: 'Bạn có chắc chắn muốn Hủy giao dịch này không?',
        handleConfirm: () => {
          cancelTransaction(record.id);
        },
      });
    },
    []
  );
  const columns = useMemo(() => {
    return getColumnListTransactionSearchImportExport(
      params,
      actionByRole,
      STOCK_MOVE_LOOK_UP_MOVE_TYPE,
      STOCK_MOVE_STATUS,
      handleViewTransaction,
      handleCancelTransaction
    );
  }, [params, actionByRole, STOCK_MOVE_LOOK_UP_MOVE_TYPE, STOCK_MOVE_STATUS]);

  const handleFinish = useCallback(
    (values: Record<string, string | Dayjs[]>) => {
      const { time, ...payload } = values;
      if (time) {
        const [startDateSearch, endDateSearch] = time as Dayjs[];
        payload.startDateSearch = startDateSearch
          ?.startOf('day')
          .format(formatDateBe);
        payload.endDateSearch = endDateSearch
          ?.endOf('day')
          .format(formatDateBe);
      }
      handleSearch(payload);
    },
    [params]
  );

  return (
    <Wrapper>
      <div>
        <TitleHeader>Tra cứu giao dịch xuất nhập</TitleHeader>
        <RowHeader>
          <div className="flex-1">
            <Form
              onFinish={handleFinish}
              form={form}
              initialValues={{
                time: [dayjs().subtract(29, 'day'), dayjs()],
              }}
            >
              <CFilter
                items={items}
                validQuery={REACT_QUERY_KEYS.TransactionSearchImportExportList}
                searchComponent={
                  <Tooltip title="Nhập mã giao dịch" placement="right">
                    <Form.Item name="stockMoveCode">
                      <CInput
                        maxLength={100}
                        placeholder="Nhập mã giao dịch"
                        prefix={<FontAwesomeIcon icon={faSearch} />}
                      />
                    </Form.Item>
                  </Tooltip>
                }
              />
            </Form>
          </div>
        </RowHeader>
        <CTable
          loading={loadingTable}
          otherHeight={10}
          columns={columns}
          rowKey={'id'}
          dataSource={data?.content || []}
          pagination={{
            total: data?.totalElements,
          }}
        />
      </div>
    </Wrapper>
  );
};

export default TransactionSearchImportExport;
