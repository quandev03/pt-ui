import { PlusOutlined } from '@ant-design/icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CButtonExport } from '@react/commons/Button';
import { CRangePicker } from '@react/commons/DatePicker';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import { CTooltip } from '@react/commons/index';
import CInput from '@react/commons/Input';
import {
  NotificationError,
  NotificationSuccess,
} from '@react/commons/Notification';
import CSelect from '@react/commons/Select';
import { BtnGroupFooter } from '@react/commons/Template/style';
import { DateFormat } from '@react/constants/app';
import { formatDate } from '@react/constants/moment';
import { decodeSearchParams } from '@react/helpers/utils';
import useSearchHandler from '@react/hooks/useSearchHandler';
import { useQueryClient } from '@tanstack/react-query';
import { Button, Col, Form, Modal, Row, Spin, Tooltip, TreeSelect } from 'antd';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import dayjs from 'dayjs';
import { compact } from 'lodash';
import { FC, useCallback, useEffect, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useGetDepartments } from '../../UserManagement/queryHooks';
import {
  feedbackTypeToTreeData,
  getListStatus,
  getQuerySearch,
  LIST_PRIORITY_STATUS,
  mapChildren,
} from '../constants';
import { ButtonWrapper } from '../page/styles';
import {
  useAcceptFeedback,
  useActiveUsers,
  useListPriority,
  useListPriorityById,
  useUserDepartmentCode,
} from '../queryHooks';
import useFeedbackStore from '../store';
import { PageFilterEnum, StatusEnum } from '../types';

interface IProps {
  type: PageFilterEnum;
  onExport?: () => void;
  spinning?: any;
}

