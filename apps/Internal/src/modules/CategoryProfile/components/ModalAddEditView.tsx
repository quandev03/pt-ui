import { Card, Col, Form, Row, Tooltip } from 'antd';
import { FC, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { RowButton, TitleHeader } from '@react/commons/Template/style';
import CInput from '@react/commons/Input';
import useGroupStore from '../store';
import {
  CButtonClose,
  CButtonEdit,
  CButtonSave,
  CButtonSaveAndAdd,
} from '@react/commons/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { ItemEdit, useAddFn } from '../queryHook/useAdd';
import { useView } from '../queryHook/useView';
import { useEditFn } from '../queryHook/useEdit';
import { ActionType } from '@react/constants/app';
import ModalConfirm from 'apps/Internal/src/components/modalConfirm';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import CSwitch from '@react/commons/Switch';

type Props = {
  typeModal: ActionType;
};

const ModalAddEditView: FC<Props> = ({ typeModal }) => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const { mutate: addMutate, isPending: loadingAdd } = useAddFn(form);
  const { isPending: isLoadingEdit, mutate: editMutate } = useEditFn(form);
  const navigate = useNavigate();
  const {
    isAutoDefault,
    resetGroupStore,
    isValuesChanged,
    setIsValuesChanged,
  } = useGroupStore();
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
  }, [typeModal, id]);

  const setValue = (itemEdit: any) => {
    form.setFields([
      {
        name: 'code',
        value: itemEdit?.code,
      },
      {
        name: 'value',
        value: itemEdit?.value,
      },
      {
        name: 'status',
        value: itemEdit?.status,
      },
      {
        name: 'isDefault',
        value: itemEdit?.isDefault,
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

  const handleFinishForm = (values: ItemEdit) => {
    const data = {
      id: itemEdit?.id || undefined,
      ...values,
      status: values.status ? 1 : 0,
      isDefault: isAutoDefault ? 1 : values.isDefault ? 1 : 0,
    };
    if (
      (typeModal === ActionType.ADD && isAutoDefault) ||
      (typeModal === ActionType.ADD && !values.isDefault)
    ) {
      addMutate(data);
      return;
    } else if (
      typeModal === ActionType.ADD ||
      (typeModal === ActionType.EDIT &&
        !itemEdit?.isDefault &&
        values.isDefault)
    ) {
      ModalConfirm({
        message:
          'Đã tồn tại profile mặc định. Bạn có muốn thay đổi profile mặc định không?',
        handleConfirm: () => {
          if (typeModal === ActionType.ADD) {
            addMutate(data);
            return;
          }
          if (typeModal === ActionType.EDIT) {
            ModalConfirm({
              message: 'Bạn có chắc chắn muốn cập nhật không?',
              handleConfirm: () => {
                editMutate(data);
              },
            });
          }
        },
        handleCancel: () => {
          data.isDefault = 0;
          if (typeModal === ActionType.ADD) {
            addMutate(data);
            return;
          }
          if (typeModal === ActionType.EDIT) {
            ModalConfirm({
              message: 'Bạn có chắc chắn muốn cập nhật không?',
              handleConfirm: () => {
                editMutate(data);
              },
            });
          }
        },
      });
    } else if (typeModal === ActionType.EDIT) {
      ModalConfirm({
        message: 'Bạn có chắc chắn muốn cập nhật không?',
        handleConfirm: () => {
          editMutate(data);
        },
      });
    }
  };

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const renderTitle = () => {
    const name = ' profile';

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
        <Card>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                labelAlign="left"
                label="Mã profile"
                name="code"
                rules={[
                  {
                    required: true,
                    message: 'Không được để trống trường này',
                  },
                ]}
              >
                <CInput
                  preventSpecial
                  preventSpace
                  uppercase
                  preventVietnamese
                  maxLength={50}
                  disabled={typeModal !== ActionType.ADD}
                  placeholder={'Nhập mã profile'}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                labelAlign="left"
                label="Tên profile"
                name="value"
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
                  placeholder={'Nhập tên profile'}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={
                  <span>
                    Profile mặc định{' '}
                    <Tooltip
                      title={
                        'Chọn profile mặc định để ghép KIT tự động cho đơn hàng online'
                      }
                    >
                      <FontAwesomeIcon icon={faCircleInfo} />
                    </Tooltip>
                  </span>
                }
                name={'isDefault'}
                initialValue={isAutoDefault}
              >
                <CSwitch
                  disabled={typeModal === ActionType.VIEW || isAutoDefault}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              {typeModal === ActionType.ADD && (
                <Form.Item
                  label={'Trạng thái'}
                  name={'status'}
                  initialValue={true}
                >
                  <CSwitch disabled={true} />
                </Form.Item>
              )}
              {typeModal !== ActionType.ADD && (
                <Form.Item label={'Trạng thái'} name={'status'}>
                  <CSwitch disabled={typeModal !== ActionType.EDIT} />
                </Form.Item>
              )}
            </Col>
          </Row>
        </Card>
        <br />
        <RowButton>
          <Form.Item name="saveForm"></Form.Item>
          <Form.Item name="id"></Form.Item>
          {typeModal === ActionType.ADD && (
            <CButtonSaveAndAdd
              onClick={() => {
                form.setFieldsValue({
                  saveForm: true,
                  id: null,
                });
                form.submit();
              }}
              loading={loadingAdd}
            ></CButtonSaveAndAdd>
          )}
          {typeModal === ActionType.VIEW && (
            <CButtonEdit
              onClick={() => navigate(pathRoutes.category_profile_edit(id))}
            ></CButtonEdit>
          )}
          {typeModal !== ActionType.VIEW && (
            <CButtonSave
              onClick={() => {
                form.setFieldsValue({
                  saveForm: false,
                  id: id,
                });
                form.submit();
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
    </>
  );
};

export default ModalAddEditView;
