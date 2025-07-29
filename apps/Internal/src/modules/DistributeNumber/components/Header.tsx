import { PlusOutlined } from '@ant-design/icons';
import { CRangePicker } from '@react/commons/DatePicker';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import CSelect from '@react/commons/Select';
import { TitleHeader } from '@react/commons/Template/style';
import { ActionsTypeEnum } from '@react/constants/app';
import { formatDateBe } from '@react/constants/moment';
import { decodeSearchParams } from '@react/helpers/utils';
import useSearchHandler from '@react/hooks/useSearchHandler';
import { Button, Form } from 'antd';
import {
  NumberStockTypes,
  OPTION_NUMBER_PROCESS_TYPE,
} from 'apps/Internal/src/constants/constants';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useGetNumberStocks } from 'apps/Internal/src/hooks/useGetNumberStocks';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import dayjs from 'dayjs';
import { includes } from 'lodash';
import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { RowHeader } from './style';

const Header: React.FC = () => {
  const [form] = Form.useForm();
  const actionByRole = useRolesByRouter();
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const navigate = useNavigate();
  const { data: OPTION_STOCK_EXPORT } = useGetNumberStocks([
    NumberStockTypes.GENERAL,
  ]);
  const { data: OPTION_STOCK_IMPORT } = useGetNumberStocks(
    [NumberStockTypes.SPECIFIC, NumberStockTypes.SALE],
    true
  );
  const { handleSearch } = useSearchHandler('useGetDistributeNumberKey');

  const handleSearchForm = (values: any) => {
    const { date, ...restValue } = values;
    handleSearch({
      ...restValue,
      from: date
        ? dayjs(date[0]).startOf('day').format(formatDateBe)
        : undefined,
      to: date ? dayjs(date[1]).endOf('day').format(formatDateBe) : undefined,
    });
  };

  const handleNavigateToScreens = () => {
    navigate(pathRoutes.distributeNumberAdd);
  };

  const items: ItemFilter[] = [
    {
      label: 'Kiểu phân phối',
      value: (
        <Form.Item name="processType" className="w-44">
          <CSelect
            options={OPTION_NUMBER_PROCESS_TYPE}
            placeholder="Kiểu phân phối"
          />
        </Form.Item>
      ),
    },
    {
      label: 'Kho xuất',
      value: (
        <Form.Item name="stockId" className="w-44">
          <CSelect options={OPTION_STOCK_EXPORT ?? []} placeholder="Kho xuất" />
        </Form.Item>
      ),
    },
    {
      label: 'Kho nhận',
      value: (
        <Form.Item name="ieStockId" className="w-44">
          <CSelect options={OPTION_STOCK_IMPORT ?? []} placeholder="Kho nhận" />
        </Form.Item>
      ),
    },
    {
      label: 'Thời gian',
      showDefault: true,
      value: (
        <Form.Item name="date" className="w-70">
          <CRangePicker />
        </Form.Item>
      ),
    },
  ];

  useEffect(() => {
    if (params['processType']) {
      form.setFieldValue('processType', Number(params['processType']));
    }
    if (params['stockId']) {
      form.setFieldValue('stockId', Number(params['stockId']));
    }
    if (params['ieStockId']) {
      form.setFieldValue('ieStockId', Number(params['ieStockId']));
    }
    if (params['from'] && params['to']) {
      form.setFieldValue('date', [dayjs(params['from']), dayjs(params['to'])]);
    }
  }, []);

  return (
    <>
      <TitleHeader>Danh sách phân phối số</TitleHeader>
      <RowHeader>
        <Form
          form={form}
          onFinish={handleSearchForm}
          initialValues={{ date: [dayjs().subtract(29, 'day'), dayjs()] }}
        >
          <CFilter items={items} validQuery={'useGetDistributeNumberKey'} />
        </Form>
        {includes(actionByRole, ActionsTypeEnum.CREATE) && (
          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={handleNavigateToScreens}
          >
            <FormattedMessage id="common.add" />
          </Button>
        )}
      </RowHeader>
    </>
  );
};
export default Header;
