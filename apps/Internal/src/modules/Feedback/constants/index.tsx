import { Text } from '@react/commons/Template/style';
import { Button, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import {
  FeedbackChannelEnum,
  IFeedback,
  IFeedbackType,
  PageFilterEnum,
  PriorityEnum,
  StatusEnum,
} from '../types';
import { ButtonWrapper } from '../page/styles';
import dayjs from 'dayjs';
import { formatDateTime } from '@react/constants/moment';
import React from 'react';
import { TableProps } from 'antd/lib';
import { includes } from 'lodash';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { getDate } from '@react/utils/datetime';
import { DateFormat } from '@react/constants/app';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';

export const FeedbackPriorityList = [
  {
    value: PriorityEnum.URGENT,
    label: 'Khẩn cấp',
  },
  {
    value: PriorityEnum.NORMAL,
    label: 'Bình thường',
  },
];

export const isOverDate = (record: IFeedback) => {
  return record?.warning;
};

export const getStatusStyles = (status: StatusEnum) => {
  switch (status) {
    case StatusEnum.CLOSED:
      return { color: '#52c41a' };
    case StatusEnum.CANCELED:
      return { color: '#ED1212' };
    case StatusEnum.NOT_APPROVED:
      return { color: '#ED1212' };
    case StatusEnum.REJECTED:
      return { color: '#ED1212' };
    case StatusEnum.REPROCESS:
      return { color: '#ED1212' };
    default:
      return {};
  }
};

export const getPriorityStyles = (status: PriorityEnum) => {
  switch (status) {
    case PriorityEnum.URGENT:
      return { color: '#ED1212' };
    default:
      return {};
  }
};

export const getCollumnTable = ({
  handleDetail,
  more,
  INTERNAL_DEPARTMENT,
  isAssigned,
  type,
}: {
  handleDetail: (record: IFeedback) => void;
  more: (recprd: IFeedback) => React.ReactNode;
  INTERNAL_DEPARTMENT: any[];
  isAssigned?: boolean;
  type?: PageFilterEnum;
}): ColumnsType<IFeedback> => {
  return [
    {
      title: 'ID',
      align: 'center',
      width: 50,
      fixed: 'left',
      render(_, record) {
        return (
          <Text style={{ color: isOverDate(record) ? 'red' : '#333' }}>
            {record.id}
          </Text>
        );
      },
    },
    {
      title: 'Tên phản ánh',
      dataIndex: 'name',
      width: 140,
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text style={{ color: isOverDate(record) ? 'red' : '#333' }}>
              {value}
            </Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Loại phản ánh',
      dataIndex: 'feedbackTypeName',
      width: 270,
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text style={{ color: isOverDate(record) ? 'red' : '#333' }}>
              {value}
            </Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Số thuê bao phản ánh',
      dataIndex: 'isdn',
      width: 170,
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text style={{ color: isOverDate(record) ? 'red' : '#333' }}>
              {value}
            </Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Trạng thái xử lý',
      dataIndex: 'status',
      width: 130,
      render(value, record) {
        const val = LIST_STATUS?.find((e) => e.value === value)?.label;
        return (
          <Tooltip title={val} placement="topLeft">
            <Text
              style={{
                color: isOverDate(record) ? 'red' : '#333',
                ...getStatusStyles(record.status as any),
              }}
            >
              {val}
            </Text>
          </Tooltip>
        );
      },
    },
    // {
    //   title: 'Thời hạn phản ánh',
    //   dataIndex: 'deadline',
    //   width: 150,
    //   render(value, record) {
    //     return (
    //       <Tooltip
    //         title={dayjs(value).format(formatDateTime)}
    //         placement="topLeft"
    //       >
    //         <Text style={{ color: isOverDate(record) ? 'red' : '#333' }}>
    //           {dayjs(value).format(formatDateTime)}
    //         </Text>
    //       </Tooltip>
    //     );
    //   },
    // },
    {
      title: 'Nội dung phản ánh',
      dataIndex: 'content',
      width: 180,
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text style={{ color: isOverDate(record) ? 'red' : '#333' }}>
              {value}
            </Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Ngày phản ánh',
      dataIndex: 'createdDate',
      width: 150,
      render(value, record) {
        return (
          <Tooltip
            title={dayjs(value).format(formatDateTime)}
            placement="topLeft"
          >
            <Text style={{ color: isOverDate(record) ? 'red' : '#333' }}>
              {dayjs(value).format(formatDateTime)}
            </Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Người tạo',
      dataIndex: 'createdBy',
      width: 170,
      hidden: type === PageFilterEnum.CSKH,
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text style={{ color: isOverDate(record) ? 'red' : '#333' }}>
              {value}
            </Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'BO duyệt',
      dataIndex: 'approvalDepartment',
      width: 170,
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text style={{ color: isOverDate(record) ? 'red' : '#333' }}>
              {value}
            </Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Phòng ban xử lý ',
      dataIndex: 'departmentCode',
      width: 170,
      render(value, record) {
        const val =
          INTERNAL_DEPARTMENT?.find((e) => e.code === value)?.label || value;
        return (
          <Tooltip title={val} placement="topLeft">
            <Text style={{ color: isOverDate(record) ? 'red' : '#333' }}>
              {val}
            </Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Người xử lý',
      dataIndex: 'processor',
      width: 170,
      render(value, record) {
        const processor = value ?? record.processorDepartment;
        return (
          <Tooltip title={processor} placement="topLeft">
            <Text style={{ color: isOverDate(record) ? 'red' : '#333' }}>
              {processor}
            </Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Số lần phản ánh',
      dataIndex: 'feedbackCount',
      width: 130,
      render(value) {
        return (
          <Tooltip title={value} placement="topLeft">
            {value}
          </Tooltip>
        );
      },
    },
    {
      title: 'Độ ưu tiên',
      dataIndex: 'priorityLevel',
      width: 100,
      fixed: 'right',
      render(value, record) {
        const priorityName = FeedbackPriorityList.find(
          (e) => e.value === value
        )?.label;
        return (
          <Tooltip title={priorityName} placement="topLeft">
            <Text
              style={{
                color: isOverDate(record) ? 'red' : '#333',
                ...getPriorityStyles(record?.priorityLevel as any),
              }}
            >
              {priorityName}
            </Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Thao tác',
      width: 130,
      fixed: 'right',
      align: 'center',
      render(value, record) {
        return (
          <ButtonWrapper
            style={{ alignItems: 'center', justifyContent: 'center' }}
          >
            <Button type="default" onClick={() => handleDetail(record)}>
              Chi tiết
            </Button>
            {more(record) as any}
          </ButtonWrapper>
        );
      },
    },
  ];
};

export const mapChildren = (arr: any[] | undefined, parent: any) => {
  if (!arr) return;
  const newArr = arr
    ?.filter(
      (item) =>
        item.parentId === parent ||
        (!arr?.some((val: any) => val.id === item.parentId) && parent === null)
    )
    ?.reduce((acc, item) => {
      acc.push({ ...item, children: mapChildren(arr, item.id) });
      return acc;
    }, []);
  return newArr?.length > 0 ? newArr : undefined;
};

export const feedbackTypeToTreeData = (
  arr: IFeedbackType[],
  isDisableByLevel = false,
  isShowHierarchy = false
) => {
  if (!arr) return;
  return arr?.map((e) => {
    let titleCalc = e.typeName;
    const getPrefixTitle = (
      arr: IFeedbackType[],
      parentId: number,
      title: string
    ) => {
      const parentItem = arr.find((e) => e.id === parentId);
      const parentTitle = parentItem?.typeName;
      titleCalc = parentTitle ? `${parentTitle} / ${title}` : title;
      if (!parentItem?.parentId || !parentTitle) return;
      getPrefixTitle(arr, parentItem?.parentId, titleCalc);
    };
    if (e?.level === 4 && isShowHierarchy) {
      getPrefixTitle(arr, e.parentId, e.typeName);
    }
    return {
      ...e,
      value: e.id,
      title: titleCalc,
      disabled: isDisableByLevel ? e?.level != 4 : false,
    };
  });
};

export const LIST_PRIORITY_STATUS: { label: string; value: string }[] = [
  {
    label: 'Khẩn cấp',
    value: PriorityEnum.URGENT,
  },
  {
    label: 'Bình thường',
    value: PriorityEnum.NORMAL,
  },
];

export const LIST_STATUS: { label: string; value: string }[] = [
  {
    label: 'Chờ duyệt',
    value: StatusEnum.APPROVING,
  },
  {
    label: 'Chờ xử lý',
    value: StatusEnum.PENDING,
  },
  {
    label: 'Đang xử lý',
    value: StatusEnum.PROCESSING,
  },
  {
    label: 'Đã xử lý',
    value: StatusEnum.PROCESSED,
  },
  {
    label: 'Đã đóng',
    value: StatusEnum.CLOSED,
  },
  {
    label: 'Đã hủy',
    value: StatusEnum.CANCELED,
  },
  {
    label: 'Không duyệt',
    value: StatusEnum.NOT_APPROVED,
  },
  {
    label: 'Từ chối',
    value: StatusEnum.REJECTED,
  },
  {
    label: 'Xử lý lại',
    value: StatusEnum.REPROCESS,
  },
];

export const LIST_STATUS_BO: { label: string; value: string }[] = [
  {
    label: 'Chờ duyệt',
    value: StatusEnum.APPROVING,
  },
  {
    label: 'Chờ xử lý',
    value: StatusEnum.PENDING,
  },
  {
    label: 'Đang xử lý',
    value: StatusEnum.PROCESSING,
  },
  {
    label: 'Đã xử lý',
    value: StatusEnum.PROCESSED,
  },
  {
    label: 'Đã đóng',
    value: StatusEnum.CLOSED,
  },
  {
    label: 'Đã hủy',
    value: StatusEnum.CANCELED,
  },
  {
    label: 'Không duyệt',
    value: StatusEnum.NOT_APPROVED,
  },
  {
    label: 'Từ chối',
    value: StatusEnum.REJECTED,
  },
  {
    label: 'Xử lý lại',
    value: StatusEnum.REPROCESS,
  },
];

export const LIST_STATUS_ASSIGNED: { label: string; value: string }[] = [
  {
    label: 'Chờ xử lý',
    value: StatusEnum.PENDING,
  },
  {
    label: 'Từ chối',
    value: StatusEnum.REJECTED,
  },
  {
    label: 'Đang xử lý',
    value: StatusEnum.PROCESSING,
  },
  {
    label: 'Đã xử lý',
    value: StatusEnum.PROCESSED,
  },
  {
    label: 'Đã đóng',
    value: StatusEnum.CLOSED,
  },
  {
    label: 'Xử lý lại',
    value: StatusEnum.REPROCESS,
  },
];
export const collumnActionImpact: TableProps['columns'] = [
  {
    title: 'STT',
    align: 'left',
    width: 50,
    render(_, record, index) {
      return <Text>{index + 1}</Text>;
    },
  },
  {
    title: 'User tác động',
    dataIndex: 'actionUser',
    width: 200,
    render(value, record) {
      return (
        <Tooltip title={value} placement="topLeft">
          <Text>{value}</Text>
        </Tooltip>
      );
    },
  },
  {
    title: 'Thời gian',
    dataIndex: 'actionTime',
    width: 200,
    render(value, record) {
      return (
        <Tooltip
          title={getDate(value, DateFormat.DATE_TIME)}
          placement="topLeft"
        >
          <Text>{getDate(value, DateFormat.DATE_TIME)}</Text>
        </Tooltip>
      );
    },
  },
  {
    title: 'Loại tác động',
    dataIndex: 'actionContent',
    width: 200,
    render(value, record) {
      return (
        <Tooltip title={value} placement="topLeft">
          <Text>{value}</Text>
        </Tooltip>
      );
    },
  },
  {
    title: 'Ghi chú tác động/lý do',
    dataIndex: 'note',
    width: 200,
    render(value, record) {
      return (
        <Tooltip title={value} placement="topLeft">
          <Text>{value}</Text>
        </Tooltip>
      );
    },
  },
];

export const isAdd = (path: string) => {
  return includes(path, 'add');
};

export const isEdit = (path: string) => {
  return includes(path, 'edit');
};

export const isView = (path: string) => {
  return includes(path, 'view');
};

export const isCSKH = (path: string) => {
  return includes(path, pathRoutes.feedbackCSKH);
};

export const isBO = (path: string) => {
  return includes(path, pathRoutes.feedbackBO);
};

export const isAssigned = (path: string) => {
  return includes(path, pathRoutes.feedbackAssigned);
};

export const getListStatus = (type: PageFilterEnum) => {
  switch (type) {
    case PageFilterEnum.ASSIGNED:
      return LIST_STATUS_ASSIGNED;
    case PageFilterEnum.BO:
      return LIST_STATUS_BO;
    default:
      return LIST_STATUS;
  }
};

export const isShowEditBtn = (feedbackRequestResponseDTO: IFeedback) => {
  return (
    feedbackRequestResponseDTO?.status === undefined ||
    [
      StatusEnum.APPROVING,
      StatusEnum.PROCESSING,
      StatusEnum.PENDING,
      StatusEnum.PROCESSED,
      StatusEnum.REPROCESS,
      StatusEnum.REJECTED,
      StatusEnum.NOT_APPROVED,
    ].includes(feedbackRequestResponseDTO?.status as any)
  );
};

export const isShowCancelBtn = (
  feedbackRequestResponseDTO: IFeedback,
  type?: PageFilterEnum
) => {
  if (type === PageFilterEnum.BO) {
    return (
      feedbackRequestResponseDTO?.status === undefined ||
      [
        StatusEnum.APPROVING,
        StatusEnum.PENDING,
        StatusEnum.PROCESSING,
        StatusEnum.REJECTED,
      ].includes(feedbackRequestResponseDTO?.status as any)
    );
  }
  return (
    feedbackRequestResponseDTO?.status === undefined ||
    [StatusEnum.APPROVING, StatusEnum.NOT_APPROVED].includes(
      feedbackRequestResponseDTO?.status as any
    )
  );
};

export const getQuerySearch = (type: PageFilterEnum) => {
  switch (type) {
    case PageFilterEnum.CSKH:
      return REACT_QUERY_KEYS.SEARCH_FEEDBACK_CSKH;
    case PageFilterEnum.BO:
      return REACT_QUERY_KEYS.SEARCH_FEEDBACK_BO;
    case PageFilterEnum.ASSIGNED:
      return REACT_QUERY_KEYS.SEARCH_FEEDBACK_ASSIGN;
  }
};
