import {
  CButtonClose,
  CButtonDelete,
  CButtonEdit,
  CButtonSave,
  CButtonSaveAndAdd,
} from '@react/commons/Button';
import CInput from '@react/commons/Input';
import CSwitch from '@react/commons/Switch';
import { TitleHeader } from '@react/commons/Template/style';
import { ActionType } from '@react/constants/app';
import { MESSAGE } from '@react/utils/message';
import { Card, Col, Form, Row, Space } from 'antd';
import ModalConfirm from 'apps/Internal/src/components/modalConfirm';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { FC, useCallback, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';
import { useAdd } from '../hooks/useAdd';
import { useDelete } from '../hooks/useDelete';
import { useEdit } from '../hooks/useEdit';
import { useView } from '../hooks/useView';
import useSupplierStore from '../store';
import { PayloadSupplier } from '../types';

type Props = {
  typeModal: ActionType;
};
const ModalAddEditView: FC<Props> = ({ typeModal }) => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const { isValuesChanged, setIsValuesChanged, resetStore } =
    useSupplierStore();
  const { data: supplierDetail } = useView(id || '');
  const { mutate: addSupplier, isPending: loadingAdd } = useAdd(form);
  const { mutate: deleteSupplier } = useDelete();
  const { mutate: editSupplier, isPending: loadingEdit } = useEdit(form);
  useEffect(() => {
    if (typeModal === ActionType.ADD && form) {
      form.setFieldValue('status', true);
    } else if (form && supplierDetail) {
      form.setFieldsValue(supplierDetail);
    }
  }, [form, supplierDetail]);
  const renderTitle = () => {
    const name = ' nhà cung cấp';
    switch (typeModal) {
      case ActionType.ADD:
        return 'Tạo' + name;
      case ActionType.EDIT:
        return 'Chỉnh sửa' + name;
      case ActionType.VIEW:
        return 'Chi tiết' + name;
      default:
        return '';
    }
  };
  const handleFinish = (values: PayloadSupplier) => {
    if (typeModal === ActionType.ADD) {
      addSupplier({ ...values, status: 1 });
    } else {
      const status = form.getFieldValue('status');
      if (typeof status === 'number') {
        ModalConfirm({
          message: MESSAGE.G04,
          handleConfirm: () => {
            editSupplier({ ...values, id: Number(id) });
          },
        });
      } else {
        ModalConfirm({
          message: MESSAGE.G04,
          handleConfirm: () => {
            editSupplier({
              ...values,
              id: Number(id),
              status: status === true ? 1 : 0,
            });
          },
        });
      }
    }
  };
  const handleClose = useCallback(() => {
    form.resetFields();
    resetStore();
    navigate(-1);
  }, [form, navigate, resetStore]);

  const handleCloseModal = useCallback(() => {
    handleClose();
  }, [handleClose]);
  const handleDelete = useCallback(() => {
    ModalConfirm({
      message: MESSAGE.G05,
      handleConfirm: () => {
        deleteSupplier(Number(id));
        handleClose();
      },
    });
  }, [handleClose]);
  return (
    <>
      <TitleHeader>{renderTitle()}</TitleHeader>
      <Card>
        <strong className="text-base text-[#2C3D94]">Thông tin</strong>
        <Form
          form={form}
          labelCol={{ span: 9 }}
          disabled={typeModal === ActionType.VIEW}
          colon={false}
          className="mt-4"
          onValuesChange={() => {
            if (!isValuesChanged) {
              setIsValuesChanged(true);
            }
          }}
          onFinish={handleFinish}
        >
          <Row gutter={30}>
            <Col span={12}>
              <Form.Item
                label="Mã nhà cung cấp"
                name={'supplierCode'}
                rules={[
                  {
                    required: true,
                    message: 'Không được để trống trường này',
                  },
                ]}
              >
                <CInput
                  maxLength={50}
                  onInput={(e: any) =>
                    (e.target.value = e.target.value.toUpperCase())
                  }
                  placeholder="Mã nhà cung cấp"
                  preventSpace
                  preventSpecial
                  preventVietnamese
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Tên nhà cung cấp"
                name="supplierName"
                rules={[
                  {
                    required: true,
                    message: 'Không được để trống trường này',
                  },
                ]}
              >
                <CInput maxLength={50} placeholder="Tên nhà cung cấp" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={'Hoạt động'} name={'status'}>
                <CSwitch disabled={typeModal !== ActionType.EDIT} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
      <Row className="my-8" justify={'end'}>
        <Form.Item name="saveForm"></Form.Item>
        <Space size="middle">
          {typeModal === ActionType.ADD && (
            <CButtonSaveAndAdd
              onClick={() => {
                form.setFieldsValue({
                  saveForm: true,
                });
                form.submit();
              }}
              loading={loadingAdd || loadingEdit}
            />
          )}
          {
            typeModal === ActionType.VIEW && (
              //   includes(listRoleByRouter, ActionsTypeEnum.UPDATE) && (
              <CButtonEdit
                onClick={() => navigate(pathRoutes.supplier_edit(Number(id)))}
              >
                {intl.formatMessage({ id: 'common.edit' })}
              </CButtonEdit>
            )
            //   )
          }
          {
            typeModal === ActionType.VIEW && (
              //   includes(listRoleByRouter, ActionsTypeEnum.DELETE) && (
              <CButtonDelete disabled={false} onClick={handleDelete}>
                {intl.formatMessage({ id: 'common.delete' })}
              </CButtonDelete>
            )
            //   )
          }
          {typeModal !== ActionType.VIEW && (
            <CButtonSave
              onClick={() => {
                form.setFieldsValue({
                  saveForm: false,
                });
                form.submit();
              }}
              loading={loadingAdd || loadingEdit}
            />
          )}
          <CButtonClose onClick={handleCloseModal} />
        </Space>
      </Row>
    </>
  );
};
export default ModalAddEditView;
