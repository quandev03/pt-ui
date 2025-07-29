import { CButtonAdd } from '@react/commons/Button';
import { CRangePicker } from '@react/commons/DatePicker';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import CInput from '@react/commons/Input';
import CSelect from '@react/commons/Select';
import { RowHeader, TitleHeader } from '@react/commons/Template/style';
import { ParamsOption } from '@react/commons/types';
import { DateFormat } from '@react/constants/app';
import { decodeSearchParams } from '@react/helpers/utils';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import useSearchHandler from '@react/hooks/useSearchHandler';
import { Form, Tooltip } from 'antd';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { queryKeyList } from '../hook/useList';

const Header = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { AIRTIME_TRANSACTION_APPROVAL_STATUS = [] } =
    useGetDataFromQueryKey<ParamsOption>([REACT_QUERY_KEYS.GET_PARAMS]);
  const [form] = Form.useForm();
  const { handleSearch } = useSearchHandler(queryKeyList);

  useEffect(() => {
    const { fromDate, toDate } = params;
    const from = fromDate ? dayjs(fromDate) : dayjs().subtract(29, 'day');
    const to = toDate ? dayjs(toDate) : dayjs();
    form.setFieldsValue({ ...params, rangePicker: [from, to] });
  }, [params]);

  const items: ItemFilter[] = [
    {
      label: 'Trạng thái',
      value: (
        <Form.Item name="approvalStatus">
          <CSelect
            onKeyDown={(e) => e.preventDefault()}
            className="min-w-60"
            options={AIRTIME_TRANSACTION_APPROVAL_STATUS}
            placeholder="Trạng thái"
          />
        </Form.Item>
      ),
    },
    {
      label: 'Thời gian tạo',
      value: (
        <Form.Item name="rangePicker">
          <CRangePicker
            placeholder={['Từ ngày', 'Đến ngày']}
            allowClear={false}
          />
        </Form.Item>
      ),
      showDefault: true,
    },
  ];

  const handleSubmit = (values: any) => {
    setSearchParams({
      ...params,
      ...values,
      page: 0,
      fromDate: dayjs(values.rangePicker?.[0]).format(DateFormat.DATE_ISO),
      toDate: dayjs(values.rangePicker?.[1]).format(DateFormat.DATE_ISO),
    });
    handleSearch(searchParams);
  };
  const navigate = useNavigate();
  const handleAdd = () => {
    navigate(pathRoutes.airtimeBonusTransactionPartnerAdd);
  };
  return (
    <>
      <TitleHeader>Danh sách giao dịch cộng tiền airtime</TitleHeader>
      <RowHeader>
        <Form form={form} onFinish={handleSubmit}>
          <CFilter
            items={items}
            searchComponent={
              <Tooltip title="Tìm kiếm theo tên đối tác" placement="right">
                <Form.Item name="orgName">
                  <CInput
                    placeholder="Tìm kiếm theo tên đối tác"
                    maxLength={100}
                  />
                </Form.Item>
              </Tooltip>
            }
            validQuery={queryKeyList}
          />
        </Form>
        <CButtonAdd onClick={handleAdd} />
      </RowHeader>
    </>
  );
};
export default Header;
