import {
  CButtonClose,
  CButtonSave,
  CButtonSaveAndAdd,
} from '@react/commons/Button';
import CDatePicker from '@react/commons/DatePicker';
import { DebounceSelect } from '@react/commons/DebounceSelect';
import { NotificationError } from '@react/commons/index';
import CInput from '@react/commons/Input';
import CSelect from '@react/commons/Select';
import Show from '@react/commons/Template/Show';
import {
  TitleHeader,
} from '@react/commons/Template/style';
import CTextArea from '@react/commons/TextArea';
import { ActionType, DeliveryOrderMethod, DeliveryOrderType } from '@react/constants/app';
import { MESSAGE } from '@react/utils/message';
import validateForm from '@react/utils/validator';
import { Card, Col, Form, Row, Space } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import { NumberProcessType } from 'apps/Internal/src/constants/constants';
import { ReasonCodeEnum, useListReasonCatalogService } from 'apps/Internal/src/hooks/useReasonCatalogService';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useAdd from '../hook/useAddExport';
import useAddImport from '../hook/useAddImport';
import { useFilterSerial } from '../hook/useFilterSerial';
import useGetDetail from '../hook/useGetDetail';
import useGetDetailDeliveryImport from '../hook/useGetDetailDeliveryImport';
import useGetDetailDeliveryNote from '../hook/useGetDetailDeliveryNote';
import useGetDetailTransactionExport from '../hook/useGetDetailTransactionExport';
import { useGetFilterDeliveryNoteExportSearch } from '../hook/useGetFilterDeliveryNoteExportSearch';
import { useGetFilterDeliveryNoteImportSearch } from '../hook/useGetFilterDeliveryNoteImportSearch';
import useGetStockCurrentUser from '../hook/useGetStockCurrentUser';
import useGetStockIn from '../hook/useGetStockIn';
import useGetStockOut from '../hook/useGetStockOut';
import { IDataProduct, IDeliveryOrderLineDTO, ISerialItem } from '../type';
import TableProduct from './TableProduct';
type Props = {
  typeModal: ActionType;
  isImport: boolean;
};
const ModalAddEditView: React.FC<Props> = ({ typeModal, isImport }) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [detailOrderSale, setDetailOrderSale] = useState<any>({})
  const [toOrgId, setToOrgId] = useState<any>({})
  const [idDeliveryNote, setIdDeliveryNote] = useState<string>("")
  const disableForm = typeModal === ActionType.VIEW;
  const reasonId = useWatch<NumberProcessType>('reasonId', form);
  const optionReason = useListReasonCatalogService(
      disableForm,
      reasonId,
      ReasonCodeEnum.INTERNAL_IMPORT_EXPORT
  );
  const { id } = useParams()
  const [listProduct, setListProduct] = useState<IDataProduct[]>([])
  const [products, setProducts] = useState<IDataProduct[]>([])
  const { data: dataDetailInternalWarehouseDeliveryNote } = useGetDetail(id ?? "")
  const [deliveryNoteDate, setDeliveryNoteDate] = useState<string>("")
  const [fromOrgId, setFromOrgId] = useState<any>({})
  const { mutate: filterSerial } = useFilterSerial((data) => {
      if (data) {
          setListSerial(data)
      }
  })
  const { mutate: detailTransactionExport } = useGetDetailTransactionExport((data) => {
      if (data) {
          setDetailOrderSale(data)
          setListProduct(data.stockMoveLineDTOS.map((item: any) => {
              return {
                  orgId: data.orgId,
                  productName: item.productDTO.productName,
                  productCode: item.productDTO.productCode,
                  productUOM: item.productDTO.productUom,
                  id: item.id,
                  productId: item.productDTO.id,
                  fromSerial: item.fromSerial,
                  toSerial: item.toSerial,
                  quantity: item.quantity,
              }
          }))
      }
  })
  const { mutateAsync: mutateFilterDeliveryNoteSearch } = useGetFilterDeliveryNoteImportSearch((data) => {
      if (data) {
          setDataFilterDeliveryNoteSearch(data)
      }
  })
  const { mutate: getStockIn, isPending: loadingStockIn } = useGetStockIn((data) => {
      setToOrgId({
          label: data.orgName,
          value: String(data.id),
      });
  })
  const { mutate: getStockOut, isPending: loadingStockOut } = useGetStockIn((data) => {
      setFromOrgId({
          label: data.orgName,
          value: String(data.id),
      });
  })
  const [listSerial, setListSerial] = useState<ISerialItem[]>([])
  useEffect(() => {
      if (listSerial && listProduct.length > 0 && !dataDetailInternalWarehouseDeliveryNote) {
          if (Array.isArray(listSerial) && listSerial.length > 0) {
              const flattenedListSerialNumber = listSerial.flatMap((item: any) => {
                  const checkSerial = listProduct.find((product: IDataProduct) => product.productId === item.productId)?.checkSerial
                  const parentItem = {
                      productId: item.productId,
                      fromSerial: checkSerial ? item.fromSerial : null,
                      toSerial: checkSerial ? item.toSerial : null,
                      quantity: item.quantity,
                      orgId: detailOrderSale.orgId,
                      productName: listProduct.find((product: IDataProduct) => product.productId === item.productId)?.productName,
                      productCode: listProduct.find((product: IDataProduct) => product.productId === item.productId)?.productCode,
                      productUOM: listProduct.find((product: IDataProduct) => product.productId === item.productId)?.productUOM,
                      id: checkSerial ? listProduct.find((product: IDataProduct) => product.productId === item.productId)?.id : null,
                      checkSerial: checkSerial,
                  };
                  const childrenItems = Array.isArray(item.serialChildrenList) && item.serialChildrenList.length && checkSerial ?
                      item.serialChildrenList.map((serial: any) => ({
                          productId: serial.productId,
                          fromSerial: serial.fromSerial,
                          toSerial: serial.toSerial,
                          quantity: serial.quantity,
                          orgId: detailOrderSale.orgId,
                          productCode: listProduct.find((product: any) => product.productId === serial.productId)?.productCode,
                          checkSerial: checkSerial,
                      })) : [];
                  setProducts([...products, ...childrenItems])
                  return [parentItem, ...childrenItems];
              });

              const newList = listProduct.map((item: IDataProduct) => {
                  const matchingSerial = listSerial.find(
                      (serialItem: any) => serialItem.productId === item.productId
                  );
                  if (matchingSerial) {
                      return matchingSerial
                  }
                  return item;
              });
              const updatedList = newList.flatMap((item: any) => {
                  const matchingSerials = flattenedListSerialNumber.filter(serial => serial.productId === item.productId);
                  return matchingSerials
              });
              if (JSON.stringify(updatedList) !== JSON.stringify(listProduct)) {
                  setListProduct(updatedList);
              }
          }
          else {
              console.log("listSerial is not an array or is empty");
          }
      }
  }, [listSerial]);
  const { mutate: detailDeliveryNoteImport } = useGetDetailDeliveryImport((data) => {
      setIdDeliveryNote(data.id)
      if (data && typeModal !== ActionType.VIEW) {
          setDeliveryNoteDate(data.deliveryNoteDate ?? "");
          getStockIn(data.toOrgId)
          getStockOut(data.fromOrgId)
          detailTransactionExport(data.stockId)
      }
      else if (typeModal === ActionType.VIEW) {
          form.setFieldValue("deliveryNoteId", data.deliveryNoteCode)
      }
      const order = {
          id: data.id,
          orgId: data.fromOrgId
      };
      const orderDetail = {
          orderNo: data.orderNo,
          products: data.deliveryNoteLines.map((item: any, index: number) => {
              return {
                  productName: item.productDTO.productName,
                  productCode: item.productDTO.productCode,
                  productUOM: item.productDTO.productUom,
              }
          }),
      };
      if (dataDetailInternalWarehouseDeliveryNote) {
          setDetailOrderSale(orderDetail as any);
      } else {
          setDetailOrderSale(order as any);
      }
  })
  const { mutate: detailDeliveryNote } = useGetDetailDeliveryNote((data) => {
      if (typeModal !== ActionType.VIEW) {
          setDeliveryNoteDate(data.deliveryNoteDate ?? "");
      }
      const dataFilterSerial = data.deliveryNoteLines.map((item: IDeliveryOrderLineDTO) => {
          return {
              orgId: data.fromOrgId,
              productId: item.productDTO.id,
              quantity: item.quantity
          }
      })
      dataFilterSerial.length > 0 && filterSerial(dataFilterSerial)
      if (data && typeModal !== ActionType.VIEW) {
          getStockIn(data.toOrgId)
          getStockOut(data.fromOrgId)
          setListProduct(data.deliveryNoteLines.filter((item: {
              quantity: number,
              productDTO: {
                  checkSerial: boolean,
                  productName: string,
                  productCode: string,
                  productUom: string,
                  id: number,
              },
              checkSerial: boolean,
              id: number,
          }) => item.quantity !== 0).map((item: {
              quantity: number,
              productDTO: {
                  checkSerial: boolean,
                  productName: string,
                  productCode: string,
                  productUom: string,
                  id: number,
              },
              checkSerial: boolean,
              id: number,
          }) => {
              return {
                  productName: item.productDTO.productName,
                  productCode: item.productDTO.productCode,
                  productUOM: item.productDTO.productUom,
                  id: item.id,
                  quantity: item.quantity,
                  productId: item.productDTO.id,
                  checkSerial: item.productDTO.checkSerial,
              }
          }))
      }
      else if (typeModal === ActionType.VIEW) {
          form.setFieldValue("deliveryNoteId", data.deliveryNoteCode)
      }
      const order = {
          id: data.id,
          orgId: data.fromOrgId
      };
      const orderDetail = {
          orderNo: data.orderNo,
          products: data.deliveryNoteLines.map((item: any, index: number) => {
              return {
                  productName: item.productDTO.productName,
                  productCode: item.productDTO.productCode,
                  productUOM: item.productDTO.productUom,
              }
          }),
      };
      if (dataDetailInternalWarehouseDeliveryNote) {
          setDetailOrderSale(orderDetail as any);
      } else {
          setDetailOrderSale(order as any);
      }
  })
  const [dataFilterDeliveryNoteSearch, setDataFilterDeliveryNoteSearch] = useState<any>(null)
  const { mutateAsync: mutateFilterDeliveryNoteExportSearch } = useGetFilterDeliveryNoteExportSearch((data) => {
      setDataFilterDeliveryNoteSearch(data)
  })
  const listFilterDeliveryNoteSearch = useMemo(() => {
      if (!dataFilterDeliveryNoteSearch) return []
      return dataFilterDeliveryNoteSearch
  }, [dataFilterDeliveryNoteSearch])

  const { data: idGetStockOut } = useGetStockOut()
  const { data: dataGetStockCurrentUser } = useGetStockCurrentUser()
  const listWarehouseExport = useMemo(() => {
      if (!dataGetStockCurrentUser) return []
      return dataGetStockCurrentUser.map((item: any) => {
          return {
              value: item.orgId,
              label: item.orgName
          }
      })
  }, [dataGetStockCurrentUser])
  const { mutate: addImport, isPending: loadingAddImport } = useAddImport(() => {
      if (submitType === 'saveAndAdd') {
          form.resetFields()
          setDetailOrderSale({} as any)
      } else {
          navigate(-1)
      }
  }, form)
  const { mutate: addInternalWarehouseDeliveryNote, isPending: loadingAdd } = useAdd(() => {
      if (submitType === 'saveAndAdd') {
          form.resetFields()
          setDetailOrderSale({} as any)
      } else {
          navigate(-1)
      }
  }, form)
  useEffect(() => {
      if (dataDetailInternalWarehouseDeliveryNote) {
          detailDeliveryNote(dataDetailInternalWarehouseDeliveryNote.deliveryNoteId);
          const stockMoveLineDTOS = dataDetailInternalWarehouseDeliveryNote.stockMoveLineDTOS
          getStockOut(dataDetailInternalWarehouseDeliveryNote.orgId)
          getStockIn(dataDetailInternalWarehouseDeliveryNote.ieOrgId)
          setListProduct(stockMoveLineDTOS.length > 0 ? stockMoveLineDTOS.map((item: any) => {
              return {
                  productName: item.productDTO.productName,
                  productCode: item.productDTO.productCode,
                  productUOM: item.productDTO.productUom,
                  productId: item.productDTO.id,
                  fromSerial: item.fromSerial,
                  toSerial: item.toSerial,
                  quantity: item.quantity
              }
          }) : [])
          const formValues = {
              ...dataDetailInternalWarehouseDeliveryNote,
              deliveryNoteDate: dayjs(dataDetailInternalWarehouseDeliveryNote.deliveryNoteDate),
              reasonId: dataDetailInternalWarehouseDeliveryNote.reasonId,
          };
          form.setFieldsValue(formValues);
      }
  }, [dataDetailInternalWarehouseDeliveryNote, form, listFilterDeliveryNoteSearch, detailDeliveryNote]);
  const [submitType, setSubmitType] = useState<string>('');
  const handleSubmit = useCallback((values: any) => {
      const data = {
          deliveryNoteId: detailOrderSale.id,
          orgId: Number(fromOrgId.value),
          ieOrgId: Number(toOrgId.value),
          moveType: DeliveryOrderType.INTERNAL,
          reasonId: values.reasonId,
          moveDate: dayjs(values.deliveryNoteDate).format('YYYY-MM-DD'),
          description: values.description,
          deliveryNoteDate: dayjs(values.deliveryNoteDate).format('YYYY-MM-DD'),
          stockMoveLineDTOS: listProduct.filter((item: IDataProduct) => !item.id).map((item: IDataProduct) => {
              return {
                  orgId: item.orgId,
                  productId: item.productId,
                  quantity: item.quantity,
                  fromSerial: item.checkSerial ? item.fromSerial : null,
                  toSerial: item.checkSerial ? item.toSerial : null,
                  productCode: item.productCode,
              }
          }).concat(listProduct.filter((item: IDataProduct) => !item.checkSerial && item.id).map((item: IDataProduct) => {
              return {
                  orgId: detailOrderSale.orgId,
                  productId: item.productId,
                  quantity: item.quantity,
                  fromSerial: item.fromSerial,
                  toSerial: item.toSerial,
                  productCode: item.productCode,
              }
          })),
          moveMethod: isImport ? DeliveryOrderMethod.IMPORT : DeliveryOrderMethod.EXPORT,
      }
      const dataImport = {
          stockMoveCode: values.stockMoveCode,
          deliveryNoteId: Number(idDeliveryNote),
          orgId: Number(fromOrgId.value),
          ieOrgId: Number(toOrgId.value),
          moveType: DeliveryOrderType.INTERNAL,
          reasonId: values.reasonId,
          moveDate: dayjs(values.deliveryNoteDate).format('YYYY-MM-DD'),
          description: values.description,
          deliveryNoteDate: dayjs(values.deliveryNoteDate).format('YYYY-MM-DD'),
          stockMoveLineDTOS: listProduct.map((item: any) => {
              return {
                  orgId: Number(toOrgId.value),
                  productId: item.productId,
                  quantity: item.quantity,
                  fromSerial: item.fromSerial,
                  toSerial: item.toSerial,
                  productCode: item.productCode,
              }
          }),
          moveMethod: DeliveryOrderMethod.IMPORT,
      }
      const check = listProduct.filter((item: IDataProduct) => item.checkSerial).find((item: IDataProduct) => !item.fromSerial || !item.toSerial)
      if (check) {
          NotificationError("Số lượng sản phẩm không đủ")
      } else {
          if (isImport) {
              addImport(dataImport)
          } else {
              addInternalWarehouseDeliveryNote(data)
          }
      }
  }, [detailOrderSale, toOrgId, form, addInternalWarehouseDeliveryNote, listProduct, fromOrgId, addImport, isImport]);
  useEffect(() => {
      if (listWarehouseExport.length > 0 && idGetStockOut && !loadingStockOut && !loadingStockIn) {
          form.setFieldsValue({
              fromOrgId: fromOrgId.label ?? "",
              toOrgId: toOrgId.label ?? "",
          });
      }
  }, [form, toOrgId, listWarehouseExport, idGetStockOut, loadingStockOut, loadingStockIn]);
  const handleChange = (value: any, options: any) => {
      if (value) {
          if (isImport) {
              form.setFieldValue('products', []);
              detailDeliveryNoteImport(value);
          } else {
              form.setFieldValue('products', []);
              detailDeliveryNote(value);
              form.setFieldValue('products', []);
          }
      }
      setDetailOrderSale({} as any)
  };
  const renderTitle = useMemo(() => {
      if (typeModal === ActionType.ADD) {
          return isImport ? "Lập GD nhập kho nội bộ" : "Lập GD xuất kho nội bộ";
      } else if (typeModal === ActionType.VIEW) {
          return isImport ? "Chi tiết GD nhập kho nội bộ" : "Chi tiết GD xuất kho nội bộ";
      }
      return "";
  }, [typeModal, isImport]);
  const handleClear = useCallback(() => {
      form.setFieldsValue({
          fromOrgId: '',
          toOrgId: '',
      })
      setListProduct([])
      setListSerial([])
      setDetailOrderSale({} as any)
  }, [form])
  useEffect(() => {
      if (deliveryNoteDate) {
          form.validateFields(['deliveryNoteDate']);
      }
  }, [deliveryNoteDate, form]);
  return (
      <>
          <TitleHeader>{renderTitle}</TitleHeader>
          <Form
              form={form}
              labelCol={{ flex: '110px' }}
              colon={false}
              disabled={typeModal === ActionType.VIEW}
              initialValues={{ files: [{}] }}
              onFinish={handleSubmit}
          >
              <Card className="mb-6">
                  <Row>
                      <Show.When isTrue={!isImport}>
                          <Col span={24}>
                              <Form.Item
                                  name="deliveryNoteId"
                                  label="Mã phiếu xuất"
                                  rules={[
                                      {
                                          required: true,
                                          message: MESSAGE.G06,
                                      },
                                  ]}
                                  className='max-w-[440px]'
                              >
                                  <DebounceSelect
                                      onClear={handleClear}
                                      fetchOptions={mutateFilterDeliveryNoteExportSearch}
                                      placeholder="Chọn mã phiếu xuất"
                                      onSelect={handleChange}
                                  />
                              </Form.Item>
                          </Col>
                      </Show.When>
                      <Show.When isTrue={isImport}>
                          <Col span={24}>
                              <Form.Item
                                  name="deliveryNoteId"
                                  label="Mã phiếu nhập"
                                  rules={[
                                      {
                                          required: true,
                                          message: MESSAGE.G06,
                                      },
                                  ]}
                                  className='max-w-[440px]'
                              >
                                  <DebounceSelect
                                      onClear={handleClear}
                                      fetchOptions={mutateFilterDeliveryNoteSearch}
                                      placeholder="Chọn mã phiếu nhập"
                                      onSelect={handleChange}
                                  />
                              </Form.Item>
                          </Col>
                      </Show.When>
                  </Row>
              </Card>
              <Card>
                  <Row gutter={24}>
                      <Show.When isTrue={!isImport && typeModal === ActionType.VIEW}>
                          <Col span={12}>
                              <Form.Item
                                  label="Mã GD xuất"
                                  rules={[
                                      {
                                          required: true,
                                          message: MESSAGE.G06,
                                      },
                                  ]}
                                  name="stockMoveCode"
                              >
                                  <CInput />
                              </Form.Item>
                          </Col>
                      </Show.When>
                      <Show.When isTrue={isImport && typeModal === ActionType.VIEW}>
                          <Col span={12}>
                              <Form.Item
                                  label="Mã GD nhập"
                                  rules={[
                                      {
                                          required: true,
                                          message: MESSAGE.G06,
                                      },
                                  ]}
                                  name="stockMoveCode"
                              >
                                  <CInput />
                              </Form.Item>
                          </Col>
                      </Show.When>
                      <Col span={12}>
                          <Form.Item
                              label="Ngày lập"
                              name="deliveryNoteDate"
                              rules={[
                                  validateForm.required,
                                  {
                                      validator: (_, value) => {
                                          if (!value || !deliveryNoteDate) {
                                              return Promise.resolve();
                                          }
                                          else if (dayjs(value).isBefore(dayjs(deliveryNoteDate), 'day')) {
                                              return Promise.reject(isImport ? 'Ngày lập giao dịch nhập không được nhỏ hơn ngày lập phiếu nhập' : 'Ngày lập giao dịch không được nhỏ hơn ngày lập phiếu xuất');
                                          }
                                          return Promise.resolve();
                                      }
                                  }
                              ]}
                              initialValue={dayjs()}
                          >
                              <CDatePicker allowClear={false} />
                          </Form.Item>
                      </Col>
                      <Col span={12}>
                          <Form.Item
                              name="fromOrgId"
                              label="Kho xuất"
                              rules={[
                                  {
                                      required: true,
                                      message: MESSAGE.G06,
                                  },
                              ]}
                              initialValue={fromOrgId.label}
                          >
                              <CInput disabled placeholder="Nhập kho xuất" />
                          </Form.Item>
                      </Col>
                      <Col span={12}>
                          <Form.Item
                              label="Kho nhận"
                              name="toOrgId"
                              rules={[
                                  {
                                      required: true,
                                      message: MESSAGE.G06,
                                  },
                              ]}
                              initialValue={toOrgId.value}
                          >
                              <CInput disabled placeholder="Nhập kho nhận" />
                          </Form.Item>
                      </Col>
                      <Col span={12}>
                          <Form.Item
                              label="Lý do"
                              name="reasonId"
                              rules={[
                                  {
                                      required: true,
                                      message: MESSAGE.G06,
                                  },
                              ]}
                          >
                              <CSelect options={optionReason} placeholder="Chọn lý do" />
                          </Form.Item>
                      </Col>
                      <Col span={24}>
                          <Form.Item
                              labelAlign="left"
                              label="Ghi chú"
                              name="description"
                              rules={[
                                  { required: true, message: MESSAGE.G06 },
                              ]}
                          >
                              <CTextArea
                                  maxLength={200}
                                  placeholder="Ghi chú"
                                  autoSize={{ minRows: 3, maxRows: 5 }}
                              />
                          </Form.Item>
                      </Col>
                  </Row>
                  <Row className="mt-6">
                      <TableProduct
                          orgId={detailOrderSale.orgId}
                          listProduct={listProduct}
                          listSerialNumber={listSerial}
                          setListProduct={setListProduct}
                          setListSerialNumber={setListSerial}
                          data={listProduct}
                          actionType={typeModal}
                          isImport={false}
                      />
                  </Row>
              </Card>
              <Row className="justify-end">
                  <Space className="my-6">
                      {
                          typeModal === ActionType.ADD &&
                          <>
                              <CButtonSaveAndAdd
                                  loading={loadingAdd || loadingAddImport}
                                  htmlType="submit"
                                  onClick={() => setSubmitType('saveAndAdd')}

                              />
                              <CButtonSave
                                  loading={loadingAdd || loadingAddImport}
                                  onClick={() => setSubmitType('save')}
                                  htmlType='submit' />
                          </>
                      }
                      <CButtonClose disabled={false} onClick={() => navigate(-1)} type="default" />
                  </Space>
              </Row>
          </Form >
      </>
  );
};
export default ModalAddEditView;
