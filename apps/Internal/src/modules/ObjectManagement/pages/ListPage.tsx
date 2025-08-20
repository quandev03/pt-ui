import {
  ActionsTypeEnum,
  AnyElement,
  CButtonAdd,
  CButtonDetail,
  decodeSearchParams,
  LayoutList,
  MESSAGE,
  ModalConfirm,
  Text,
  WrapperActionTable,
} from '@vissoft-react/common';
import { Dropdown, MenuProps, Space, TableColumnsType } from 'antd';
import { useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDeleteObject } from '../hooks/useDeleteObject';
import { useListObject } from './useListObject';
import { ObjectType } from '../types';
import { MoreVertical } from 'lucide-react';
import { pathRoutes } from 'apps/Internal/src/routers';
import { useFilters } from '../hooks/useFilters';

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { page = 0, size = 20 } = params;
  const isPartner = !!+params?.isPartner;
  const isMobile = params?.isPartner === '2';
  console.log('isMobile', isMobile);
  const { data, isFetching: isLoadingList } = useListObject(
    isPartner,
    isMobile
  );
  const { mutate: mutateDelete, isPending: isLoadingDelete } =
    useDeleteObject();

  const searchData = useMemo(() => {
    const result = data?.filter((e) =>
      e.title?.toLowerCase().includes(params?.q?.toLowerCase() ?? '')
    );
    return {
      content: result?.slice(page * size, (page + 1) * size),
      total: result?.length || 0,
    };
  }, [params, data]);
  const handleView = (id: string) => {
    isMobile
      ? navigate(
          `${pathRoutes.object_view(
            id
          )}?isPartner=${isPartner}&isMobile=${isMobile}`
        )
      : navigate(`${pathRoutes.object_view(id)}?isPartner=${isPartner}`);
  };
  const handleEdit = (id: string) => {
    isMobile
      ? navigate(
          `${pathRoutes.object_edit(
            id
          )}?isPartner=${isPartner}&isMobile=${isMobile}`
        )
      : navigate(`${pathRoutes.object_edit(id)}?isPartner=${isPartner}`);
  };

  const handleDelete = (id: string) => {
    ModalConfirm({
      message: MESSAGE.G05,
      handleConfirm: () => id && mutateDelete({ id, isPartner, isMobile }),
    });
  };
  const renderMenuItemsMore = (id: string): MenuProps['items'] => {
    return [
      {
        key: ActionsTypeEnum.UPDATE,
        label: <Text onClick={() => handleEdit(id)}>Chỉnh sửa</Text>,
      },
      {
        key: ActionsTypeEnum.DELETE,
        label: (
          <Text type="danger" onClick={() => handleDelete(id)}>
            X
          </Text>
        ),
      },
    ];
  };
  const columns: TableColumnsType<ObjectType> = [
    {
      title: 'STT',
      dataIndex: 'stt',
      width: 50,
      render: (_, __, idx: number) => {
        return <div>{page * size + idx + 1}</div>;
      },
    },
    {
      title: 'Tên',
      dataIndex: 'title',
      width: 160,
      render: (value: string) => {
        return <span title={value}>{value}</span>;
      },
    },
    {
      title: 'URI',
      dataIndex: 'uri',
      width: 160,
      render: (value: string) => {
        return <span title={value}>{value}</span>;
      },
    },
    {
      title: 'ID',
      dataIndex: 'key',
      width: 160,
    },
    {
      title: 'Parent ID',
      dataIndex: 'parentId',
      width: 160,
    },
    {
      title: 'Is children',
      dataIndex: 'isChildren',
      width: 80,
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 150,
      fixed: 'right',
      render(_, record) {
        const items = [
          {
            key: ActionsTypeEnum.UPDATE,
            onClick: () => {
              handleEdit(record.key);
            },
            label: <Text>Sửa</Text>,
          },
          {
            key: ActionsTypeEnum.DELETE,
            onClick: () => {
              handleDelete(record.key);
            },
            label: <Text type="danger">Xóa</Text>,
          },
        ];

        return (
          <WrapperActionTable>
            <CButtonDetail
              onClick={() => {
                handleView(record.key);
              }}
            />
            <div className="w-5">
              <Dropdown
                menu={{ items: items }}
                placement="bottom"
                trigger={['click']}
              >
                <MoreVertical size={16} />
              </Dropdown>
            </div>
          </WrapperActionTable>
        );
      },
    },
  ];
  const { filters } = useFilters();
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
  ];
  const actionComponent = useMemo(() => {
    return (
      <Dropdown trigger={['click']} menu={{ items: dropdownItems }}>
        <CButtonAdd />
      </Dropdown>
    );
  }, []);
  return (
    <LayoutList
      actionComponent={actionComponent}
      data={(searchData as AnyElement) ?? []}
      columns={columns}
      title="Quản lý object"
      filterItems={filters}
      loading={isLoadingList || isLoadingDelete}
      searchComponent={
        <LayoutList.SearchComponent
          name="q"
          tooltip="Nhập tên"
          placeholder="Nhập tên"
        />
      }
    />
  );
};
