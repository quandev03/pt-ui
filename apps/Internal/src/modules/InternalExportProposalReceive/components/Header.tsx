import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CRangePicker } from '@react/commons/DatePicker';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import CInput from '@react/commons/Input';
import CSelect from '@react/commons/Select';
import { RowHeader, TitleHeader } from '@react/commons/Template/style';
import { decodeSearchParams } from '@react/helpers/utils';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import useSearchHandler from '@react/hooks/useSearchHandler';
import { Col, Form, Row, Tooltip } from 'antd';
import { ParamsOption } from 'apps/Internal/src/components/layouts/types';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DELIVERY_ORDER_ORDER_STATUS } from '../../InternalExportProposalSend/components/Header';
import { queryKeyList } from '../hook/useList';

const Header = () => {
  const [form] = Form.useForm();
  const { DELIVERY_ORDER_APPROVAL_STATUS } =
    useGetDataFromQueryKey<ParamsOption>([REACT_QUERY_KEYS.GET_PARAMS]);
  const items: ItemFilter[] = [
    {
      label: 'Trạng thái phê duyệt',
      value: (
        <Form.Item className="w-56" name="approvalStatus">
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
        <Form.Item className="w-52" name="orderStatus">
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
  return (
    <div>
      <TitleHeader>Danh sách đề nghị xuất kho nhận được</TitleHeader>
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
      </RowHeader>
    </div>
  );
};

export default Header;
