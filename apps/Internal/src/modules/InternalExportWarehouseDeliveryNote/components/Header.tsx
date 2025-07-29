import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CButtonAdd } from '@react/commons/Button';
import { CRangePicker } from '@react/commons/DatePicker';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import CInput from '@react/commons/Input';
import CSelect from '@react/commons/Select';
import { RowHeader, Text, TitleHeader } from '@react/commons/Template/style';
import { decodeSearchParams } from '@react/helpers/utils';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import useSearchHandler from '@react/hooks/useSearchHandler';
import { Col, Divider, Form, Popover, Row, Tooltip } from 'antd';
import { ContentStyled } from 'apps/Internal/src/components/layouts/AuthLayout/styled';
import { ParamsOption } from 'apps/Internal/src/components/layouts/types';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import dayjs from 'dayjs';
import { useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { queryKeyList } from '../hook/useList';

const Header = () => {
  const [form] = Form.useForm();
  const { DELIVERY_NOTE_STATUS } = useGetDataFromQueryKey<ParamsOption>([
    REACT_QUERY_KEYS.GET_PARAMS,
  ]);
  const optionsDeliveryNoteType = [
    {
      value: '1',
      label: 'Phiếu xuất',
    },
    {
      value: '2',
      label: 'Phiếu nhập',
    },
  ];
  const items: ItemFilter[] = [
    {
      label: 'Loại phiếu',
      value: (
        <Form.Item className="min-w-40" name="deliveryNoteMethod">
          <CSelect
            onKeyDown={(e) => {
              e.preventDefault();
            }}
            options={optionsDeliveryNoteType}
            placeholder="Chọn loại phiếu"
            showSearch={false}
          />
        </Form.Item>
      ),
    },
    {
      label: 'Trạng thái phiếu',
      value: (
        <Form.Item className="min-w-40" name="deliveryNoteStatus">
          <CSelect
            onKeyDown={(e) => {
              e.preventDefault();
            }}
            showSearch={false}
            options={DELIVERY_NOTE_STATUS}
            placeholder="Chọn trạng thái phiếu"
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

  const handleAddExport = useCallback(() => {
    navigate(pathRoutes.internalExportWarehouseDeliveryNoteAdd);
  }, [navigate]);
  const handleAddImport = useCallback(() => {
    navigate(pathRoutes.internalImportWarehouseDeliveryNoteAdd);
  }, [navigate]);
  const content = (
    <ContentStyled>
      <Text
        onClick={handleAddExport}
        className="hover:bg-gray-100 p-2 cursor-pointer"
      >
        Lập phiếu xuất
      </Text>
      <Divider className="m-0" />
      <Text
        className="hover:bg-gray-100 p-2 cursor-pointer"
        onClick={handleAddImport}
      >
        Lập phiếu nhập
      </Text>
    </ContentStyled>
  );
  return (
    <div>
      <TitleHeader>Danh sách phiếu xuất nhập kho nội bộ</TitleHeader>
      <RowHeader>
        <Form form={form} onFinish={handleSubmit}>
          <Row gutter={8}>
            <Col>
              <CFilter
                searchComponent={
                  <Tooltip
                    title="Nhập mã phiếu hoặc mã đề nghị"
                    placement="right"
                  >
                    <Form.Item name="q">
                      <CInput
                        className="min-w-72"
                        maxLength={100}
                        placeholder="Nhập mã phiếu hoặc mã đề nghị"
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
        <Popover content={content} placement="bottomLeft">
          <CButtonAdd />
        </Popover>
      </RowHeader>
    </div>
  );
};

export default Header;
