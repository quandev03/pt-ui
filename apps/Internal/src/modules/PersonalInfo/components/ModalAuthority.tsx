import { faMinus, faPlus, faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CButtonClose } from '@react/commons/Button';
import {
  Button,
  CDatePicker,
  CModal,
  CSelect,
  CTable,
} from '@react/commons/index';
import { DateFormat } from '@react/constants/app';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import {
  disabledBetweenDate,
  disabledBetweenPlusDate,
  disabledBetweenPlusTime,
  disabledBetweenTime,
  disabledFromDate,
  disabledFromTime,
  disabledToDate,
  disabledToTime,
  toLocalISOString,
} from '@react/utils/datetime';
import validateForm from '@react/utils/validator';
import { Col, Flex, Form, FormListOperation, Row } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { IUserInfo } from 'apps/Internal/src/components/layouts/types';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { useGetAllUser } from 'apps/Internal/src/hooks/useGetAllUser';
import { useParameterQuery } from 'apps/Internal/src/hooks/useParameterQuery';
import dayjs, { Dayjs } from 'dayjs';
import { concat, without } from 'lodash';
import { useEffect, useMemo } from 'react';
import { useDeleteApprovalDelegate } from '../hooks/useDeleteApprovalDelegate';
import { useEditApprovalDelegate } from '../hooks/useEditApprovalDelegate';
import {
  ApprovalDelegateType,
  useListApprovalDelegate,
} from '../hooks/useListApprovalDelegate';
import { ApprovalProcessType } from '../hooks/useListApprovalProcess';

export interface Props {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  data: ApprovalProcessType | undefined;
}

