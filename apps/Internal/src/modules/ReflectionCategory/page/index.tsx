import { CButtonDetail } from '@react/commons/Button';
import { CTable, CTag, CTooltip } from '@react/commons/index';
import { Text, WrapperActionTable } from '@react/commons/Template/style';
import { AnyElement } from '@react/commons/types';
import { ActionsTypeEnum, ActionType, DateFormat } from '@react/constants/app';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import { getDate } from '@react/utils/datetime';
import { Dropdown, Space, TableColumnsType, Tooltip } from 'antd';
import { MenuProps } from 'antd/lib';
import { ReactComponent as IconMore } from 'apps/Internal/src/assets/images/IconMore.svg';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useArea } from 'apps/Internal/src/hooks/useArea';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import { includes } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import { useListReflectionCategory } from '../hooks';
import { Req } from '../services';
import { IReflectionCategory } from '../types';
import { Wrapper } from './style';

export enum Status {
  INACTIVE = 0,
  ACTIVE = 1,
}

export const COLOR_STATUS: Record<Status, 'processing' | 'success'> = {
  [Status.INACTIVE]: 'processing',
  [Status.ACTIVE]: 'success',
};

const ReflectionCategoryPage: React.FC = () => {
  const navigate = useNavigate();
  const actionByRole = useRolesByRouter();
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { page, size, ...rest } = params;
  const { data = [], isFetching: isLoadingList } = useListReflectionCategory(
    queryParams(rest)
  );
  const [expandedKeys, setExpandedKeys] = useState<number[]>([]);

  const isSearch = useMemo(() => {
    return (
      params.param ||
      params.toDate ||
      params.fromDate ||
      params.status ||
      params.status === 0
    );
  }, [params]);

  const expandedKeysWhenSearch = useMemo(() => {
    if (isSearch) {
      return data.map((item) => item.id);
    }
    return [];
  }, [data, isSearch]);

  const optionStatus = [
    { label: 'Không hoạt động', value: 0 },
    { label: 'Hoạt động', value: 1 },
  ];

  const buildHierarchy = (
    data: IReflectionCategory[],
    searchValues: Req
  ): IReflectionCategory[] => {
    data.sort(
      (a, b) =>
        new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
    );

    const map = new Map<number, IReflectionCategory>();
    const result: IReflectionCategory[] = [];
    const pathSet = new Set<number>();

    data.forEach((item) => {
      if (
        searchValues.param &&
        item.typeName.toLowerCase().includes(searchValues.param.toLowerCase())
      ) {
        let currentParentId = item.parentId;
        while (currentParentId) {
          pathSet.add(currentParentId);
          currentParentId =
            data.find((x) => x.id === currentParentId)?.parentId ?? null;
        }
      }
    });

    data.forEach((item) => {
      map.set(item.id, {
        ...item,
        children: [],
        isExpanded: pathSet.has(item.id),
      });
    });

    data.forEach((item) => {
      if (item.parentId !== null) {
        const parent = map.get(item.parentId);
        if (parent) {
          parent.children?.push(map.get(item.id)!);
        }
      } else {
        result.push(map.get(item.id)!);
      }
    });

    const cleanChildren = (
      items: IReflectionCategory[]
    ): IReflectionCategory[] => {
      return items.map((item) => {
        if (item.children && item.children.length === 0) {
          const { children, ...rest } = item;
          return rest as IReflectionCategory;
        }
        if (item.children) {
          item.children.sort(
            (a, b) =>
              new Date(b.createdDate).getTime() -
              new Date(a.createdDate).getTime()
          );
          item.children = cleanChildren(item.children);
        }
        return item;
      });
    };

    return cleanChildren(result);
  };

  const dataSource: IReflectionCategory[] = buildHierarchy(
    data?.map((item, index) => ({
      ...item,
      key: item.id,
    })) ?? [],
    params
  );

  const handleEditView = (type: ActionType, id: number) => {
    return navigate(
      type === ActionType.EDIT
        ? pathRoutes.reflectionCategoryEdit(id)
        : pathRoutes.reflectionCategoryView(id)
    );
  };

  const { data: provinces } = useArea('provinces', '');
  const optionsProvinces = useMemo(() => {
    if (!provinces) {
      return [];
    }
    return provinces.map((province) => ({
      label: province.areaName,
      value: province.areaCode,
      id: province.id,
    }));
  }, [provinces]);

  const renderMenuItemsMore = (
    record: IReflectionCategory
  ): MenuProps['items'] => {
    return [
      {
        key: ActionsTypeEnum.UPDATE,
        label: (
          <Text onClick={() => handleEditView(ActionType.EDIT, record.id)}>
            <FormattedMessage id={'common.edit'} />
          </Text>
        ),
      },
    ];
  };

  const columns: TableColumnsType<AnyElement> = [
    {
      title: 'Loại phản ánh',
      dataIndex: 'typeName',
      width: 250,
      render: (value: string) => {
        return <CTooltip title={value}>{value}</CTooltip>;
      },
    },
    {
      title: 'Người tạo',
      dataIndex: 'createdBy',
      width: 140,
      render: (value: string) => {
        return <CTooltip title={value}>{value}</CTooltip>;
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdDate',
      width: 160,
      render: (value) => {
        return (
          <CTooltip title={getDate(value, DateFormat.DATE_TIME)}>
            {getDate(value, DateFormat.DATE_TIME)}
          </CTooltip>
        );
      },
    },
    {
      title: 'Người cập nhật',
      dataIndex: 'modifiedBy',
      width: 140,
      render: (value: string) => {
        return <CTooltip title={value}>{value}</CTooltip>;
      },
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'modifiedDate',
      width: 160,
      render: (value: string) => {
        return (
          <CTooltip title={getDate(value, DateFormat.DATE_TIME)}>
            {getDate(value, DateFormat.DATE_TIME)}
          </CTooltip>
        );
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 150,
      align: 'left',
      render(value) {
        const text = optionStatus
          ? optionStatus.find((item) => item.value === value)?.label
          : '';
        return (
          <Tooltip title={text} placement="topLeft">
            <CTag bordered={false} color={COLOR_STATUS[value as Status]}>
              {text}
            </CTag>
          </Tooltip>
        );
      },
    },
    {
      title: 'Thao tác',
      dataIndex: 'id',
      width: 140,
      align: 'center',
      fixed: 'right',
      render: (_, record) => {
        return !record.deliveryMethod ? (
          <WrapperActionTable>
            <CButtonDetail
              type="default"
              onClick={() => handleEditView(ActionType.VIEW, record.id)}
            />
            {(includes(actionByRole, ActionsTypeEnum.UPDATE) ||
              includes(actionByRole, ActionsTypeEnum.DELETE)) && (
              <Dropdown
                menu={{ items: renderMenuItemsMore(record) }}
                placement="bottom"
                trigger={['click']}
              >
                <IconMore className="cursor-pointer" />
              </Dropdown>
            )}
          </WrapperActionTable>
        ) : (
          ''
        );
      },
    },
  ];

  const getExpandedKeys = (data: IReflectionCategory[]): number[] => {
    const expandedKeys: number[] = [];

    const traverse = (items: IReflectionCategory[]) => {
      items.forEach((item) => {
        if (item.isExpanded) {
          expandedKeys.push(item.id);
        }
        if (item.children && item.children.length > 0) {
          traverse(item.children);
        }
      });
    };

    traverse(data);
    return expandedKeys;
  };

  useEffect(() => {
    const expandedRowKeys = getExpandedKeys(dataSource);
    setExpandedKeys(expandedRowKeys);
  }, [searchParams]);

  const handleExpand = (expanded: boolean, record: IReflectionCategory) => {
    if (expanded) {
      setExpandedKeys((prev) => [...prev, record.id]);
    } else {
      setExpandedKeys((prev) => prev.filter((id) => id !== record.id));
    }
  };

  return (
    <Wrapper>
      <Header provinces={optionsProvinces} />
      <CTable
        columns={columns}
        dataSource={dataSource}
        loading={isLoadingList}
        expandable={{
          expandedRowKeys: isSearch ? expandedKeysWhenSearch : expandedKeys,
          onExpand: handleExpand,
        }}
      />
    </Wrapper>
  );
};

export default ReflectionCategoryPage;
