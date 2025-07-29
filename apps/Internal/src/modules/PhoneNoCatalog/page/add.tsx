import {
  CButtonClose,
  CButtonDelete,
  CButtonEdit,
  CButtonSave,
  CButtonSaveAndAdd,
} from '@react/commons/Button';
import { CModalConfirm } from '@react/commons/index';
import CInput from '@react/commons/Input';
import CSelect from '@react/commons/Select';
import CSwitch from '@react/commons/Switch';
import { TitleHeader } from '@react/commons/Template/style';
import CTextArea from '@react/commons/TextArea';
import { ActionType } from '@react/constants/app';
import { RegexOnlyTextAndNumbers } from '@react/constants/regex';
import { MESSAGE } from '@react/utils/message';
import { Col, Form, Row, Space, Spin, TreeSelect } from 'antd';
import Card from 'antd/es/card/Card';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';
import CTableSelectedUser from '../components/CTableSelectedUser';
import { useAddphoneNoCatalog } from '../hook/useAddPhoneNoCatalog';
import useDeletephoneNoCatalog from '../hook/useDeletePhoneNoCatalog';
import useGetDetailphoneNoCatalog from '../hook/useGetDetailPhoneNoCatalog';
import {
  convertArrToObj,
  useGetListphoneNoCatalog,
} from '../hook/useGetListPhoneNoCatalog';
import { useGetSaleChannels } from '../hook/useGetSaleChannels';
import useGetStockType from '../hook/useGetStockType';
import useUpdatephoneNoCatalog from '../hook/useUpdatePhoneNoCatalog';
import {
  IDataPayloadPhoneNoCatalog,
  IListPhoneNoCatalog,
  IStockType,
  StockTypeEnum,
} from '../type';

