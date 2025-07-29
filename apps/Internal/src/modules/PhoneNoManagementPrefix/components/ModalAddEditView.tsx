import {
  CButtonClose,
  CButtonDelete,
  CButtonEdit,
  CButtonSave,
  CButtonSaveAndAdd,
} from '@react/commons/Button';
import CInput from '@react/commons/Input';
import { RowButton, TitleHeader } from '@react/commons/Template/style';
import CTextArea from '@react/commons/TextArea';
import { ActionsTypeEnum, ActionType } from '@react/constants/app';
import { Card, Col, Form, Row, Spin } from 'antd';
import ModalConfirm from 'apps/Internal/src/components/modalConfirm';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import includes from 'lodash/includes';
import { FC, FocusEvent, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';
import { ItemEdit, useAddFn } from '../queryHook/useAdd';
import { useDeleteFn } from '../queryHook/useDelete';
import { useEditFn } from '../queryHook/useEdit';
import { useView } from '../queryHook/useView';
import useGroupStore from '../store';
type Props = {
  typeModal: ActionType;
};

const ModalAddEditView: FC<Props> = ({ typeModal }) => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const listRoleByRouter = useRolesByRouter();
  const navigate = useNavigate();
  const { resetGroupStore, isValuesChanged, setIsValuesChanged } =
    useGroupStore();

  const {
    isFetching: isFetchingView,
    isLoading: isLoadingView,
    data: itemEdit,
    refetch: refetchGetItemEdit,
  } = useView(id || '');

  useEffect(() => {
    if (typeModal !== ActionType.ADD && id) {
      refetchGetItemEdit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeModal, id]);

  const setValue = (itemEdit: any) => {
    form.setFields([
      {
        name: 'isdnPrefix',
        value: itemEdit?.isdnPrefix,
      },
      {
        name: 'description',
        value: itemEdit?.description,
      },
    ]);
  };

  useEffect(() => {
    if (itemEdit?.id) {
      setValue(itemEdit);
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

  const handleBlur = (e: FocusEvent<HTMLInputElement>, field: string) => {
    let value = (e.target as HTMLInputElement).value;
    if (value[0] === '0') {
      value = value.slice(1);
    }
    form.setFieldValue(field, value);
    form.validateFields([field]);
  };

  const { mutate: addMutate, isPending: loadingAdd } = useAddFn(form);
  const { isPending: isLoadingEdit, mutate: editMutate } = useEditFn(form);
  const { mutate: deleteMutate } = useDeleteFn();
  const handleFinishForm = (values: ItemEdit) => {
    const data = {
      id: itemEdit?.id || undefined,
      ...values,
      // status: values.status ? 1 : 0,
    };
    if (typeModal === ActionType.ADD) {
      addMutate(data);
      return;
    }
    if (typeModal === ActionType.EDIT) {
      ModalConfirm({
        message: 'common.confirmUpdate',
        handleConfirm: () => {
          editMutate(data);
        },
      });
    }
  };

  const handleDeleteItem = () => {
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
    const name = ' đầu số ';

    switch (typeModal) {
      case ActionType.ADD:
        return 'Tạo' + name + ' mới';
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
      <Form
        form={form}
        onFinish={handleFinishForm}
        onValuesChange={() => {
          if (!isValuesChanged) {
            setIsValuesChanged(true);
          }
        }}
      >
        <Spin spinning={loadingAdd || isLoadingEdit || isLoadingView}>
          <Card className="mb-4">
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  labelAlign="left"
                  label="Đầu số"
                  name="isdnPrefix"
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 16 }}
                  rules={[
                    {
                      required: true,
                      message: 'Không được để trống trường này',
                    },
                  ]}
                >
                  <CInput
                    maxLength={4}
                    onlyNumber
                    preventSpace
                    disabled={typeModal !== ActionType.ADD}
                    placeholder={'Nhập đầu số'}
                    onBlur={(e) => {
                      handleBlur(e, 'isdnPrefix');
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  labelAlign="left"
                  label="Mô tả"
                  name="description"
                  labelCol={{ span: 2 }}
                  wrapperCol={{ span: 24 }}
                >
                  <CTextArea
                    maxLength={200}
                    rows={3}
                    placeholder="Nhập mô tả"
                    disabled={typeModal === ActionType.VIEW}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Spin>

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
                  onClick={() => handleDeleteItem()}
                  disabled={false}
                />
                <CButtonEdit
                  onClick={() => navigate(pathRoutes.numberPrefixEdit(id))}
                  disabled={false}
                />
              </>
            )}
          {typeModal !== ActionType.VIEW && (
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

          <CButtonClose onClick={handleCloseModal} type="default" />
        </RowButton>
      </Form>
      {/* </Card> */}
    </>
  );
};

export default ModalAddEditView;
