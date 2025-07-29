import { Dropdown, MenuProps, Tooltip, Form, Row, Col } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { FormattedMessage, useIntl } from 'react-intl';
import CTable from '@react/commons/Table';
import { ReactComponent as IconMore } from 'apps/Internal/src/assets/images/IconMore.svg';
import {
  RowHeader,
  Text,
  TitleHeader,
  WrapperActionTable,
} from '@react/commons/Template/style';
import {
  CButtonAdd,
  CButtonDetail,
  CButtonExport,
} from '@react/commons/Button';
import dayjs from 'dayjs';
import {
  useGetCategoryProductObjectList,
  useSupportDeleteCategoryProduct,
} from '../queryHook';
import { ICategoryProduct, mappingColor } from '../types';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CSelect from '@react/commons/Select';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faSearch } from '@fortawesome/free-solid-svg-icons';
import CInput from '@react/commons/Input';
import { useEffect, useMemo } from 'react';
import { ModelStatus } from '@react/commons/types';
import CTag from '@react/commons/Tag';
import { decodeSearchParams } from '@react/helpers/utils';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { ActionsTypeEnum, ActionType } from '@react/constants/app';
import { formatDate, formatDateTime } from '@react/constants/moment';
import { useExportList } from '../queryHook/useExportList';
import { CModalConfirm } from '@react/commons/index';
import { MESSAGE } from '@react/utils/message';
import { includes } from 'lodash';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';

const Body = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const [form] = Form.useForm();
  const { isFetching, data } = useGetCategoryProductObjectList(params);
  const intl = useIntl();
  const { mutateAsync: mutateExport } = useExportList();
  const dataTable = useMemo(() => {
    if (!data) return [];
    return data;
  }, [data]);
  const onDownload = () => {
    mutateExport(params);
  };

  const handleAdd = () => {
    navigate(pathRoutes.category_product_add);
  };
  const items: ItemFilter[] = [
    {
      label: 'Trạng thái',
      value: (
        <Form.Item label="" name="status" className="w-40">
          <CSelect
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
            placeholder="Trạng thái"
            onKeyDown={(e) => e.preventDefault()}
          />
        </Form.Item>
      ),
    },
  ];
  const { mutate: deleteCategoryProduct } = useSupportDeleteCategoryProduct();
  const openModalEditView = (type: ActionType, record: ICategoryProduct) => {
    return navigate(
      type === ActionType.EDIT
        ? pathRoutes.category_product_edit(record.id)
        : pathRoutes.category_product_view(record.id)
    );
  };
  const renderMenuItemsMore = (
    record: ICategoryProduct
  ): MenuProps['items'] => {
    return [
      {
        key: ActionsTypeEnum.UPDATE,
        label: (
          <Text onClick={() => openModalEditView(ActionType.EDIT, record)}>
            <FormattedMessage id={'common.edit'} />
          </Text>
        ),
      },
      {
        key: ActionsTypeEnum.DELETE,
        label: (
          <Text
            type="danger"
            onClick={() => {
              handleDeleteItem(String(record.id));
            }}
          >
            <FormattedMessage id={'common.delete'} />
          </Text>
        ),
      },
    ];
  };

  const columns: ColumnsType<ICategoryProduct> = [
    {
      title: 'STT',
      align: 'left',
      fixed: 'left',
      width: 50,
      render(_, record, index) {
        return (
          <Text disabled={!record?.status}>
            {index + 1 + params.page * params.size}
          </Text>
        );
      },
    },
    {
      title: 'Mã loại sản phẩm',
      dataIndex: 'categoryCode',
      width: 180,
      align: 'left',
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text disabled={!record?.status}>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Tên loại  sản phẩm',
      dataIndex: 'categoryName',
      width: 180,
      align: 'left',
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text disabled={!record?.status}>{value}</Text>
          </Tooltip>
        );
      },
    },

    {
      title: intl.formatMessage({ id: 'common.creator' }),
      dataIndex: 'createdBy',
      width: 150,
      align: 'left',
      render: (value, record) => {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text disabled={!record?.status}>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'common.creationDate' }),
      dataIndex: 'createdDate',
      width: 100,
      align: 'left',
      render: (value, record) => {
        return (
          <Tooltip
            title={dayjs(value).format(formatDateTime)}
            placement="topLeft"
          >
            <Text disabled={!record?.status}>
              {dayjs(value).format(formatDate)}
            </Text>
          </Tooltip>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'common.updater' }),
      dataIndex: 'modifiedBy',
      width: 150,
      align: 'left',
      render: (value, record) => {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text disabled={!record?.status}>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'common.updatedDate' }),
      dataIndex: 'modifiedDate',
      width: 100,
      align: 'left',
      render: (value, record) => {
        return (
          <Tooltip
            title={dayjs(value).format(formatDateTime)}
            placement="topLeft"
          >
            <Text disabled={!record?.status}>
              {dayjs(value).format(formatDate)}
            </Text>
          </Tooltip>
        );
      },
    },

    {
      title: intl.formatMessage({ id: 'role.statusName' }),
      dataIndex: 'status',
      width: 80,
      align: 'left',
      render: (value) => {
        const label = (
          <FormattedMessage id={value ? 'common.active' : 'common.inactive'} />
        );
        return (
          <Tooltip title={label} placement="topLeft">
            <CTag color={mappingColor[value as keyof typeof mappingColor]}>
              {label}
            </CTag>
          </Tooltip>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'common.action' }),
      align: 'center',
      width: 150,
      fixed: 'right',
      render(_, record) {
        return (
          <WrapperActionTable>
            <CButtonDetail
              onClick={() => openModalEditView(ActionType.VIEW, record)}
            />
            <Dropdown
              menu={{ items: renderMenuItemsMore(record) }}
              placement="bottom"
              trigger={['click']}
            >
              <IconMore className="iconMore" />
            </Dropdown>
          </WrapperActionTable>
        );
      },
    },
  ];
  const handleDeleteItem = (id: string) => {
    CModalConfirm({
      message: MESSAGE.G05,
      onOk: () => id && deleteCategoryProduct(id),
    });
  };
  useEffect(() => {
    params && form.setFieldsValue(params);
  }, [params]);
  const handleSearch = (values: any) => {
    setSearchParams({
      ...params,
      ...values,
      page: 0,
    });
  };
  const actions = useRolesByRouter();
  return (
    <div>
      <div>
        <TitleHeader>Danh mục loại sản phẩm</TitleHeader>
        <RowHeader>
          <Form form={form} onFinish={handleSearch}>
            <Row gutter={8}>
              <Col>
                <CFilter
                  searchComponent={
                    <Tooltip
                      title="Nhập mã hoặc tên loại sản phẩm"
                      placement="right"
                    >
                      <Form.Item name="q">
                        <CInput
                          maxLength={100}
                          placeholder="Nhập mã hoặc tên loại sản phẩm"
                          prefix={<FontAwesomeIcon icon={faSearch} />}
                        />
                      </Form.Item>
                    </Tooltip>
                  }
                  items={items}
                />
              </Col>
            </Row>
          </Form>
          <CButtonAdd onClick={handleAdd} />
          {includes(actions, ActionsTypeEnum.EXPORT_EXCEL) && (
            <CButtonExport onClick={onDownload} />
          )}
        </RowHeader>
      </div>
      <CTable
        loading={isFetching}
        columns={columns}
        rowKey={'id'}
        dataSource={dataTable?.content ?? []}
        pagination={{
          current: params.page + 1,
          pageSize: params.size,
          total: dataTable?.totalElements ?? 0,
        }}
      />
    </div>
  );
};

export default Body;
