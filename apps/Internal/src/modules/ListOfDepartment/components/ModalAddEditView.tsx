import {
  CButtonClose,
  CButtonDelete,
  CButtonEdit,
  CButtonSave,
  CButtonSaveAndAdd,
} from '@react/commons/Button';
import CInput from '@react/commons/Input';
import { default as CSelect, default as Select } from '@react/commons/Select';
import CSwitch from '@react/commons/Switch';
import CTag from '@react/commons/Tag';
import { RowButton, TitleHeader } from '@react/commons/Template/style';
import { ModelStatus } from '@react/commons/types';
import { ActionType } from '@react/constants/app';
import { emailRegex, vietnameseCharsRegex } from '@react/constants/regex';
import { MESSAGE } from '@react/utils/message';
import validateForm from '@react/utils/validator';
import type { SelectProps } from 'antd';
import { Card, Col, Form, Row } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import ModalConfirm from 'apps/Internal/src/components/modalConfirm';
import {
  RegOnlyNum,
  RegValidStringEnglish,
} from 'apps/Internal/src/constants/regex';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useParameterQuery } from 'apps/Internal/src/hooks/useParameterQuery';
import { FC, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';
import { ItemEdit, useAddFn } from '../queryHook/useAdd';
import { Cadastral, useArea } from '../queryHook/useArea';
import { useDeleteFn } from '../queryHook/useDelete';
import { useEditFn } from '../queryHook/useEdit';
import { deleteChild, useList } from '../queryHook/useList';
import { useView } from '../queryHook/useView';
import { ContentItem } from '../types';

type TagRender = SelectProps['tagRender'];

type Props = {
  typeModal: ActionType;
};

const ModalAddEditView: FC<Props> = ({ typeModal }) => {
  const intl = useIntl();
  const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const saleChanel = useWatch('saleChanel', form);
  const deliveryAreas = useWatch('deliveryAreas', form);

  const { isLoading: loadingList, data: dataParentId } = useList();
  const { mutate: deleteMutate } = useDeleteFn();
  const {
    isPending: loadingProvinces,
    data: optionsProvinces,
    mutate: getMutateProvinces,
  } = useArea();
  const {
    isPending: loadingDistrict,
    data: optionsDistrict,
    mutate: getMutateDistrict,
  } = useArea();
  const {
    isPending: loadingWard,
    data: optionsWard,
    mutate: getMutateWard,
  } = useArea();

  useEffect(() => {
    getMutateProvinces('');
  }, []);

  useEffect(() => {
    if (itemEdit?.provinceCode) {
      const areaId = optionsProvinces?.filter(
        (item: Cadastral) => item.areaCode === itemEdit?.provinceCode
      )[0]?.id;
      if (!areaId) return;
      getMutateDistrict(areaId);
    }
  }, [optionsProvinces, id]);

  useEffect(() => {
    if (itemEdit?.districtCode) {
      const areaId = optionsDistrict?.filter(
        (item: Cadastral) => item.areaCode === itemEdit?.districtCode
      )[0]?.id;
      if (!areaId) return;
      getMutateWard(areaId);
    }
  }, [optionsDistrict, id]);

  const optionsParentId = deleteChild(dataParentId, Number(id))
    ?.filter((item: ContentItem) => {
      return item.status === ModelStatus.ACTIVE;
    })
    ?.map((item: ContentItem) => {
      return {
        value: item.id,
        label: item.orgName,
      };
    });

  const {
    isFetching: isFetchingView,
    data: itemEdit,
    refetch: refetchGetItemEdit,
  } = useView(id || '');

  useEffect(() => {
    if (typeModal !== ActionType.ADD && id) {
      refetchGetItemEdit();
    }
  }, [typeModal, id]);

  const setValue = (itemEdit: any) => {
    form.setFields([
      {
        name: 'orgCode',
        value: itemEdit?.orgCode,
      },
      {
        name: 'orgName',
        value: itemEdit?.orgName,
      },
      {
        name: 'provinceCode',
        value: itemEdit?.provinceCode,
      },
      {
        name: 'districtCode',
        value: itemEdit?.districtCode,
      },
      {
        name: 'wardCode',
        value: itemEdit?.wardCode,
      },
      {
        name: 'address',
        value: itemEdit?.address,
      },
      {
        name: 'address',
        value: itemEdit?.address,
      },
      {
        name: 'taxCode',
        value: itemEdit?.taxCode,
      },
      {
        name: 'representative',
        value: itemEdit?.representative,
      },
      {
        name: 'parentId',
        value: itemEdit?.parentId,
      },
      {
        name: 'orgSubType',
        value: itemEdit?.orgSubType,
      },
      {
        name: 'status',
        value: itemEdit?.status,
      },
      {
        name: 'saleChanel',
        value: itemEdit?.saleChanel?.split(','),
      },
      {
        name: 'deliveryAreas',
        value: itemEdit?.deliveryAreas?.split(','),
      },
      {
        name: 'phone',
        value: itemEdit?.phone,
      },
      {
        name: 'email',
        value: itemEdit?.email ? (itemEdit?.email as string).split(',') : [],
      },
    ]);
  };

  useEffect(() => {
    if (itemEdit?.id) {
      setValue(itemEdit);
    }
  }, [itemEdit?.id, isFetchingView]);

  const handleClose = () => {
    form.resetFields();
    navigate(-1);
  };

  const handleCloseModal = () => {
    handleClose();
  };

  const { mutate: addMutate, isPending: loadingAdd } = useAddFn(form);
  const { isPending: isLoadingEdit, mutate: editMutate } = useEditFn(form);
  const { isLoading: isLoadingParameter, data: parameterData } =
    useParameterQuery({
      'table-name': 'ORGANIZATION_UNIT',
      'column-name': 'ORG_SUB_TYPE',
    });
  const {
    isLoading: isLoadingParameterSaleChanel,
    data: parameterDataSaleChanel,
  } = useParameterQuery({
    'table-name': 'ORGANIZATION_UNIT',
    'column-name': 'SALES_CHANNELS',
  });
  const checkFirstParent =
    !dataParentId?.some((value: any) => value.parentId === null) ||
    (typeModal !== ActionType.ADD && itemEdit?.parentId === null);
  const optionsOrgSubType = parameterData?.filter((item) => {
    if (checkFirstParent) {
      form.setFields([
        {
          name: 'orgSubType',
          value: '00',
        },
      ]);
      return item.value === '00';
    } else {
      return item.value !== '00';
    }
  });

  const handleFinishForm = (values: ItemEdit) => {
    const data = {
      id: itemEdit?.id || undefined,
      ...values,
      status: values.status ? 1 : 0,
      deliveryAreas: (values.deliveryAreas as string[])?.join(),
      saleChanel: (values.saleChanel as string[])?.join(),
      email: values.email
        ? (values.email as string[])
            .filter(
              (item) =>
                emailRegex.test(item) && !vietnameseCharsRegex.test(item)
            )
            .join(',')
        : '',
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

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const handleDeleteItem = (id: string) => {
    if (id) {
      ModalConfirm({
        message: 'common.confirmDelete',
        handleConfirm: () => {
          deleteMutate(id);
        },
      });
    }
  };

  const renderTitle = () => {
    const name = ' kho';

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

  const tagRender: TagRender = (props) => {
    const { label, value, closable, onClose } = props;
    const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
      event.preventDefault();
      event.stopPropagation();
    };

    const isValueValid =
      emailRegex.test(value) && !vietnameseCharsRegex.test(value);

    return (
      <CTag
        color={isValueValid ? 'success' : 'error'}
        title={isValueValid ? 'Email hợp lệ' : 'Email không hợp lệ'}
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{ marginInlineEnd: 4 }}
      >
        {label}
      </CTag>
    );
  };

  return (
    <>
      <TitleHeader>{renderTitle()}</TitleHeader>
      <Form form={form} {...layout} onFinish={handleFinishForm}>
        <Card>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                labelAlign="left"
                label={intl.formatMessage({ id: 'common.active' })}
                name="status"
                valuePropName="checked"
                initialValue={true}
              >
                <CSwitch disabled={typeModal === ActionType.VIEW} />
              </Form.Item>
            </Col>
            <Col span={12} />
            <Col span={12}>
              <Form.Item
                labelAlign="left"
                label="Mã kho" 
                name="orgCode"
                rules={[
                  validateForm.required,
                  {
                    validator: (_, value) =>
                      !value || RegValidStringEnglish.test(value)
                        ? Promise.resolve()
                        : Promise.reject(
                            new Error(
                              'Mã kho' +
                                intl.formatMessage({
                                  id: 'validator.errFormat',
                                })
                            )
                          ),
                  },
                ]}
              >
                <CInput
                  placeholder="Nhập mã kho"
                  uppercase
                  maxLength={30}
                  preventSpace
                  preventSpecialExceptHyphenAndUnderscore
                  preventVietnamese
                  preventDoubleSpace
                  disabled={typeModal === ActionType.VIEW}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                labelAlign="left"
                label="Tên kho"
                name="orgName"
                rules={[validateForm.required]}
              >
                <CInput
                  placeholder="Nhập tên kho"
                  maxLength={100}
                  disabled={typeModal === ActionType.VIEW}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item labelAlign="left" label="Tỉnh/TP" name="provinceCode">
                <Select
                  placeholder="Chọn Tỉnh/TP"
                  fieldNames={{ label: 'areaName', value: 'areaCode' }}
                  loading={loadingProvinces}
                  disabled={typeModal === ActionType.VIEW}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, options: any) =>
                    (options?.areaName ?? '')
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={optionsProvinces}
                  onChange={(value, option: any) => {
                    getMutateDistrict(option?.id);
                    getMutateWard(undefined);
                    form.setFields([
                      {
                        name: 'districtCode',
                        value: undefined,
                      },
                      {
                        name: 'wardCode',
                        value: undefined,
                      },
                    ]);
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                labelAlign="left"
                label="Quận/Huyện"
                name="districtCode"
              >
                <Select
                  placeholder="Chọn Quận/Huyện"
                  fieldNames={{ label: 'areaName', value: 'areaCode' }}
                  disabled={typeModal === ActionType.VIEW}
                  showSearch
                  loading={loadingDistrict}
                  optionFilterProp="children"
                  filterOption={(input, options: any) =>
                    (options?.areaName ?? '')
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={optionsDistrict}
                  onChange={(value, option: any) => {
                    getMutateWard(option?.id);
                    form.setFields([
                      {
                        name: 'wardCode',
                        value: undefined,
                      },
                    ]);
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item labelAlign="left" label="Xã/Phường" name="wardCode">
                <Select
                  placeholder="Chọn Xã/Phường"
                  fieldNames={{ label: 'areaName', value: 'areaCode' }}
                  disabled={typeModal === ActionType.VIEW}
                  showSearch
                  loading={loadingWard}
                  optionFilterProp="children"
                  filterOption={(input, options: any) =>
                    (options?.areaName ?? '')
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={optionsWard}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item labelAlign="left" label="Địa chỉ" name="address">
                <CInput
                  placeholder="Chọn địa chỉ"
                  maxLength={200}
                  disabled={typeModal === ActionType.VIEW}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                labelAlign="left"
                label="MST"
                name="taxCode"
                rules={[
                  {
                    validator: (_, value) =>
                      !value || RegOnlyNum.test(value)
                        ? Promise.resolve()
                        : Promise.reject(
                            new Error(
                              'Mã số thuế ' +
                                intl.formatMessage({
                                  id: 'validator.errFormat',
                                })
                            )
                          ),
                  },
                ]}
              >
                <CInput
                  placeholder="Nhập MST"
                  maxLength={20}
                  disabled={typeModal === ActionType.VIEW}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                labelAlign="left"
                label="Người đại diện"
                name="representative"
              >
                <CInput
                  placeholder="Nhập người đại diện"
                  maxLength={50}
                  disabled={typeModal === ActionType.VIEW}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                labelAlign="left"
                label="Kho cha"
                name="parentId"
                rules={[
                  {
                    required: !checkFirstParent,
                    message: MESSAGE.G06,
                  },
                ]}
              >
                <Select
                  placeholder="Chọn kho cha"
                  loading={loadingList}
                  disabled={
                    typeModal === ActionType.VIEW ||
                    checkFirstParent ||
                    itemEdit?.parentId === null
                  }
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, options: any) =>
                    (options?.label ?? '')
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={optionsParentId}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                labelAlign="left"
                label="Loại kho"
                name="orgSubType"
                rules={[validateForm.required]}
              >
                <Select
                  placeholder="Chọn loại kho"
                  loading={isLoadingParameter}
                  disabled={
                    typeModal === ActionType.VIEW ||
                    checkFirstParent ||
                    itemEdit?.parentId === null
                  }
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, options: any) =>
                    (options?.label ?? '')
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={optionsOrgSubType}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                labelAlign="left"
                label="Kênh bán"
                name="saleChanel"
                dependencies={['deliveryAreas']}
                rules={
                  (deliveryAreas && deliveryAreas.length > 0) ||
                  (saleChanel && saleChanel.length > 0)
                    ? [validateForm.required]
                    : undefined
                }
              >
                <Select
                  mode="multiple"
                  placeholder="Kênh bán"
                  loading={isLoadingParameterSaleChanel}
                  disabled={typeModal === ActionType.VIEW}
                  showSearch
                  options={parameterDataSaleChanel}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item labelAlign="left" label="SĐT" name="phone">
                <CInput
                  placeholder="Nhập số điện thoại"
                  maxLength={13}
                  disabled={typeModal === ActionType.VIEW}
                  onlyNumber
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                labelAlign="left"
                label="Phân vùng giao hàng"
                name="deliveryAreas"
                dependencies={['saleChanel']}
                rules={
                  (deliveryAreas && deliveryAreas.length > 0) ||
                  (saleChanel && saleChanel.length > 0)
                    ? [validateForm.required]
                    : undefined
                }
              >
                <Select
                  mode="multiple"
                  placeholder="Phân vùng giao hàng"
                  fieldNames={{ label: 'areaName', value: 'areaCode' }}
                  loading={loadingProvinces}
                  disabled={typeModal === ActionType.VIEW}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, options: any) =>
                    (options?.areaName ?? '')
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={optionsProvinces}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item labelAlign="left" label="Email" name="email">
                <CSelect
                  placeholder="Nhập email"
                  disabled={typeModal === ActionType.VIEW}
                  mode="tags"
                  tokenSeparators={[',']}
                  tagRender={tagRender}
                  maxRow={3}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>
        <RowButton className="mt-4">
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
            />
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
            />
          )}
          {typeModal === ActionType.VIEW && (
            <>
              {!checkFirstParent && (
                <CButtonDelete
                  onClick={() => handleDeleteItem(itemEdit?.id)}
                  loading={loadingAdd || isLoadingEdit}
                />
              )}

              <CButtonEdit
                onClick={() => {
                  navigate(pathRoutes.listOfDepartmentEdit(itemEdit?.id));
                }}
              />
            </>
          )}

          <CButtonClose onClick={handleCloseModal} />
        </RowButton>
      </Form>
    </>
  );
};

export default ModalAddEditView;
