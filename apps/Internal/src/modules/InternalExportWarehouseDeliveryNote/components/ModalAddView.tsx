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
import {
  ActionType,
  DeliveryOrderMethod,
  DeliveryOrderType,
} from '@react/constants/app';
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
import useGetDetailStockIn from '../hook/useGetDetailStockIn';
import useGetDetailStockOut from '../hook/useGetDetailStockOut';
import useGetFileDownload from '../hook/useGetFileDownload';
import { useGetFilterDeliveryNoteSearch } from '../hook/useGetFilterDeliveryNoteSearch';
import { useGetFilterDeliveryNoteSearchSend } from '../hook/useGetFilterDeliveryNoteSearchSend';
import '../index.scss';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import { ParamsOption } from '@react/commons/types';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { formatDateEnglishV2 } from '@react/constants/moment';
type Props = {
  typeModal: ActionType;
};
const ModalAddEditView: React.FC<Props> = ({ typeModal }) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [detailOrderSale, setDetailOrderSale] = useState<any>({} as any);
  const listQuantity = useWatch('deliveryNoteLines', form);
  const disableForm = typeModal === ActionType.VIEW;
  const reasonId = useWatch<NumberProcessType>('reasonId', form);
  const { PRODUCT_PRODUCT_UOM } =
    useGetDataFromQueryKey<ParamsOption>([REACT_QUERY_KEYS.GET_PARAMS]) ?? {};
  const optionReason = useListReasonCatalogService(
    disableForm,
    reasonId,
    ReasonCodeEnum.INTERNAL_IMPORT_EXPORT
  );
  const checkQuantity =
    listQuantity && listQuantity.some((item: any) => Boolean(item.quantity));
  useEffect(() => {
    if (listQuantity) {
      listQuantity.forEach((item: { quantity: number }, index: number) => {
        form.validateFields([['deliveryNoteLines', index, 'quantity']]);
      });
    }
  }, [listQuantity, form]);
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
            name={['deliveryNoteLines', index, 'quantity']}
            rules={[
              {
                validator: (_, value) => {
                  const maxQuantity = record.quantity;
                  if (value > maxQuantity && typeModal !== ActionType.VIEW) {
                    return Promise.reject(
                      'Số lượng sản phẩm vượt quá số lượng sản phẩm đơn đề nghị'
                    );
                  } else if (
                    value &&
                    Number(value) < 1 &&
                    typeModal !== ActionType.VIEW
                  ) {
                    return Promise.reject('Số lượng phải lớn hơn hoặc bằng 1');
                  } else if (!checkQuantity && typeModal !== ActionType.VIEW) {
                    return Promise.reject(MESSAGE.G06);
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <CInput
              onlyNumber
              disabled={typeModal === ActionType.VIEW}
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
  const { mutate: detailDeliveryNote } = useGetDetailDeliveryNote((data) => {
    setDeliveryNoteDate(data.orderDate ?? '');
    if (data) {
      getDetailStockOut(data.fromOrgId);
      getDetailStockIn(data.toOrgId);
    }
    const order = {
      id: data.id,
      fromOrgId: data.fromOrgId,
      toOrgId: data.toOrgId,
      deliveryOrderDate: data.orderDate,
      saleOrderLines: data.deliveryOrderLineDTOS
        .filter(
          (item: any) =>
            Number(item.quantity) - Number(item.deliveriedQuantity) !== 0
        )
        .map((item: any, index: number) => {
          return {
            productName: item.productDTO.productName,
            productCode: item.productDTO.productCode,
            productUOM: item.productDTO.productUom,
            quantity: Number(item.quantity) - Number(item.deliveriedQuantity),
            id: item.id,
            productId: item.productDTO.id,
          };
        }),
    };
    const orderDetail = {
      orderNo: data.orderNo,
      fromOrgId: data.fromOrgId,
      toOrgId: data.toOrgId,
      saleOrderLines: data.deliveryOrderLineDTOS
        .filter((item: any) => Number(item.deliveriedQuantity) !== 0)
        .map((item: any, index: number) => {
          return {
            productName: item.productDTO.productName,
            productCode: item.productDTO.productCode,
            productUOM: item.productDTO.productUom,
          };
        }),
    };
    if (dataDetailInternalWarehouseDeliveryNote) {
      setDetailOrderSale(orderDetail as any);
    } else {
      setDetailOrderSale(order as any);
    }
  });
  const [dataFilterDeliveryNoteSearch, setDataFilterDeliveryNoteSearch] =
    useState<any>(null);
  const { mutateAsync: mutateFilterDeliveryNoteSearch } =
    useGetFilterDeliveryNoteSearch((data) => {
      setDataFilterDeliveryNoteSearch(data);
    });
  const { mutateAsync: mutateFilterDeliveryNoteSearchSend } =
    useGetFilterDeliveryNoteSearchSend((data) => {
      setDataFilterDeliveryNoteSearch(data);
    });
  const listFilterDeliveryNoteSearch = useMemo(() => {
    if (!dataFilterDeliveryNoteSearch) return [];
    return dataFilterDeliveryNoteSearch;
  }, [dataFilterDeliveryNoteSearch]);
  const { mutate: getDetailStockIn } = useGetDetailStockOut((data) => {
    form.setFieldValue('toOrgId', data.orgName);
  });
  const { mutate: getDetailStockOut } = useGetDetailStockIn((data) => {
    form.setFieldValue('fromOrgId', data.orgName);
  });
  const { mutate: addInternalWarehouseDeliveryNote, isPending: loadingAdd } =
    useAdd(() => {
      if (submitType === 'saveAndAdd') {
        form.resetFields();
        setDetailOrderSale({} as any);
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
      detailDeliveryNote(
        dataDetailInternalWarehouseDeliveryNote.deliveryOrderId
      );
      const formValues = {
        ...dataDetailInternalWarehouseDeliveryNote,
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
        deliveryNoteLines:
          dataDetailInternalWarehouseDeliveryNote.deliveryNoteLines
            .filter((item: any) => Number(item.quantity) !== 0)
            .map((item: any) => ({
              quantity: item.quantity,
            })),
      };
      form.setFieldsValue(formValues);
    }
  }, [
    dataDetailInternalWarehouseDeliveryNote,
    form,
    listFilterDeliveryNoteSearch,
    detailDeliveryNote,
  ]);
  const checkTypeProposal = useWatch('type', form);
  const [submitType, setSubmitType] = useState<string>('');
  const optionsTypeProposal = [
    {
      label: 'Nhập hàng',
      value: DeliveryOrderMethod.EXPORT, // 1
    },
    {
      label: 'Trả hàng',
      value: DeliveryOrderMethod.RETURN, // 4
    },
  ];
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
        type: values.type,
        deliveryOrderDate: dayjs(detailOrderSale?.orderDate).format(
          formatDateEnglishV2
        ),
        deliveryNoteType: DeliveryOrderType.INTERNAL,
        deliveryNoteMethod: DeliveryOrderType.INTERNAL,
        toOrgId: detailOrderSale.toOrgId,
        fromOrgId: detailOrderSale.fromOrgId,
        deliveryOrderId: detailOrderSale?.id,
        deliveryNoteDate: dayjs(values.deliveryNoteDate).format(
          formatDateEnglishV2
        ),
        deliveryNoteLines: detailOrderSale.saleOrderLines.map(
          (item: any, index: number) => {
            return {
              deliveryOrderLineId: detailOrderSale?.saleOrderLines[index].id,
              productId: detailOrderSale?.saleOrderLines[index].productId,
              quantity: Number(values.deliveryNoteLines[index].quantity),
            };
          }
        ),
        attachments: values.files
          ? values.files.map((item: any) => {
              return {
                fileName: item.name,
                description: item.desc ?? '',
                createdDate: new Date().toISOString(),
              };
            })
          : [],
      };
      addInternalWarehouseDeliveryNote(data);
    },
    [detailOrderSale, form, addInternalWarehouseDeliveryNote]
  );
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
          ['deliveryNoteLines', index, 'quantity'],
          item.quantity
        );
      });
    }
  }, [detailOrderSale, form]);
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
        return 'Lập phiếu xuất kho nội bộ';
      case ActionType.VIEW:
        return 'Chi tiết phiếu xuất kho nội bộ';
    }
  }, [typeModal]);
  const handleClearDeliveryOrder = useCallback(() => {
    form.setFieldsValue({
      fromOrgId: '',
      toOrgId: '',
    });
    setDetailOrderSale({} as any);
  }, [form]);
  useEffect(() => {
    if (deliveryNoteDate) {
      form.validateFields(['deliveryNoteDate']);
    }
  }, [deliveryNoteDate, form]);
  const handleChangeType = useCallback(
    (value: any) => {
      form.resetFields();
      setDetailOrderSale({} as any);
      form.setFieldsValue({
        type: value,
      });
    },
    [form]
  );
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
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                rules={[{ required: true, message: MESSAGE.G06 }]}
                initialValue={DeliveryOrderMethod.EXPORT}
                label="Kiểu đề nghị"
                name="type"
              >
                <CSelect
                  onChange={handleChangeType}
                  allowClear={false}
                  onKeyDown={(e) => e.preventDefault()}
                  options={optionsTypeProposal}
                  placeholder="Chọn kiểu đề nghị"
                />
              </Form.Item>
            </Col>
            <Show.When isTrue={typeModal === ActionType.ADD}>
              <Show.When
                isTrue={checkTypeProposal === DeliveryOrderMethod.EXPORT}
              >
                <Col span={12}>
                  <Form.Item
                    name="deliveryOrderId"
                    label="Mã đề nghị"
                    rules={[
                      {
                        required: true,
                        message: MESSAGE.G06,
                      },
                    ]}
                  >
                    <DebounceSelect
                      fetchOptions={mutateFilterDeliveryNoteSearch}
                      placeholder="Chọn mã đề nghị"
                      onSelect={handleChange}
                      onClear={handleClearDeliveryOrder}
                    />
                  </Form.Item>
                </Col>
              </Show.When>
              <Show.When
                isTrue={checkTypeProposal === DeliveryOrderMethod.RETURN}
              >
                <Col span={12}>
                  <Form.Item
                    name="deliveryOrderId"
                    label="Mã đề nghị"
                    rules={[
                      {
                        required: true,
                        message: MESSAGE.G06,
                      },
                    ]}
                  >
                    <DebounceSelect
                      fetchOptions={mutateFilterDeliveryNoteSearchSend}
                      placeholder="Chọn mã đề nghị"
                      onClear={handleClearDeliveryOrder}
                      onSelect={handleChange}
                    />
                  </Form.Item>
                </Col>
              </Show.When>
            </Show.When>
            <Show.When isTrue={typeModal === ActionType.VIEW}>
              <Col span={12}>
                <Form.Item
                  label="Mã đề nghị"
                  rules={[
                    {
                      required: true,
                      message: MESSAGE.G06,
                    },
                  ]}
                >
                  <CInput value={detailOrderSale.orderNo} disabled />
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
                  label="Mã phiếu xuất"
                  name="deliveryNoteCode"
                  rules={[
                    {
                      required: true,
                      message: MESSAGE.G06,
                    },
                  ]}
                >
                  <CInput />
                </Form.Item>
              </Col>
            </Show.When>
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
              >
                <CInput disabled placeholder="Kho xuất" />
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
              >
                <CInput disabled placeholder="Kho nhận" />
              </Form.Item>
            </Col>
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
                          'Ngày lập phiếu xuất không được nhỏ hơn ngày lập đề nghị'
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
            showAction={typeModal === ActionType.ADD}
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
                  Hủy phiếu xuất
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
