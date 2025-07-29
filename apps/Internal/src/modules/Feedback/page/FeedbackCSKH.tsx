import { Wrapper } from './styles';
import { Text, TitleHeader } from '@react/commons/Template/style';
import { FilterAction } from '../components/FilterAction';
import { Dropdown, Row } from 'antd';
import { CTable, NotificationSuccess } from '@react/commons/index';
import { getCollumnTable, isOverDate } from '../constants';
import {
  FeedbackDestinationEnum,
  IFeedback,
  PageFilterEnum,
  StatusEnum,
} from '../types';
import {
  useCancelFeedback,
  useExportMutationCSKH,
  useListFeedbackCSKH,
  useSendEmailFeedback,
} from '../queryHooks';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import { ReactComponent as IconMore } from 'apps/Internal/src/assets/images/IconMore.svg';
import { ActionsTypeEnum, DateFormat } from '@react/constants/app';
import useFeedbackStore from '../store';
import { useQueryClient } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import ReasonModal from '../components/ReasonModal';
import { useGetDepartments } from '../../UserManagement/queryHooks';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import dayjs from 'dayjs';

/**
 * @author
 * @function @FeedbackCSKH
 **/

const FeedbackCSKH = () => {
  const [searchParams] = useSearchParams({
    fromDate: dayjs().subtract(29, 'd').format(DateFormat.DEFAULT),
    toDate: dayjs().format(DateFormat.DEFAULT),
  });
  const params = decodeSearchParams(searchParams);
  const { page, size } = params;
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { isOpenReasonModal, setOpenReasonModal } = useFeedbackStore();
  const { data: INTERNAL_DEPARTMENT = [] } = useGetDepartments();
  const { data, isFetching } = useListFeedbackCSKH(queryParams(params));
  const client = useQueryClient();
  const { mutate: downloadFile } = useExportMutationCSKH();
  const { mutate: cancelFeedback, isPending: confirmLoading } =
    useCancelFeedback(() => {
      NotificationSuccess('Hủy phản ánh thành công');
      client.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.SEARCH_FEEDBACK_CSKH],
      });
      setOpenReasonModal(false, []);
    });

  const handleDetail = (record: IFeedback) => {
    navigate(pathRoutes.feedbackRouteView(pathname, record.id.toString()));
  };
  const { mutate: sendMail } = useSendEmailFeedback(() => {
    NotificationSuccess('Gửi mail nhắc nhở thành công');
  });
  const handleExport = () => {
    downloadFile({ params, fileName: 'Danh_sach_yeu_cau_CSKH' });
  };

  const handleSubmitCancel = (
    values: { reason: string; description?: string },
    ids: number[]
  ) => {
    cancelFeedback({
      feedbackIds: ids,
      departmentCode: null,
      note: values?.description,
      reasonCode: values?.reason,
      isBO: false,
    });
  };

  const handleCancel = (record: IFeedback) => {
    setOpenReasonModal(true, [record.id], 'cancel');
  };

  const items = (record: IFeedback) =>
    [
      {
        key: ActionsTypeEnum.UPDATE,
        onClick: () => {
          navigate(
            pathRoutes.feedbackRouteEdit(pathname, record.id.toString())
          );
        },
        label: <Text>Chỉnh sửa/Tích tăng</Text>,
        isShow: ![StatusEnum.CLOSED, StatusEnum.CANCELED].includes(
          record?.status as StatusEnum
        ),
      },
      {
        key: ActionsTypeEnum.SEND_MAIL,
        onClick: () => {
          sendMail({
            type: FeedbackDestinationEnum.APPROVE,
            id: record.id,
          });
        },
        label: <Text>Gửi mail nhắc nhở</Text>,
        isShow:
          isOverDate(record) &&
          [StatusEnum.APPROVING].includes(record?.status as StatusEnum),
      },
      {
        key: ActionsTypeEnum.CANCEL,
        onClick: () => handleCancel(record),
        label: <Text>Hủy phản ánh</Text>,
        isShow:
          record?.status === StatusEnum.APPROVING ||
          record?.status === StatusEnum.NOT_APPROVED,
      },
    ].filter((e) => e.isShow);

  return (
    <Wrapper id="wrapperFeedbackManager">
      <TitleHeader id="filterFeedbackManager">
        Danh sách yêu cầu phản ánh (CSKH)
      </TitleHeader>
      <div className="flex flex-col">
        <FilterAction type={PageFilterEnum.CSKH} onExport={handleExport} />
        <Row>
          <CTable
            columns={getCollumnTable({
              INTERNAL_DEPARTMENT,
              handleDetail,
              more: (record) => (
                <Dropdown
                  menu={{ items: items(record) }}
                  placement="bottom"
                  trigger={['click']}
                >
                  <IconMore className="iconMore" />
                </Dropdown>
              ),
              type: PageFilterEnum.CSKH,
            })}
            dataSource={data?.content || []}
            loading={isFetching}
            rowKey={'id'}
            pagination={{
              current: +page + 1,
              pageSize: +size,
              total: data?.numberOfElements || 0,
            }}
          />
        </Row>
      </div>
      {isOpenReasonModal && (
        <ReasonModal
          onSubmit={handleSubmitCancel}
          confirmLoading={confirmLoading}
        />
      )}
    </Wrapper>
  );
};

export default FeedbackCSKH;
