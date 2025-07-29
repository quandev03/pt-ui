import {
  CInput,
  CModalConfirm,
  CSwitch,
  FormFooterDetail,
} from '@react/commons/index';
import { TitleHeader } from '@react/commons/Template/style';
import { ACTION_MODE_ENUM } from '@react/commons/types';
import { getActionMode } from '@react/utils/index';
import { MESSAGE } from '@react/utils/message';
import validateForm from '@react/utils/validator';
import { useQueryClient } from '@tanstack/react-query';
import { Card, Col, Form, Row, Spin } from 'antd';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCreateConfig } from '../hooks/useCreateConfig';
import {
  queryKeyDetailConfig,
  useDetailConfig,
} from '../hooks/useDetailConfig';
import { useEditConfig } from '../hooks/useEditConfig';
import { AddEditViewProps } from '../types';

const AddEditViewPage: React.FC<AddEditViewProps> = ({ actionMode }) => {
  const [form] = Form.useForm();
  const isViewMode = actionMode === ACTION_MODE_ENUM.VIEW;
  const isCreateMode = actionMode === ACTION_MODE_ENUM.CREATE;
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { mutate: mutateCreate, isPending: isLoadingCreate } =
    useCreateConfig();
  const { data, isFetching: isLoadingDetail } = useDetailConfig(id);
  const { mutate: mutateEdit, isPending: isLoadingEdit } = useEditConfig();

  useEffect(() => {
    form.setFieldsValue(data);
  }, [data, isViewMode]);

  const handleSubmit = (values: any, isSaveAndAdd?: boolean) => {
    const { status, statusOnline, ...restValues } = values;
    const payload = {
      ...restValues,
      status: +status,
      statusOnline: +statusOnline,
    };
    switch (actionMode) {
      case ACTION_MODE_ENUM.VIEW:
        navigate(pathRoutes.configSystemParamEdit(id));
        break;
      case ACTION_MODE_ENUM.CREATE:
        mutateCreate(payload, {
          onSuccess: () =>
            !isSaveAndAdd ? window.history.back() : form.resetFields(),
        });
        break;
      case ACTION_MODE_ENUM.EDIT:
        CModalConfirm({
          message: MESSAGE.G04,
          onOk: () => {
            id &&
              mutateEdit(
                { id, payload },
                {
                  onSuccess: () => {
                    queryClient.invalidateQueries({
                      queryKey: [queryKeyDetailConfig, id],
                    });
                  },
                }
              );
          },
        });
        break;
    }
  };

  const handleFinish = (values: any) => {
    handleSubmit(values);
  };
  const handleEdit = () => {
    navigate(pathRoutes.configSystemParamEdit(id));
  };
  return (
    <>
      <TitleHeader>{`${getActionMode(actionMode)} cấu hình`}</TitleHeader>
      <Spin spinning={isLoadingCreate || isLoadingDetail || isLoadingEdit}>
        <Form
          form={form}
          colon={false}
          onFinish={handleFinish}
          labelCol={{ prefixCls: 'w-[154px]' }}
          initialValues={{ status: true, statusOnline: true }}
        >
          <Card className="mb-5">
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  label="Trạng thái kênh BCSS"
                  name="status"
                  valuePropName="checked"
                >
                  <CSwitch disabled={isViewMode} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Trạng thái kênh online"
                  name="statusOnline"
                  valuePropName="checked"
                >
                  <CSwitch disabled={isViewMode} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Loại cấu hình"
                  name="type"
                  rules={[validateForm.required]}
                >
                  <CInput
                    disabled={!isCreateMode}
                    maxLength={100}
                    placeholder="Loại cấu hình"
                    uppercase
                  />
                </Form.Item>
              </Col>
              <Col span={12} />
              <Col span={12}>
                <Form.Item
                  label="Mã cấu hình"
                  name="code"
                  rules={[validateForm.required]}
                >
                  <CInput
                    disabled={!isCreateMode}
                    maxLength={100}
                    placeholder="Mã cấu hình"
                    uppercase
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Tên cấu hình"
                  name="name"
                  rules={[validateForm.required]}
                >
                  <CInput
                    disabled={isViewMode}
                    maxLength={100}
                    placeholder="Tên cấu hình"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Giá trị" name="value">
                  <CInput
                    disabled={isViewMode}
                    maxLength={100}
                    placeholder="Giá trị"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Loại dữ liệu"
                  name="dataType"
                  rules={[validateForm.required]}
                >
                  <CInput
                    disabled={isViewMode}
                    maxLength={100}
                    placeholder="Loại dữ liệu"
                  />
                </Form.Item>
              </Col>
            </Row>
            <FormFooterDetail handleEdit={handleEdit} actionMode={actionMode} onSubmit={handleSubmit} />
          </Card>
        </Form>
      </Spin>
    </>
  );
};

export default AddEditViewPage;
