import CTable from '@react/commons/Table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { IListPhoneNoCatalog, StockTypeEnum } from '../type';
import { ActionsTypeEnum, ActionType } from '@react/constants/app';
import { CInput, CModalConfirm, CSelect, CTag } from '@react/commons/index';
import { MESSAGE } from '@react/utils/message';
import {
  RowHeader,
  Text,
  TitleHeader,
  WrapperActionTable,
} from '@react/commons/Template/style';
import { Dropdown, Form, Row, TableProps, Tooltip } from 'antd';
import { Col } from 'antd/lib';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { CButtonAdd, CButtonDetail } from '@react/commons/Button';
import { useForm } from 'antd/es/form/Form';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import { AnyElement, ModelStatus } from '@react/commons/types';
import { ReactComponent as IconMore } from 'apps/Internal/src/assets/images/IconMore.svg';
import { FormattedMessage } from 'react-intl';
import dayjs from 'dayjs';
import { formatDate, formatDateTime } from '@react/constants/moment';
import useDeletephoneNoCatalog from '../hook/useDeletePhoneNoCatalog';
import {
  convertArrToObj,
  useGetListphoneNoCatalog,
} from '../hook/useGetListPhoneNoCatalog';
import useSearchHandler from '@react/hooks/useSearchHandler';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { mappingColor } from '../../CategoryProduct/types';
const Container = () => {
  const navigate = useNavigate();
  const [form] = useForm();
  const { mutate: deletephoneNoCatalog } = useDeletephoneNoCatalog(() => {
    console.log(123);
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const searchValue = params.q || '';
  const { data: dataTable, isLoading: loadingTable } = useGetListphoneNoCatalog(
    queryParams(params)
  );
  const items: ItemFilter[] = [
    {
      label: 'Trạng thái',
      value: (
        <Form.Item className="min-w-44" name="status">
          <CSelect
            placeholder={'Chọn trạng thái'}
            options={[
              {
                label: 'Hoạt động',
                value: 1,
              },
              {
                label: 'Không hoạt động',
                value: 0,
              },
            ]}
            onKeyDown={(e) => e.preventDefault()}
          />
        </Form.Item>
      ),
    },
  ];
  const handleAdd = useCallback(() => {
    navigate(pathRoutes.phoneNoCatalogAdd);
  }, [navigate]);
  const { handleSearch } = useSearchHandler(
    REACT_QUERY_KEYS.GET_LIST_WAREHOUSE_CATALOG
  );
  const openModalEditView = (type: ActionType, record: IListPhoneNoCatalog) => {
    return navigate(
      type === ActionType.VIEW
        ? pathRoutes.phoneNoCatalogView(record.id)
        : pathRoutes.phoneNoCatalogEdit(record.id)
    );
  };
  const listDataTable = useMemo(() => {
    if (!dataTable) return [];
    const filteredData = dataTable.filter((obj: IListPhoneNoCatalog) => {
      const matchesSearch =
        searchValue === '' ||
        obj.stockCode?.toLowerCase().includes(searchValue.toLowerCase()) ||
        obj.stockName?.toLowerCase().includes(searchValue.toLowerCase());
      return matchesSearch;
    });

    return convertArrToObj(filteredData, null);
  }, [dataTable, searchValue]);
  const handleDeleteItem = (id: string) => {
    CModalConfirm({
      message: MESSAGE.G05,
      onOk: () => deletephoneNoCatalog(id),
    });
  };
  useEffect(() => {
    params && form.setFieldsValue(params);
  }, [params, form]);
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
  useEffect(() => {
    if (listDataTable && listDataTable.length > 0) {
      const allKeys = listDataTable.flatMap((item: IListPhoneNoCatalog) => {
        const getAllChildKeys = (item: IListPhoneNoCatalog): string[] => {
          const keys = [item.id];
          if (item.children) {
            item.children.forEach((child) => {
              keys.push(...getAllChildKeys(child));
            });
          }
          return keys;
        };
        return getAllChildKeys(item);
      });
      setExpandedRowKeys(allKeys);
    }
  }, [listDataTable]);
  const getColumnsTablephoneNoCatalog = (
    openModalEditView: (type: ActionType, record: IListPhoneNoCatalog) => void,
    handleDelete: (id: string) => void
  ): TableProps<IListPhoneNoCatalog>['columns'] => {
    const renderMenuItemsMore = (record: IListPhoneNoCatalog): AnyElement => {
      const arr = [
        {
          key: ActionsTypeEnum.UPDATE,
          label: (
            <Text onClick={() => openModalEditView(ActionType.EDIT, record)}>
              <FormattedMessage id={'common.edit'} />
            </Text>
          ),
        },
      ];
      if (
        record.parentId !== null &&
        (record.stockType === StockTypeEnum.SELL_WAREHOUSE ||
          record.stockType === StockTypeEnum.PURPOSE_WAREHOUSE)
      ) {
        arr.push({
          key: ActionsTypeEnum.DELETE,
          label: (
            <Text type="danger" onClick={() => handleDelete(record.id)}>
              <FormattedMessage id={'common.delete'} />
            </Text>
          ),
        });
      }
      return arr;
    };
    return [
      {
        title: 'Tên kho số',
        dataIndex: 'stockName',
        align: 'left',
        width: 200,
        ellipsis: { showTitle: false },
        render(value, record) {
          return (
            <Tooltip placement="topLeft" title={value}>
              <Text disabled={record.status === ModelStatus.INACTIVE}>
                {value}
              </Text>
            </Tooltip>
          );
        },
      },
      {
        title: 'Mã kho số',
        dataIndex: 'stockCode',
        align: 'left',
        width: 120,
        ellipsis: { showTitle: false },
        render(value, record) {
          return (
            <Tooltip placement="topLeft" title={value}>
              <Text disabled={record.status === ModelStatus.INACTIVE}>
                {value}
              </Text>
            </Tooltip>
          );
        },
      },
      {
        title: 'Người tạo',
        dataIndex: 'createdBy',
        align: 'left',
        width: 140,
        ellipsis: { showTitle: false },
        render(value, record) {
          return (
            <Tooltip placement="topLeft" title={value}>
              <Text disabled={record.status === ModelStatus.INACTIVE}>
                {value}
              </Text>
            </Tooltip>
          );
        },
      },
      {
        title: 'Ngày tạo',
        dataIndex: 'createdDate',
        align: 'left',
        width: 120,
        ellipsis: { showTitle: false },
        render(value, record) {
          const text = dayjs(value).format(formatDate);
          return (
            <Tooltip
              placement="topLeft"
              title={dayjs(value).format(formatDateTime)}
            >
              <Text disabled={record.status === ModelStatus.INACTIVE}>
                {text}
              </Text>
            </Tooltip>
          );
        },
      },
      {
        title: 'Người cập nhật',
        dataIndex: 'modifiedBy',
        align: 'left',
        width: 120,
        ellipsis: { showTitle: false },
        render(value, record) {
          return (
            <Tooltip placement="topLeft" title={value}>
              <Text disabled={record.status === ModelStatus.INACTIVE}>
                {value}
              </Text>
            </Tooltip>
          );
        },
      },
      {
        title: 'Ngày cập nhật',
        dataIndex: 'modifiedDate',
        align: 'left',
        width: 100,
        ellipsis: { showTitle: false },
        render(value, record) {
          const text = dayjs(value).format(formatDate);
          return (
            <Tooltip
              placement="topLeft"
              title={dayjs(value).format(formatDateTime)}
            >
              <Text disabled={record.status === ModelStatus.INACTIVE}>
                {text}
              </Text>
            </Tooltip>
          );
        },
      },
      {
        title: 'Trạng thái',
        dataIndex: 'status',
        align: 'left',
        width: 80,
        ellipsis: { showTitle: false },
        render(value) {
          const text = value ? 'Hoạt động' : 'Không hoạt động';
          return (
            <Tooltip placement="topLeft" title={text}>
              <CTag color={mappingColor[value as keyof typeof mappingColor]}>
                {text}
              </CTag>
            </Tooltip>
          );
        },
      },
      {
        title: 'Thao tác',
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
  };
  return (
    <>
      <div>
        <TitleHeader> Danh mục kho số</TitleHeader>
        <RowHeader>
          <Form onFinish={handleSearch} form={form}>
            <Row style={{ width: '90%' }}>
              <Col>
                <CFilter
                  validQuery={REACT_QUERY_KEYS.GET_LIST_WAREHOUSE_CATALOG}
                  searchComponent={
                    <Tooltip title="Nhập tên hoặc mã kho số" placement="right">
                      <Form.Item name="q">
                        <CInput
                          maxLength={100}
                          placeholder="Nhập tên hoặc mã kho số"
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
        </RowHeader>
      </div>
      {!loadingTable && (
        <CTable
          loading={loadingTable}
          rowKey={'id'}
          expandable={{
            expandedRowKeys,
            onExpand: (expanded, record) => {
              const newExpandedRowKeys = expanded
                ? [
                    ...expandedRowKeys,
                    record.id,
                    ...(record.children
                      ? record.children.map(
                          (child: IListPhoneNoCatalog) => child.id
                        )
                      : []),
                  ]
                : expandedRowKeys.filter(
                    (key) =>
                      key !== record.id &&
                      !(
                        record.children &&
                        record.children
                          .map((child: IListPhoneNoCatalog) => child.id)
                          .includes(key)
                      )
                  );
              setExpandedRowKeys(newExpandedRowKeys);
            },
          }}
          columns={getColumnsTablephoneNoCatalog(
            openModalEditView,
            handleDeleteItem
          )}
          dataSource={listDataTable}
          pagination={false}
        />
      )}
    </>
  );
};
export default Container;
