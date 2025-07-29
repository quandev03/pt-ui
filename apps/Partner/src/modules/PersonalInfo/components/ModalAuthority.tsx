import React, { useEffect } from 'react'
import { faMinus, faPlus, faSave } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { CButtonClose } from '@react/commons/Button'
import { CDatePicker, CTable } from '@react/commons/index'
import CModal from '@react/commons/Modal'
import CSelect from '@react/commons/Select'
import { DateFormat } from '@react/constants/app'
import { Button, Col, Flex, Form, Row } from 'antd'
import Column from 'antd/es/table/Column'
import validateForm from 'apps/Partner/src/utils/validator'
import { ApprovalDelegateType, ApprovalProcessType } from '../type'
import {
  disabledBetweenDate,
  disabledBetweenPlusDate,
  disabledBetweenPlusTime,
  disabledBetweenTime,
  disabledFromDate,
  disabledFromTime,
  disabledToDate,
  disabledToTime,
} from '@react/utils/datetime';
import { Dayjs } from 'dayjs'
import { concat, without } from 'lodash'
import { useParameterQuery } from 'apps/Partner/src/hooks/useParameterQuery'
import { FormListOperation } from 'antd/lib'
import { useUsersByOrgId } from '../queryHooks/useUsersByOrgId'
import { useDeleteApprovalDelegate } from '../queryHooks/useDeleteApprovalDelegate'
import { useEditApprovalDelegate } from '../queryHooks/useEditApprovalDelegate'

export interface Props {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  data: ApprovalProcessType | undefined
}

const ModalAuthority: React.FC<Props> = ({isOpen, setIsOpen, data}) => {
  const [form] = Form.useForm();
  const { id } = data ?? {};
  const dataTable: ApprovalDelegateType[] =
    Form.useWatch('delegates', form) ?? [];
  const { isLoading: isLoadingProcess, data: listProcess } = useParameterQuery({
    'table-name': 'APPROVAL_PROCESS',
    'column-name': 'PROCESS_CODE',
    isIdValue: true,
  });
  const { data: listUser = [], isPending: isLoadingUser, mutate: mutateUser } = useUsersByOrgId();
  const { isPending: isLoadingEdit, mutate: mutateEdit } = useEditApprovalDelegate();
  const { isPending: isLoadingDelete, mutate: mutateDelete } = useDeleteApprovalDelegate();

  useEffect(() => {
    if (data?.orgId) mutateUser(data?.orgId);
  }, [data]);

  const handleCancel = () => {
    setIsOpen(false)
  }

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

  const handleFinish = ({
    delegates,
  } : {
    delegates: ApprovalDelegateType[]
  }) => {
      handleEditApi(delegates);
  }

  const handleEditApi = (delegates: ApprovalDelegateType[]) => {
    mutateEdit(
      {
        processId: id,
        stepOrder: data?.stepOrder,
        stepDelegateRequestDTOS: delegates?.map((e) => {
          const delegateUserName = listUser?.find(
            (c) => c.value === e.delegateUserId
          )?.userFullName;
          return { ...e, delegateUserName };
        }),
      },
      { onSuccess: () => setIsOpen(false) }
    );
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
    };
  };

  return (
    <CModal
      title={'Ủy quyền phê duyệt'}
      open={isOpen}
      loading={isLoadingEdit || isLoadingDelete}
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
      <Form
        form={form}
        onFinish={handleFinish}
        colon={false}>
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
                      >
                        <Column
                          width={50}
                          dataIndex="stt"
                          title={'STT'}
                          align="center"
                          render={(_, __, index) => ++index}
                        />
                        <Column
                          width={155}
                          dataIndex="delegateUserId"
                          title={
                            <div className="label-required-suffix">
                              Người duyệt thay
                            </div>
                          }
                          align="left"
                          render={(value, __, index) => (
                            <Form.Item
                              name={[index, 'delegateUserId']}
                              rules={[validateForm.required]}
                            >
                              <CSelect
                                isLoading={isLoadingUser}
                                disabled={false}
                                options={listUser}
                                fieldNames={{
                                  value: 'value',
                                  label: 'userFullName',
                                }}
                                optionLabelProp="userFullName"
                              />
                            </Form.Item>
                          )}
                        />
                        <Column
                          dataIndex="fromDate"
                          title={
                            <div className="label-required-suffix">
                              Thời gian bắt đầu
                            </div>
                          }
                          align="center"
                          width={175}
                          render={(_, record: any, index: number) => {
                            const toDate = form.getFieldValue([
                              'delegates',
                              index,
                              'toDate',
                            ]);
                            return (
                              <Form.Item
                                name={[index, 'fromDate']}
                                rules={[validateForm.required]}
                              >
                                <CDatePicker
                                  format={DateFormat.DATE_TIME_NO_SECOND}
                                  showTime={{ format: 'HH:mm' }}
                                  disabledDate={(e) =>
                                    getDisabledDate(e, index, toDate, true)
                                  }
                                  // disabledTime={(e) =>
                                  //   getDisabledTime(e, index, toDate, true)
                                  // }
                                />
                              </Form.Item>
                            );
                          }}
                        />
                        <Column
                          dataIndex="toDate"
                          title={
                            <div className="label-required-suffix">
                              Thời gian kết thúc
                            </div>
                          }
                          align="center"
                          width={175}
                          render={(_, record: any, index: number) => {
                            const fromDate = form.getFieldValue([
                              'delegates',
                              index,
                              'fromDate',
                            ]);
                            return (
                              <Form.Item
                                name={[index, 'toDate']}
                                rules={[validateForm.required]}
                              >
                                <CDatePicker
                                  format={DateFormat.DATE_TIME_NO_SECOND}
                                  showTime={{ format: 'HH:mm' }}
                                  disabledDate={(e) =>
                                    getDisabledDate(e, index, fromDate, false)
                                  }
                                  // disabledTime={(e) =>
                                  //   getDisabledTime(e, index, fromDate, false)
                                  // }
                                />
                              </Form.Item>
                            );
                          }}
                        />
                        <Column
                          dataIndex="id"
                          title=""
                          align="center"
                          width={75}
                          render={(_, record: any, index: number) => (
                            <Flex justify="end" gap={12}>
                              <FontAwesomeIcon
                                icon={faMinus}
                                onClick={() => handleRemoveItem(remove, index)}
                                className="mr-2 cursor-pointer"
                                size="lg"
                                title="Xóa"
                              />
                            </Flex>
                          )}
                        />
                      </CTable>
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
  )
}

export default ModalAuthority
