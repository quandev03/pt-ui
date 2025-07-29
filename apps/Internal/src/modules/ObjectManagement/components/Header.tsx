import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CButton, { CButtonAdd } from '@react/commons/Button';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import { CInput } from '@react/commons/index';
import { CReloadButton } from '@react/commons/ReloadButton';
import CustomSearch from '@react/commons/Search';
import CSelect from '@react/commons/Select';
import { RowHeader, TitleHeader } from '@react/commons/Template/style';
import { decodeSearchParams } from '@react/helpers/utils';
import { filterFalsy } from '@react/utils/index';
import { Col, Dropdown, Form, Row } from 'antd';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

const dropdownItems = [
  {
    key: '1',
    label: (
      <Link to={`${pathRoutes.object_add}?isPartner=false`}>Web nội bộ</Link>
    ),
  },
  {
    key: '2',
    label: (
      <Link to={`${pathRoutes.object_add}?isPartner=true`}>Web đối tác</Link>
    ),
  },
  {
    key: '3',
    label: (
      <Link to={`${pathRoutes.object_add}?isPartner=true&isMobile=true`}>
        App Mobile
      </Link>
    ),
  },
];

const Header: React.FC = () => {
  const [form] = Form.useForm();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const navigate = useNavigate();

  useEffect(() => {
    setSearchParams({
      ...params,
      isPartner: params.isPartner ?? '0',
      filters: params.filters ?? '0',
    });
  }, []);

  useEffect(() => {
    form.setFieldsValue({ ...params, isPartner: params.isPartner ?? '0' });
  }, [params]);

  const handleSearch = (values: any) => {
    setSearchParams(
      filterFalsy({
        ...params,
        ...values,
        page: 0,
      })
    );
  };

  const items: ItemFilter[] = [
    {
      label: 'Loại web',
      showDefault: true,
      value: (
        <Form.Item label="" name="isPartner" className="w-48">
          <CSelect
            options={[
              {
                label: 'Nội bộ',
                value: '0',
              },
              {
                label: 'Đối tác',
                value: '1',
              },
              {
                label: 'App Mobile',
                value: '2',
              },
            ]}
            placeholder="Loại web"
          />
        </Form.Item>
      ),
    },
  ];

  return (
    <>
      <TitleHeader>Quản lý object</TitleHeader>
      <RowHeader>
        <Form form={form} onFinish={handleSearch}>
          <Row gutter={8}>
            <Col span={6}>
              <Form.Item name="q">
                <CInput
                  maxLength={100}
                  placeholder="Nhập tên"
                  prefix={<FontAwesomeIcon icon={faSearch} />}
                />
              </Form.Item>
            </Col>
            <Col>
              <CFilter items={items} />
            </Col>
          </Row>
        </Form>
        <Dropdown trigger={['click']} menu={{ items: dropdownItems }}>
          <CButtonAdd />
        </Dropdown>{' '}
      </RowHeader>
    </>
  );
};

export default Header;
