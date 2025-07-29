import {
  CButtonClose,
  CButtonDelete,
  CButtonEdit,
  CButtonSave,
  CButtonSaveAndAdd,
} from '@react/commons/Button';
import { TitleHeader } from '@react/commons/Template/style';
import { ActionsTypeEnum, ActionType } from '@react/constants/app';
import { Form, Row, Space, Spin } from 'antd';
import { useCallback, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Attribute from '../components/Attribute';
import Information from '../components/Information';
import { useAddProductCatalogMutation } from '../hooks/useAddProductCatalogMutation';
import { useDetailProductCatalogQuery } from '../hooks/useDetailProductCatalogQuery';
import { useEditProductCatalogMutation } from '../hooks/useEditProductCatalogMutation';
import { AddEditViewProps, AttributeType, ProductType } from '../types';
import { CModalConfirm } from '@react/commons/index';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useDeleteProductCatalogMutation } from '../hooks/useDeleteProductCatalogMutation';
import { ModelStatus } from '@react/commons/types';
import { mapProductDTOStoAdd, mapProductDTOStoView } from '../utils';
import TableForm from '../components/TableForm';
import { MESSAGE } from '@react/utils/message';
import { subPageTitle } from '@react/utils/index';
import { useParameterQuery } from 'apps/Internal/src/hooks/useParameterQuery';
import { includes } from 'lodash';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import { useProductCatalogStore } from '../store';

const initialValues = {
  productStatus: true,
  checkQuantity: true,
  checkSerial: true,
  productPriceDTOS: [{}],
  productVatDTOS: [{}],
};

