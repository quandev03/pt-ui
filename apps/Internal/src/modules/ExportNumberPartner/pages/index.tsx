import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CButtonAdd } from '@react/commons/Button';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import { CInput, CRangePicker, CSelect, CTable } from '@react/commons/index';
import { RowHeader, TitleHeader, Wrapper } from '@react/commons/Template/style';
import { DateFormat } from '@react/constants/app';
import { formatDateBe } from '@react/constants/moment';
import { decodeSearchParams } from '@react/helpers/utils';
import useSearchHandler from '@react/hooks/useSearchHandler';
import { Form, Tooltip } from 'antd';
import { NumberStockTypes } from 'apps/Internal/src/constants/constants';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import {
  useGetNumberStocks,
  useGetNumberStocksPartner,
} from 'apps/Internal/src/hooks/useGetNumberStocks';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useColumns } from '../hooks/useColumns';
import { useGetList } from '../hooks/useGetList';

const List = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const columns = useColumns();
  const { handleSearch } = useSearchHandler(
    REACT_QUERY_KEYS.ExportNumberPartnerKey
  );

  useEffect(() => {
    const { from, to } = params;
    form.setFieldValue('time', [
      from ? dayjs(from) : dayjs().subtract(29, 'day'),
      to ? dayjs(to) : dayjs(),
    ]);
  }, []);

  const { data: OPTION_STOCK_EXPORT = [] } = useGetNumberStocks([
    NumberStockTypes.GENERAL,
    NumberStockTypes.SPECIFIC,
    NumberStockTypes.SALE,
  ]);
  const { data: OPTION_STOCK_PARTNER = [] } = useGetNumberStocksPartner();

  const items: ItemFilter[] = [
    {
      label: 'Kho xuất',
      value: (
        <Form.Item name="stockId">
          <CSelect
            placeholder="Kho xuất"
            style={{ width: '150px' }}
            options={OPTION_STOCK_EXPORT}
          />
        </Form.Item>
      ),
    },
    {
      label: 'Kho đối tác',
      value: (
        <Form.Item name="ieStockId">
          <CSelect
            placeholder="Kho đối tác"
            style={{ width: '150px' }}
            options={OPTION_STOCK_PARTNER}
          />
        </Form.Item>
      ),
    },
    {
      label: 'Thời gian',
      showDefault: true,
      value: (
        <Form.Item name="time">
          <CRangePicker allowClear={false} />
        </Form.Item>
      ),
    },
  ];

  const { data: dataTable, isLoading: loadingTable } = useGetList({
    ...params,
    from: params.from
      ? dayjs(params.from).startOf('day').format(formatDateBe)
      : dayjs().subtract(29, 'day').startOf('day').format(formatDateBe),
    to: params.to
      ? dayjs(params.to).endOf('day').format(formatDateBe)
      : dayjs().endOf('day').format(formatDateBe),
  });

  const handleFinish = (values: any) => {
    const { time, ...rest } = values;
    const [from, to] = time;
    handleSearch({
      ...rest,
      from: from
        ? dayjs(from).startOf('day').format(formatDateBe)
        : dayjs().subtract(29, 'day').startOf('day').format(formatDateBe),
      to: to
        ? dayjs(to).endOf('day').format(formatDateBe)
        : dayjs().endOf('day').format(formatDateBe),
      queryTime: dayjs().format(DateFormat.TIME),
    });
  };

  return (
    <Wrapper>
      <TitleHeader>Danh sách giao dịch xuất số cho đối tác</TitleHeader>
      <RowHeader>
        <Form
          form={form}
          onFinish={handleFinish}
          initialValues={{
            time: [dayjs().subtract(29, 'day'), dayjs()],
          }}
        >
          <CFilter
            searchComponent={
              <Tooltip title="Nhập mã đơn hàng" placement="right">
                <Form.Item name={'orderNo'}>
                  <CInput
                    placeholder="Nhập mã đơn hàng"
                    prefix={<FontAwesomeIcon icon={faSearch} />}
                  />
                </Form.Item>
              </Tooltip>
            }
            items={items}
            validQuery={REACT_QUERY_KEYS.ExportNumberPartnerKey}
          />
        </Form>
        <CButtonAdd
          onClick={() => navigate(pathRoutes.exportNumberPartnerAdd)}
        />
      </RowHeader>

      <CTable
        columns={columns}
        dataSource={dataTable?.content ?? []}
        loading={loadingTable}
        pagination={{
          total: dataTable?.totalElements ?? 0,
        }}
      />
    </Wrapper>
  );
};

export default List;
