import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CButton from '@react/commons/Button';
import { CRangePicker } from '@react/commons/DatePicker';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import CInput from '@react/commons/Input';
import CSelect from '@react/commons/Select';
import CTable from '@react/commons/Table';
import { RowHeader, TitleHeader } from '@react/commons/Template/style';
import { ACTION_MODE_ENUM } from '@react/commons/types';
import { formatDateISO } from '@react/constants/moment';
import {
  cleanParams,
  decodeSearchParams,
  queryParams,
} from '@react/helpers/utils';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import useSearchHandler from '@react/hooks/useSearchHandler';
import { Flex, Form } from 'antd';
import { ParamsOption } from 'apps/Partner/src/components/layouts/types';
import ModalConfirm from 'apps/Partner/src/components/modalConfirm';
import { REACT_QUERY_KEYS } from 'apps/Partner/src/constants/querykeys';
import { pathRoutes } from 'apps/Partner/src/constants/routes';
import { useRolesByRouter } from 'apps/Partner/src/hooks/useRolesByRouter';
import dayjs, { Dayjs } from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ModalESim } from '../components/ModalESim';
import { getColumnsTableOrder, StatusOrderEnum } from '../constants';
import { useGetOrders, useSupportUpdateStatusOrder } from '../queryHooks';
import { IOrder } from '../types';

const OrderList = () => {
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const listRoles = useRolesByRouter();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { mutate: updateStatusOrder } = useSupportUpdateStatusOrder();
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

  const dataTable = useMemo(() => {
    if (!orders) {
      return [];
    }
    return orders.content;
  }, [orders]);

  const {
    SALE_ORDER_PAYMENT_OPTION = [],
    SALE_ORDER_STATUS = [],
    SALE_ORDER_APPROVAL_STATUS = [],
  } = useGetDataFromQueryKey<ParamsOption>([
    REACT_QUERY_KEYS.GET_PARAMS_OPTION,
  ]);

  useEffect(() => {
    const { fromDate, toDate } = params;
    form.setFieldsValue({
      ...params,
      time: [
        fromDate ? dayjs(fromDate) : dayjs().subtract(29, 'day'),
        toDate ? dayjs(toDate) : dayjs(),
      ],
    });
  }, []);

  const items: ItemFilter[] = useMemo(() => {
    return [
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
            <CRangePicker allowClear={false} />
          </Form.Item>
        ),
      },
    ];
  }, [SALE_ORDER_STATUS, SALE_ORDER_APPROVAL_STATUS]);

  const [nameFile, setNameFile] = useState<{
    name: string;
    id: number;
  }>({
    name: '',
    id: 0,
  });
  const handleOpenModalESim = (record: IOrder) => {
    const nameFile = `${record.orderNo.replace(
      /[/-]/g,
      '_'
    )}_File QR eSIM.xlsx`;
    setNameFile({
      name: nameFile,
      id: record.id,
    });
  };
  const handleCloseModalESim = () => {
    setNameFile({
      name: '',
      id: -1,
    });
  };

  const handleAction = useCallback(
    (action: ACTION_MODE_ENUM, record: IOrder) => {
      switch (action) {
        case ACTION_MODE_ENUM.VIEW:
          return navigate(pathRoutes.viewOrder(record.id));
        case ACTION_MODE_ENUM.Copy:
          return navigate(pathRoutes.copyOrder(record.id));
        case ACTION_MODE_ENUM.Finish:
          ModalConfirm({
            title: 'Bạn có chắc chắn đã hoàn thành đơn hàng không?',
            handleConfirm: () => {
              updateStatusOrder({
                id: record.id,
                status: StatusOrderEnum.FINISH,
              });
            },
          });
          return;
        case ACTION_MODE_ENUM.Cancel:
          ModalConfirm({
            title: 'Bạn có chắc chắn muốn hủy đơn hàng không?',
            handleConfirm: () => {
              updateStatusOrder({
                id: record.id,
                status: StatusOrderEnum.CANCELLED,
              });
            },
          });
          return;
        default:
          break;
      }
    },
    [navigate, updateStatusOrder]
  );

  const handleFinish = (values: Record<string, string | Dayjs[]>) => {
    const { time, ...payload } = values;
    if (time) {
      const [fromDate, toDate] = time as Dayjs[];
      payload.fromDate = fromDate?.format(formatDateISO);
      payload.toDate = toDate?.endOf('day').format(formatDateISO);
    }
    handleSearch(payload);
  };

  return (
    <div>
      <TitleHeader>Danh sách đơn đặt hàng</TitleHeader>
      <RowHeader>
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
            }
          />
        </Form>
        <Flex gap={8} justify={'end'} className="mt-0">
          <CButton
            icon={<FontAwesomeIcon icon={faPlus} size="lg" />}
            onClick={() => {
              navigate(pathRoutes.addOrder);
            }}
          >
            Thêm mới
          </CButton>
        </Flex>
      </RowHeader>

      <div className="mt-8">
        <CTable
          columns={getColumnsTableOrder(
            params,
            listRoles,
            SALE_ORDER_STATUS,
            SALE_ORDER_APPROVAL_STATUS,
            SALE_ORDER_PAYMENT_OPTION,
            handleAction,
            handleOpenModalESim
          )}
          otherHeight={50}
          dataSource={dataTable}
          loading={loadingTable}
          rowKey={'id'}
          pagination={{
            total: orders?.totalElements,
          }}
        />
      </div>
      <ModalESim onClose={handleCloseModalESim} nameFile={nameFile} />
    </div>
  );
};
export default OrderList;
