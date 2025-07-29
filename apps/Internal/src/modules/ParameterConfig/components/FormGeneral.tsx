import {
  CButtonClose,
  CButtonDelete,
  CButtonEdit,
  CButtonSave,
  CButtonSaveAndAdd,
} from '@react/commons/Button';
import {
  CInputNumber,
  CModalConfirm,
  CSelect,
  CSwitch,
  CTooltip,
  WrapperPage,
} from '@react/commons/index';
import CInput from '@react/commons/Input';
import { TitleHeader } from '@react/commons/Template/style';
import { AnyElement } from '@react/commons/types';
import { ActionsTypeEnum, ActionType } from '@react/constants/app';
import { MESSAGE } from '@react/utils/message';
import validateForm from '@react/utils/validator';
import { Card, Col, Form, Row, Space } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useAddParameterConfig,
  useDeleteParameterConfig,
  useGetDetailParameterConfig,
  useUpdateParameterConfig,
} from '../hooks';
import { RowStyle } from '../page/style';
import { EDefault, EStatus } from '../types';
import { includes } from 'lodash';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';

type Props = {
  type: ActionType;
};

const FormGeneral = ({ type }: Props) => {
  const actionByRole = useRolesByRouter();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isStatus, setStatus] = useState<EStatus>(EStatus.ACTIVE);

  const handleClose = useCallback(() => {
    form.resetFields();
    navigate(-1);
  }, [form, navigate]);

  const handleCloseAddSave = useCallback(() => {
    form.resetFields();
  }, [form]);

  const handleCloseModal = useCallback(() => {
    handleClose();
  }, [handleClose]);

  const { mutate: onCreate, isPending: loadingAdd } = useAddParameterConfig(
    () => {
      if (submitType === 'saveAndAdd') {
        handleCloseAddSave();
      } else {
        handleClose();
      }
    },
    form
  );
  const { mutate: onUpdate, isPending: isLoadingUpdate } =
    useUpdateParameterConfig(handleClose);
  const { mutate: onDelete } = useDeleteParameterConfig(handleClose);

  const { id } = useParams();
  const {
    isFetching: isLoadingDetail,
    data: detailParameterConfig,
    isSuccess: isGetDetailSuccess,
  } = useGetDetailParameterConfig(id ?? '');

  const [submitType, setSubmitType] = useState<string>('');

  useEffect(() => {
    if (isGetDetailSuccess && detailParameterConfig) {
      form.setFieldsValue({
        ...detailParameterConfig,
        status: detailParameterConfig.status === 1 ? true : false,
        isDefault: detailParameterConfig.isDefault ? EDefault.YES : EDefault.NO,
      });
      setStatus(detailParameterConfig.status);
    }
  }, [isGetDetailSuccess, detailParameterConfig]);

  const handleFinishForm = (val: AnyElement) => {
    const data = {
      ...val,
      tableName: val.tableName.trim(),
      columnName: val.columnName.trim(),
      value: val.value.trim(),
      code: val.code.trim(),
      status: isStatus,
      isDefault: val.isDefault === EDefault.YES ? true : false,
    };
    if (type === ActionType.ADD) {
      onCreate(data as AnyElement);
    }
    if (type === ActionType.EDIT) {
      CModalConfirm({
        message: MESSAGE.G04,
        onOk: () => {
          onUpdate({
            id: detailParameterConfig?.id
              ? String(detailParameterConfig?.id)
              : '',
            data: data,
          });
        },
      });
    }
  };

  const handleDelete = () => {
    CModalConfirm({
      message: 'Bạn có chắc chắn muốn xóa cấu hình tham số này không?',
      onOk: () => id && onDelete(id),
    });
  };

  const renderTitle = () => {
    switch (type) {
      case ActionType.ADD:
        return 'Thêm mới cấu hình tham số';
      case ActionType.EDIT:
        return 'Chỉnh sửa cấu hình tham số';
      case ActionType.VIEW:
        return 'Xem chi tiết cấu hình tham số';
      default:
        return '';
    }
  };

  const optionIsDefault: DefaultOptionType[] = [
    {
      value: EDefault.YES,
      label: 'Có',
    },
    {
      value: EDefault.NO,
      label: 'Không',
    },
  ];

  const handleKeyPressOnlyNumber = (e: any) => {
    if (!/[0-9]/.test(e.key)) {
      e.preventDefault();
    }
  };

  const onBlurUppercase = (e: any, key: string) => {
    form.setFieldValue(key, e.target.value.trim().toUpperCase());
  };

  return (
    <WrapperPage>
      <TitleHeader>{renderTitle()}</TitleHeader>
      <Form
        form={form}
        labelCol={{ style: { width: '160px' } }}
        onFinish={handleFinishForm}
        disabled={type === ActionType.VIEW}
        initialValues={{
          isDefault: EDefault.NO,
        }}
      >
        <Card className="mb-5" loading={isLoadingDetail}>
          <RowStyle gutter={[24, 0]}>
            <Col span={12}>
              <Form.Item label="Trạng thái" name="status" colon={false}>
                <CTooltip
                  title={
                    isStatus === EStatus.ACTIVE
                      ? 'Hoạt động'
                      : 'Không hoạt động'
                  }
                  placement="right"
                >
                  <CSwitch
                    value={isStatus === EStatus.ACTIVE ? true : false}
                    onChange={(checked) => {
                      setStatus(checked ? EStatus.ACTIVE : EStatus.INACTIVE);
                    }}
                  />
                </CTooltip>
              </Form.Item>
            </Col>
            <Col span={12}></Col>
            <Col span={12}>
              <Form.Item
                label="Tên bảng"
                name="tableName"
                colon={false}
                required
                rules={[
                  validateForm.required,
                  { whitespace: true, message: MESSAGE.G06 },
                ]}
              >
                <CInput
                  maxLength={30}
                  placeholder="Nhập tên bảng"
                  onBlur={(e) => onBlurUppercase(e, 'tableName')}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Tên cột"
                name="columnName"
                colon={false}
                rules={[
                  validateForm.required,
                  { whitespace: true, message: MESSAGE.G06 },
                ]}
              >
                <CInput
                  maxLength={30}
                  placeholder="Nhập tên cột"
                  onBlur={(e) => onBlurUppercase(e, 'columnName')}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="CODE"
                name="code"
                colon={false}
                rules={[
                  validateForm.required,
                  { whitespace: true, message: MESSAGE.G06 },
                ]}
              >
                <CInput maxLength={20} placeholder="Nhập CODE" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Giá trị"
                name="value"
                colon={false}
                rules={[
                  validateForm.required,
                  { whitespace: true, message: MESSAGE.G06 },
                ]}
              >
                <CInput maxLength={30} placeholder="Nhập giá trị" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Loại dữ liệu" name="valueType" colon={false}>
                <CInput
                  maxLength={10}
                  placeholder="Nhập loại dữ liệu"
                  onBlur={(e) => onBlurUppercase(e, 'valueType')}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="ID tham chiếu" name="refId" colon={false}>
                <CInputNumber
                  controls={false}
                  maxLength={9}
                  placeholder="Nhập ID tham chiếu"
                  onKeyPress={handleKeyPressOnlyNumber}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Mặc định" name="isDefault" colon={false}>
                <CSelect
                  showSearch={false}
                  allowClear={false}
                  options={optionIsDefault}
                  placeholder="Chọn mặc định"
                  defaultValue={EDefault.NO}
                />
              </Form.Item>
            </Col>
          </RowStyle>
        </Card>
        <Row justify="end">
          <Space size="middle">
            {type === ActionType.VIEW && (
              <>
                {includes(actionByRole, ActionsTypeEnum.DELETE) && (
                  <CButtonDelete
                    onClick={handleDelete}
                    disabled={false}
                    htmlType="button"
                  />
                )}

                {includes(actionByRole, ActionsTypeEnum.UPDATE) && (
                  <CButtonEdit
                    onClick={() => {
                      detailParameterConfig?.id &&
                        navigate(
                          pathRoutes.parameterConfigEdit(
                            detailParameterConfig?.id
                          )
                        );
                    }}
                    disabled={false}
                    htmlType="button"
                  />
                )}

                <CButtonClose
                  onClick={handleCloseModal}
                  disabled={false}
                  type="default"
                  htmlType="button"
                />
              </>
            )}
            {type === ActionType.ADD && (
              <CButtonSaveAndAdd
                htmlType="submit"
                loading={loadingAdd || isLoadingUpdate}
                onClick={() => setSubmitType('saveAndAdd')}
              />
            )}
            {type !== ActionType.VIEW && (
              <CButtonSave
                htmlType="submit"
                loading={loadingAdd || isLoadingUpdate}
                onClick={() => setSubmitType('save')}
              />
            )}
            {type !== ActionType.VIEW && (
              <CButtonClose
                onClick={handleCloseModal}
                disabled={false}
                type="default"
                htmlType="button"
              />
            )}
          </Space>
        </Row>
      </Form>
    </WrapperPage>
  );
};

export default FormGeneral;
