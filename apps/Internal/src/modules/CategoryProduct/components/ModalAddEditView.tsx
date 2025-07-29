import {
  CButtonClose,
  CButtonDelete,
  CButtonEdit,
  CButtonSave,
  CButtonSaveAndAdd,
} from '@react/commons/Button';
import { CModalConfirm, WrapperPage } from '@react/commons/index';
import CInput from '@react/commons/Input';
import CSwitch from '@react/commons/Switch';
import { TitleHeader } from '@react/commons/Template/style';
import CTextArea from '@react/commons/TextArea';
import { AnyElement, ModelStatus } from '@react/commons/types';
import { ActionType } from '@react/constants/app';
import { RegexOnlyTextAndNumbers } from '@react/constants/regex';
import { MESSAGE } from '@react/utils/message';
import { Card, Col, Form, Row, Select, Space, Spin } from 'antd';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useGetDetailCategoryProduct,
  useGetListCategotyType,
  useSupportAddCategoryProduct,
  useSupportDeleteCategoryProduct,
  useSupportUpdateCategoryProduct,
} from '../queryHook';
import useGetTypeAtrribute from '../queryHook/useGetTypeAtrribute';
import useCategoryProductStore from '../store';
import {
  IListCategoryType,
  PayloadCreateUpdateCategoryProduct,
  ProductTypeGroup,
  TypeAttribute,
} from '../types';
import ProductCategoryAttributes from './ProductCategoryAttributes';
type Props = {
  typeModal: ActionType;
};

