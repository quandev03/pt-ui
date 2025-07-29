import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CButtonAdd } from '@react/commons/Button';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import CInput from '@react/commons/Input';
import CSelect from '@react/commons/Select';
import { RowHeader, TitleHeader } from '@react/commons/Template/style';
import { decodeSearchParams } from '@react/helpers/utils';
import { Col, Form, Row, Tooltip } from 'antd';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useSearchHandler from '@react/hooks/useSearchHandler';
import { queryKeyList } from '../hook/useList';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import { ParamsOption } from 'apps/Internal/src/components/layouts/types';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { CRangePicker } from '@react/commons/DatePicker';
import dayjs from 'dayjs';
export const DELIVERY_ORDER_ORDER_STATUS = [
  {
    label: 'Tạo mới',
    value: '1',
  },
  {
    label: 'Đang lập phiếu',
    value: '3',
  },
  {
    label: 'Đã lập phiếu',
    value: '4',
  },
  {
    label: 'Đã Huỷ',
    value: '5',
  },
];
const Header = () => {
  const [form] = Form.useForm();
  const { DELIVERY_ORDER_APPROVAL_STATUS } =
    useGetDataFromQueryKey<ParamsOption>([REACT_QUERY_KEYS.GET_PARAMS]);
  const items: ItemFilter[] = [
    {
      label: 'Trạng thái phê duyệt',
      value: (
        <Form.Item className="min-w-40" name="approvalStatus">
          <CSelect
            onKeyDown={(e) => {
              e.preventDefault();
            }}
            showSearch={false}
            options={DELIVERY_ORDER_APPROVAL_STATUS}
            placeholder="Chọn trạng thái phê duyệt"
          />
        </Form.Item>
      ),
    },
    {
      label: 'Trạng thái đề nghị',
      value: (
        <Form.Item className="min-w-40" name="orderStatus">
          <CSelect
            onKeyDown={(e) => {
              e.preventDefault();
            }}
            showSearch={false}
            options={DELIVERY_ORDER_ORDER_STATUS}
            placeholder="Chọn trạng thái đề nghị"
          />
        </Form.Item>
      ),
    },
    {
      label: 'Ngày tạo',
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
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { handleSearch } = useSearchHandler(queryKeyList);
  const handleSubmit = (values: any) => {
    setSearchParams({
      ...params,
      ...values,
      fromDate: values.rangePicker?.[0]?.toISOString(),
      toDate: values.rangePicker?.[1]?.toISOString(),
      page: 0,
    });
    handleSearch(params);
  };
  useEffect(() => {
    if (params) {
      const { fromDate, toDate, ...rest } = params;
      const from = fromDate ? dayjs(fromDate) : dayjs().subtract(29, 'day');
      const to = toDate ? dayjs(toDate) : dayjs();
      form.setFieldsValue({
        ...rest,
        rangePicker: [from, to],
      });
    }
  }, [params]);

  const handleAdd = useCallback(() => {
    navigate(pathRoutes.internalExportProposalAdd);
  }, [navigate]);
  return (
    <div>
      <TitleHeader> Danh sách đề nghị xuất kho gửi đi</TitleHeader>
      <RowHeader>
        <Form form={form} onFinish={handleSubmit}>
          <Row gutter={8}>
            <Col>
              <CFilter
                searchComponent={
                  <Tooltip title="Nhập mã đề nghị" placement="right">
                    <Form.Item name="q">
                      <CInput
                        maxLength={100}
                        placeholder="Nhập mã đề nghị"
                        prefix={<FontAwesomeIcon icon={faSearch} />}
                      />
                    </Form.Item>
                  </Tooltip>
                }
                validQuery={queryKeyList}
                items={items}
              />
            </Col>
          </Row>
        </Form>
        <CButtonAdd onClick={handleAdd} />
      </RowHeader>
    </div>
  );
};

export default Header;
