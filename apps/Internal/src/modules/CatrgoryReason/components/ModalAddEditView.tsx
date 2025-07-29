import { Card, Col, Form, Row } from 'antd';
import { FC, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import CSwitch from '@react/commons/Switch';
import { RowButton, TitleHeader } from '@react/commons/Template/style';
import CInput from '@react/commons/Input';
import Select from '@react/commons/Select';
import includes from 'lodash/includes';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import useGroupStore from '../store';
import { TagActive } from 'apps/Internal/src/modules/RoleManagement/page/style';
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

type Props = {
  typeModal: ActionType;
};

const ModalAddEditView: FC<Props> = ({ typeModal }) => {
  const intl = useIntl();
  const { id } = useParams();
  const [form] = Form.useForm();
  const listRoleByRouter = useRolesByRouter();
  const navigate = useNavigate();
  const { resetGroupStore, isValuesChanged, setIsValuesChanged } =
    useGroupStore();
  const { data: dataReasonType } = useListReasonType();

  const {
    isFetching: isFetchingView,
    data: itemEdit,
    refetch: refetchGetItemEdit,
  } = useView(id || '');

  const [itemsReasonType, setItemsReasonType] = useState<
    { label: string; value: string }[]
  >([]);

  const fetchDataReasonTypeItems = () => {
    if (dataReasonType && Array.isArray(dataReasonType)) {
      setItemsReasonType(
        dataReasonType.map((item) => ({
          label: item.reasonTypeName,
          value: item.id,
        }))
      );
    }
  };

  useEffect(() => {
    if (typeModal !== ActionType.ADD && id) {
      refetchGetItemEdit();
    }
    if (dataReasonType) {
      fetchDataReasonTypeItems();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeModal, id, dataReasonType]);

  const setValue = (itemEdit: any) => {
    form.setFields([
      {
        name: 'reasonTypeId',
        value: itemEdit?.reasonTypeId,
      },
      {
        name: 'reasonCode',
        value: itemEdit?.reasonCode,
      },
      {
        name: 'reasonName',
        value: itemEdit?.reasonName,
      },
      {
        name: 'status',
        value: itemEdit?.status,
      },
    ]);
  };

  useEffect(() => {
    if (itemEdit?.id) {
      setValue(itemEdit);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemEdit?.id, isFetchingView]);

  const handleCloseModal = () => {
    resetGroupStore();
    form.resetFields();
    navigate(-1);
  };

  const { mutate: addMutate, isPending: loadingAdd } = useAddFn(form);
  const { isPending: isLoadingEdit, mutate: editMutate } = useEditFn(form);
  const { mutate: deleteMutate } = useDeleteFn();
  const handleFinishForm = (values: ItemEdit) => {
    const data = {
      id: itemEdit?.id || undefined,
      ...values,
      status: values.status ? 1 : 0,
    };
    if (typeModal === ActionType.ADD) {
      addMutate(data);
      return;
    }
    if (typeModal === ActionType.EDIT) {
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
                name="reasonTypeId"
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
                  options={itemsReasonType}
                  placeholder={'Chọn loại lý do'}
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
                name="reasonCode"
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
                name="reasonName"
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
                    form.setFieldsValue({ reasonName: trimmedValue });
                  }}
                />
              </Form.Item>
            </Col>
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
                    onClick={() =>
                      navigate(pathRoutes.category_reason_edit(id))
                    }
                    disabled={false}
                  >
                    {intl.formatMessage({ id: 'common.edit' })}
                  </CButtonEdit>
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
