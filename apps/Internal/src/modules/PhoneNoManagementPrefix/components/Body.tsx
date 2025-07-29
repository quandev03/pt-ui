import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button, { CButtonDetail } from '@react/commons/Button';
import CFilter from '@react/commons/Filter';
import CInput from '@react/commons/Input';
import CTable from '@react/commons/Table';
import {
  BtnGroupFooter,
  RowHeader,
  Text,
  TitleHeader,
  WrapperActionTable,
} from '@react/commons/Template/style';
import { ActionsTypeEnum, ActionType } from '@react/constants/app';
import { formatDate, formatDateTime } from '@react/constants/moment';
import { decodeSearchParams } from '@react/helpers/utils';
import useSearchHandler from '@react/hooks/useSearchHandler';
import { Dropdown, Form, MenuProps, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { ReactComponent as IconMore } from 'apps/Internal/src/assets/images/IconMore.svg';
import ModalConfirm from 'apps/Internal/src/components/modalConfirm';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import dayjs from 'dayjs';
import { includes } from 'lodash';
import { useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDeleteFn } from '../queryHook/useDelete';
import { useList } from '../queryHook/useList';
import { ContentItem } from '../types';

const Body = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const intl = useIntl();
  const { mutate: deleteMutate } = useDeleteFn();
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { isLoading: loadingTable, data: dataTable } = useList(params);

  const renderMenuItemsMore = (record: ContentItem): MenuProps['items'] => {
    return [
      {
        key: ActionsTypeEnum.UPDATE,
        onClick: () => openModalEditView(ActionType.EDIT, record),
        label: (
          <Text>
            <FormattedMessage id={'common.edit'} />
          </Text>
        ),
      },
      {
        key: ActionsTypeEnum.DELETE,
        onClick: () => handleDeleteItem(record.id),
        label: (
          <Text type="danger">
            <FormattedMessage id={'common.delete'} />
          </Text>
        ),
      },
    ];
  };

  const handleAdd = () => {
    navigate(pathRoutes.numberPrefixAdd);
  };
  const actionByRole = useRolesByRouter();

  const columns: ColumnsType<ContentItem> = [
    {
      title: 'STT',
      align: 'left',
      fixed: 'left',
      width: 50,
      render(_, record, index) {
        return <Text> {index + 1 + params.page * params.size}</Text>;
      },
    },
    {
      title: 'Đầu số',
      dataIndex: 'isdnPrefix',
      width: 150,
      align: 'left',
      render: (value, record) => {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      width: 200,
      align: 'left',
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Người tạo',
      dataIndex: 'createdBy',
      width: 200,
      align: 'left',
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdDate',
      width: 100,
      align: 'left',
      render: (value) => {
        return (
          <Tooltip
            title={dayjs(value).format(formatDateTime)}
            placement="topLeft"
          >
            <Text>{dayjs(value).format(formatDate)}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Người cập nhật',
      dataIndex: 'modifiedBy',
      width: 200,
      align: 'left',
      render: (value) => {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'modifiedDate',
      width: 100,
      align: 'left',
      render: (value) => {
        return (
          <Tooltip
            title={dayjs(value).format(formatDateTime)}
            placement="topLeft"
          >
            <Text>{dayjs(value).format(formatDate)}</Text>
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
            {includes(actionByRole, ActionsTypeEnum.READ) && (
              <CButtonDetail
                onClick={() => openModalEditView(ActionType.VIEW, record)}
              />
            )}
            {(includes(actionByRole, ActionsTypeEnum.UPDATE) ||
              includes(actionByRole, ActionsTypeEnum.DELETE)) && (
              <Dropdown
                menu={{ items: renderMenuItemsMore(record) }}
                placement="bottom"
                trigger={['click']}
              >
                <IconMore className="iconMore" />
              </Dropdown>
            )}
          </WrapperActionTable>
        );
      },
    },
  ];

  const handleDeleteItem = (id: string) => {
    if (id) {
      ModalConfirm({
        message: 'common.confirmDelete',
        handleConfirm: () => {
          deleteMutate(id);
        },
      });
    }
  };

  const openModalEditView = (type: ActionType, record: ContentItem) => {
    return navigate(
      type === ActionType.EDIT
        ? pathRoutes.numberPrefixEdit(record.id)
        : pathRoutes.numberPrefixView(record.id)
    );
  };

  useEffect(() => {
    form.setFieldValue('prefix', params.prefix || '');
  }, []);

  const { handleSearch } = useSearchHandler(
    REACT_QUERY_KEYS.GET_LIST_PHONE_NO_PREFIX
  );

  return (
    <div>
      <TitleHeader>Danh sách đầu số được cấp</TitleHeader>
      <RowHeader>
        <Form onFinish={handleSearch} form={form}>
          <CFilter
            items={[]}
            validQuery={REACT_QUERY_KEYS.GET_LIST_PHONE_NO_PREFIX}
            searchComponent={
              <Tooltip title="Nhập đầu số để tìm kiếm" placement="right">
                <Form.Item name="prefix">
                  <CInput
                    maxLength={100}
                    onlyNumber
                    placeholder="Nhập đầu số để tìm kiếm"
                    prefix={<FontAwesomeIcon icon={faSearch} />}
                  />
                </Form.Item>
              </Tooltip>
            }
          />
        </Form>
        <BtnGroupFooter>
          <Button icon={<FontAwesomeIcon icon={faPlus} />} onClick={handleAdd}>
            <FormattedMessage id="common.add" />
          </Button>
        </BtnGroupFooter>
      </RowHeader>
      <CTable
        rowKey="id"
        loading={loadingTable}
        columns={columns}
        dataSource={dataTable?.content ?? []}
        pagination={{
          total: dataTable?.totalElements,
        }}
      />
    </div>
  );
};

export default Body;
