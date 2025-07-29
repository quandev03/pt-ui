import { CButtonDetail } from '@react/commons/Button';
import { NotificationSuccess } from '@react/commons/Notification';
import CTag from '@react/commons/Tag';
import { Text, WrapperActionTable } from '@react/commons/Template/style';
import {
  ACTION_MODE_ENUM,
  IErrorResponse,
  IFieldErrorsItem,
  ModelStatus,
} from '@react/commons/types';
import { ActionsTypeEnum } from '@react/constants/app';
import { ColorList } from '@react/constants/color';
import { formatDate, formatDateTime } from '@react/constants/moment';
import { decodeSearchParams } from '@react/helpers/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Dropdown, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { ReactComponent as IconMore } from 'apps/Internal/src/assets/images/IconMore.svg';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import dayjs from 'dayjs';
import { includes } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { useSearchParams } from 'react-router-dom';
import { coverageAreaServices } from '../services';
import { ICoverageAreaItem, ICoverageAreaParams } from '../types';

// Add a new query key for coverage areas
export const COVERAGE_AREA_QUERY_KEYS = {
  GET_ALL_COVERAGE_AREAS: 'GET_ALL_COVERAGE_AREAS',
  GET_COVERAGE_AREA: 'GET_COVERAGE_AREA',
  GET_NATIONS: 'GET_NATIONS',
};

export const useGetCoverageAreas = (params: ICoverageAreaParams) => {
  return useQuery({
    queryKey: [COVERAGE_AREA_QUERY_KEYS.GET_ALL_COVERAGE_AREAS, params],
    queryFn: () => coverageAreaServices.getCoverageAreas(params),
  });
};

export const useSupportGetCoverageArea = (id?: string) => {
  return useQuery({
    queryKey: ['coverageArea', id],
    queryFn: () => coverageAreaServices.getCoverageArea(id),
    enabled: !!id,
  });
};

export const useSupportCheckIsAttached = (id?: string) => {
  return useQuery({
    queryKey: ['coverageAreaIsAttached', id],
    queryFn: () => coverageAreaServices.checkIsAttached(id),
    enabled: !!id,
  });
};

export function useSupportDeleteCoverageArea(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: coverageAreaServices.deleteCoverageArea,
    onSuccess: () => {
      NotificationSuccess('Xóa thành công');
      queryClient.invalidateQueries({
        queryKey: [COVERAGE_AREA_QUERY_KEYS.GET_ALL_COVERAGE_AREAS],
      });
      onSuccess && onSuccess();
    },
  });
}

export const useSupportAddCoverageArea = (
  onSuccess: () => void,
  onError: (errorField: IFieldErrorsItem[]) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: coverageAreaServices.createCoverageArea,
    onSuccess: () => {
      NotificationSuccess('Thêm mới thành công');
      queryClient.invalidateQueries({
        queryKey: [COVERAGE_AREA_QUERY_KEYS.GET_ALL_COVERAGE_AREAS],
      });
      onSuccess();
    },
    onError(error: IErrorResponse & { fieldErrors?: IFieldErrorsItem[] }) {
      if (error?.errors) {
        onError(error?.errors);
      }
    },
  });
};

