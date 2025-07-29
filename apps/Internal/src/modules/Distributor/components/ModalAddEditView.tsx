import { Card, Col, Form, Row } from 'antd';
import { FC, useCallback, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import CCheckbox from '@react/commons/Checkbox';
import CSwitch from '@react/commons/Switch';
import { RowButton, TitleHeader } from '@react/commons/Template/style';
import CInput from '@react/commons/Input';
import orderBy from 'lodash/orderBy';
import includes from 'lodash/includes';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import useGroupStore from '../store';
import { TagActive } from 'apps/Internal/src/modules/RoleManagement/page/style';
import { RegValidStringEnglish } from 'apps/Internal/src/constants/regex';
import Button from '@react/commons/Button';
import {
  useGetRoleObjectList,
  useGetUserObjectList,
  useSupportAddGroup,
  useSupportDeleteGroup,
  useSupportUpdateGroup,
} from '../queryHook';
import { IFieldErrorsItem } from '@react/commons/types';
import { PayloadCreateUpdateGroup } from '../types';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import ModalConfirm from 'apps/Internal/src/components/modalConfirm';
import { ActionsTypeEnum, ActionType } from '@react/constants/app';

type Props = {
  typeModal: ActionType;
};

const ModalAddEditView: FC<Props> = ({ typeModal }) => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const listRoleByRouter = useRolesByRouter();
  const navigate = useNavigate();
  const {
    listRoleStatus0,
    listUserStatus0,
    groupDetail,
    saveForm,
    setListUserStatus0,
    setListRoleStatus0,
    resetGroupStore,
    isValuesChanged,
    setIsValuesChanged,
    setSaveForm,
  } = useGroupStore();

  useEffect(() => {
    if (groupDetail && !!form) {
      form.setFieldsValue(groupDetail);
    }
  }, [form, groupDetail]);

  const { data: listUser } = useGetUserObjectList();
  const { data: listRole } = useGetRoleObjectList();

  const handleClose = useCallback(() => {
    form.resetFields();
    resetGroupStore();
    navigate(-1);
  }, [form, resetGroupStore]);

  const handleCloseModal = useCallback(() => {
    if (isValuesChanged) {
      ModalConfirm({
        title:
          typeModal === ActionType.ADD
            ? 'common.confirmCancelPopup'
            : 'common.confirmCancelAction',
        handleConfirm: () => {
          handleClose();
        },
      });
    } else {
      handleClose();
    }
  }, [typeModal, handleClose, isValuesChanged]);

  const setFieldError = useCallback(
    (fieldErrors: IFieldErrorsItem[]) => {
      form.setFields(
        fieldErrors.map((item: IFieldErrorsItem) => ({
          name: item.field,
          errors: [item.message],
        }))
      );
    },
    [form]
  );

  const { mutate: createGroup, isPending: loadingAdd } = useSupportAddGroup(
    handleClose,
    setFieldError
  );
  const { mutate: deleteGroup } = useSupportDeleteGroup(handleClose);
  const { mutate: updateGroup, isPending: loadingUpdate } =
    useSupportUpdateGroup(handleClose, setFieldError);

  const optionsRole = orderBy(
    listRole ? [...listRole, ...listRoleStatus0] : listRoleStatus0,
    ['status', 'roleCode'],
    ['desc', 'asc']
  ).map((item) => {
    return {
      value: item.id,
      label:
        item.code +
        '_' +
        item.name +
        (item.status === 0
          ? intl.formatMessage({ id: 'common.optionInactive' })
          : ''),
    };
  });
  const optionsUser = orderBy(
    listUser ? [...listUser, ...listUserStatus0] : listUserStatus0,
    ['status', 'username'],
    ['desc', 'asc']
  ).map((item) => {
    return {
      value: item.id,
      label:
        item.username +
        (item.status === 0
          ? intl.formatMessage({ id: 'common.optionInactive' })
          : ''),
    };
  });

  const checkListRoleStatus0 = (value: string[]) => {
    if (listRoleStatus0.length === 0) return;
    const arr = [...listRoleStatus0].filter((item) => value.includes(item.id));
    setListRoleStatus0(arr);
  };

  const checkListUserStatus0 = (value: string[]) => {
    if (listUserStatus0.length === 0) return;
    const arr = [...listUserStatus0].filter((item) => value.includes(item.id));
    setListUserStatus0(arr);
  };

  const handleFinishForm = (values: PayloadCreateUpdateGroup) => {
    const data = {
      id: groupDetail?.id || undefined,
      ...values,
      status: values.status ? 1 : 0,
    };
    if (typeModal === ActionType.ADD) {
      createGroup(data);
      return;
    }
    if (typeModal === ActionType.EDIT) {
      ModalConfirm({
        message: 'common.confirmUpdate',
        handleConfirm: () => {
          updateGroup(data);
        },
      });
    }
  };

  const layout = {
    labelCol: { lg: { span: 8 }, md: { span: 12 } },
    wrapperCol: { lg: { span: 16 }, md: { span: 12 } },
  };

  const handleDeleteItem = (id: string) => {
    if (id) {
      ModalConfirm({
        message: 'common.confirmDelete',
        handleConfirm: () => {
          deleteGroup([id]);
        },
      });
    }
  };

  const renderTitle = () => {
    let name: string = ' đối tác';

    switch (typeModal) {
      case ActionType.ADD:
        return 'Tạo' + name;
      case ActionType.EDIT:
        return 'Cập nhật' + name;
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
          disabled={typeModal === ActionType.VIEW}
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
                label="Mã nhà cung cấp"
                name="code"
                initialValue={groupDetail?.code || ''}
                rules={[
                  {
                    required: true,
                    message:
                      intl.formatMessage({
                        id: 'userGroupManager.groupCodeUser',
                      }) + intl.formatMessage({ id: 'validator.require' }),
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
                <CInput
                  maxLength={20}
                  disabled={typeModal !== ActionType.ADD}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                labelAlign="left"
                label="Tên nhà cung cấp"
                name="name"
                initialValue={groupDetail?.name || ''}
                rules={[
                  {
                    required: true,
                    message:
                      intl.formatMessage({
                        id: 'userGroupManager.groupNameUser',
                      }) + intl.formatMessage({ id: 'validator.require' }),
                  },
                ]}
              >
                <CInput maxLength={100} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              {typeModal === ActionType.VIEW ? (
                <TagActive
                  active={Boolean(groupDetail?.status)}
                  style={{ marginBottom: 20 }}
                >
                  <FormattedMessage
                    id={
                      groupDetail?.status ? 'common.active' : 'common.inactive'
                    }
                  />
                </TagActive>
              ) : (
                <Form.Item
                  labelAlign="left"
                  label={intl.formatMessage({ id: 'common.active' })}
                  name="status"
                  valuePropName="checked"
                  initialValue={
                    typeModal === ActionType.ADD
                      ? true
                      : Boolean(groupDetail?.status)
                  }
                >
                  <CSwitch disabled={typeModal !== ActionType.EDIT} />
                </Form.Item>
              )}
            </Col>
          </Row>

          <RowButton>
            <CCheckbox checked={saveForm} onClick={() => setSaveForm()}>
              Tạo thêm
            </CCheckbox>
            {typeModal === ActionType.VIEW &&
              includes(listRoleByRouter, ActionsTypeEnum.DELETE) && (
                <Button
                  onClick={() => handleDeleteItem(groupDetail?.id || '')}
                  disabled={false}
                >
                  {intl.formatMessage({ id: 'common.delete' })}
                </Button>
              )}
            {typeModal === ActionType.VIEW &&
              includes(listRoleByRouter, ActionsTypeEnum.UPDATE) && (
                <Button onClick={() => navigate('Edit')} disabled={false}>
                  {intl.formatMessage({ id: 'common.edit' })}
                </Button>
              )}
            {typeModal !== ActionType.VIEW && (
              <Button
                htmlType="submit"
                icon={<FontAwesomeIcon icon={faPlus} />}
                loading={loadingAdd || loadingUpdate}
              >
                <FormattedMessage id="common.save" />
              </Button>
            )}
            {typeModal !== ActionType.VIEW && (
              <Button onClick={handleCloseModal} type="default">
                Huỷ
              </Button>
            )}
          </RowButton>
        </Form>
      </Card>
    </>
  );
};

export default ModalAddEditView;
