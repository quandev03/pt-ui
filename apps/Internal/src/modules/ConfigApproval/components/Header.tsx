import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CButton from '@react/commons/Button';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import CSelect from '@react/commons/Select';
import { RowHeader, TitleHeader } from '@react/commons/Template/style';
import { DateFormat } from '@react/constants/app';
import { decodeSearchParams } from '@react/helpers/utils';
import { filterFalsy } from '@react/utils/index';
import { Col, Form, Row } from 'antd';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useListOrgUnit } from 'apps/Internal/src/hooks/useListOrgUnit';
import { useParameterQuery } from 'apps/Internal/src/hooks/useParameterQuery';
import dayjs from 'dayjs';
import { isNil } from 'lodash';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Header: React.FC = () => {
  const [form] = Form.useForm();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const navigate = useNavigate();
  const { data: listOrgUnit, isFetching: isLoadingOrgUnit } = useListOrgUnit({
    status: 1,
  });
  const { isLoading: isLoadingProcess, data: listProcess } = useParameterQuery({
    'table-name': 'APPROVAL_PROCESS',
    'column-name': 'PROCESS_CODE',
  });

  useEffect(() => {
    form.setFieldsValue({
      ...params,
      orgId: !isNil(params.orgId) ? Number(params.orgId) : undefined,
    });
  }, [params.toString()]);
  const handleSearch = (values: any) => {
    setSearchParams(
      filterFalsy({
        ...params,
        ...values,
        page: 0,
        queryTime: dayjs().format(DateFormat.TIME),
      })
    );
  };

  const items: ItemFilter[] = [
    {
      label: 'Quy trình',
      showDefault: true,
      value: (
        <Form.Item label="" name="search-string" className="w-[235px]">
          <CSelect
            isLoading={isLoadingProcess}
            options={listProcess}
            placeholder="Quy trình"
          />
        </Form.Item>
      ),
    },
    {
      label: 'Kho',
      value: (
        <Form.Item label="" name="orgId" className="w-48">
          <CSelect
            isLoading={isLoadingOrgUnit}
            options={listOrgUnit}
            placeholder="Chọn kho"
          />
        </Form.Item>
      ),
    },
  ];

  const handleAdd = () => {
    navigate(pathRoutes.config_approval_add);
  };

  return (
    <>
      <TitleHeader>Quản lý cấu hình phê duyệt</TitleHeader>
      <RowHeader>
        <Form form={form} onFinish={handleSearch}>
          <Row gutter={8}>
            <Col>
              <CFilter items={items} />
            </Col>
          </Row>
        </Form>
        <CButton
          icon={<FontAwesomeIcon icon={faPlus} size="lg" />}
          onClick={handleAdd}
        >
          Thêm mới
        </CButton>
      </RowHeader>
    </>
  );
};

export default Header;