export function useSupportUpdateCoverageArea(
  onSuccess: () => void,
  onError: (errorField: IFieldErrorsItem[]) => void
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: coverageAreaServices.updateCoverageArea,
    onSuccess: () => {
      NotificationSuccess('Cập nhật thành công');
      queryClient.invalidateQueries({
        queryKey: [COVERAGE_AREA_QUERY_KEYS.GET_ALL_COVERAGE_AREAS],
      });
      onSuccess();
    },
    onError(error: IErrorResponse & { fieldErrors?: IFieldErrorsItem[] }) {
      if (error?.errors) {
        onError(error?.errors);
      }
    },
  });
}
export const useGetNations = (params: ICoverageAreaParams) => {
  return useQuery({
    queryKey: [COVERAGE_AREA_QUERY_KEYS.GET_NATIONS, params],
    queryFn: () => coverageAreaServices.getNations(params),
  });
};
export const useColumns = (
  onAction: (action: ACTION_MODE_ENUM, record: ICoverageAreaItem) => void,
  rangeTypes: { label: string; value: string; id: number }[]
): ColumnsType<ICoverageAreaItem> => {
  const [searchParams] = useSearchParams();
  const listRoles = useRolesByRouter();
  const params = decodeSearchParams(searchParams);

  return [
    {
      title: 'STT',
      align: 'left',
      width: 50,
      fixed: 'left',
      render(_, record, index) {
        return (
          <Text disabled={!record?.status}>
            {index + 1 + params.page * params.size}
          </Text>
        );
      },
    },
    {
      title: 'Tên quốc gia/ khu vực',
      dataIndex: 'rangeName',
      width: 200,
      align: 'left',
      fixed: 'left',
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text disabled={record?.status !== 1}>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Loại phạm vi',
      dataIndex: 'rangeType',
      width: 120,
      align: 'left',
      fixed: 'left',
      render(value, record) {
        const renderedValue = rangeTypes.find(
          (item) => item.value == value
        )?.label;
        return (
          <Tooltip title={renderedValue} placement="topLeft">
            <Text disabled={record?.status !== 1}>{renderedValue}</Text>
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
            <Text disabled={record?.status !== 1}>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdDate',
      width: 125,
      align: 'left',
      render(value, record) {
        const textformatDateTime = value
          ? dayjs(value).format(formatDateTime)
          : '';
        return (
          <Tooltip title={textformatDateTime} placement="topLeft">
            <Text disabled={record?.status !== 1}>{textformatDateTime}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Người cập nhật',
      dataIndex: 'modifiedBy',
      width: 200,
      align: 'left',
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text disabled={record?.status !== 1}>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'modifiedDate',
      width: 125,
      align: 'left',
      render(value, record) {
        const textformatDateTime = value
          ? dayjs(value).format(formatDateTime)
          : '';
        return (
          <Tooltip title={textformatDateTime} placement="topLeft">
            <Text disabled={record?.status !== 1}>{textformatDateTime}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 100,
      align: 'left',
      render: (value) => {
        return (
          <Tooltip
            title={
              <FormattedMessage
                id={
                  value === ModelStatus.ACTIVE
                    ? 'common.active'
                    : 'common.inactive'
                }
              />
            }
            placement="topLeft"
          >
            <CTag
              color={
                value === ModelStatus.ACTIVE
                  ? ColorList.SUCCESS
                  : ColorList.CANCEL
              }
            >
              <FormattedMessage
                id={
                  value === ModelStatus.ACTIVE
                    ? 'common.active'
                    : 'common.inactive'
                }
              />
            </CTag>
          </Tooltip>
        );
      },
    },
    {
      title: <FormattedMessage id="common.action" />,
      align: 'center',
      width: 150,
      fixed: 'right',
      render(_, record) {
        const items = [
          {
            key: ActionsTypeEnum.UPDATE,
            onClick: () => {
              onAction(ACTION_MODE_ENUM.EDIT, record);
            },
            label: (
              <Text>
                <FormattedMessage id={'common.edit'} />
              </Text>
            ),
          },
          {
            key: ActionsTypeEnum.DELETE,
            onClick: () => {
              onAction(ACTION_MODE_ENUM.Delete, record);
            },
            label: (
              <Text type="danger">
                <FormattedMessage id={'common.delete'} />
              </Text>
            ),
          },
        ].filter((item) => includes(listRoles, item?.key));

        return (
          <WrapperActionTable>
            <CButtonDetail
              onClick={() => onAction(ACTION_MODE_ENUM.VIEW, record)}
            />

            {items.length > 0 && (
              <Dropdown menu={{ items }} placement="bottomRight">
                <IconMore className="cursor-pointer" />
              </Dropdown>
            )}
          </WrapperActionTable>
        );
      },
    },
  ];
};
