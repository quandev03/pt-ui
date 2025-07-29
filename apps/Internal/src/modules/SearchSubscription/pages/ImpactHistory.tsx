import CTable from '@react/commons/Table';
import HeaderImpactHistory from '../components/HeaderImpactHistory';
import { useImpactHistoryQuery } from '../hooks/useImpactHistoryQuery';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Row, TableProps, Tooltip } from 'antd';
import { ImpactHistory, ImpactType } from '../types';
import { CButtonClose, CButtonDetail } from '@react/commons/Button';
import dayjs from 'dayjs';
import { DateFormat } from '@react/constants/app';
import { Text, Wrapper } from '@react/commons/Template/style';
import { useState } from 'react';
import InformationChangeModal, {
  ModalType,
} from '../components/InformationChangeModal';
import useSubscriptionStore from '../store';
import { useGetApplicationConfig } from 'apps/Internal/src/hooks/useGetApplicationConfig';
import { getDate } from '@react/utils/datetime';

const ImpactHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const [isOpenInfoChange, setIsOpenInfoChange] = useState(false);
  const [modalType, setModalType] = useState(ModalType.censor);
  const { setHistoryId } = useSubscriptionStore();

  const { data: impactTypeData = [] } = useGetApplicationConfig('SUB_ACTION');
  const { isFetching, data } = useImpactHistoryQuery(
    id ?? '',
    queryParams({
      ...params,
      fromDate:
        params.fromDate ?? dayjs().subtract(6, 'M').format(DateFormat.DEFAULT),
      toDate: params.toDate ?? dayjs().format(DateFormat.DEFAULT),
    })
  );

  const columns: TableProps<ImpactHistory>['columns'] = [
    {
      title: 'STT',
      align: 'center',
      fixed: 'left',
      width: 60,
      render: (_, __, index) => params.page * params.size + index + 1,
    },
    {
      title: 'Loại tác động',
      dataIndex: 'actionCode',
      width: 160,
      render: (value) => (
        <Tooltip title={value} placement="topLeft">
          <Text>
            {impactTypeData?.find((item) => item.code === value)?.name ?? ''}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: 'User thực hiện',
      dataIndex: 'actionUser',
      width: 160,
      render: (value) => (
        <Tooltip title={value} placement="topLeft">
          <Text>{value}</Text>
        </Tooltip>
      ),
    },
    {
      title: 'Ngày thực hiện',
      dataIndex: 'actionDate',
      width: 160,
      render: (value) => (
        <Tooltip
          title={getDate(value, DateFormat.DATE_TIME)}
          placement="topLeft"
        >
          <Text>{getDate(value, DateFormat.DATE_TIME)}</Text>
        </Tooltip>
      ),
    },
    {
      title: 'Lý do',
      width: 200,
      render: (_, { reasonName, reasonNote }) => (
        <Tooltip title={reasonNote ?? reasonName} placement="topLeft">
          <Text>{reasonNote ?? reasonName}</Text>
        </Tooltip>
      ),
    },
    {
      title: 'Mô tả',
      width: 220,
      render: (_, { actionCode, description }) => {
        const isOpenBlock = [
          ImpactType.OPEN_1_WAY,
          ImpactType.OPEN_2_WAY,
          ImpactType.BLOCK_1_WAY,
          ImpactType.BLOCK_2_WAY,
        ].includes(actionCode);

        return (
          <Tooltip title={description} placement="topLeft">
            <Text>
              {isOpenBlock
                ? description
                  ? 'Thực hiện gửi tin nhắn'
                  : 'Không thực hiện gửi tin nhắn'
                : description}
            </Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Thao tác',
      align: 'center',
      fixed: 'right',
      width: 140,
      render: ({ id, actionCode }) =>
        (actionCode === ImpactType.APPROVE ||
          actionCode === ImpactType.OWNERSHIP_TRANSFER ||
          actionCode === ImpactType.CHANGE_INFO) && (
          <CButtonDetail
            onClick={() => {
              if (actionCode === ImpactType.APPROVE) {
                setModalType(ModalType.censor);
              }
              if (actionCode === ImpactType.OWNERSHIP_TRANSFER) {
                setModalType(ModalType.ownershipTransfer);
              }
              if (actionCode === ImpactType.CHANGE_INFO) {
                setModalType(ModalType.changeInformation);
              }

              setIsOpenInfoChange(true);
              setHistoryId(id);
            }}
          />
        ),
    },
  ];

  return (
    <Wrapper>
      <HeaderImpactHistory />
      <CTable
        rowKey="id"
        columns={columns}
        dataSource={data?.content}
        loading={isFetching}
        otherHeight={50}
        pagination={{
          current: params.page + 1,
          pageSize: params.size,
          total: data?.totalElements,
          onChange: (page, pageSize) =>
            setSearchParams(
              {
                ...params,
                page: page - 1,
                size: pageSize,
              },
              { replace: true }
            ),
        }}
      />
      <Row justify="end" className={data?.totalElements ? '' : 'mt-5'}>
        <CButtonClose onClick={() => navigate(-1)} />
      </Row>
      <InformationChangeModal
        isOpen={isOpenInfoChange}
        setIsOpen={setIsOpenInfoChange}
        type={modalType}
      />
    </Wrapper>
  );
};

export default ImpactHistoryPage;
