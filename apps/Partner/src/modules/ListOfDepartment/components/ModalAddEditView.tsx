import {
  CButtonClose,
  CButtonDelete,
  CButtonEdit,
  CButtonSave,
  CButtonSaveAndAdd,
} from '@react/commons/Button';
import CInput from '@react/commons/Input';
import Select from '@react/commons/Select';
import CSwitch from '@react/commons/Switch';
import { RowButton, TitleHeader } from '@react/commons/Template/style';
import { ModelStatus } from '@react/commons/types';
import { ActionType } from '@react/constants/app';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import { MESSAGE } from '@react/utils/message';
import validateForm from '@react/utils/validator';
import { Card, Col, Form, Row, TreeSelect } from 'antd';
import { ParamsOption } from 'apps/Partner/src/components/layouts/types';
import ModalConfirm from 'apps/Partner/src/components/modalConfirm';
import { REACT_QUERY_KEYS } from 'apps/Partner/src/constants/querykeys';
import { RegValidStringEnglish } from 'apps/Partner/src/constants/regex';
import { pathRoutes } from 'apps/Partner/src/constants/routes';
import { FC, useEffect, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';
import { ItemEdit, useAddFn } from '../queryHook/useAdd';
import { useDeleteFn } from '../queryHook/useDelete';
import { useEditFn } from '../queryHook/useEdit';
import { convertArrToObj, deleteChild, useList } from '../queryHook/useList';
import { useView } from '../queryHook/useView';
import { ContentItem } from '../types';

type Props = {
  typeModal: ActionType;
};

const ModalAddEditView: FC<Props> = ({ typeModal }) => {
  const intl = useIntl();
  const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const { isLoading: loadingList, data: dataParentId } = useList();
  const { mutate: deleteMutate } = useDeleteFn();
  //
  const listParentId = useMemo(() => {
    if (!dataParentId || !Array.isArray(dataParentId)) return [];
    else if (typeModal === ActionType.EDIT) {
      return convertArrToObj(
        dataParentId.filter(
          (item: any) =>
            String(item.id) !== String(id) &&
            String(item.parentId) !== String(id)
        ),
        null
      );
    }
    return convertArrToObj(dataParentId, null);
  }, [dataParentId, id, typeModal]);
  const mapStockParent = (stocks: any) => {
    return stocks?.map((item: any) => ({
      title: item.orgName,
      value: item.id,
      children: mapStockParent(item.children),
    }));
  };
  console.log('listParentId', listParentId);
  //
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
  }, [typeModal, id, refetchGetItemEdit]);

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
        value: itemEdit?.saleChanel,
      },
      {
        name: 'deliveryAreas',
        value: itemEdit?.deliveryAreas?.split(','),
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
    navigate(-1);
  };

  const handleCloseModal = () => {
    handleClose();
  };

  const { mutate: addMutate, isPending: loadingAdd } = useAddFn(form);
  const { isPending: isLoadingEdit, mutate: editMutate } = useEditFn(form);
  const { ORGANIZATION_UNIT_ORG_SUB_TYPE = [] } = useGetDataFromQueryKey<ParamsOption>([REACT_QUERY_KEYS.GET_PARAMS_OPTION]);
  const checkFirstParent =
    !dataParentId?.some((value: any) => value.parentId === null) ||
    (typeModal !== ActionType.ADD && itemEdit?.parentId === null);
  const optionsOrgSubType = ORGANIZATION_UNIT_ORG_SUB_TYPE?.filter((item) => {
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

  return (
    <>
      <TitleHeader>{renderTitle()}</TitleHeader>
      <Card>
        <Form form={form} {...layout} onFinish={handleFinishForm}>
          <Row gutter={24}>
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
                  maxLength={20}
                  preventSpace
                  preventSpecial
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
                <TreeSelect
                  placeholder="Chọn kho cha"
                  showSearch
                  treeDefaultExpandAll
                  treeNodeFilterProp="title"
                  disabled={
                    typeModal === ActionType.VIEW ||
                    checkFirstParent ||
                    itemEdit?.parentId === null
                  }
                  loading={loadingList}
                  treeData={mapStockParent(listParentId || [])}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                labelAlign="left"
                label="Loại kho"
                name="orgSubType"
                rules={[validateForm.required]}
              >
                <Select
                  placeholder="Chọn loại kho"
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
          </Row>
          <RowButton>
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
                    navigate(pathRoutes.warehouseManagementEdit(itemEdit?.id));
                  }}
                />
              </>
            )}

            <CButtonClose onClick={handleCloseModal} />
          </RowButton>
        </Form>
      </Card>
    </>
  );
};

export default ModalAddEditView;