export const FilterAction: FC<IProps> = ({ type, onExport, spinning }) => {
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const [form] = Form.useForm();
  const { data: USERS = [] } = useActiveUsers({ status: 1 });
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const {
    selectedKeys,
    setOpenDepartmentModal,
    setOpenReasonModal,
    setOpenProgressModal,
    setListPriority,
    selectedFeedback,
    setSelectedKeys,
  } = useFeedbackStore();
  const departmentCode = useUserDepartmentCode();
  const { mutate: getPriorityById } = useListPriorityById((data: any[]) => {
    setListPriority(data);
  });
  const { data: INTERNAL_DEPARTMENT = [], isFetching: isLoadingDepartment } =
    useGetDepartments();
  const client = useQueryClient();
  const { data: feedbackTypes, isFetching: isLoadingFeedbackType } =
    useListPriority();
  const { mutate: acceptFeedback, isPending: isPendingAcceptFeedback } =
    useAcceptFeedback((data) => {
      NotificationSuccess(data.message, 5000);
      setOpenReasonModal(false, []);
      setSelectedKeys([]);
      client.invalidateQueries({
        queryKey: [getQuerySearch(type)],
      });
    });

  useEffect(() => {
    getPriorityById({});
  }, []);

  useEffect(() => {
    const {
      fromDate,
      toDate,
      feedbackTypeId,
      departmentCode,
      status,
      ...restParams
    } = params;
    form.setFieldsValue({
      ...restParams,
      createdDate:
        fromDate && toDate
          ? [
            dayjs(fromDate, DateFormat.DEFAULT),
            dayjs(toDate, DateFormat.DEFAULT),
          ]
          : [dayjs().subtract(29, 'd'), dayjs()],
      feedbackTypeId: compact(feedbackTypeId?.split(','))?.map((x: any) => +x),
      status: status ? String(status) : undefined,
    });
  }, [JSON.stringify(params)]);

  const departmentOptions = useMemo(() => {
    return INTERNAL_DEPARTMENT.map((e) => ({ ...e, value: e.code }));
  }, [isLoadingDepartment]);

  const handleAcceptFeedback = () => {
    if (!checkFeedbackStatus([StatusEnum.PENDING, StatusEnum.REPROCESS])) {
      return NotificationError(
        'Chỉ được chọn các phản ánh đang có trạng thái là Chờ xử lý, xử lý lại'
      );
    }
    acceptFeedback({
      feedbackIds: selectedKeys as any[],
      departmentCode: departmentCode,
    });
  };

  const validateDateRange = () => {
    const [start, end] = form.getFieldValue('createdDate');
    const diffInDays = end.diff(start, 'days');
    if (diffInDays > 180) {
      return Promise.reject(new Error('Thời gian tìm kiếm tối đa là 6 tháng'));
    }
    return Promise.resolve();
  };

  const validateFeedbackDateExpire = () => {
    if (form.getFieldValue('feedbackDateExpire')) {
      const [start, end] = form.getFieldValue('feedbackDateExpire');

      const diffInDays = end.diff(start, 'days');
      if (diffInDays > 180) {
        return Promise.reject(
          new Error('Thời gian tìm kiếm tối đa là 6 tháng')
        );
      }
    }
    return Promise.resolve();
  };

  const getBaseFeedbackType = useMemo(() => {
    return mapChildren(feedbackTypeToTreeData(feedbackTypes || []), null);
  }, [isLoadingFeedbackType]);

  const items: ItemFilter[] = [
    {
      label: 'Loại phản ánh',
      value: (
        <Form.Item label="" name="feedbackTypeId" className="w-72">
          <TreeSelect
            showSearch
            style={{ width: '100%' }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder="Loại phản ánh"
            allowClear
            treeData={getBaseFeedbackType}
            treeNodeFilterProp="title"
            multiple
            maxTagCount={5}
            maxTagPlaceholder={(omittedValues) => (
              <Tooltip
                overlayStyle={{ pointerEvents: 'none' }}
                title={omittedValues.map(({ label }) => label).join(', ')}
              >
                <span>...</span>
              </Tooltip>
            )}
          // onChange={handleChangeFeedbackType}
          />
        </Form.Item>
      ),
    },
    {
      label: 'Độ ưu tiên',
      value: (
        <Form.Item label="" name="priorityLevel" className="w-40">
          <CSelect
            options={LIST_PRIORITY_STATUS}
            showSearch={false}
            placeholder="Độ ưu tiên"
          />
        </Form.Item>
      ),
    },
    {
      label: 'Phòng ban xử lý phản ánh',
      value: (
        <Form.Item label="" name="departmentCode" className="w-56">
          <CSelect
            options={departmentOptions}
            showSearch={false}
            placeholder="Phòng ban xử lý phản ánh"
            isLoading={isLoadingDepartment}
          />
        </Form.Item>
      ),
    },
    {
      label: 'Trạng thái',
      value: (
        <Form.Item label="" name="status" className="w-40">
          <CSelect options={getListStatus(type)} placeholder="Trạng thái" />
        </Form.Item>
      ),
    },
    {
      label: 'Ngày tạo',
      showDefault: true,
      value: (
        <Form.Item
          label=""
          name="createdDate"
          rules={[{ validator: validateDateRange }]}
        >
          <CRangePicker
            format={formatDate}
            className="!w-[268px]"
            allowClear={false}
          />
        </Form.Item>
      ),
    },
    // {
    //   label: 'Thời hạn phản ánh',
    //   value: (
    //     <ButtonWrapper style={{ alignItems: 'center' }}>
    //       <Form.Item
    //         label="Thời hạn phản ánh"
    //         name="feedbackDateExpire"
    //         rules={[{ validator: validateFeedbackDateExpire }]}
    //         initialValue={[dayjs().subtract(29, 'd'), dayjs()]}
    //       >
    //         <CRangePicker className="!w-[268px]" format={formatDate} />
    //       </Form.Item>
    //     </ButtonWrapper>
    //   ),
    // },
    {
      label: 'BO duyệt',
      value: (
        <Form.Item label="" name="approvalDepartment" className="w-72">
          <CSelect
            options={USERS?.map((e) => ({
              label: e?.username,
              value: e.email ?? e?.username,
            }))}
            placeholder="BO duyệt"
          />
        </Form.Item>
      ),
    },
  ];

  const { handleSearch } = useSearchHandler(getQuerySearch(type));

  const onSearch = (values: any) => {
    if (values?.feedbackDateExpire) {
      values.fromFeedbackDate = dayjs(values?.feedbackDateExpire[0]).format(
        formatDate
      );
      values.toFeedbackDate = dayjs(values?.feedbackDateExpire[1]).format(
        formatDate
      );
      delete values.feedbackDateExpire;
    }
    if (values?.createdDate) {
      values.fromDate = dayjs(values?.createdDate[0]).format(formatDate);
      values.toDate = dayjs(values?.createdDate[1]).format(formatDate);
      delete values.createdDate;
    }
    handleSearch(values);
  };

  const handleAdd = useCallback(() => {
    navigate(pathRoutes.feedbackRouteAdd(pathname));
  }, []);

  const checkFeedbackStatus = (acceptStatus: StatusEnum[]) => {
    const rs = selectedFeedback?.every((feedback) =>
      acceptStatus?.includes(feedback?.status as any)
    );
    return rs;
  };

  const handleBOApprove = () => {
    if (!checkFeedbackStatus([StatusEnum.APPROVING])) {
      return NotificationError(
        'Chỉ được chọn các phản ánh đang có trạng thái là chờ duyệt'
      );
    }
    setOpenDepartmentModal(true, selectedKeys as string[]);
  };

  const handleCancel = () => {
    if (
      !checkFeedbackStatus([
        StatusEnum.APPROVING,
        StatusEnum.PENDING,
        StatusEnum.PROCESSING,
        StatusEnum.REJECTED,
      ])
    ) {
      return NotificationError(
        'Chỉ được chọn các phản ánh đang có trạng thái là chờ duyệt, chờ xử lý, đang xử lý, từ chối'
      );
    }
    setOpenReasonModal(true, selectedKeys as number[], 'cancel');
  };

  const handleReject = (isDepartment = false) => {
    if (!checkFeedbackStatus([StatusEnum.APPROVING]) && !isDepartment) {
      return NotificationError(
        'Chỉ được chọn các phản ánh đang có trạng thái là chờ duyệt'
      );
    }
    if (!checkFeedbackStatus([StatusEnum.PENDING]) && isDepartment) {
      return NotificationError(
        'Chỉ được chọn các phản ánh đang có trạng thái là chờ xử lý'
      );
    }
    setOpenReasonModal(true, selectedKeys as number[], 'reject');
  };

  const handleClose = () => {
    if (checkFeedbackStatus([StatusEnum.CANCELED, StatusEnum.CLOSED])) {
      return NotificationError(
        'Không được chọn các phản ánh đang có trạng thái là hủy hoặc đã đóng'
      );
    }
    setOpenReasonModal(true, selectedKeys as number[], 'close');
  };

  const handleOpen = () => {
    if (!checkFeedbackStatus([StatusEnum.PROCESSED])) {
      return NotificationError(
        'Chỉ được chọn các phản ánh đang có trạng thái là đã xử lý'
      );
    }
    setOpenReasonModal(true, selectedKeys as number[], 'open');
  };

  return (
    <div>
      <Spin spinning={spinning ? spinning : null}>
        <Form form={form} onFinish={onSearch} colon={false}>
          <Row gutter={8}>
            <Col>
              <CFilter
                items={items}
                searchComponent={
                  <CTooltip
                    title="Tìm kiếm theo ID hoặc số thuê bao phản ánh"
                    placement="right"
                  >
                    <Form.Item label="" name="searchText">
                      <CInput
                        maxLength={100}
                        placeholder="Tìm kiếm theo ID hoặc số thuê bao phản ánh"
                        prefix={<FontAwesomeIcon icon={faSearch} />}
                      />
                    </Form.Item>
                  </CTooltip>
                }
              />
            </Col>
            <BtnGroupFooter>
              {type === PageFilterEnum.BO && (
                <>
                  <Button
                    disabled={!selectedKeys.length}
                    type="primary"
                    onClick={handleBOApprove}
                  >
                    Duyệt
                  </Button>
                  <Button
                    disabled={!selectedKeys.length}
                    color="danger"
                    variant="solid"
                    onClick={() => handleReject()}
                  >
                    Từ chối
                  </Button>
                  <Button
                    disabled={!selectedKeys.length}
                    type="primary"
                    onClick={handleClose}
                  >
                    Đóng phản ánh
                  </Button>
                  <Button
                    disabled={!selectedKeys.length}
                    type="primary"
                    onClick={handleOpen}
                  >
                    Mở lại
                  </Button>
                  <Button
                    disabled={!selectedKeys.length}
                    color="default"
                    variant="solid"
                    onClick={handleCancel}
                  >
                    Hủy phản ánh
                  </Button>
                </>
              )}
              {type === PageFilterEnum.ASSIGNED && (
                <>
                  <Button
                    loading={isPendingAcceptFeedback}
                    disabled={!selectedKeys.length}
                    type="primary"
                    onClick={handleAcceptFeedback}
                  >
                    Tiếp nhận
                  </Button>
                  <Button
                    disabled={!selectedKeys.length}
                    color="default"
                    variant="solid"
                    onClick={() => {
                      if (
                        !checkFeedbackStatus([
                          StatusEnum.PROCESSING,
                          StatusEnum.PENDING,
                          StatusEnum.REPROCESS,
                        ])
                      ) {
                        return NotificationError(
                          'Chỉ được chọn các phản ánh đang có trạng thái là Chờ xử lý, Đang xử lý, Xử lý lại'
                        );
                      }
                      setOpenProgressModal(true, selectedKeys as any[]);
                    }}
                  >
                    Đã xử lý
                  </Button>
                  <Button
                    disabled={!selectedKeys.length}
                    color="danger"
                    variant="solid"
                    onClick={() => handleReject(true)}
                  >
                    Từ chối
                  </Button>
                </>
              )}
              {type !== PageFilterEnum.ASSIGNED && (
                <CButtonExport onClick={() => onExport && onExport()} />
              )}
              {type !== PageFilterEnum.ASSIGNED && (
                <Button
                  icon={<PlusOutlined />}
                  type="primary"
                  onClick={handleAdd}
                >
                  <FormattedMessage id="common.add" />
                </Button>
              )}
            </BtnGroupFooter>
          </Row>
        </Form>
      </Spin>
    </div>
  );
};
