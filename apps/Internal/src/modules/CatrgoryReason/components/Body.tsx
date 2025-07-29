import { Dropdown, MenuProps, Tooltip, Form, Row, Col } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useState, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { ContentItem } from '../types';
import CTable from '@react/commons/Table';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import { ReactComponent as IconMore } from 'apps/Internal/src/assets/images/IconMore.svg';
import {
  BtnGroupFooter,
  RowHeader,
  Text,
  TitleHeader,
  WrapperActionTable,
} from '@react/commons/Template/style';
import { CButtonDetail } from '@react/commons/Button';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useList, useListReasonType } from '../queryHook/useList';
import { useDeleteFn } from '../queryHook/useDelete';
import CSelect from '@react/commons/Select';
import { AnyElement, ModelStatus } from '@react/commons/types';
import { ActionsTypeEnum, ActionType } from '@react/constants/app';
import ModalConfirm from 'apps/Internal/src/components/modalConfirm';
import { decodeSearchParams } from '@react/helpers/utils';
import CInput from '@react/commons/Input';
import CButton from '@react/commons/Button';
import { formatDate, formatDateTime } from '@react/constants/moment';
import dayjs from 'dayjs';
import CTag from '@react/commons/Tag';

const Body = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { isLoading: loadingTable, data: dataTable } = useList(params);
  const { isLoading: loadingReasonType, data: dataReasonType } =
    useListReasonType();
  const intl = useIntl();
  const { mutate: deleteMutate } = useDeleteFn();
  const [form] = Form.useForm();

  const reasonTypeOptions = dataReasonType?.map((item: any) => ({
    label: item.reasonTypeName,
    value: item.id.toString(),
  }));

  console.log('REASONNNNNNNNNNN ', reasonTypeOptions);

  useEffect(() => {
    form.submit();
  }, [params.type]);

  useEffect(() => {
    if (params) {
      const { reasonTypeId, ...rest } = params;
      const reasonId = reasonTypeId ? reasonTypeId : undefined;
      form.setFieldsValue({
        ...rest,
        reasonTypeId: reasonId,
      });
    }
  }, [params]);

  const items: ItemFilter[] = [
    {
      label: 'Loại lý do',
      value: (
        <Form.Item label={''} name={'reasonTypeId'} className="w-40">
          <CSelect
            options={reasonTypeOptions}
            placeholder="Loại lý do"
            loading={loadingReasonType}
          />
        </Form.Item>
      ),
    },
  ];

  const renderMenuItemsMore = (record: ContentItem): MenuProps['items'] => {
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
            onClick={() => handleDeleteItem(record.reasonId.toString())}
          >
            <FormattedMessage id={'common.delete'} />
          </Text>
        ),
      },
    ];
    // .filter((item: { key: ActionsTypeEnum; label: JSX.Element }) =>
    //   includes(actionByRole, item?.key)
    // );
  };

  const handleAdd = () => {
    navigate(pathRoutes.category_reason_add);
  };

  const columns: ColumnsType<ContentItem> = [
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
      title: intl.formatMessage({ id: 'categoryReason.reasonType' }),
      dataIndex: 'reasonTypeName',
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
      title: intl.formatMessage({ id: 'categoryReason.reasonCode' }),
      dataIndex: 'reasonCode',
      width: 120,
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
      title: intl.formatMessage({ id: 'categoryReason.reasonName' }),
      dataIndex: 'reasonName',
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
      title: intl.formatMessage({ id: 'categoryReason.reasonCreator' }),
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
      title: intl.formatMessage({ id: 'Ngày tạo' }),
      dataIndex: 'createdDate',
      width: 120,
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
      title: intl.formatMessage({ id: 'categoryReason.updatedBy' }),
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
      title: intl.formatMessage({ id: 'categoryReason.updatedDate' }),
      dataIndex: 'modifiedDate',
      width: 130,
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
      width: 150,
      align: 'left',
      render: (value) => {
        return (
          <Tooltip
            title={
              <FormattedMessage
                id={value ? 'common.active' : 'common.inactive'}
              />
            }
            placement="topLeft"
          >
            <CTag color={value === ModelStatus.ACTIVE ? 'success' : 'default'}>
              <FormattedMessage
                id={value ? 'common.active' : 'common.inactive'}
              />
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
            {/* {includes(actionByRole, ActionsTypeEnum.READ) && ( */}
            <CButtonDetail
              onClick={() => openModalEditView(ActionType.VIEW, record)}
            />
            {/* )} */}
            {/* {(includes(actionByRole, ActionsTypeEnum.UPDATE) ||
              includes(actionByRole, ActionsTypeEnum.DELETE)) && ( */}
            <div className="w-5">
              <Dropdown
                menu={{ items: renderMenuItemsMore(record) }}
                placement="bottom"
                trigger={['click']}
              >
                <IconMore className="iconMore" />
              </Dropdown>
            </div>
            {/* )} */}
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
        ? pathRoutes.category_reason_edit(record.reasonId)
        : pathRoutes.category_reason_view(record.reasonId)
    );
  };
  const handleSearch = (values: AnyElement) => {
    setSearchParams({
      ...params,
      ...values,
      page: 0,
    });
  };

  return (
    <div>
      <div>
        <TitleHeader>Danh mục lý do</TitleHeader>
        <RowHeader>
          <Form form={form} onFinish={handleSearch}>
            <Row gutter={8}>
              <Col>
                <CFilter
                  searchComponent={
                    <Tooltip
                      title="Tìm kiếm theo Tên hoặc mã lý do"
                      placement="right"
                    >
                      <Form.Item label="" name={'param'}>
                        <CInput
                          placeholder="Tìm kiếm theo Tên hoặc mã lý do"
                          prefix={<FontAwesomeIcon icon={faSearch} />}
                          maxLength={100}
                        />
                      </Form.Item>
                    </Tooltip>
                  }
                  items={items}
                />
              </Col>
              <BtnGroupFooter>
                <CButton
                  icon={<FontAwesomeIcon icon={faPlus} />}
                  onClick={handleAdd}
                >
                  <FormattedMessage id="common.add" />
                </CButton>
              </BtnGroupFooter>
            </Row>
          </Form>
        </RowHeader>
      </div>
      <CTable
        rowKey="id"
        // expandable={{ defaultExpandAllRows: true }}
        loading={loadingTable}
        columns={columns}
        dataSource={dataTable?.content}
        pagination={{
          current: params.page + 1,
          pageSize: params.size,
          total: dataTable?.totalElements,
        }}
        // onChange={handleChangeTable}
      />
    </div>
  );
};

export default Body;