const AddEditViewPage: React.FC<AddEditViewProps> = ({ actionType }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const actions = useRolesByRouter();
  const disabled = actionType === ActionType.VIEW;

  const { isLoading: isLoadingDetail, data: productCatalog } =
    useDetailProductCatalogQuery(id ?? '');
  const { isPending: isLoadingAdd, mutate: addMutate } =
    useAddProductCatalogMutation(form);
  const { isPending: isLoadingEdit, mutate: editMutate } =
    useEditProductCatalogMutation(form);
  const { isPending: isLoadingDelete, mutate: deleteMutate } =
    useDeleteProductCatalogMutation();
  const { data: parameterData } = useParameterQuery({
    'table-name': 'PRODUCT',
    'column-name': 'PRODUCT_UOM',
  });
  const { unitHetTocDoCaoGiamXuong, unitDungLuongTocDoCao, reset, productDescription, setProductDescription, setSelectedLanguage } = useProductCatalogStore();
  useEffect(() => {
    if (productCatalog) {
      setProductDescription(productCatalog?.productDescriptionEn ?? '');
      setSelectedLanguage(productCatalog?.productDescriptionEn ? 'en' : '');
      form.setFieldsValue({
        ...productCatalog,
        productPriceDTOS: mapProductDTOStoView(productCatalog.productPriceDTOS),
        productVatDTOS: mapProductDTOStoView(productCatalog.productVatDTOS),
        attributeValueList: [],
      });
    }
  }, [productCatalog]);

  const handleFinish = useCallback((values: any) => {
    const newValues = {
      ...values,
      productDescriptionEn: productDescription,
      id: id ? Number(id) : null,
      productType: ProductType.PRODUCT,
      productStatus: values.productStatus
        ? ModelStatus.ACTIVE
        : ModelStatus.INACTIVE,
      checkQuantity: values.checkQuantity ? 1 : 0,
      checkSerial: values.checkSerial ? 1 : 0,
      productPriceDTOS: mapProductDTOStoAdd(values.productPriceDTOS),
      productVatDTOS: mapProductDTOStoAdd(values.productVatDTOS),
      attributeValueList: values.attributeValueList?.flatMap((item: any) => {
        let productCategoryAttributeValueId = '';
        if (item.attributeValueObj) {
          try {
            const parsedValue = item.attributeType === AttributeType.SKUID || item.attributeType === AttributeType.LOAI_GOI || item.attributeType === AttributeType.NHA_CUNG_CAP ? item.attributeValueObj : JSON.parse(item.attributeValueObj);
            if (Array.isArray(parsedValue)) {
              return parsedValue.map(parsedItem => ({
                id: item.id,
                productCategoryAttributeId: item.attributeId,
                productCategoryAttributeValueId: parsedItem.id || '',
                attributeValue: parsedItem.value,
              }));
            } else {
              productCategoryAttributeValueId = parsedValue.id || '';
              const renderValue = () => {
                if (item.attributeType === AttributeType.HET_TOC_DO_CAO_GIAM_XUONG) {
                  return parsedValue != null
                    ? parsedValue + ' ' + (unitHetTocDoCaoGiamXuong || "Kbps")
                    : undefined;
                } else if (item.attributeType === AttributeType.DUNG_LUONG_TOC_DO_CAO) {
                  return parsedValue ? parsedValue + ' ' + (unitDungLuongTocDoCao ? unitDungLuongTocDoCao : "GB") : undefined;
                }
                else if (item.attributeType === AttributeType.SO_NGAY_SU_DUNG
                  || item.attributeType === AttributeType.LOAI_GOI || item.attributeType === AttributeType.NHA_CUNG_CAP ||
                  item.attributeType === AttributeType.SKUID
                ) {
                  return parsedValue
                }
                else {
                  return parsedValue.value
                }
              }
              return [{
                id: item.id,
                productCategoryAttributeId: item.attributeId,
                productCategoryAttributeValueId: productCategoryAttributeValueId,
                attributeValue: renderValue(),
              }];
            }
          } catch (error) {
            return [{
              id: item.id,
              productCategoryAttributeId: item.attributeId,
              productCategoryAttributeValueId: '',
              attributeValue: item.attributeValueObj,
            }];
          }
        } else {
          return [{
            id: item.id,
            productCategoryAttributeId: item.attributeId,
            productCategoryAttributeValueId: '',
            attributeValue: item.attributeValueObj || '',
          }];
        }
      }),
    };
    delete newValues.isKeepPage;
    if (actionType === ActionType.ADD) {
      addMutate(newValues, {
        onSuccess: () => {
          if (values.isKeepPage) {
            reset();
            form.resetFields();
            parameterData?.length &&
              form.setFieldValue('productUom', parameterData[0].value);
          } else {
            navigate(-1);
          }
        },
      });
    } else {
      editMutate({ id, data: newValues });
    }
  }, [unitHetTocDoCaoGiamXuong, unitDungLuongTocDoCao, reset, productDescription]);
  useEffect(() => {
    return () => {
      reset();
    }
  }, [reset]);
  const handleFinishFailed = () => {
    const error = document.querySelector('.ant-form-item-has-error');
    error && error.scrollIntoView({ block: 'center', behavior: 'smooth' });
  };

  const handleEdit = () => {
    form
      .validateFields()
      .then(() =>
        CModalConfirm({
          message: MESSAGE.G04,
          onOk: form.submit,
        })
      )
      .catch(handleFinishFailed);
  };

  const handleDelete = () => {
    CModalConfirm({
      message: MESSAGE.G05,
      onOk: () => id && deleteMutate(id, { onSuccess: () => navigate(-1) }),
    });
  };

  return (
    <>
      <TitleHeader>{subPageTitle(actionType)} sản phẩm</TitleHeader>
      <Spin
        spinning={
          isLoadingDetail || isLoadingAdd || isLoadingEdit || isLoadingDelete
        }
      >
        <Form
          form={form}
          labelCol={{ span: 6 }}
          colon={false}
          labelWrap
          initialValues={initialValues}
          onFinish={handleFinish}
          onFinishFailed={handleFinishFailed}
        >
          <Space direction="vertical" size="middle" className="mb-5">
            <Information disabled={disabled} />
            <Attribute disabled={disabled} actionType={actionType} />
            <TableForm
              title="Giá sản phẩm sau thuế"
              name="productPriceDTOS"
              disabled={disabled}
            />
            <TableForm
              title="Thuế suất"
              name="productVatDTOS"
              disabled={disabled}
            />
          </Space>
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
                    <Link to={pathRoutes.productCatalogEdit(id)}>
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

export default AddEditViewPage;