import { ColumnsType } from 'antd/es/table';
import { IAdvertisement } from '../../types';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  decodeSearchParams,
  IModeAction,
  RenderCell,
  usePermissions,
  Text,
  WrapperActionTable,
  formatDate,
  formatDateTime,
  ModalConfirm,
  CTag,
  CTooltip,
  TypeTagEnum,
} from '@vissoft-react/common';
import useConfigAppStore from '../../../Layouts/stores';
import { Dropdown, Tag } from 'antd';
import { MoreVertical } from 'lucide-react';
import dayjs from 'dayjs';
import { AdvertisementStatusMap, AdvertisementStatusOptions } from '../../constants/enum';
import { AdvertisementStatus } from '../../types';
import { useSupportDeleteAdvertisement } from '../../hooks';
import { pathRoutes } from '../../../../../src/routers';
import { baseApiUrl } from '../../../../../src/constants';

export const useColumnsAdvertisementList = (): ColumnsType<IAdvertisement> => {
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { menuData } = useConfigAppStore();
  const permission = usePermissions(menuData);
  const navigate = useNavigate();
  const { mutate: deleteAdvertisement } = useSupportDeleteAdvertisement();

  const handleAction = (action: IModeAction, record: IAdvertisement) => {
    switch (action) {
      case IModeAction.READ: {
        const to = pathRoutes.advertisementManagementView;
        if (typeof to === 'function') {
          navigate(to(record.id));
        }
        break;
      }
      case IModeAction.UPDATE: {
        const to = pathRoutes.advertisementManagementEdit;
        if (typeof to === 'function') {
          navigate(to(record.id));
        }
        break;
      }
      case IModeAction.DELETE:
        ModalConfirm({
          message: 'Bạn có chắc chắn muốn xóa quảng cáo này không?',
          handleConfirm: () => {
            deleteAdvertisement(record.id);
          },
        });
        break;
    }
  };

  const getStatusColor = (status: AdvertisementStatus) => {
    switch (status) {
      case AdvertisementStatus.ACTIVE:
        return 'green';
      case AdvertisementStatus.PUBLISHED:
        return 'blue';
      case AdvertisementStatus.INACTIVE:
        return 'red';
      case AdvertisementStatus.DRAFT:
        return 'orange';
      default:
        return 'default';
    }
  };

  const getStatusTypeTag = (status: AdvertisementStatus) => {
    switch (status) {
      case AdvertisementStatus.ACTIVE:
        return TypeTagEnum.SUCCESS;
      case AdvertisementStatus.PUBLISHED:
        return TypeTagEnum.INFO;
      case AdvertisementStatus.INACTIVE:
        return TypeTagEnum.ERROR;
      case AdvertisementStatus.DRAFT:
        return TypeTagEnum.WARNING;
      default:
        return TypeTagEnum.DEFAULT;
    }
  };

  return [
    {
      title: 'STT',
      align: 'left',
      width: 50,
      fixed: 'left',
      render(_, record, index) {
        const page = params.page || 0;
        const size = params.size || 10;
        const stt = index + 1 + page * size;
        return <RenderCell value={stt} tooltip={stt} />;
      },
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      width: 200,
      align: 'left',
      fixed: 'left',
      render(value, record) {
        return <RenderCell value={value} tooltip={value} />;
      },
    },
    {
      title: 'Nội dung',
      dataIndex: 'content',
      width: 300,
      align: 'left',
      render(value) {
        const truncated = value && value.length > 100 
          ? `${value.substring(0, 100)}...` 
          : value;
        return <RenderCell value={truncated} tooltip={value} />;
      },
    },
    {
      title: 'Ảnh',
      dataIndex: 'imageUrl',
      width: 120,
      align: 'center',
      render(value) {
        if (!value) return <RenderCell value="-" tooltip="-" />;
        const imageUrl = value.startsWith('http') 
          ? value 
          : `${baseApiUrl}/${value}`;
        return (
          <img
            src={imageUrl}
            alt="Advertisement"
            style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        );
      },
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'startDate',
      width: 150,
      align: 'left',
      render(value) {
        if (!value) return <RenderCell value="-" tooltip="-" />;
        return (
          <RenderCell
            value={dayjs(value).format(formatDate)}
            tooltip={dayjs(value).format(formatDateTime)}
          />
        );
      },
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'endDate',
      width: 150,
      align: 'left',
      render(value) {
        if (!value) return <RenderCell value="-" tooltip="-" />;
        return (
          <RenderCell
            value={dayjs(value).format(formatDate)}
            tooltip={dayjs(value).format(formatDateTime)}
          />
        );
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 150,
      align: 'center',
      render(value) {
        return (
          <CTooltip title={AdvertisementStatusMap[value as AdvertisementStatus]} placement="topLeft">
            <CTag type={getStatusTypeTag(value as AdvertisementStatus)}>
              {AdvertisementStatusMap[value as AdvertisementStatus] || '-'}
            </CTag>
          </CTooltip>
        );
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdDate',
      width: 150,
      align: 'left',
      render(value) {
        if (!value) return <RenderCell value="-" tooltip="-" />;
        return (
          <RenderCell
            value={dayjs(value).format(formatDate)}
            tooltip={dayjs(value).format(formatDateTime)}
          />
        );
      },
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 150,
      fixed: 'right',
      render(_, record) {
        const items = [
          {
            key: IModeAction.UPDATE,
            onClick: () => {
              handleAction(IModeAction.UPDATE, record);
            },
            label: <Text>Sửa</Text>,
          },
          {
            key: IModeAction.DELETE,
            onClick: () => {
              handleAction(IModeAction.DELETE, record);
            },
            label: <Text>Xóa</Text>,
          },
        ].filter((item) => permission.getAllPermissions().includes(item.key));

        return (
          <WrapperActionTable>
            {permission.canRead && (
              <Text
                onClick={() => {
                  handleAction(IModeAction.READ, record);
                }}
                className="cursor-pointer text-blue-600 hover:text-blue-800"
              >
                Xem
              </Text>
            )}
            <div className="w-5">
              {(permission.canUpdate || permission.canDelete) && (
                <Dropdown
                  menu={{ items: items }}
                  placement="bottom"
                  trigger={['click']}
                >
                  <MoreVertical size={16} className="cursor-pointer" />
                </Dropdown>
              )}
            </div>
          </WrapperActionTable>
        );
      },
    },
  ];
};