const PhoneNoCatalogAdd = ({ typeModal }: { typeModal: string }) => {
  const [form] = Form.useForm();
  const { data: getStockType, isPending: loadingGetStock } = useGetStockType();
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitBack, setIsSubmitBack] = useState(false);
  const {
    data: dataphoneNoCatalogParent,
    isPending: loadingListphoneNoCatalogParent,
  } = useGetListphoneNoCatalog({
    page: 0,
    size: 999999999,
    status: '1',
  });

  const { data: dataSaleChannels, isPending: loadingSaleChannels } =
    useGetSaleChannels();
  const listSaleChannels = useMemo(() => {
    if (!dataSaleChannels) return [];
    return dataSaleChannels;
  }, [dataSaleChannels]);

  const mapStockParent = (stocks: any) => {
    return stocks?.map((item: any) => ({
      title: item.stockName,
      value: item.id,
      children: mapStockParent(item.children),
    }));
  };
  const listphoneNoCatalogParent = useMemo(() => {
    if (!dataphoneNoCatalogParent || !Array.isArray(dataphoneNoCatalogParent))
      return [];
    else if (typeModal === ActionType.EDIT) {
      return convertArrToObj(
        dataphoneNoCatalogParent.filter(
          (item: any) =>
            String(item.id) !== String(id) &&
            String(item.parentId) !== String(id)
        ),
        null
      );
    }
    return convertArrToObj(dataphoneNoCatalogParent, null);
  }, [dataphoneNoCatalogParent, id, typeModal]);
  const handleCloseAddSave = useCallback(() => {
    form.resetFields();
  }, [form]);
  const handleClose = useCallback(() => {
    form.resetFields();
    navigate(-1);
  }, [form, navigate]);
  const { mutate: deletephoneNoCatalog } = useDeletephoneNoCatalog(handleClose);
  const { mutate: addphoneNoCatalog, isPending: loadingAdd } =
    useAddphoneNoCatalog(() => {
      if (!isSubmitBack) {
        handleClose();
      } else {
        handleCloseAddSave();
      }
    }, form);
  const { mutate: updatephoneNoCatalog, isPending: loadingUpdate } =
    useUpdatephoneNoCatalog(handleClose, form);

  const [dataViewPhoneNoCatalog, setDataViewPhoneNoCatalog] =
    useState<IListPhoneNoCatalog>();
  const checkTypeStock =
    dataViewPhoneNoCatalog?.stockType === StockTypeEnum.SELL_WAREHOUSE ||
    dataViewPhoneNoCatalog?.stockType === StockTypeEnum.PURPOSE_WAREHOUSE
      ? true
      : false;
  const listStockType = useMemo(() => {
    if (!getStockType) return [];
    else if (
      typeModal === ActionType.ADD ||
      (typeModal === ActionType.EDIT && checkTypeStock)
    ) {
      return getStockType
        .filter(
          (item: IStockType) =>
            String(item.code) === String(StockTypeEnum.SELL_WAREHOUSE) ||
            String(item.code) === String(StockTypeEnum.PURPOSE_WAREHOUSE)
        )
        .map((item: IStockType) => {
          return {
            label: item.value,
            value: String(item.code),
          };
        });
    }
    return getStockType.map((item: IStockType) => {
      return {
        label: item.value,
        value: String(item.code),
      };
    });
  }, [getStockType, typeModal, checkTypeStock]);

  const { mutate: dataDetailphoneNoCatalog, isPending: loadingDataDetail } =
    useGetDetailphoneNoCatalog((data) => {
      setDataViewPhoneNoCatalog(data);
      form.setFieldsValue({
        ...data,
        stockType: String(data.stockType),
        stockIsdnOrgPermissionDTOS:
          data.stockIsdnOrgPermissionDTOS?.map((item: any) => {
            return {
              userId: item.userId,
              userName: item.userName,
              userFullName: item.userFullName,
            };
          }) ?? [],
        salesChannels: data.salesChannels?.split(','),
      });
    });
  useEffect(() => {
    if (getStockType && dataphoneNoCatalogParent) {
      id && dataDetailphoneNoCatalog(id);
    }
  }, [
    getStockType,
    dataphoneNoCatalogParent,
    id,
    dataDetailphoneNoCatalog,
    navigate,
  ]);
  const handleSubmit = useCallback(
    (values: IDataPayloadPhoneNoCatalog) => {
      const data = {
        ...values,
        salesChannels: values.salesChannels?.join(','),
        stockIsdnOrgPermissionDTOS: values.stockIsdnOrgPermissionDTOS
          ? values.stockIsdnOrgPermissionDTOS.map((item: any) => {
              return {
                userId: item.userId,
                userName: item.userName,
                userFullName: item.userFullName,
              };
            })
          : [],
      };
      if (typeModal === ActionType.EDIT) {
        CModalConfirm({
          message: MESSAGE.G04,
          onOk: () => {
            updatephoneNoCatalog({
              ...data,
              id: id,
              status: values.status ? 1 : 0,
              salesChannels: values.salesChannels?.join(','),
            });
          },
        });
      }
      if (typeModal === ActionType.ADD) {
        addphoneNoCatalog({
          ...data,
          status: 1,
        });
      }
    },
    [form, id, typeModal, updatephoneNoCatalog, addphoneNoCatalog]
  );
  const handleDelete = () => {
    CModalConfirm({
      message: MESSAGE.G05,
      onOk: () => id && deletephoneNoCatalog(id),
    });
  };
  const renderTitle = useMemo(() => {
    switch (typeModal) {
      case ActionType.ADD:
        return 'Tạo kho số';
      case ActionType.EDIT:
        return 'Cập nhật kho số';
      case ActionType.VIEW:
        return 'Xem chi tiết kho số';
      default:
        return '';
    }
  }, [typeModal]);

  const intl = useIntl();
  const handlePates = async (
    e: React.ClipboardEvent<HTMLInputElement>,
    field: string
  ) => {
    const value = (e.target as HTMLInputElement).value;
    form.setFieldValue(field, value.trim());
    form.validateFields([field]);
  };
  return (
    <div>
      <TitleHeader>{renderTitle}</TitleHeader>
      <Spin
        spinning={
          loadingDataDetail ||
          loadingListphoneNoCatalogParent ||
          loadingGetStock
        }
      >
        <Form
          disabled={typeModal === ActionType.VIEW}
          layout="horizontal"
          form={form}
          onFinish={handleSubmit}
        >
          <Card>
            <div>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
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
                                  'Mã kho số' +
                                    intl.formatMessage({
                                      id: 'validator.errFormat',
                                    })
                                )
                              ),
                      },
                    ]}
                    labelCol={{ style: { minWidth: '100px' } }}
                    name="stockCode"
                    label="Mã kho số"
                  >
                    <CInput
                      uppercase
                      preventVietnamese
                      preventSpace
                      preventSpecial
                      maxLength={20}
                      placeholder="Nhập mã kho số"
                      onPaste={(e) => {
                        handlePates(e, 'stockCode');
                      }}
                      disabled={
                        (!checkTypeStock && typeModal === ActionType.EDIT) ||
                        typeModal === ActionType.VIEW
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    rules={[
                      {
                        required: true,
                        message: MESSAGE.G06,
                      },
                    ]}
                    labelCol={{ style: { minWidth: '100px' } }}
                    name="stockName"
                    label="Tên kho số"
                  >
                    <CInput maxLength={255} placeholder="Nhập tên kho số" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    rules={[
                      {
                        required: true,
                        message: MESSAGE.G06,
                      },
                    ]}
                    labelCol={{ style: { minWidth: '100px' } }}
                    name="stockType"
                    label="Loại kho"
                  >
                    <CSelect
                      disabled={
                        (!checkTypeStock && typeModal === ActionType.EDIT) ||
                        typeModal === ActionType.VIEW
                      }
                      options={listStockType}
                      placeholder="Chọn loại kho"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    rules={[
                      {
                        required:
                          checkTypeStock || typeModal === ActionType.ADD,
                        message: MESSAGE.G06,
                      },
                    ]}
                    labelCol={{ style: { minWidth: '100px' } }}
                    name="parentId"
                    label="Kho cha"
                  >
                    <TreeSelect
                      placeholder="Chọn kho cha"
                      showSearch
                      treeDefaultExpandAll
                      treeNodeFilterProp="title"
                      disabled={
                        (!checkTypeStock && typeModal === ActionType.EDIT) ||
                        typeModal === ActionType.VIEW
                      }
                      loading={loadingListphoneNoCatalogParent}
                      treeData={mapStockParent(listphoneNoCatalogParent || [])}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    labelCol={{ style: { minWidth: '100px' } }}
                    name="salesChannels"
                    label="Kênh bán"
                  >
                    <CSelect
                      mode="multiple"
                      loading={loadingSaleChannels}
                      options={listSaleChannels}
                      placeholder="Chọn kênh bán"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    labelCol={{ style: { minWidth: '100px' } }}
                    label="Trạng thái"
                    name="status"
                    valuePropName="checked"
                    initialValue={true}
                  >
                    <CSwitch
                      disabled={
                        !checkTypeStock || typeModal === ActionType.VIEW
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    labelCol={{ style: { minWidth: '100px' } }}
                    name="description"
                    label="Mô tả"
                  >
                    <CTextArea
                      placeholder=" Nhập mô tả"
                      maxLength={200}
                      rows={3}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <div className="rounded-lg mt-4 border py-4 px-4 border-[#A89E9E]">
                <CTableSelectedUser
                  disabled={typeModal === ActionType.VIEW}
                  typeModal={typeModal}
                />
              </div>
            </div>
          </Card>
          <Row className="mt-8" justify="end">
            <Space size="middle">
              {typeModal === ActionType.VIEW && (
                <>
                  {dataViewPhoneNoCatalog?.parentId !== null &&
                    (dataViewPhoneNoCatalog?.stockType ===
                      StockTypeEnum.SELL_WAREHOUSE ||
                      dataViewPhoneNoCatalog?.stockType ===
                        StockTypeEnum.PURPOSE_WAREHOUSE) && (
                      <CButtonDelete onClick={handleDelete} disabled={false} />
                    )}
                  <CButtonEdit
                    loading={loadingAdd || loadingUpdate}
                    onClick={() => {
                      navigate(pathRoutes.phoneNoCatalogEdit(id ?? ''));
                    }}
                    disabled={false}
                  />
                  <CButtonClose
                    onClick={handleClose}
                    disabled={false}
                    type="default"
                  />
                </>
              )}
              {typeModal === ActionType.ADD && (
                <CButtonSaveAndAdd
                  loading={loadingAdd || loadingUpdate}
                  htmlType="submit"
                  onClick={() => setIsSubmitBack(true)}
                />
              )}
              {typeModal !== ActionType.VIEW && (
                <CButtonSave
                  loading={loadingAdd || loadingUpdate}
                  htmlType="submit"
                  onClick={() => setIsSubmitBack(false)}
                />
              )}
              {typeModal !== ActionType.VIEW && (
                <CButtonClose
                  onClick={() => {
                    navigate(-1);
                  }}
                  disabled={false}
                  type="default"
                />
              )}
            </Space>
          </Row>
        </Form>
      </Spin>
    </div>
  );
};
export default PhoneNoCatalogAdd;
