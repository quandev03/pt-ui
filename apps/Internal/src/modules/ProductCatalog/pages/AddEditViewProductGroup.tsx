import { TitleHeader } from '@react/commons/Template/style';
import { Card, Col, Form, Row, Space, Spin, TreeSelect } from 'antd';
import { AddEditViewProps, ProductCatalog, ProductType } from '../types';
import { useDetailProductCatalogQuery } from '../../ProductCatalog/hooks/useDetailProductCatalogQuery';
import { Link, useNavigate, useParams } from 'react-router-dom';
import validateForm from '@react/utils/validator';
import CInput from '@react/commons/Input';
import { useEffect, useMemo } from 'react';
import { useProductGroupQuery } from '../../ProductCatalog/hooks/useProductGroupQuery';
import { mapProductGroups } from '../../ProductCatalog/utils';
import { useAddProductCatalogMutation } from '../hooks/useAddProductCatalogMutation';
import { useEditProductCatalogMutation } from '../hooks/useEditProductCatalogMutation';
import { ActionsTypeEnum, ActionType } from '@react/constants/app';
import {
  CButtonClose,
  CButtonDelete,
  CButtonEdit,
  CButtonSave,
  CButtonSaveAndAdd,
} from '@react/commons/Button';
import { CModalConfirm } from '@react/commons/index';
import { MESSAGE } from '@react/utils/message';
import { useDeleteProductCatalogMutation } from '../hooks/useDeleteProductCatalogMutation';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { subPageTitle } from '@react/utils/index';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import { includes } from 'lodash';

const AddEditViewProductGroupPage: React.FC<AddEditViewProps> = ({
  actionType,
}) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const actions = useRolesByRouter();
  const đisabled = actionType === ActionType.VIEW;

  const { isLoading: isLoadingDetail, data: productGroupDetail } =
    useDetailProductCatalogQuery(id ?? '');
  const { isLoading: isLoadingProductGroup, data: productGroupData } =
    useProductGroupQuery();
  const { isPending: isLoadingAdd, mutate: addMutate } =
    useAddProductCatalogMutation(form);
  const { isPending: isLoadingEdit, mutate: editMutate } =
    useEditProductCatalogMutation(form);
  const { isPending: isLoadingDelete, mutate: deleteMutate } =
    useDeleteProductCatalogMutation();

  const productGroupTreeData = useMemo(() => {
    const groups = (data?: ProductCatalog[]): any =>
      data
        ?.filter((item) => item.id !== Number(id))
        ?.map((item) => ({ ...item, children: groups(item.children) }));
    return mapProductGroups(groups(productGroupData) || []);
  }, [productGroupData, id]);

  useEffect(() => {
    productGroupDetail && form.setFieldsValue(productGroupDetail);
  }, [productGroupDetail]);

  const handleFinish = (values: any) => {
    const newValues = {
      ...values,
      id: id ? Number(id) : null,
      productType: ProductType.GROUP,
    };
    delete newValues.isKeepPage;

    if (actionType === ActionType.ADD) {
      addMutate(newValues, {
        onSuccess: () =>
          values.isKeepPage ? form.resetFields() : navigate(-1),
      });
    } else {
      editMutate({ id, data: newValues });
    }
  };

  const handleEdit = () => {
    CModalConfirm({
      message: MESSAGE.G04,
      onOk: form.submit,
    });
  };

  const handleDelete = () => {
    CModalConfirm({
      message: MESSAGE.G05,
      onOk: () => id && deleteMutate(id, { onSuccess: () => navigate(-1) }),
    });
  };

  return (
    <>
      <TitleHeader>{subPageTitle(actionType)} nhóm sản phẩm</TitleHeader>
      <Spin
        spinning={
          isLoadingDetail || isLoadingAdd || isLoadingEdit || isLoadingDelete
        }
      >
        <Form
          form={form}
          labelCol={{ xl: { span: 8 }, xxl: { span: 6 } }}
          colon={false}
          onFinish={handleFinish}
        >
          <Card className="mb-5">
            <div className="font-medium text-base text-primary mb-5">
              Thông tin nhóm sản phẩm
            </div>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  label="Mã nhóm sản phẩm"
                  name="productCode"
                  rules={[validateForm.required]}
                >
                  <CInput
                    placeholder="Nhập mã sản phẩm"
                    uppercase
                    preventSpace
                    preventSpecial
                    preventVietnamese
                    maxLength={50}
                    disabled={đisabled}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Tên nhóm sản phẩm"
                  name="productName"
                  rules={[validateForm.required]}
                >
                  <CInput
                    placeholder="Nhập tên sản phẩm"
                    maxLength={100}
                    disabled={đisabled}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Nhóm sản phẩm cha" name="parentId">
                  <TreeSelect
                    placeholder="Chọn nhóm sản phẩm cha"
                    allowClear
                    showSearch
                    treeDefaultExpandAll
                    treeNodeFilterProp="title"
                    loading={isLoadingProductGroup}
                    treeData={productGroupTreeData as any}
                    disabled={đisabled}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
          <Row justify="end">
            <Form.Item name="isKeepPage" hidden />
            <Space size="middle">
              {actionType === ActionType.ADD && (
                <>
                  <CButtonSaveAndAdd
                    onClick={() => form.setFieldValue('isKeepPage', true)}
                    htmlType="submit"
                  />
                  <CButtonSave
                    onClick={() => form.setFieldValue('isKeepPage', false)}
                    htmlType="submit"
                  />
                </>
              )}
              {actionType === ActionType.EDIT && (
                <CButtonSave onClick={handleEdit} />
              )}
              {actionType === ActionType.VIEW && (
                <>
                  {includes(actions, ActionsTypeEnum.DELETE) && (
                    <CButtonDelete onClick={handleDelete} />
                  )}
                  {includes(actions, ActionsTypeEnum.UPDATE) && (
                    <Link to={pathRoutes.productGroupEdit(id)}>
                      <CButtonEdit />
                    </Link>
                  )}
                </>
              )}
              <CButtonClose onClick={() => navigate(-1)} />
            </Space>
          </Row>
        </Form>
      </Spin>
    </>
  );
};

export default AddEditViewProductGroupPage;