const ModalAuthority: React.FC<Props> = ({ isOpen, setIsOpen, data }) => {
  const [form] = Form.useForm();
  const { id } = data ?? {};
  const currentUser = useGetDataFromQueryKey<IUserInfo>([
    REACT_QUERY_KEYS.GET_PROFILE,
  ]);
  const dataTable: ApprovalDelegateType[] =
    Form.useWatch('delegates', form) ?? [];
  const { isLoading: isLoadingProcess, data: listProcess } = useParameterQuery({
    'table-name': 'APPROVAL_PROCESS',
    'column-name': 'PROCESS_CODE',
    isIdValue: true,
  });
  const { data: listDelegate, isFetching: isLoadingList } =
    useListApprovalDelegate(id, isOpen);
  const { isPending: isLoadingEdit, mutate: mutateEdit } =
    useEditApprovalDelegate();
  const { isPending: isLoadingDelete, mutate: mutateDelete } =
    useDeleteApprovalDelegate();
  const { data: listUser = [], isLoading: isLoadingUser } =
    useGetAllUser(isOpen);

  const optionUsers = useMemo(() => {
    const listUsersSaved = listDelegate ? listDelegate.delegates : [];
    const activeUserSet = new Set(
      listUser.filter((item) => item.status === 1).map((e) => e.id)
    );
    const activeUser = listUser
      .filter((item) => item.status === 1)
      .map((e) => ({
        label: `${e.fullname} ${e.status === 0 ? '(Ngưng hoạt động)' : ''}`,
        value: e.id,
        email: e.email,
      }));
    listUsersSaved
      .filter((item) => item.id && item.delegateUserId)
      .forEach((user) => {
        if (!activeUserSet.has(user.delegateUserId)) {
          activeUser.unshift({
            label: `${user.delegateUserName} ${'(Ngưng hoạt động)'}`,
            value: user.delegateUserId ?? '',
            email: user.email ?? '',
          });
        }
      });
    return activeUser.filter((item) => item.value !== currentUser?.id);
  }, [listUser, listDelegate]);

  useEffect(() => {
    if (!listDelegate) return;
    form.setFieldsValue(listDelegate);
  }, [isLoadingList]);
  const handleFinish = ({
    delegates,
  }: {
    delegates: ApprovalDelegateType[];
  }) => {
    const deletedDelegateIds = listDelegate?.delegates
      ?.filter(
        (e) =>
          !delegates?.some((item: ApprovalDelegateType) => item?.id === e.id)
      )
      ?.map((e) => e.id!);
    if (deletedDelegateIds?.length) {
      mutateDelete(deletedDelegateIds, {
        onSuccess: () => {
          handleEditApi(delegates);
        },
      });
    } else {
      handleEditApi(delegates);
    }
  };
  const handleEditApi = (delegates: ApprovalDelegateType[]) => {
    mutateEdit(
      {
        processId: id,
        stepOrder: data?.stepOrder,
        stepDelegateRequestDTOS: delegates?.map((e) => {
          const delegateUserName = optionUsers?.find(
            (c) => c.value === e.delegateUserId
          )?.email;
          return {
            ...e,
            fromDate: toLocalISOString(dayjs(e.fromDate)),
            toDate: toLocalISOString(dayjs(e.toDate)),
            delegateUserName,
          };
        }),
      },
      { onSuccess: () => setIsOpen(false) }
    );
  };
  const handleCancel = () => {
    setIsOpen(false);
  };
  const handleAddItem = (add: FormListOperation['add']) => {
    const record = {};
    add(record);
  };
  const handleRemoveItem = (
    remove: FormListOperation['remove'],
    index: number
  ) => {
    remove(index);
  };
  const getDisabledDate = (
    cur: Dayjs,
    idx: number,
    comparedDate: Dayjs,
    isFromDate: boolean
  ) => {
    if (!cur) return false;
    return (
      (isFromDate
        ? disabledFromDate(cur, comparedDate)
        : disabledToDate(cur, comparedDate)) ||
      disabledBetweenDate(dataTable, cur, idx, isFromDate) ||
      disabledBetweenPlusDate(dataTable, cur, idx, isFromDate)
    );
  };
  const getDisabledTime = (
    cur: Dayjs,
    idx: number,
    comparedDate: Dayjs,
    isFromDate: boolean
  ) => {
    if (!cur) return {};
    const hours = without(
      concat(
        isFromDate
          ? disabledFromTime(cur, comparedDate)?.disabledHours?.()
          : disabledToTime(cur, comparedDate)?.disabledHours?.(),
        disabledBetweenTime(dataTable, cur, idx, isFromDate)?.disabledHours?.(),
        disabledBetweenPlusTime(
          dataTable,
          cur,
          idx,
          isFromDate
        )?.disabledHours?.(),
        []
      ),
      undefined
    );
    const minutes = without(
      concat(
        isFromDate
          ? disabledFromTime(cur, comparedDate)?.disabledMinutes?.()
          : disabledToTime(cur, comparedDate)?.disabledMinutes?.(),
        disabledBetweenTime(
          dataTable,
          cur,
          idx,
          isFromDate
        )?.disabledMinutes?.(),
        disabledBetweenPlusTime(
          dataTable,
          cur,
          idx,
          isFromDate
        )?.disabledMinutes?.(),
        []
      ),
      undefined
    );
    return {
      disabledHours: () => hours,
      disabledMinutes: () => minutes,
    } as any;
  };

  const columns = (
    remove: (index: number | number[]) => void
  ): ColumnsType<ApprovalDelegateType> => {
    return [
      {
        title: 'STT',
        dataIndex: 'stt',
        key: 'stt',
        align: 'center',
        width: 50,
        render: (_, __, index) => <div className="mt-2">{++index}</div>,
      },
      {
        title: 'Người duyệt thay',
        dataIndex: 'delegateUserId',
        key: 'delegateUserId',
        width: 175,
        align: 'left',
        render: (value, __, index) => (
          <Form.Item
            name={[index, 'delegateUserId']}
            rules={[validateForm.required]}
          >
            <CSelect
              isLoading={isLoadingUser}
              disabled={false}
              options={optionUsers}
              placeholder="Người duyệt thay"
            />
          </Form.Item>
        ),
      },
      {
        title: 'Thời gian bắt đầu',
        dataIndex: 'fromDate',
        key: 'fromDate',
        width: 150,
        align: 'left',
        render: (_, record: any, index: number) => {
          const toDate = form.getFieldValue(['delegates', index, 'toDate']);
          return (
            <Form.Item
              name={[index, 'fromDate']}
              rules={[validateForm.required]}
            >
              <CDatePicker
                format={DateFormat.DATE_TIME_NO_SECOND}
                showTime={{ format: 'HH:mm' }}
                disabledDate={(e) => getDisabledDate(e, index, toDate, true)}
                disabledTime={(e) => getDisabledTime(e, index, toDate, true)}
              />
            </Form.Item>
          );
        },
      },
      {
        title: 'Thời gian kết thúc',
        dataIndex: 'toDate',
        key: 'toDate',
        align: 'left',
        width: 150,
        render: (_, record: any, index: number) => {
          const fromDate = form.getFieldValue(['delegates', index, 'fromDate']);
          return (
            <Form.Item name={[index, 'toDate']} rules={[validateForm.required]}>
              <CDatePicker
                format={DateFormat.DATE_TIME_NO_SECOND}
                showTime={{ format: 'HH:mm' }}
                disabledDate={(e) => getDisabledDate(e, index, fromDate, false)}
                disabledTime={(e) => getDisabledTime(e, index, fromDate, false)}
              />
            </Form.Item>
          );
        },
      },
      {
        title: '',
        dataIndex: 'id',
        key: 'id',
        align: 'center',
        width: 50,
        render: (_, record: any, index: number) => (
          <FontAwesomeIcon
            icon={faMinus}
            onClick={() => handleRemoveItem(remove, index)}
            className="mr-1.5 mt-3 cursor-pointer"
            size="lg"
            title="Xóa"
          />
        ),
      },
    ];
  };

  return (
    <CModal
      title={'Ủy quyền phê duyệt'}
      open={isOpen}
      loading={isLoadingList || isLoadingEdit || isLoadingDelete}
      width={1000}
      onCancel={handleCancel}
      footer={[
        <Flex justify="end" gap={12} className="w-full">
          <CButtonClose type="default" onClick={handleCancel}>
            Đóng
          </CButtonClose>
          <Button
            icon={<FontAwesomeIcon icon={faSave} />}
            onClick={form.submit}
            htmlType="submit"
          >
            Xác nhận
          </Button>
        </Flex>,
      ]}
    >
      <Form form={form} onFinish={handleFinish} colon={false}>
        <Row gutter={12}>
          <Col span={8}>
            <Form.Item labelAlign="left" label={'Quy trình'} name="processName">
              <CSelect
                isLoading={isLoadingProcess}
                placeholder="Quy trình"
                options={listProcess}
                disabled
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.List name={'delegates'}>
              {(_, { add, remove }) => (
                <div className="mb-4">
                  <Flex justify="end" align="end" gap={12}>
                    <CTable
                      rowKey={'id'}
                      dataSource={dataTable}
                      loading={false}
                      scroll={undefined}
                      pagination={false}
                      className="dynamic-table"
                      rowClassName={'align-top'}
                      columns={columns(remove)}
                    />
                    {
                      <FontAwesomeIcon
                        icon={faPlus}
                        onClick={() => handleAddItem(add)}
                        size="lg"
                        className="cursor-pointer mb-[18px]"
                        title="Thêm"
                      />
                    }
                  </Flex>
                </div>
              )}
            </Form.List>
          </Col>
        </Row>
      </Form>
    </CModal>
  );
};

export default ModalAuthority;
