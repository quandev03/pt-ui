import { CButtonAdd } from '@react/commons/Button';
import { CRangePicker } from '@react/commons/DatePicker';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import CSelect from '@react/commons/Select';
import { RowHeader, TitleHeader } from '@react/commons/Template/style';
import { IOption } from '@react/commons/types';
import { formatDateBe } from '@react/constants/moment';
import { decodeSearchParams } from '@react/helpers/utils';
import useSearchHandler from '@react/hooks/useSearchHandler';
import { Form } from 'antd';
import {
  NumberStockTypes,
  OPTION_NUMBER_PROCESS_TYPE,
} from 'apps/Internal/src/constants/constants';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useGetNumberStocks } from 'apps/Internal/src/hooks/useGetNumberStocks';
import dayjs from 'dayjs';
import React, { useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { data: dataSaleStock } = useGetNumberStocks([
    NumberStockTypes.SALE,
    NumberStockTypes.CANCELED,
  ]);
  const { data: dataStockExport } = useGetNumberStocks([
    NumberStockTypes.GENERAL,
  ]);

  const listSaleStock = useMemo<IOption[]>(() => {
    if (!dataSaleStock) return [];
    return dataSaleStock;
  }, [dataSaleStock]);

  const listGeneralStock = useMemo<IOption[]>(() => {
    if (!dataStockExport) return [];
    return dataStockExport;
  }, [dataStockExport]);

  const handleAdd = () => {
    navigate(pathRoutes.revokeNumberAdd);
  };

  const [form] = Form.useForm();

  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { handleSearch } = useSearchHandler(
    REACT_QUERY_KEYS.GET_LIST_REVOKE_NUMBER
  );

  useEffect(() => {
    if (params) {
      const { from, to, ...rest } = params;

      form.setFieldsValue({
        ...rest,
        rangePicker: [
          from ? dayjs(params.from) : dayjs().subtract(29, 'day'),
          to ? dayjs(params.to) : dayjs(),
        ],
        processType: params['processType']
          ? Number(params['processType'])
          : null,
        stockId: params['stockId'] ? Number(params['stockId']) : null,
        ieStockId: params['ieStockId'] ? Number(params['ieStockId']) : null,
      });
    }
  }, []);

  const items: ItemFilter[] = [
    {
      label: 'Kiểu thu hồi',
      value: (
        <Form.Item className="min-w-48" name="processType">
          <CSelect
            placeholder="Chọn kiểu thu hồi"
            options={OPTION_NUMBER_PROCESS_TYPE}
          />
        </Form.Item>
      ),
    },
    {
      label: 'Kho thu hồi',
      value: (
        <Form.Item className="min-w-48" name="stockId">
          <CSelect placeholder="Chọn kho thu hồi" options={listSaleStock} />
        </Form.Item>
      ),
    },
    {
      label: 'Kho nhận',
      value: (
        <Form.Item className="min-w-48" name="ieStockId">
          <CSelect placeholder="Chọn Kho nhận" options={listGeneralStock} />
        </Form.Item>
      ),
    },
    {
      label: 'Ngày tạo',
      value: (
        <Form.Item name="rangePicker">
          <CRangePicker allowClear={false} />
        </Form.Item>
      ),
      showDefault: true,
    },
  ];

  const handleSubmit = (values: {
    rangePicker: dayjs.Dayjs[];
    processType: number;
    stockId: number;
    ieStockId: number;
  }) => {
    const { rangePicker, ...rest } = values;
    const [fromDate, toDate] = rangePicker as dayjs.Dayjs[];
    handleSearch({
      ...rest,
      from: fromDate.startOf('day').format(formatDateBe),
      to: toDate.endOf('day').format(formatDateBe),
      page: 0,
    });
  };

  return (
    <>
      <TitleHeader>Danh sách thu hồi số</TitleHeader>
      <RowHeader>
        <Form
          initialValues={{
            rangePicker: [dayjs().subtract(29, 'day'), dayjs()],
          }}
          validateTrigger={['onSubmit', 'onBlur']}
          form={form}
          onFinish={handleSubmit}
        >
          <CFilter
            validQuery={REACT_QUERY_KEYS.GET_LIST_REVOKE_NUMBER}
            items={items}
          />
        </Form>
        <CButtonAdd onClick={handleAdd} />
      </RowHeader>
    </>
  );
};

export default Header;
