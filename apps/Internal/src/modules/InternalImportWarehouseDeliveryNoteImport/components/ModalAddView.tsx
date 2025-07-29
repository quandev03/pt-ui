import {
  CButtonClose,
  CButtonSave,
  CButtonSaveAndAdd,
} from '@react/commons/Button';
import CDatePicker from '@react/commons/DatePicker';
import { DebounceSelect } from '@react/commons/DebounceSelect';
import { CModalConfirm } from '@react/commons/index';
import CInput from '@react/commons/Input';
import CSelect from '@react/commons/Select';
import CTable from '@react/commons/Table';
import CTableUploadFile from '@react/commons/TableUploadFile';
import Show from '@react/commons/Template/Show';
import { Text, TitleHeader } from '@react/commons/Template/style';
import CTextArea from '@react/commons/TextArea';
import { ActionType, DeliveryOrderType } from '@react/constants/app';
import { DeliveryOrderStatusList } from '@react/constants/status';
import { MESSAGE } from '@react/utils/message';
import validateForm from '@react/utils/validator';
import { Card, Col, Form, Row, Space } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import { ColumnsType } from 'antd/es/table';
import { Tooltip } from 'antd/lib';
import { NumberProcessType } from 'apps/Internal/src/constants/constants';
import {
  ReasonCodeEnum,
  useListReasonCatalogService,
} from 'apps/Internal/src/hooks/useReasonCatalogService';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CButtonCancel } from '../components/CButtonCancel';
import useAdd from '../hook/useAdd';
import { useCancel } from '../hook/useCancel';
import useGetDetail from '../hook/useGetDetail';
import useGetDetailDeliveryNote from '../hook/useGetDetailDeliveryNote';
import useGetFileDownload from '../hook/useGetFileDownload';
import { useGetFilterDeliveryNoteExport } from '../hook/useGetFilterDeveliveryNoteExport';
import useGetFromOrg from '../hook/useGetFromOrg';
import useGetStockIn from '../hook/useGetStockIn';
import '../index.scss';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { ParamsOption } from '@react/commons/types';
type Props = {
  typeModal: ActionType;
};
const ModalAddEditView: React.FC<Props> = ({ typeModal }) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [detailOrderSale, setDetailOrderSale] = useState<any>({} as any);
  const [toOrgId, setToOrgId] = useState<any>({});
  const [fromOrgId, setFromOrgId] = useState<any>({});
  const disableForm = typeModal === ActionType.VIEW;
  const reasonId = useWatch<NumberProcessType>('reasonId', form);
  const { PRODUCT_PRODUCT_UOM } =
    useGetDataFromQueryKey<ParamsOption>([REACT_QUERY_KEYS.GET_PARAMS]) ?? {};
  const optionReason = useListReasonCatalogService(
    disableForm,
    reasonId,
    ReasonCodeEnum.INTERNAL_IMPORT_EXPORT
  );
  const columns: ColumnsType = [
    {
      title: 'STT',
      align: 'left',
      fixed: 'left',
      width: 50,
      render: (_, __, index) => {
        return <Text>{index + 1}</Text>;
      },
    },
    {
      title: 'Mã sản phẩm',
      dataIndex: 'productCode',
      width: 100,
      align: 'left',
      render: (value, record) => {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'productName',
      width: 160,
      align: 'left',
      render: (value, record) => {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Đơn vị tính',
      dataIndex: 'productUOM',
      width: 120,
      align: 'left',
      render: (value, record) => {
        const text = PRODUCT_PRODUCT_UOM?.find(
          (e) => String(e.value) === String(value)
        )?.label;
        return (
          <Tooltip title={text} placement="topLeft">
            <Text>{text}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Số lượng',
      width: 160,
      align: 'left',
      render: (value: string, record, index) => {
        return (
          <Form.Item
            rules={[
              {
                required: true,
                message: MESSAGE.G06,
              },
              {
                validator: (_, value) => {
                  const maxQuantity = record.quantity;
                  if (value > maxQuantity) {
                    return Promise.reject(
                      'Số lượng sp vượt quá số lượng trong kho'
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
            name={['deliveryNoteLineDTOList', index, 'quantity']}
          >
            <CInput
              disabled={true}
              onlyNumber
              min={1}
              maxLength={10}
              max={record.quantity}
              placeholder="Nhập số lượng"
            />
          </Form.Item>
        );
      },
    },
  ];
  const { id } = useParams();
  const { data: dataDetailInternalWarehouseDeliveryNote } = useGetDetail(
    id ?? ''
  );
  const [deliveryNoteDate, setDeliveryNoteDate] = useState<string>('');
  const { mutate: getStockToOrg } = useGetStockIn((data) => {
    setToOrgId({
      label: data.orgName,
      value: String(data.id),
    });
  });
  const { mutate: getStockFromOrg } = useGetFromOrg((data) => {
    setFromOrgId({
      label: data.orgName,
      value: String(data.id),
    });
  });
  const { mutate: detailDeliveryNote } = useGetDetailDeliveryNote((data) => {
    setDeliveryNoteDate(data.deliveryNoteDate ?? '');
    if (data) {
      getStockToOrg(data.toOrgId);
      getStockFromOrg(data.fromOrgId);
    }
    const order = {
      id: data.id,
      saleOrderLines: data.deliveryNoteLines
        .filter((item: any) => item.quantity !== 0)
        .map((item: any, index: number) => {
          return {
            productName: item.productDTO.productName,
            productCode: item.productDTO.productCode,
            productUOM: item.productDTO.productUom,
            quantity: item.quantity,
            id: item.id,
            productId: item.productDTO.id,
          };
        }),
    };
    setDetailOrderSale(order as any);
  });
  const [dataFilterDeliveryNoteSearch, setDataFilterDeliveryNoteSearch] =
    useState<any>(null);
  const { mutateAsync: mutateFilterDeliveryNoteSearch } =
    useGetFilterDeliveryNoteExport((data) => {
      setDataFilterDeliveryNoteSearch(data);
    });
  const listFilterDeliveryNoteSearch = useMemo(() => {
    if (!dataFilterDeliveryNoteSearch) return [];
    return dataFilterDeliveryNoteSearch;
  }, [dataFilterDeliveryNoteSearch]);
  const { mutate: addInternalWarehouseDeliveryNote, isPending: loadingAdd } =
    useAdd(() => {
      if (submitType === 'saveAndAdd') {
        form.resetFields();
        setDetailOrderSale({} as any);
        setFromOrgId({} as any);
        setToOrgId({} as any);
      } else {
        navigate(-1);
      }
    });
  const { mutate: getFileDownload } = useGetFileDownload();
  const handleDownloadFile = (file: any) => {
    getFileDownload({
      id: file.id as number,
      fileName: file?.name ?? '',
    });
  };
  useEffect(() => {
    if (dataDetailInternalWarehouseDeliveryNote) {
      getStockToOrg(dataDetailInternalWarehouseDeliveryNote.fromOrgId);
      getStockFromOrg(dataDetailInternalWarehouseDeliveryNote.toOrgId);
      const formValues = {
        ...dataDetailInternalWarehouseDeliveryNote,
        deliveryOrderId:
          dataDetailInternalWarehouseDeliveryNote.refDeliveryNoteCode,
        deliveryNoteDate: dayjs(
          dataDetailInternalWarehouseDeliveryNote.deliveryNoteDate
        ),
        reasonId: dataDetailInternalWarehouseDeliveryNote.reasonId,
        files: dataDetailInternalWarehouseDeliveryNote.attachments.map(
          (item: any) => ({
            name: item.fileName,
            desc: item.description,
            files: item.fileUrl,
            size: item.fileVolume,
            date: item.createdDate,
            id: item.id,
          })
        ),
        deliveryNoteLineDTOList:
          dataDetailInternalWarehouseDeliveryNote.deliveryNoteLines
            .filter((item: any) => Number(item.quantity) !== 0)
            .map((item: any) => ({
              quantity: item.quantity,
            })),
      };
      const orderDetail = {
        saleOrderLines:
          dataDetailInternalWarehouseDeliveryNote.deliveryNoteLines.map(
            (item: any, index: number) => {
              return {
                productName: item.productDTO.productName,
                productCode: item.productDTO.productCode,
                productUOM: item.productDTO.productUom,
              };
            }
          ),
      };
      setDetailOrderSale(orderDetail as any);
      form.setFieldsValue(formValues);
    }
  }, [
    dataDetailInternalWarehouseDeliveryNote,
    form,
    listFilterDeliveryNoteSearch,
    detailDeliveryNote,
  ]);
  const [submitType, setSubmitType] = useState<string>('');
  const handleSubmit = useCallback(
    (values: any) => {
      const data = {
        ...values,
        files: values.files
          ? values.files.reduce((acc: any, item: any) => {
              acc.push(item.files);
              return acc;
            }, [])
          : [],
        deliveryNoteType: DeliveryOrderType.INTERNAL,
        deliveryNoteMethod: DeliveryOrderType.INTERNAL,
        toOrgId: Number(toOrgId.value),
        ticketOutDeliveryNoteId: detailOrderSale?.id,
        deliveryNoteDate: dayjs(values.deliveryNoteDate).format('YYYY-MM-DD'),
        deliveryNoteLines: detailOrderSale.saleOrderLines.map(
          (item: any, index: number) => {
            return {
              deliveryOrderLineId: DeliveryOrderType.INTERNAL,
              quantity: DeliveryOrderType.INTERNAL,
              productId: DeliveryOrderType.INTERNAL,
            };
          }
        ),
        attachmentsDTOS: values.files
          ? values.files.map((item: any) => {
              return {
                description: item.desc ?? '',
              };
            })
          : [],
      };
      addInternalWarehouseDeliveryNote(data);
    },
    [detailOrderSale, toOrgId, form, addInternalWarehouseDeliveryNote]
  );
  useEffect(() => {
    if (fromOrgId.value && toOrgId.value) {
      form.setFieldsValue({
        fromOrgId: fromOrgId.label ?? '',
        toOrgId: toOrgId.label ?? '',
      });
    }
  }, [form, toOrgId, fromOrgId, detailOrderSale]);
  const handleChange = useCallback(
    (value: any, options: any) => {
      if (value) {
        detailDeliveryNote(value);
      }
      setDetailOrderSale({} as any);
    },
    [detailDeliveryNote]
  );
  useEffect(() => {
    if (!dataDetailInternalWarehouseDeliveryNote) {
      detailOrderSale.saleOrderLines?.forEach((item: any, index: number) => {
        form.setFieldValue(
          ['deliveryNoteLineDTOList', index, 'quantity'],
          item.quantity
        );
      });
    }
  }, [
    detailOrderSale,
    form,
    detailDeliveryNote,
    dataDetailInternalWarehouseDeliveryNote,
  ]);
  const { mutate: onCancel } = useCancel(() => {
    navigate(-1);
  });
  const handleCancel = useCallback(() => {
    CModalConfirm({
      message: 'Bạn có chắc chắn muốn Hủy phiếu xuất này không?',
      onOk: () => id && onCancel(id),
    });
  }, [onCancel, id]);
  const renderTitle = useMemo(() => {
    switch (typeModal) {
      case ActionType.ADD:
        return 'Lập phiếu nhập kho nội bộ';
      case ActionType.VIEW:
        return 'Chi tiết phiếu nhập kho nội bộ';
    }
  }, [typeModal]);
  const handleClear = useCallback(() => {
    form.setFieldsValue({
      deliveryNoteDate: dayjs(),
      fromOrgId: '',
      toOrgId: '',
    });
    setFromOrgId({});
    setToOrgId({});
    setDetailOrderSale({} as any);
  }, [form]);
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
            <Show.When isTrue={typeModal === ActionType.ADD}>
              <Col span={24}>
                <Form.Item
                  name="deliveryOrderId"
                  label="Mã phiếu xuất"
                  rules={[
                    {
                      required: true,
                      message: MESSAGE.G06,
                    },
                  ]}
                  className="max-w-[440px]"
                >
                  <DebounceSelect
                    onClear={handleClear}
                    fetchOptions={mutateFilterDeliveryNoteSearch}
                    placeholder="Chọn mã phiếu xuất"
                    onSelect={handleChange}
                  />
                </Form.Item>
              </Col>
            </Show.When>
            <Show.When isTrue={typeModal === ActionType.VIEW}>
              <Col span={24}>
                <Form.Item
                  label="Mã phiếu xuất"
                  name="deliveryOrderId"
                  rules={[
                    {
                      required: true,
                      message: MESSAGE.G06,
                    },
                  ]}
                  className="max-w-[440px]"
                >
                  <CInput className="max-w-[440px]" disabled />
                </Form.Item>
              </Col>
            </Show.When>
          </Row>
        </Card>
        <Card>
          <Row gutter={24}>
            <Show.When isTrue={typeModal === ActionType.VIEW}>
              <Col span={12}>
                <Form.Item
                  label="Mã phiếu nhập"
                  name="deliveryNoteCode"
                  rules={[
                    {
                      required: true,
                      message: MESSAGE.G06,
                    },
                  ]}
                  initialValue={fromOrgId.value}
                >
                  <CInput disabled placeholder="Chọn kho nhập" />
                </Form.Item>
              </Col>
            </Show.When>
            <Show.When isTrue={typeModal === ActionType.ADD}>
              <Col span={12}>
                <Form.Item
                  label="Kho xuất"
                  name="fromOrgId"
                  rules={[
                    {
                      required: true,
                      message: MESSAGE.G06,
                    },
                  ]}
                  initialValue={fromOrgId.value}
                >
                  <CInput disabled placeholder="Chọn kho nhập" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="toOrgId"
                  label="Kho nhận"
                  rules={[
                    {
                      required: true,
                      message: MESSAGE.G06,
                    },
                  ]}
                  initialValue={toOrgId.value}
                >
                  <CInput disabled placeholder="Chọn kho xuất" />
                </Form.Item>
              </Col>
            </Show.When>
            <Show.When isTrue={typeModal === ActionType.VIEW}>
              <Col span={12}>
                <Form.Item
                  label="Kho xuất"
                  name="toOrgId"
                  rules={[
                    {
                      required: true,
                      message: MESSAGE.G06,
                    },
                  ]}
                  initialValue={fromOrgId.value}
                >
                  <CInput disabled placeholder="Chọn kho nhập" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="fromOrgId"
                  label="Kho nhận"
                  rules={[
                    {
                      required: true,
                      message: MESSAGE.G06,
                    },
                  ]}
                  initialValue={toOrgId.value}
                >
                  <CInput disabled placeholder="Chọn kho xuất" />
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
                      } else if (
                        dayjs(value).isBefore(dayjs(deliveryNoteDate), 'day')
                      ) {
                        return Promise.reject(
                          'Ngày lập phiếu nhập không được nhỏ hơn ngày lập phiếu xuất'
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
                initialValue={dayjs()}
              >
                <CDatePicker allowClear={false} />
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
              <Form.Item labelAlign="left" label="Ghi chú" name="description">
                <CTextArea maxLength={200} placeholder="Ghi chú" rows={3} />
              </Form.Item>
            </Col>
          </Row>
          <CTableUploadFile
            showAction={typeModal !== ActionType.VIEW}
            onDownload={
              typeModal === ActionType.VIEW ? handleDownloadFile : undefined
            }
            disabled={typeModal === ActionType.VIEW}
            acceptedFileTypes="*"
          />
          <Row className="mt-6">
            <strong className="text-xl mb-6">Danh sách sản phẩm</strong>
            <CTable
              columns={columns}
              dataSource={detailOrderSale.saleOrderLines}
            />
          </Row>
        </Card>
        <Row className="justify-end">
          <Space className="my-6">
            {typeModal === ActionType.ADD && (
              <>
                <CButtonSaveAndAdd
                  loading={loadingAdd}
                  htmlType="submit"
                  onClick={() => setSubmitType('saveAndAdd')}
                />
                <CButtonSave
                  loading={loadingAdd}
                  onClick={() => setSubmitType('save')}
                  htmlType="submit"
                />
              </>
            )}
            {typeModal === ActionType.VIEW &&
              dataDetailInternalWarehouseDeliveryNote &&
              dataDetailInternalWarehouseDeliveryNote.status ===
                DeliveryOrderStatusList.CREATE && (
                <CButtonCancel disabled={false} onClick={handleCancel}>
                  Hủy phiếu nhập
                </CButtonCancel>
              )}
            <CButtonClose
              disabled={false}
              onClick={() => navigate(-1)}
              type="default"
            />
          </Space>
        </Row>
      </Form>
    </>
  );
};

export default ModalAddEditView;
