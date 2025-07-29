import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CButtonAdd, CButtonExport } from '@react/commons/Button';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import CInput from '@react/commons/Input';
import CSelect from '@react/commons/Select';
import { RowHeader, TitleHeader } from '@react/commons/Template/style';
import { Dropdown, Form, Tooltip } from 'antd';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link, useSearchParams } from 'react-router-dom';
import { ModelStatus } from '@react/commons/types';
import { ProductCatalogRequest } from '../types';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import { useExportMutation } from 'apps/Internal/src/hooks/useExportMutation';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import useSearchHandler from '@react/hooks/useSearchHandler';
import { prefixCatalogService } from 'apps/Internal/src/constants/app';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import { includes } from 'lodash';
import { ActionsTypeEnum, DateFormat } from '@react/constants/app';
import dayjs from 'dayjs';

const dropdownItems = [
  {
    key: '1',
    label: <Link to={pathRoutes.productCatalogAdd}>Tạo sản phẩm</Link>,
  },
  {
    key: '2',
    label: <Link to={pathRoutes.productGroupAdd}>Tạo nhóm sản phẩm</Link>,
  },
];

const Header: React.FC = () => {
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { page, size, ...rest } = params;
  const [form] = Form.useForm();
  const { isPending, mutate } = useExportMutation();
  const actions = useRolesByRouter();
  const { handleSearch } = useSearchHandler(
    REACT_QUERY_KEYS.GET_LIST_PRODUCT_CATALOG
  );

  useEffect(() => {
    params && form.setFieldsValue(params);
  }, [params]);

  const handleFinish = (values: ProductCatalogRequest) => {
    handleSearch({
      ...rest,
      ...values,
    });
  };

  const handleExport = () => {
    mutate({
      uri: `/${prefixCatalogService}/product/export`,
      filename: `danh_muc_san_pham-${dayjs().format(DateFormat.EXPORT)}.xlsx`,
      params: queryParams(rest),
    });
  };

  const items: ItemFilter[] = [
    {
      label: 'Trạng thái',
      value: (
        <Form.Item name="status" className="w-40">
          <CSelect
            placeholder="Trạng thái"
            showSearch={false}
            options={[
              {
                label: <FormattedMessage id="common.active" />,
                value: ModelStatus.ACTIVE,
              },
              {
                label: <FormattedMessage id="common.inactive" />,
                value: ModelStatus.INACTIVE,
              },
            ]}
          />
        </Form.Item>
      ),
    },
  ];

  return (
    <>
      <TitleHeader>Danh mục sản phẩm</TitleHeader>
      <RowHeader>
        <Form form={form} onFinish={handleFinish}>
          <CFilter
            items={items}
            validQuery={REACT_QUERY_KEYS.GET_LIST_PRODUCT_CATALOG}
            searchComponent={
              <Tooltip title="Nhập mã hoặc tên sản phẩm" placement="right">
                <Form.Item name="value-search" className="w-64">
                  <CInput
                    placeholder="Nhập mã hoặc tên sản phẩm"
                    prefix={<FontAwesomeIcon icon={faSearch} />}
                    maxLength={100}
                  />
                </Form.Item>
              </Tooltip>
            }
          />
        </Form>
        {includes(actions, ActionsTypeEnum.CREATE) && (
          <Dropdown trigger={['click']} menu={{ items: dropdownItems }}>
            <CButtonAdd />
          </Dropdown>
        )}
        {includes(actions, ActionsTypeEnum.EXPORT_EXCEL) && (
          <CButtonExport loading={isPending} onClick={handleExport} />
        )}
      </RowHeader>
    </>
  );
};

export default Header;
