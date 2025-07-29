import React from 'react';
import Header from './Header';
import CTable from '@react/commons/Table';
import { Dropdown, MenuProps, Tooltip } from 'antd';
import { Text, WrapperActionTable } from '@react/commons/Template/style';
import { ColumnsType } from 'antd/es/table';
import { IDiscountManagement } from '../types';
import {
  useDeleteDiscount,
  useListDiscountManagement,
} from '../queryHook/useList';
import {
  formatDate,
  formatDateBe,
  formatDateTime,
  formatDateTimeHHmm,
} from '@react/constants/moment';
import dayjs from 'dayjs';
import { CButtonDetail } from '@react/commons/Button';
import { ReactComponent as IconMore } from 'apps/Internal/src/assets/images/IconMore.svg';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { ActionsTypeEnum, ActionType } from '@react/constants/app';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { CModalConfirm } from '@react/commons/index';
import { MESSAGE } from '@react/utils/message';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';

const Body: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { data: dataSerial, isLoading: loadingTable } =
    useListDiscountManagement(
      queryParams({
        ...params,
        // startDate:
        //   params.startDate ??
        //   dayjs().subtract(29, 'day').startOf('day').format(formatDateBe),
        // endDate: params.endDate ?? dayjs().endOf('day').format(formatDateBe),
      })
    );
  const { mutate: deleteDiscount } = useDeleteDiscount();

  const openModalEditView = (type: ActionType, record: IDiscountManagement) => {
    return navigate(
      type === ActionType.EDIT
        ? pathRoutes.discountEdit(record.id)
        : pathRoutes.discountView(record.id)
    );
  };

  const handleDeleteItem = (id: string | number) => {
    CModalConfirm({
      message: MESSAGE.G05,
      onOk: () => id && deleteDiscount(id),
    });
  };

  const renderMenuItemsMore = (
    record: IDiscountManagement
  ): MenuProps['items'] => {
    return [
      {
        key: ActionsTypeEnum.UPDATE,
        onClick: () => {
          openModalEditView(ActionType.EDIT, record);
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
          handleDeleteItem(record.id);
        },
        label: (
          <Text type="danger">
            <FormattedMessage id={'common.delete'} />
          </Text>
        ),
      },
    ];
  };

  const columns: ColumnsType<IDiscountManagement> = [
    {
      title: 'STT',
      align: 'left',
      fixed: 'left',
      width: 50,
      render(value, record, index) {
        return <Text>{index + 1 + params.page * params.size}</Text>;
      },
    },

    {
      title: 'Mã CTCK',
      dataIndex: 'discountCode',
      width: 110,
      align: 'left',
      render(value) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },

    {
      title: 'Tên CTCK',
      dataIndex: 'discountName',
      width: 150,
      align: 'left',
      render(value) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },

    {
      title: 'Thời gian bắt đầu',
      dataIndex: 'fromDate',
      width: 100,
      align: 'left',
      render(value) {
        const text = value ? dayjs(value).format(formatDate) : '';
        const tooltip = value ? dayjs(value).format(formatDateTimeHHmm) : '';
        return (
          <Tooltip title={tooltip} placement="topLeft">
            <Text>{text}</Text>
          </Tooltip>
        );
      },
    },

    {
      title: 'Thời gian kết thúc',
      dataIndex: 'toDate',
      width: 100,
      align: 'left',
      render(value) {
        const text = value ? dayjs(value).format(formatDate) : '';
        const tooltip = value ? dayjs(value).format(formatDateTimeHHmm) : '';
        return (
          <Tooltip title={tooltip} placement="topLeft">
            <Text>{text}</Text>
          </Tooltip>
        );
      },
    },

    {
      title: 'Người tạo',
      dataIndex: 'createdBy',
      width: 150,
      align: 'left',
      render(value) {
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
      render(value) {
        const text = value ? dayjs(value).format(formatDate) : '';
        const tooltip = value ? dayjs(value).format(formatDateTime) : '';
        return (
          <Tooltip title={tooltip} placement="topLeft">
            <Text>{text}</Text>
          </Tooltip>
        );
      },
    },

    {
      title: 'Người cập nhật',
      dataIndex: 'modifiedBy',
      width: 150,
      align: 'left',
      render(value) {
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
      render(value) {
        const text = value ? dayjs(value).format(formatDate) : '';
        const tooltip = value ? dayjs(value).format(formatDateTime) : '';
        return (
          <Tooltip title={tooltip} placement="topLeft">
            <Text>{text}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 110,
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
  return (
    <>
      <Header />
      <CTable
        loading={loadingTable}
        columns={columns}
        dataSource={dataSerial ? dataSerial.content : []}
        rowKey={'id'}
        pagination={{
          total: dataSerial?.totalElements,
        }}
      />
    </>
  );
};

export default Body;
