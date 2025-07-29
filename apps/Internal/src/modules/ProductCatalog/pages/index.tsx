import { CButtonDetail } from '@react/commons/Button';
import { Dropdown, MenuProps, Space, TableProps, Tooltip } from 'antd';
import Header from '../components/Header';
import { Text, WrapperActionTable } from '@react/commons/Template/style';
import { FormattedMessage } from 'react-intl';
import { ReactComponent as IconMore } from 'apps/Internal/src/assets/images/IconMore.svg';
import { useProductCatalogQuery } from '../hooks/useProductCatalogQuery';
import { ProductCatalog, ProductType } from '../types';
import { Link, useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { ModelStatus } from '@react/commons/types';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import { ActionsTypeEnum, DateFormat } from '@react/constants/app';
import { CModalConfirm, CTable, CTag } from '@react/commons/index';
import { useDeleteProductCatalogMutation } from '../hooks/useDeleteProductCatalogMutation';
import { MESSAGE } from '@react/utils/message';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import { includes } from 'lodash';
import { ColorList } from '@react/constants/color';
const ProductCatalogPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const actions = useRolesByRouter();
  const { page, size, ...rest } = params;
  const { isFetching, data } = useProductCatalogQuery(queryParams(rest));
  const { isPending, mutate } = useDeleteProductCatalogMutation();
  const handleDelete = (id: string) => {
    CModalConfirm({
      message: MESSAGE.G05,
      onOk: () => mutate(id),
    });
  };

  const renderMenuItemsMore = (
    id: string,
    productType: ProductType
  ): MenuProps['items'] => {
    return [
      {
        key: ActionsTypeEnum.UPDATE,
        label: (
          <Link
            to={
              productType === ProductType.PRODUCT
                ? pathRoutes.productCatalogEdit(id)
                : pathRoutes.productGroupEdit(id)
            }
          >
            <Text>
              <FormattedMessage id="common.edit" />
            </Text>
          </Link>
        ),
      },
      {
        key: ActionsTypeEnum.DELETE,
        label: (
          <Text type="danger">
            <FormattedMessage id="common.delete" />
          </Text>
        ),
        onClick: () => handleDelete(id),
      },
    ].filter((item) => includes(actions, item.key));
  };

  const columns: TableProps<ProductCatalog>['columns'] = [
    {
      title: 'Tên sản phẩm',
      dataIndex: 'productName',
      width: 220,
      ellipsis: { showTitle: false },
      render: (value) => (
        <Tooltip title={value} placement="topLeft">
          {value}
        </Tooltip>
      ),
    },
    {
      title: 'Mã sản phẩm',
      dataIndex: 'productCode',
      width: 150,
      ellipsis: { showTitle: false },
      render: (value, { productType }) =>
        productType === ProductType.PRODUCT && (
          <Tooltip title={value} placement="topLeft">
            {value}
          </Tooltip>
        ),
    },
    {
      title: 'Loại sản phẩm',
      dataIndex: 'categoryName',
      width: 130,
      ellipsis: { showTitle: false },
      render: (value) => (
        <Tooltip title={value} placement="topLeft">
          {value}
        </Tooltip>
      ),
    },
    {
      title: 'Đơn vị tính',
      dataIndex: 'productUomValue',
      width: 110,
      render: (value) => (
        <Tooltip title={value} placement="topLeft">
          {value}
        </Tooltip>
      ),
    },
    {
      title: 'Người tạo',
      dataIndex: 'createdBy',
      width: 160,
      ellipsis: { showTitle: false },
      render: (value) => (
        <Tooltip title={value} placement="topLeft">
          {value}
        </Tooltip>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdDate',
      width: 100,
      render: (value) => (
        <Tooltip
          title={dayjs(value).format(DateFormat.DATE_TIME)}
          placement="topLeft"
        >
          {dayjs(value).format(DateFormat.DEFAULT)}
        </Tooltip>
      ),
    },
    {
      title: 'Người cập nhật',
      dataIndex: 'modifiedBy',
      width: 160,
      ellipsis: { showTitle: false },
      render: (value) => (
        <Tooltip title={value} placement="topLeft">
          {value}
        </Tooltip>
      ),
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'modifiedDate',
      width: 120,
      render: (value) => (
        <Tooltip
          title={dayjs(value).format(DateFormat.DATE_TIME)}
          placement="topLeft"
        >
          {dayjs(value).format(DateFormat.DEFAULT)}
        </Tooltip>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'productStatus',
      width: 150,
      render: (value, { productType }) => {
        if (productType === ProductType.PRODUCT) {
          const label = value ? 'Hoạt động' : 'Không hoạt động';
          return (
            <Tooltip title={label} placement="topLeft">
              <CTag
                color={
                  value === ModelStatus.ACTIVE
                    ? ColorList.SUCCESS
                    : ColorList.DEFAULT
                }
              >
                {label}
              </CTag>
            </Tooltip>
          );
        }
      },
    },
    {
      title: 'Thao tác',
      align: 'center',
      fixed: 'right',
      width: 140,
      hidden: !actions?.some((item) =>
        includes(
          [
            ActionsTypeEnum.READ,
            ActionsTypeEnum.UPDATE,
            ActionsTypeEnum.DELETE,
          ],
          item
        )
      ),
      render: ({ id, productType }) => (
        <WrapperActionTable>
          {includes(actions, ActionsTypeEnum.READ) && (
            <Link
              to={
                productType === ProductType.PRODUCT
                  ? pathRoutes.productCatalogView(id)
                  : pathRoutes.productGroupView(id)
              }
            >
              <CButtonDetail />
            </Link>
          )}
          {(includes(actions, ActionsTypeEnum.UPDATE) ||
            includes(actions, ActionsTypeEnum.DELETE)) && (
            <Dropdown
              menu={{ items: renderMenuItemsMore(id, productType) }}
              placement="bottom"
              trigger={['click']}
            >
              <IconMore className="cursor-pointer" />
            </Dropdown>
          )}
        </WrapperActionTable>
      ),
    },
  ];

  return (
    <>
      <Header />
      <CTable
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={isFetching || isPending}
        rowClassName={(record) =>
          record.productType === ProductType.GROUP
            ? 'font-bold'
            : record.productStatus === ModelStatus.INACTIVE
            ? 'text-disabled'
            : ''
        }
      />
    </>
  );
};

export default ProductCatalogPage;
