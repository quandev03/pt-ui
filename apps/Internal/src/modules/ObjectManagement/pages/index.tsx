import CButton from '@react/commons/Button';
import { CModalConfirm } from '@react/commons/index';
import CTable from '@react/commons/Table';
import { Text } from '@react/commons/Template/style';
import { ActionsTypeEnum } from '@react/constants/app';
import { decodeSearchParams } from '@react/helpers/utils';
import { MESSAGE } from '@react/utils/message';
import { Dropdown, MenuProps, Space, TableColumnsType } from 'antd';
import { ReactComponent as IconMore } from 'apps/Internal/src/assets/images/IconMore.svg';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import { useDeleteObject } from '../hooks/useDeleteObject';
import { useListObject } from '../hooks/useListObject';
import { ObjectType } from '../types';

const ObjectPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { page = 0, size = 20 } = params;
  const isPartner = !!+params?.isPartner;
  const isMobile = params?.isPartner === '2';
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
      ? navigate(`${pathRoutes.object_view(id)}?isPartner=${isPartner}&isMobile=${isMobile}`)
      : navigate(`${pathRoutes.object_view(id)}?isPartner=${isPartner}`);
  };
  const handleEdit = (id: string) => {
    isMobile
      ? navigate(
        `${pathRoutes.object_edit(id)}?isPartner=${isPartner}&isMobile=${isMobile}`
      )
      : navigate(`${pathRoutes.object_edit(id)}?isPartner=${isPartner}`);
  };

  const handleDelete = (id: string) => {
    CModalConfirm({
      message: MESSAGE.G05,
      onOk: () => id && mutateDelete({ id, isPartner, isMobile }),
    });
  };
  const renderMenuItemsMore = (id: string): MenuProps['items'] => {
    return [
      {
        key: ActionsTypeEnum.UPDATE,
        label: (
          <Text onClick={() => handleEdit(id)}>
            <FormattedMessage id={'common.edit'} />
          </Text>
        ),
      },
      {
        key: ActionsTypeEnum.DELETE,
        label: (
          <Text type="danger" onClick={() => handleDelete(id)}>
            <FormattedMessage id={'common.delete'} />
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
      dataIndex: 'key',
      width: 100,
      align: 'center',
      render: (value) => (
        <Space size="middle">
          <CButton type="default" onClick={() => handleView(value)}>
            Chi tiết
          </CButton>
          <Dropdown
            menu={{ items: renderMenuItemsMore(value) }}
            placement="bottom"
            trigger={['click']}
          >
            <IconMore className="cursor-pointer" />
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Header />
      <CTable
        columns={columns}
        dataSource={searchData?.content ?? []}
        pagination={{ current: 1, total: searchData?.total, pageSize: +size }}
        loading={isLoadingList || isLoadingDelete}
      />
    </>
  );
};

export default ObjectPage;
