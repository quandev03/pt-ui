import { CButtonDetail } from '@react/commons/Button';
import { CStep, CTable, CTag, CTooltip } from '@react/commons/index';
import { Text, WrapperActionTable } from '@react/commons/Template/style';
import { DateFormat } from '@react/constants/app';
import { CurrentStatusList, LastStatusList } from '@react/constants/status';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import { getDate, toLocalString } from '@react/utils/datetime';
import { getCurrentStatusColor, getLastStatusColor } from '@react/utils/status';
import { Dropdown, MenuProps, Popover, TableColumnsType } from 'antd';
import { ReactComponent as IconMore } from 'apps/Internal/src/assets/images/IconMore.svg';
import {
  IUserInfo,
  ParamsOption,
} from 'apps/Internal/src/components/layouts/types';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import dayjs from 'dayjs';
import { findLast } from 'lodash';
import { useMemo, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import ModalConfirm from '../components/ModalConfirm';
import ModalProcess from '../components/ModalProcess';
import { useHandleApproval } from '../hooks/useHandleApproval';
import { useListApproval } from '../hooks/useListApproval';
import { useViewProcess } from '../hooks/useViewProcess';
import { ApprovalStatus, ApprovalType, ProcessUnitType } from '../types';

const ProcessUnit = ({ data }: { data: ProcessUnitType }) => {
  return (
    <Popover
      placement="bottom"
      content={
        <div>
          <div>{`Người duyệt: ${
            data.mandatorUserName ?? data.approvedUserName ?? ''
          }`}</div>
          <div>{`Ngày duyệt: ${getDate(
            data.approvedDate,
            DateFormat.DATE_TIME
          )}`}</div>
        </div>
      }
    >
      <div
        style={{
          background: getCurrentStatusColor(data.status, true),
        }}
        className="w-[24px] h-[24px] rounded-full flex justify-center items-center"
      >
        <div className="text-sm text-white">{data.stepOrder}</div>
      </div>
    </Popover>
  );
};

const ApprovalPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams({
    fromDate: toLocalString(dayjs().subtract(29, 'd').startOf('d')),
    toDate: toLocalString(dayjs().endOf('d')),
  });
  const params = decodeSearchParams(searchParams);
  const { page, size } = params;
  const currentUser = useGetDataFromQueryKey<IUserInfo>([
    REACT_QUERY_KEYS.GET_PROFILE,
  ]);
  const [isOpenConfirm, setIsOpenConfirm] = useState<boolean>(false);
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [isOpenProcess, setIsOpenProcess] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<ApprovalType>();
  const { data, isFetching: isLoadingList } = useListApproval(
    queryParams(params)
  );
  const { mutate: mutateApproval } = useHandleApproval();
  const { mutate: mutateViewProcess, data: dataProcess } = useViewProcess();
  const { APPROVAL_HISTORY_STEP_STATUS = [], APPROVAL_HISTORY_STATUS = [] } =
    useGetDataFromQueryKey<ParamsOption>([REACT_QUERY_KEYS.GET_PARAMS]);
  const setWidthSteps = useMemo(() => {
    const stepsLength = data?.content?.map((e) => e?.processSteps?.length);
    const maxSteps = Math.max(...(stepsLength ?? [3]));
    return maxSteps > 3 ? 72 * maxSteps : 200;
  }, [data]);
  const isHasMandator = (record: ApprovalType) => {
    const myProcessStep = record.processSteps?.find(
      (e) => e.approvedUserName === currentUser?.username
    );
    return myProcessStep?.mandatorUserId;
  };
  const handleApprove = (record: ApprovalType, status: ApprovalStatus) => {
    setIsApproved(!!status);
    setIsOpenConfirm(true);
    setSelectedRecord(record);
  };
  const handleView = (
    _: string,
    { recordId, objectName, processCode, id }: ApprovalType
  ) => {
    navigate(
      `${pathRoutes.approvalView(
        String(recordId)
      )}?object=${objectName}&approvalId=${id}&processCode=${processCode}`,
      { state: { redirectTo: location } }
    );
  };
  const handleProcess = (id: string) => {
    setIsOpenProcess(true);
    mutateViewProcess({ id });
  };
  const handleSubmitConfirm = (values: any, handleCancel: () => void) => {
    mutateApproval(
      {
        id: selectedRecord?.id,
        status: +isApproved,
        message: values.message,
      },
      { onSuccess: () => handleCancel() }
    );
  };
  const renderMenuItemsMore = (
    id: string,
    record: ApprovalType
  ): MenuProps['items'] => {
    return [
      {
        key: 1,
        label: <Text>Phê duyệt</Text>,
        onClick: () => handleApprove(record, ApprovalStatus.APPROVAl),
        hidden:
          record.currentStatus !== CurrentStatusList.PENDING ||
          record.lastStatus === LastStatusList.CANCEL ||
          isHasMandator(record),
      },
      {
        key: 2,
        label: <Text type="danger">Từ chối</Text>,
        onClick: () => handleApprove(record, ApprovalStatus.REFUSE),
        hidden:
          record.currentStatus !== CurrentStatusList.PENDING ||
          record.lastStatus === LastStatusList.CANCEL ||
          isHasMandator(record),
      },
      {
        key: 3,
        label: <Text>Tiến độ phê duyệt</Text>,
        onClick: () => handleProcess(id),
      },
    ].filter((e) => !e.hidden);
  };

  const columns: TableColumnsType<ApprovalType> = [
    {
      title: 'STT',
      dataIndex: 'stt',
      width: 50,
      fixed: 'left',
      render: (_, __, idx: number) => {
        return <div>{page * size + idx + 1}</div>;
      },
    },
    {
      title: 'Quy trình',
      dataIndex: 'processName',
      width: 160,
      render: (value: string) => {
        return <CTooltip title={value}>{value}</CTooltip>;
      },
    },
    {
      title: 'Nội dung',
      dataIndex: 'description',
      width: 160,
      render: (value: string) => {
        return <CTooltip title={value}>{value}</CTooltip>;
      },
    },
    {
      title: 'Thời gian duyệt',
      dataIndex: 'processSteps',
      width: 120,
      render: (steps: ProcessUnitType[] = []) => {
        const lastApprovedDate = findLast(
          steps,
          (e) => e.status !== CurrentStatusList.PENDING
        )?.approvedDate;
        return (
          <CTooltip title={getDate(lastApprovedDate)}>
            {getDate(lastApprovedDate)}
          </CTooltip>
        );
      },
    },
    {
      title: 'Thời gian tạo',
      dataIndex: 'timeRequest',
      width: 110,
      render: (value: string) => {
        return (
          <CTooltip title={getDate(value, DateFormat.DATE_TIME_NO_SECOND)}>
            {getDate(value)}
          </CTooltip>
        );
      },
    },
    {
      title: <span title="Trạng thái hiện tại">TT hiện tại</span>,
      dataIndex: 'currentStatus',
      width: 100,
      render: (value: number) => {
        const statusName = APPROVAL_HISTORY_STEP_STATUS.find(
          (e) => +e.value === value
        )?.label;
        return (
          <CTooltip title={statusName}>
            <CTag color={getCurrentStatusColor(value) as any}>
              {statusName}
            </CTag>
          </CTooltip>
        );
      },
    },
    {
      title: <span title="Trạng thái cuối cùng">TT cuối cùng</span>,
      dataIndex: 'lastStatus',
      width: 110,
      render: (value: number) => {
        const statusName = APPROVAL_HISTORY_STATUS.find(
          (e) => +e.value === value
        )?.label;
        return (
          <CTooltip title={statusName}>
            <CTag color={getLastStatusColor(value)}>{statusName}</CTag>
          </CTooltip>
        );
      },
    },
    {
      title: 'Tiến trình duyệt',
      dataIndex: 'processSteps',
      width: setWidthSteps,
      render: (value: ProcessUnitType[] = []) => {
        const items = value?.map((e) => ({
          key: e.id,
          icon: <ProcessUnit data={e} />,
          description: '',
        }));

        return (
          <CStep
            className="step-approval"
            current={0}
            items={items}
            size={'small'}
          />
        );
      },
    },
    {
      title: 'Thao tác',
      dataIndex: 'id',
      width: 140,
      align: 'center',
      fixed: 'right',
      render: (value, record) => (
        <WrapperActionTable>
          <CButtonDetail
            type="default"
            onClick={() => handleView(value, record)}
          />
          <Dropdown
            menu={{ items: renderMenuItemsMore(value, record) }}
            placement="bottom"
            trigger={['click']}
          >
            <IconMore className="cursor-pointer" />
          </Dropdown>
        </WrapperActionTable>
      ),
    },
  ];

  return (
    <>
      <Header />
      <CTable
        columns={columns}
        dataSource={data?.content ?? []}
        pagination={{
          current: +page + 1,
          pageSize: +size,
          total: data?.totalElements,
        }}
        loading={isLoadingList}
      />
      <ModalConfirm
        onSubmit={handleSubmitConfirm}
        isOpen={isOpenConfirm}
        setIsOpen={setIsOpenConfirm}
        isApproved={isApproved}
      />
      <ModalProcess
        data={dataProcess}
        isOpen={isOpenProcess}
        setIsOpen={setIsOpenProcess}
      />
    </>
  );
};

export default ApprovalPage;
