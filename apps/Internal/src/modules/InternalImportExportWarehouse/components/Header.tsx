import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CButtonAdd } from '@react/commons/Button';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import { CRangePicker } from '@react/commons/index';
import CInput from '@react/commons/Input';
import CSelect from '@react/commons/Select';
import { RowHeader, Text, TitleHeader } from '@react/commons/Template/style';
import { decodeSearchParams } from '@react/helpers/utils';
import useSearchHandler from '@react/hooks/useSearchHandler';
import { Col, Divider, Form, Popover, Row, Tooltip } from 'antd';
import { ContentStyled } from 'apps/Internal/src/components/layouts/AuthLayout/styled';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import dayjs from 'dayjs';
import { useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { queryKeyList } from '../hook/useList';

const Header = () => {
  const [form] = Form.useForm();
  const optionTypeStockMove = [
    {
      label: 'Xuất kho',
      value: '1',
    },
    {
      label: 'Nhập kho',
      value: '2',
    },
  ];
  const optionStatus = [
    {
      label: 'Đã hủy',
      value: '3',
    },
    {
      label: 'Đã nhập',
      value: '1',
    },
    {
      label: 'Đã xuất',
      value: '2',
    },
  ];
  const items: ItemFilter[] = [
    {
      label: 'Loại giao dịch',
      value: (
        <Form.Item className="min-w-40" name="moveMethod">
          <CSelect
            onKeyDown={(e) => {
              e.preventDefault();
            }}
            options={optionTypeStockMove}
            placeholder="Chọn loại giao dịch"
            showSearch={false}
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
        status: optionStatus.find(
          (item) => item.value === String(params.status)
        )?.label,
      });
    }
  }, [params]);

  const handleAddExport = useCallback(() => {
    navigate(pathRoutes.internalExportWarehouseAdd);
  }, [navigate]);
  const handleAddImport = useCallback(() => {
    navigate(pathRoutes.internalImportWarehouseAdd);
  }, [navigate]);
  const content = (
    <ContentStyled>
      <Text
        onClick={handleAddExport}
        className="hover:bg-gray-100 p-2 cursor-pointer"
      >
        Xuất kho
      </Text>
      <Divider className="m-0" />
      <Text
        className="hover:bg-gray-100 p-2 cursor-pointer"
        onClick={handleAddImport}
      >
        Nhập kho
      </Text>
    </ContentStyled>
  );
  return (
    <div>
      <TitleHeader>Danh sách GD xuất nhập kho</TitleHeader>
      <RowHeader>
        <Form form={form} onFinish={handleSubmit}>
          <Row gutter={8}>
            <Col>
              <CFilter
                searchComponent={
                  <Tooltip
                    title="Nhập mã phiếu hoặc mã giao dịch"
                    placement="right"
                  >
                    <Form.Item name="q">
                      <CInput
                        maxLength={100}
                        placeholder="Nhập mã phiếu hoặc mã giao dịch"
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
