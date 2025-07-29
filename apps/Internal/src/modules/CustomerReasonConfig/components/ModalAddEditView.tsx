import { Card, Checkbox, Col, Form, Row } from 'antd';
import { FC, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import CSwitch from '@react/commons/Switch';
import { RowButton, TitleHeader } from '@react/commons/Template/style';
import CInput from '@react/commons/Input';
import Select from '@react/commons/Select';
import includes from 'lodash/includes';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import useGroupStore from '../store';
import { RegValidStringEnglish } from 'apps/Internal/src/constants/regex';
import {
  CButtonClose,
  CButtonDelete,
  CButtonEdit,
  CButtonSave,
  CButtonSaveAndAdd,
} from '@react/commons/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { ItemEdit, useAddFn } from '../queryHook/useAdd';
import { useView } from '../queryHook/useView';
import { useEditFn } from '../queryHook/useEdit';
import { useListReasonType } from '../queryHook/useList';
import { ActionsTypeEnum, ActionType } from '@react/constants/app';
import ModalConfirm from 'apps/Internal/src/components/modalConfirm';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useDeleteFn } from '../queryHook/useDelete';
import CCheckbox from '@react/commons/Checkbox';
import { useGetApplicationConfig } from 'apps/Internal/src/hooks/useGetApplicationConfig';

type Props = {
  typeModal: ActionType;
};