const ModalAddEditView: FC<Props> = ({ typeModal }) => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const { id } = useParams();
  const { isFetching: isFetchingView, data: categoryProductDetail } =
    useGetDetailCategoryProduct(id ?? '');
  const { data, isLoading: loadingCategoryType } = useGetListCategotyType();
  const optionCategoryType = useMemo(() => {
    if (!data) return [];
    return data.map((item: IListCategoryType) => {
      return {
        label: item.value,
        value: item.code,
      };
    });
  }, [data, loadingCategoryType]);
  const navigate = useNavigate();
  const [submitType, setSubmitType] = useState<string>('');
  const { data: dataTypeAttribute } = useGetTypeAtrribute();

  const listTypeAttribute = useMemo(() => {
    if (!dataTypeAttribute) return [];
    return dataTypeAttribute;
  }, [dataTypeAttribute]);
  const { resetCategoryProductStore, isValuesChanged, setIsValuesChanged, updateTranslatedValue, translatedValues } =
    useCategoryProductStore();
  const handleClose = useCallback(() => {
    form.resetFields();
    resetCategoryProductStore();
    navigate(-1);
  }, [form, navigate, resetCategoryProductStore]);
  const handleCloseAddSave = useCallback(() => {
    form.resetFields();
  }, [form]);
  const handleCloseModal = useCallback(() => {
    handleClose();
  }, [handleClose]);
  const { mutate: createCategoryProduct, isPending: loadingAdd } =
    useSupportAddCategoryProduct(() => {
      if (submitType === 'saveAndAdd') {
        handleCloseAddSave();
      } else {
        handleClose();
      }
    }, form);
  useEffect(() => {
    return () => {
      form.resetFields();
      resetCategoryProductStore();
      setIsValuesChanged(false);
    };
  }, [form, resetCategoryProductStore, setIsValuesChanged]);
  const { mutate: updateCategoryProduct, isPending: loadingUpdate } =
    useSupportUpdateCategoryProduct(handleClose, form);
  const { mutate: deleteCategoryProduct } =
    useSupportDeleteCategoryProduct(handleClose);
  const handleFinishForm = useCallback(
    (values: PayloadCreateUpdateCategoryProduct) => {
      const data = {
        id: categoryProductDetail?.id || null,
        ...values,
        status: ModelStatus.ACTIVE,
        productCategoryAttributeDTOS: values.productCategoryAttributeDTOS ?? [],
      };
      const dataUpdate = {
        ...values,
        id: categoryProductDetail?.id || null,
        status: values.status ? ModelStatus.ACTIVE : ModelStatus.INACTIVE,
        categoryType:
          typeof values.categoryType === 'object' &&
          values.categoryType !== null
            ? values.categoryType.value
            : values.categoryType,
        productCategoryAttributeDTOS: values.productCategoryAttributeDTOS
          ? values.productCategoryAttributeDTOS.map(
              (attribute: any, attributeIndex: number) => ({
                id:
                  categoryProductDetail?.productCategoryAttributeDTOS?.[
                    attributeIndex
                  ]?.id || null,
                productCategoryId: categoryProductDetail?.id || null,
                attributeType: attribute.attributeType,
                attributeName: attribute.attributeName,
                productCategoryAttributeValueDTOS:
                  attribute.productCategoryAttributeValueDTOS.map(
                    (value: any, valueIndex: number) => {
                      const translationKey = `${attributeIndex}-${valueIndex}`;
                      const translation = translatedValues[translationKey];
                      
                      return {
                        id:
                          categoryProductDetail?.productCategoryAttributeDTOS?.[
                            attributeIndex
                          ]?.productCategoryAttributeValueDTOS?.[valueIndex]
                            ?.id || null,
                        productCategoryAttributeId:
                          categoryProductDetail?.productCategoryAttributeDTOS?.[
                            attributeIndex
                          ]?.productCategoryAttributeValueDTOS?.[valueIndex]
                            ?.productCategoryAttributeId || null,
                        value: value.value,
                        valueEn: translation?.value ?? "",
                        valueType: "Text"
                      };
                    }
                  ),
              })
            )
          : [],
      };
      if (typeModal === ActionType.ADD) {
        createCategoryProduct(data as AnyElement);
      }
      if (typeModal === ActionType.EDIT) {
        CModalConfirm({
          message: MESSAGE.G04,
          onOk: () => {
            updateCategoryProduct(dataUpdate as AnyElement);
          },
        });
      }
    },
    [
      categoryProductDetail?.id,
      categoryProductDetail?.productCategoryAttributeDTOS,
      typeModal,
      form,
      createCategoryProduct,
      updateCategoryProduct,
      translatedValues
    ]
  );
  const [checkCategoryType, setCheckCategoryType] = useState<boolean>(false);
  useEffect(() => {
    if (categoryProductDetail) {
      form.setFieldsValue({
        ...categoryProductDetail,
        categoryType: String(categoryProductDetail.categoryType),
      });
      categoryProductDetail.productCategoryAttributeDTOS?.forEach((attr, attrIndex) => {
        attr.productCategoryAttributeValueDTOS?.forEach((value, valueIndex) => {
          if (value.valueEn) {
            const key = `${attrIndex}-${valueIndex}`;
            updateTranslatedValue(key, value.valueEn, 'en');
          }
        });
      });
      if (categoryProductDetail.categoryType === Number(ProductTypeGroup.KIT)) {
        setCheckCategoryType(true);
      } else {
        setCheckCategoryType(false);
      }
    }
  }, [form, categoryProductDetail, setCheckCategoryType, setCheckCategoryType]);
  const handleChangeCategoryType = useCallback(
    (value: string) => {
      if (value === ProductTypeGroup.KIT) {
        setCheckCategoryType(true);

        const currentAttributes =
          form.getFieldValue('productCategoryAttributeDTOS') || [];

        const hasType3 = currentAttributes.some(
          (attr: any) => attr.attributeType === TypeAttribute.GOI_CUOC_CHINH
        );
        const hasType4 = currentAttributes.some(
          (attr: any) => attr.attributeType === TypeAttribute.LOAI_SIM
        );

        const newAttributes = [...currentAttributes];

        if (!hasType4) {
          newAttributes.push({
            attributeType: TypeAttribute.LOAI_SIM,
            productCategoryAttributeValueDTOS: [],
          });
        }

        if (!hasType3) {
          newAttributes.push({
            attributeType: TypeAttribute.GOI_CUOC_CHINH,
            productCategoryAttributeValueDTOS: [],
          });
        }

        if (!hasType3 || !hasType4) {
          form.setFieldValue('productCategoryAttributeDTOS', newAttributes);
        }
      } else {
        setCheckCategoryType(false);
      }
    },
    [form]
  );
  const handleDelete = () => {
    CModalConfirm({
      message: MESSAGE.G05,
      onOk: () =>
        categoryProductDetail &&
        deleteCategoryProduct(String(categoryProductDetail.id)),
    });
  };
  const renderTitle = () => {
    switch (typeModal) {
      case ActionType.ADD:
        return 'Tạo danh mục loại sản phẩm';
      case ActionType.EDIT:
        return 'Cập nhật danh mục loại sản phẩm';
      case ActionType.VIEW:
        return 'Xem chi tiết danh mục loại sản phẩm';
      default:
        return '';
    }
  };
  const handlePates = async (
    e: React.ClipboardEvent<HTMLInputElement>,
    field: string
  ) => {
    const value = (e.target as HTMLInputElement).value;
    form.setFieldValue(field, value.trim());
    form.validateFields([field]);
  };
  return (
    <WrapperPage>
      <Spin spinning={isFetchingView}>
        <TitleHeader>{renderTitle()}</TitleHeader>
        <Form
          form={form}
          labelCol={{ style: { width: '160px' } }}
          colon={false}
          onFinish={handleFinishForm}
          disabled={typeModal === ActionType.VIEW}
          onValuesChange={(values) => {
            if (!isValuesChanged) {
              setIsValuesChanged(true);
            }
          }}
        >
          <Card className="mb-5">
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  label="Mã loại sản phẩm"
                  name="categoryCode"
                  rules={[
                    {
                      required: true,
                      message: MESSAGE.G06,
                    },
                    {
                      validator: (_, value) =>
                        !value || RegexOnlyTextAndNumbers.test(value)
                          ? Promise.resolve()
                          : Promise.reject(
                              new Error(
                                'Mã loại sản phẩm' +
                                  intl.formatMessage({
                                    id: 'validator.errFormat',
                                  })
                              )
                            ),
                    },
                  ]}
                >
                  <CInput
                    uppercase
                    preventVietnamese
                    preventSpace
                    preventSpecial
                    placeholder="Nhập mã loại sản phẩm"
                    maxLength={50}
                    disabled={typeModal === ActionType.VIEW}
                    onPaste={(e) => {
                      handlePates(e, 'categoryCode');
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Tên loại sản phẩm"
                  name="categoryName"
                  rules={[
                    {
                      required: true,
                      message: MESSAGE.G06,
                    },
                  ]}
                >
                  <CInput
                    placeholder="Nhập tên loại sản phẩm"
                    maxLength={100}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Nhóm loại sản phẩm"
                  name="categoryType"
                  rules={[
                    {
                      required: true,
                      message: MESSAGE.G06,
                    },
                  ]}
                >
                  <Select
                    options={optionCategoryType}
                    loading={loadingCategoryType}
                    onChange={handleChangeCategoryType}
                    placeholder="Chọn loại sản phẩm"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={intl.formatMessage({ id: 'common.active' })}
                  name="status"
                  valuePropName="checked"
                  initialValue={true}
                >
                  <CSwitch disabled={typeModal !== ActionType.EDIT} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="Mô tả" name="description">
                  <CTextArea
                    placeholder="Nhập mô tả"
                    maxLength={200}
                    rows={3}
                  />
                </Form.Item>
              </Col>
            </Row>
            <ProductCategoryAttributes
              checkCategoryType={checkCategoryType}
              form={form}
              typeModal={typeModal}
            />
          </Card>
          <Row justify="end">
            <Space size="middle">
              {typeModal === ActionType.VIEW && (
                <>
                  <CButtonDelete onClick={handleDelete} disabled={false} />
                  <CButtonEdit
                    onClick={() => {
                      navigate(
                        pathRoutes.category_product_edit(
                          categoryProductDetail?.id ?? ''
                        )
                      );
                    }}
                    disabled={false}
                  />
                  <CButtonClose
                    onClick={handleCloseModal}
                    disabled={false}
                    type="default"
                  />
                </>
              )}
              {typeModal === ActionType.ADD && (
                <CButtonSaveAndAdd
                  htmlType="submit"
                  loading={loadingAdd || loadingUpdate}
                  onClick={() => setSubmitType('saveAndAdd')}
                />
              )}
              {typeModal !== ActionType.VIEW && (
                <CButtonSave
                  htmlType="submit"
                  loading={loadingAdd || loadingUpdate}
                  onClick={() => setSubmitType('save')}
                />
              )}
              {typeModal !== ActionType.VIEW && (
                <CButtonClose
                  onClick={handleCloseModal}
                  disabled={false}
                  type="default"
                />
              )}
            </Space>
          </Row>
        </Form>
      </Spin>
    </WrapperPage>
  );
};

export default ModalAddEditView;
