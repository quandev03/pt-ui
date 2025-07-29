import { faHistory, faPencil, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CButtonDetail } from '@react/commons/Button';
import CTable from '@react/commons/Table';
import { Text, WrapperActionTable } from '@react/commons/Template/style';
import { ActionsTypeEnum, DateFormat } from '@react/constants/app';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import { Dropdown, MenuProps, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { ReactComponent as IconMore } from 'apps/Internal/src/assets/images/IconMore.svg';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import { includes } from 'lodash';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ContentItem,
  useGetEnterpriseSearch,
} from '../hooks/useGetEnterpriseSearch';
import CTag from '@react/commons/Tag';
import { ColorList } from '@react/constants/color';
import { getDate } from '@react/utils/datetime';
import { useGetPositionCode } from 'apps/Internal/src/modules/BusinessManagement/hooks/useGetPositionCode';
import { useEffect } from 'react';

const statusOptions = [
  {
    label: 'Dừng hoạt động',
    value: 0,
  },
  {
    label: 'Đang hoạt động',
    value: 1,
  },
];

export const StatusColor = {
  0: ColorList.FAIL,
  1: ColorList.SUCCESS,
};

const Container = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const actionByRole = useRolesByRouter();
  const { data: dataTable, isFetching } = useGetEnterpriseSearch(
    queryParams(params)
  );

  const { mutate: mutateGetPositionCode } = useGetPositionCode();
  const textRender = (children: any, record: ContentItem) => {
    return (
      <Text type={record.expire === true ? 'danger' : undefined}>
        {children}
      </Text>
    );
  };

  useEffect(() => {
    mutateGetPositionCode();
  }, []);

  const columns: ColumnsType<ContentItem> = [
    {
      title: 'STT',
      dataIndex: 'stt',
      width: 50,
      fixed: 'left',
      render: (_, record, idx: number) => {
        return <div>{textRender(idx + 1, record)}</div>;
      },
    },
    {
      title: 'MST',
      dataIndex: 'taxCode',
      width: 180,
      render: (value: string, record) => {
        return (
          <Tooltip title={value} placement="topLeft">
            {textRender(value, record)}
          </Tooltip>
        );
      },
    },
    {
      title: 'Tên doanh nghiệp',
      dataIndex: 'enterpriseName',
      width: 150,
      render: (value: string, record) => {
        return (
          <Tooltip title={value} placement="topLeft">
            {textRender(value, record)}
          </Tooltip>
        );
      },
    },
    {
      title: 'Người đại diện',
      dataIndex: 'representativeName',
      width: 120,
      render: (value: string, record) => {
        return (
          <Tooltip title={value} placement="topLeft">
            {textRender(value, record)}
          </Tooltip>
        );
      },
    },
    {
      title: 'Người phụ trách',
      dataIndex: 'chargePerson',
      width: 200,
      render: (value: string, record) => {
        return (
          <Tooltip title={value} placement="topLeft">
            {textRender(value, record)}
          </Tooltip>
        );
      },
    },
    {
      title: 'Người tạo',
      dataIndex: 'createdBy',
      width: 140,
      render: (value: string) => {
        return <Tooltip title={value}>{value}</Tooltip>;
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdDate',
      width: 100,
      render: (value: string) => {
        return (
          <Tooltip title={getDate(value, DateFormat.DATE_TIME_NO_SECOND)}>
            {getDate(value)}
          </Tooltip>
        );
      },
    },
    {
      title: 'Người cập nhật',
      dataIndex: 'modifiedBy',
      width: 140,
      render: (value: string) => {
        return <Tooltip title={value}>{value}</Tooltip>;
      },
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'modifiedDate',
      width: 120,
      render: (value: string) => {
        return (
          <Tooltip title={getDate(value, DateFormat.DATE_TIME_NO_SECOND)}>
            {getDate(value)}
          </Tooltip>
        );
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 150,

      render: (value, record) => {
        const renderedValue =
          statusOptions.find((item) => item.value === value)?.label || '';
        return (
          <Tooltip title={renderedValue} placement="topLeft">
            <CTag color={StatusColor[value as keyof typeof StatusColor]}>
              {renderedValue}
            </CTag>
          </Tooltip>
        );
      },
    },

    {
      title: 'Thao tác',
      align: 'center',
      width: 150,
      // hidden: !actionByRole?.some((item) =>
      //   includes(
      //     [
      //       ActionsTypeEnum.READ,
      //       ActionsTypeEnum.UPDATE,
      //       ActionsTypeEnum.DELETE,
      //     ],
      //     item
      //   )
      // ),
      fixed: 'right',
      render(_, record) {
        return (
          <WrapperActionTable>
            <CButtonDetail
              onClick={() =>
                navigate(pathRoutes.businessManagementView(record.id))
              }
            />

            <Dropdown
              disabled={record.status === 0}
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

  const renderMenuItemsMore = (record: ContentItem): MenuProps['items'] => {
    return [
      {
        key: ActionsTypeEnum.UPDATE,
        itemIcon: <FontAwesomeIcon icon={faPencil} />,
        label: (
          <Text
            onClick={() =>
              navigate(pathRoutes.businessManagementEdit(record.id))
            }
          >
            Sửa
          </Text>
        ),
      },
      {
        key: ActionsTypeEnum.VIEW_UPDATE_HISTORY,
        itemIcon: <FontAwesomeIcon icon={faHistory} className="ml-2" />,
        label: (
          <Text
            onClick={() => navigate(pathRoutes.enterpriseHistory(record.id))}
          >
            Lịch sử chỉnh sửa
          </Text>
        ),
      },
      {
        key: ActionsTypeEnum.CREATE,
        itemIcon: <FontAwesomeIcon icon={faPlus} className="ml-2" />,
        label: (
          <Text
            onClick={() => {
              navigate(pathRoutes.representativeAdd(record.id));
            }}
          >
            Thêm NUQ
          </Text>
        ),
      },
    ].filter((item: { key: ActionsTypeEnum; label: JSX.Element }) =>
      includes(actionByRole, item?.key)
    );
  };

  return (
    <div>
      <CTable
        columns={columns}
        dataSource={dataTable?.content ?? []}
        loading={isFetching}
        pagination={{
          total: dataTable?.totalElements ?? 0,
        }}
      />
    </div>
  );
};

export default Container;