const ModalAddEditView: FC<Props> = ({ typeModal }) => {
  const intl = useIntl();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [isShowFreeSim, setShowFreeSim] = useState(false);
  const [freeSim, setFreeSim] = useState(false);
  const listRoleByRouter = useRolesByRouter();
  const navigate = useNavigate();
  const { resetGroupStore, isValuesChanged, setIsValuesChanged } =
    useGroupStore();
  // const { isLoading: loadingList, data: dataParentId } = useList();
  const { isLoading: loadingReasonType, data: dataReasonType } = useGetApplicationConfig('REASON');
  const reasonTypeOptions = dataReasonType?.map((item: any) => ({
    label: item.name,
    value: item.code,
  }));

  const {
    isFetching: isFetchingView,
    data: itemEdit,
    refetch: refetchGetItemEdit,
  } = useView(id || '');

  useEffect(() => {
    if (typeModal !== ActionType.ADD && id) {
      refetchGetItemEdit();
    } 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeModal, id, dataReasonType]);

  const setValue = (itemEdit: any) => {
    form.setFields([
      {
        name: 'type',
        value: itemEdit?.type,
      },
      {
        name: 'code',
        value: itemEdit?.code,
      },
      {
        name: 'name',
        value: itemEdit?.name,
      },
      {
        name: 'status',
        value: itemEdit?.status,
      },
      {
        name: 'isFreeSim',
        value: itemEdit?.isFreeSim,
      },
      {
        name: 'mbfCode',
        value: itemEdit?.mbfCode,
      },
    ]);
  };

  useEffect(() => {
    if (itemEdit?.id) {
      setValue(itemEdit);
      if (itemEdit?.type === 'CHANGE_SIM') {
        setShowFreeSim(true);
        setFreeSim(itemEdit?.isFreeSim);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemEdit?.id, isFetchingView]);

  const handleClose = () => {
    form.resetFields();
    resetGroupStore();
    navigate(-1);
  };

  const handleCloseModal = () => {
    handleClose();
  };

  const { mutate: addMutate, isPending: loadingAdd } = useAddFn(form);
  const { isPending: isLoadingEdit, mutate: editMutate } = useEditFn(form);
  const { mutate: deleteMutate } = useDeleteFn();
  const handleFinishForm = (values: ItemEdit) => {
    const data = {
      id: itemEdit?.id || undefined,
      ...values,
      status: values.status === true ? true : false,
      isFreeSim: freeSim === true ? 1 : 0,
    };
    console.log("DATATATTA ", data);
    
    if (typeModal === ActionType.ADD) {
      addMutate(data);
    } else if (typeModal === ActionType.EDIT) {
      editMutate(data);
    }
  };

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const handleDeleteItem = (id: string) => {
    if (id) {
      ModalConfirm({
        message: 'common.confirmDelete',
        handleConfirm: () => {
          deleteMutate(id);
          navigate(-1);
        },
      });
    }
  };

  const renderTitle = () => {
    const name = ' lý do';

    switch (typeModal) {
      case ActionType.ADD:
        return 'Tạo' + name;
      case ActionType.EDIT:
        return 'Chỉnh sửa' + name;
      case ActionType.VIEW:
        return 'Xem chi tiết' + name;
      default:
        return '';
    }
  };

  return (
    <>
      <TitleHeader>{renderTitle()}</TitleHeader>
      <Card>
        <Form
          form={form}
          {...layout}
          onFinish={handleFinishForm}
          onValuesChange={() => {
            if (!isValuesChanged) {
              setIsValuesChanged(true);
            }
          }}
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                labelAlign="left"
                label="Loại lý do"
                name="type"
                rules={[
                  {
                    required: true,
                    message: 'Không được để trống trường này',
                  },
                  {
                    validator: (_, value) =>
                      !value || RegValidStringEnglish.test(value)
                        ? Promise.resolve()
                        : Promise.reject(
                            new Error(
                              intl.formatMessage({
                                id: 'userGroupManager.groupCodeUser',
                              }) +
                                ' ' +
                                intl.formatMessage({
                                  id: 'validator.errFormat',
                                })
                            )
                          ),
                  },
                ]}
              >
                <Select
                  disabled={typeModal !== ActionType.ADD}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, options: any) =>
                    (options?.label ?? '')
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={reasonTypeOptions}
                  placeholder={'Chọn loại lý do'}
                  onChange={() => {
                    if (form.getFieldValue('type') === 'CHANGE_SIM') {
                      setShowFreeSim(true);
                    } else {
                      setShowFreeSim(false);
                    }
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              {typeModal === ActionType.ADD && (
                <Form.Item
                  label={'Hoạt động'}
                  name={'status'}
                  initialValue={true}
                >
                  <CSwitch disabled={true} />
                </Form.Item>
              )}
              {typeModal !== ActionType.ADD && (
                <Form.Item label={'Hoạt động'} name={'status'}>
                  <CSwitch disabled={typeModal !== ActionType.EDIT} />
                </Form.Item>
              )}
            </Col>
            <Col span={12}>
              <Form.Item
                labelAlign="left"
                label="Mã lý do"
                name="code"
                rules={[
                  {
                    required: true,
                    message: 'Không được để trống trường này',
                  },
                ]}
              >
                <CInput
                  uppercase
                  preventSpace
                  preventVietnamese
                  preventSpecial
                  maxLength={20}
                  disabled={typeModal === ActionType.VIEW}
                  placeholder={'Nhập mã lý do'}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                labelAlign="left"
                label="Tên lý do"
                name="name"
                rules={[
                  {
                    required: true,
                    message: 'Không được để trống trường này',
                  },
                ]}
              >
                <CInput
                  maxLength={100}
                  disabled={typeModal === ActionType.VIEW}
                  placeholder={'Nhập tên lý do'}
                  onBlur={(e) => {
                    const trimmedValue = e.target.value.trim();
                    form.setFieldsValue({ name: trimmedValue });
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                labelAlign="left"
                label="Mã MBF"
                name="mbfCode"
              >
                <CInput
                  uppercase
                  preventSpace
                  preventVietnamese
                  preventSpecial
                  maxLength={100}
                  disabled={typeModal === ActionType.VIEW}
                  placeholder={'Nhập mã MBF'}
                />
              </Form.Item>
            </Col>
            {isShowFreeSim && (
              <Col span={12}>
                {typeModal === ActionType.ADD && (
                  <Form.Item label={'Miễn phí đổi SIM'} name={'isFreeSim'}>
                    <CCheckbox
                      checked={freeSim}
                      onClick={() => setFreeSim(!freeSim)}
                    ></CCheckbox>
                  </Form.Item>
                )}
                {typeModal !== ActionType.ADD && (
                  <Form.Item label={'Miễn phí đổi SIM'} name={'isFreeSim'}>
                    <CCheckbox
                      checked={freeSim}
                      onClick={() => setFreeSim(!freeSim)}
                      disabled={typeModal !== ActionType.EDIT}
                    ></CCheckbox>
                  </Form.Item>
                )}
              </Col>
            )}
          </Row>
          <br />
          <br />
          <RowButton>
            <Form.Item name="saveForm"></Form.Item>
            {typeModal === ActionType.ADD && (
              <CButtonSaveAndAdd
                onClick={() => {
                  form.setFieldsValue({
                    saveForm: true,
                  });
                  form.submit();
                }}
                loading={loadingAdd}
              >
                Lưu và thêm mới
              </CButtonSaveAndAdd>
            )}
            {typeModal === ActionType.VIEW &&
              includes(listRoleByRouter, ActionsTypeEnum.UPDATE) && (
                <>
                  <CButtonDelete
                    onClick={() => handleDeleteItem(id.toString())}
                  ></CButtonDelete>
                  <CButtonEdit
                    onClick={() => navigate(pathRoutes.customerReasonEdit(id))}
                    disabled={false}
                  ></CButtonEdit>
                </>
              )}
            {typeModal === ActionType.ADD && (
              <CButtonSave
                onClick={() => {
                  form.setFieldsValue({
                    saveForm: false,
                  });
                  form.submit();
                }}
                loading={loadingAdd || isLoadingEdit}
              >
                <FormattedMessage id="common.save" />
              </CButtonSave>
            )}
            {typeModal === ActionType.EDIT && (
              <CButtonSave
                onClick={() => {
                  ModalConfirm({
                    message: 'Bạn có chắc chắn muốn cập nhật không?',
                    handleConfirm: () => {
                      form.setFieldsValue({
                        saveForm: false,
                      });
                      form.submit();
                    },
                  });
                }}
                loading={loadingAdd || isLoadingEdit}
              >
                <FormattedMessage id="common.save" />
              </CButtonSave>
            )}

            <CButtonClose onClick={handleCloseModal} type="default">
              Đóng
            </CButtonClose>
          </RowButton>
        </Form>
      </Card>
    </>
  );
};

export default ModalAddEditView;
