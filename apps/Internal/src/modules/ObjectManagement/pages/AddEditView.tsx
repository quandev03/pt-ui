import {
  CInput,
  CInputNumber,
  CModalConfirm,
  FormFooterDetail
} from '@react/commons/index';
import CSelect from '@react/commons/Select';
import Show from '@react/commons/Template/Show';
import { TitleHeader } from '@react/commons/Template/style';
import { ACTION_MODE_ENUM } from '@react/commons/types';
import { decodeSearchParams } from '@react/helpers/utils';
import { getActionMode } from '@react/utils/index';
import { MESSAGE } from '@react/utils/message';
import validateForm from '@react/utils/validator';
import { Card, Col, Form, Row, Spin, Typography } from 'antd';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useCreateObject } from '../hooks/useCreateObject';
import { useDeleteObject } from '../hooks/useDeleteObject';
import { useDetailObject } from '../hooks/useDetailObject';
import { useEditObject } from '../hooks/useEditObject';
import { useListAction } from '../hooks/useListAction';
import { useListObject } from '../hooks/useListObject';
import { AddEditViewProps } from '../types';

const AddEditViewPage: React.FC<AddEditViewProps> = ({ actionMode }) => {
  const [form] = Form.useForm();
  const isViewMode = actionMode === ACTION_MODE_ENUM.VIEW;
  const isCreateMode = actionMode === ACTION_MODE_ENUM.CREATE;
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const isPartner = params?.isPartner === 'true';
  const isMobile = params?.isMobile === 'true';
  const url = Form.useWatch('url', form);
  const { mutate: mutateCreate, isPending: isLoadingCreate } =
    useCreateObject();
  const { data = {}, isFetching: isLoadingDetail } = useDetailObject(
    id,
    isPartner,
    isMobile
  );
  const { mutate: mutateEdit, isPending: isLoadingEdit } = useEditObject();
  const { mutate: mutateDelete, isPending: isLoadingDelete } =
    useDeleteObject();
  const { data: listAction, isFetching: isLoadingAction } = useListAction();
  const { data: listObject } = useListObject(isPartner, isMobile);
  useEffect(() => {
    if (!isCreateMode) return;
    form.setFieldValue(
      'actionIds',
      listAction
        ?.filter((e) => ['CREATE', 'READ', 'UPDATE', 'DELETE'].includes(e.code))
        ?.map((c) => c.value)
    );
  }, [listAction]);

  useEffect(() => {
    form.setFieldsValue({ ...data, isPartner });
  }, [data]);

  const handleSubmit = (values: any, isSaveAndAdd?: boolean) => {
    const payload = { ...values, isPartner, isMobile };
    switch (actionMode) {
      case ACTION_MODE_ENUM.VIEW:
        isMobile
          ? navigate(
            pathRoutes.object_edit(id) +
            `?isPartner=${isPartner}&isMobile=true`
          )
          : navigate(pathRoutes.object_edit(id) + `?isPartner=${isPartner}`);
        break;
      case ACTION_MODE_ENUM.CREATE:
        mutateCreate(payload, {
          onSuccess: () =>
            !isSaveAndAdd ? window.history.back() : form.resetFields(),
        });
        break;
      case ACTION_MODE_ENUM.EDIT:
        id && mutateEdit({ id, payload });
        break;
    }
  };

  const handleFinish = (values: any) => {
    handleSubmit(values);
  };

  const handleDelete = () => {
    CModalConfirm({
      message: MESSAGE.G05,
      onOk: () =>
        id &&
        mutateDelete(
          { id, isPartner, isMobile },
          { onSuccess: () => navigate(-1) }
        ),
    });
  };
  const handleEdit = () => {
    isMobile
      ? navigate(
        `${pathRoutes.object_edit(id)}?isPartner=${isPartner}&isMobile=${isMobile}`
      )
      : navigate(`${pathRoutes.object_edit(id)}?isPartner=${isPartner}`);
  };
  return (
    <>
      <TitleHeader>{`${getActionMode(actionMode)} object`}</TitleHeader>
      <Spin
        spinning={
          isLoadingCreate || isLoadingDetail || isLoadingEdit || isLoadingDelete
        }
      >
        <Form
          form={form}
          colon={false}
          onFinish={handleFinish}
          labelCol={{ span: 4 }}
        >
          <Card className="mb-5">
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  label="Mã"
                  name="code"
                  rules={[validateForm.required]}
                >
                  <CInput
                    placeholder="VD: OBJECT-MANAGEMENT"
                    disabled={!isCreateMode}
                    maxLength={50}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Tên"
                  name="name"
                  rules={[validateForm.required]}
                >
                  <CInput
                    placeholder="Nhập tên"
                    disabled={isViewMode}
                    maxLength={250}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="URI" name="url" rules={[]}>
                  <CInput
                    placeholder="Nếu là parent Object thì uri để trống"
                    disabled={isViewMode}
                    maxLength={250}
                  />
                </Form.Item>
              </Col>
              <Show.When isTrue={!isMobile}>
                <Col span={12}>
                  <Form.Item label="ID cha" name="parentId">
                    <CSelect
                      placeholder="Nhập id cha, lấy tại cột ID, màn list"
                      disabled={isViewMode}
                      maxLength={250}
                      options={listObject?.map((e) => ({
                        label: e.title,
                        value: e.key,
                      }))}
                    />
                  </Form.Item>
                </Col>
              </Show.When>
              <Col span={12}>
                <Form.Item
                  label="Ordinal"
                  name="ordinal"
                  rules={[validateForm.required]}
                >
                  <CInputNumber
                    placeholder="Nhập số thứ tự"
                    disabled={isViewMode}
                    maxLength={4}
                  />
                </Form.Item>
              </Col>
              {url ? (
                <Col span={12}>
                  <Form.Item
                    label="Actions"
                    name="actionIds"
                    rules={[validateForm.required]}
                  >
                    <CSelect
                      options={listAction}
                      placeholder="Chọn actions"
                      disabled={isViewMode}
                      isLoading={isLoadingAction}
                      mode={'multiple'}
                    />
                  </Form.Item>
                </Col>
              ) : (
                <Col span={12}></Col>
              )}
              <Col span={24}>
                <Typography.Text type="danger">
                  Nếu là parent Object thì URI để trống
                </Typography.Text>
              </Col>
            </Row>
            <FormFooterDetail
              actionMode={actionMode}
              handleDelete={handleDelete}
              onSubmit={handleSubmit}
              handleEdit={handleEdit}
            />
          </Card>
        </Form>
      </Spin>
    </>
  );
};

export default AddEditViewPage;
