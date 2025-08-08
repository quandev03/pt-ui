import {
  ActionsTypeEnum,
  AnyElement,
  CInput,
  CInputNumber,
  CSelect,
  decodeSearchParams,
  getActionMode,
  IModeAction,
  MESSAGE,
  ModalConfirm,
  Show,
  TitleHeader,
  useActionMode,
  validateForm,
} from '@vissoft-react/common';
import { Card, Col, Form, Row, Spin, Typography } from 'antd';
import { pathRoutes } from 'apps/Internal/src/routers';
import { useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import FormFooterDetail from '../components/FormFooterDetail';
import { useCreateObject } from '../hooks/useCreateObject';
import { useDeleteObject } from '../hooks/useDeleteObject';
import { useDetailObject } from '../hooks/useDetailObject';
import { useEditObject } from '../hooks/useEditObject';
import { useListAction } from '../hooks/useListAction';
import { useListObject } from './useListObject';

export const AddEditView = () => {
  const actionMode = useActionMode();

  const [form] = Form.useForm();
  const isViewMode = actionMode === IModeAction.READ;
  const isCreateMode = actionMode === IModeAction.CREATE;
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
        ?.filter((e: AnyElement) =>
          [
            ActionsTypeEnum.CREATE,
            ActionsTypeEnum.READ,
            ActionsTypeEnum.UPDATE,
            ActionsTypeEnum.DELETE,
          ].includes(e.code)
        )
        ?.map((c: AnyElement) => c.value)
    );
  }, [listAction]);

  useEffect(() => {
    form.setFieldsValue({ ...data, isPartner });
  }, [data]);

  const handleSubmit = (values: any, isSaveAndAdd?: boolean) => {
    const payload = { ...values, isPartner, isMobile };
    switch (actionMode) {
      case IModeAction.READ:
        isMobile
          ? navigate(
              pathRoutes.object_edit(id) +
                `?isPartner=${isPartner}&isMobile=true`
            )
          : navigate(pathRoutes.object_edit(id) + `?isPartner=${isPartner}`);
        break;
      case IModeAction.CREATE:
        mutateCreate(payload, {
          onSuccess: () =>
            !isSaveAndAdd ? window.history.back() : form.resetFields(),
        });
        break;
      case IModeAction.UPDATE:
        id && mutateEdit({ id, payload });
        break;
    }
  };

  const handleFinish = (values: any) => {
    handleSubmit(values);
  };

  const handleDelete = () => {
    ModalConfirm({
      message: MESSAGE.G05,
      handleConfirm: () =>
        id &&
        mutateDelete(
          { id, isPartner, isMobile },
          { onSuccess: () => navigate(-1) }
        ),
    });
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
          labelAlign="left"
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
            />
          </Card>
        </Form>
      </Spin>
    </>
  );
};
