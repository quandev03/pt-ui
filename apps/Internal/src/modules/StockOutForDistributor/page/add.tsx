import {
  CButtonClose,
  CButtonSave,
  CButtonSaveAndAdd,
} from '@react/commons/Button';
import CDatePicker from '@react/commons/DatePicker';
import CSelect from '@react/commons/Select';
import CTable from '@react/commons/Table';
import CTableUploadFile from '@react/commons/TableUploadFile';
import { Text, TitleHeader } from '@react/commons/Template/style';
import CTextArea from '@react/commons/TextArea';
import { Card, Col, Form, Row, Space } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { Tooltip } from 'antd/lib';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActionType, DeliveryOrderType } from '@react/constants/app';
import {
  CategoryType,
  IDataOrder,
  IReason,
  IStockCurrentUserPermission,
  StatusStockOutForDistributor,
} from '../type';
import { MESSAGE } from '@react/utils/message';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetOrderDetail } from '../../Order/queryHooks';
import useGetSaleOder from '../hook/useGetSaleOrder';
import useGetWarehouseExport from '../hook/useGetWarehouseExport';
import useAddStockOutForDistributor from '../hook/useAddStockOutForDistributor';
import useGetDetailStockOutForDistributor from '../hook/useGetDetailStockOutForDistributor';
import useGetFileDownloadStockOutForDistributor from '../hook/useGetFileDownloadStockOutForDistributor';
import CInput from '@react/commons/Input';
import { AnyElement, ModelStatus } from '@react/commons/types';
import Show from '@react/commons/Template/Show';
import useGetAllSaleOder from '../hook/useGetAllSaleOrder';
import CButtonCancel from '../components/CButtonCancel';
import useCancelDeliveryNoteOperation from '../hook/useCancelDeliveryNoteOperation';
import { CModalConfirm, DebounceSelect } from '@react/commons/index';
import '../index.scss';
import useGetStockCurrentUser from '../hook/useGetStockCurrentUser';
import { useWatch } from 'antd/es/form/Form';
import validateForm from '@react/utils/validator';
import { NumberProcessType } from 'apps/Internal/src/constants/constants';
import {
  ReasonCodeEnum,
  useListReasonCatalogService,
} from 'apps/Internal/src/hooks/useReasonCatalogService';
type Props = {
  typeModal: ActionType;
};
const ModalAddEditView: React.FC<Props> = ({ typeModal }) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [detailOrderSale, setDetailOrderSale] = useState<IDataOrder>(
    {} as IDataOrder
  );
  const [toOrgId, setToOrgId] = useState({});
  const disableForm = typeModal === ActionType.VIEW;
  const reasonId = useWatch<NumberProcessType>('reasonId', form);
  const optionReason = useListReasonCatalogService(
    disableForm,
    reasonId,
    ReasonCodeEnum.NPP_IMPORT_EXPORT
  );
  const listQuantity = useWatch('deliveryNoteLines', form);
  const checkQuantity =
    listQuantity &&
    listQuantity.some((item: any) => Boolean(item.remainQuantity));
  useEffect(() => {
    if (listQuantity) {
      listQuantity.forEach(
        (item: { remainQuantity: number }, index: number) => {
          form.validateFields([['deliveryNoteLines', index, 'remainQuantity']]);
        }
      );
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
      title: 'Đơn vị tính',
      dataIndex: 'productUOM',
      width: 120,
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
      title: 'Số lượng',
      width: 160,
      align: 'left',
      render: (value: string, record, index) => {
        return (
          <Form.Item
            rules={[
              {
                validator: (_, value) => {
                  const maxQuantity = record.remainQuantity;
                  if (value > maxQuantity && typeModal !== ActionType.VIEW) {
                    return Promise.reject(
                      'Số lượng sản phẩm vượt quá số lượng trong kho'
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
            name={['deliveryNoteLines', index, 'remainQuantity']}
          >
            <CInput
              onlyNumber
              disabled={typeModal === ActionType.VIEW}
              min={1}
              maxLength={9}
              max={record.remainQuantity}
              placeholder="Nhập số lượng"
            />
          </Form.Item>
        );
      },
    },
  ];
  const { id } = useParams();
  const { data: dataDetailStockOutForDistributor } =
    useGetDetailStockOutForDistributor(id ?? '');
  const { mutate: detailOrder } = useGetOrderDetail((data) => {
    if (typeModal === ActionType.VIEW) {
      form.setFieldValue('orderId', data.orderNo);
    }
    const order = {
      ...data,
      saleOrderLines: data.saleOrderLines.filter((item: any) => {
        return (
          item.remainQuantity !== 0 &&
          item.categoryType !== CategoryType.PhiChonSo
        );
      }),
    };
    const orderDetail = {
      ...data,
      saleOrderLines: data.saleOrderLines.filter((item: any) => {
        return (
          item.quantity !== 0 &&
          (dataDetailStockOutForDistributor?.deliveryNoteLines
            ?.map((item: any) => {
              return item.productId;
            })
            .includes(item.productId) ||
            false)
        );
      }),
    };
    if (dataDetailStockOutForDistributor) {
      setDetailOrderSale(orderDetail as any);
    } else {
      setDetailOrderSale(order as any);
    }
    if (data) {
      setToOrgId({
        label: data.orgName,
        value: data.requestOrgId,
      });
    }
  });
  const { mutateAsync: dataOrders } = useGetSaleOder();
  const { data: dataGetWarehouseExportDefault } = useGetWarehouseExport();
  const { data: dataStockCurrentUser, isPending: loadingStockCurrentUser } =
    useGetStockCurrentUser();
  const listWarehouseExport = useMemo(() => {
    if (!dataStockCurrentUser) return [];
    return dataStockCurrentUser.map((item: IStockCurrentUserPermission) => {
      return {
        value: String(item.orgId),
        label: item.orgName,
      };
    });
  }, [dataStockCurrentUser]);
  const { mutate: addStockOutDistributor, isPending: loadingAdd } =
    useAddStockOutForDistributor(() => {
      if (submitType === 'saveAndAdd') {
        form.resetFields();
        setDetailOrderSale({} as IDataOrder);
      } else {
        navigate(-1);
      }
    });
  const { mutate: getFileDownloadStockOutForDistributor } =
    useGetFileDownloadStockOutForDistributor();
  const handleDownloadFile = (file: any) => {
    getFileDownloadStockOutForDistributor({
      id: file.id as number,
      fileName: file?.name ?? '',
    });
  };
  useEffect(() => {
    if (dataDetailStockOutForDistributor && dataOrders.length > 0) {
      detailOrder(dataDetailStockOutForDistributor.hashedsaleOrderId);
      const formValues = {
        ...dataDetailStockOutForDistributor,
        deliveryNoteDate: dayjs(
          dataDetailStockOutForDistributor.deliveryNoteDate
        ),
        reasonId: dataDetailStockOutForDistributor.reasonId,
        fromOrgId: String(dataDetailStockOutForDistributor.fromOrgId),
        files: dataDetailStockOutForDistributor.attachments.map(
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
          dataDetailStockOutForDistributor.deliveryNoteLines.map(
            (item: any) => ({
              remainQuantity: item.quantity,
            })
          ),
      };
      form.setFieldsValue(formValues);
    }
  }, [dataDetailStockOutForDistributor, form, dataOrders, detailOrder]);
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
        deliveryNoteType: DeliveryOrderType.PARTNER,
        deliveryNoteMethod: DeliveryOrderType.INTERNAL,
        saleOrderId: detailOrderSale?.id,
        saleOrderDate: dayjs(detailOrderSale?.orderDate).format('YYYY-MM-DD'),
        deliveryNoteDate: dayjs(values.deliveryNoteDate).format('YYYY-MM-DD'),
        deliveryNoteLines: values.deliveryNoteLines
          .map((item: any, index: number) => {
            return {
              saleOrderLineId: detailOrderSale?.saleOrderLines[index].id,
              productId: detailOrderSale?.saleOrderLines[index].productId,
              quantity: item.remainQuantity,
            };
          })
          .filter((item: any) => !!item.quantity),
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
      addStockOutDistributor(data);
    },
    [form, detailOrderSale]
  );
  useEffect(() => {
    if (
      listWarehouseExport.length > 0 &&
      dataGetWarehouseExportDefault &&
      !dataDetailStockOutForDistributor
    ) {
      form.setFieldsValue({
        fromOrgId: String(dataGetWarehouseExportDefault.id),
        toOrgId: [toOrgId][0].value ?? '',
      });
    }
  }, [listWarehouseExport, form, toOrgId, dataGetWarehouseExportDefault]);
  const handleChange = useCallback(
    (value: any, option: any) => {
      if (value) {
        detailOrder(value);
      }
      setDetailOrderSale({} as IDataOrder);
    },
    [detailOrder]
  );
  useEffect(() => {
    if (!dataDetailStockOutForDistributor) {
      detailOrderSale.saleOrderLines?.forEach((item, index) => {
        form.setFieldValue(
          ['deliveryNoteLines', index, 'remainQuantity'],
          item.remainQuantity
        );
      });
    }
  }, [detailOrderSale, form]);
  const { mutate: onCancel } = useCancelDeliveryNoteOperation(() => {
    navigate(-1);
  });
  const handleCancel = useCallback(() => {
    CModalConfirm({
      message: 'Bạn có chắc chắn muốn Hủy phiếu xuất này không?',
      onOk: () => id && onCancel(id),
    });
  }, [onCancel, id]);
  useEffect(() => {
    if (detailOrderSale.orderDate) {
      form.validateFields(['deliveryNoteDate']);
    }
  }, [detailOrderSale.orderDate, form]);
  return (
    <>
      <TitleHeader>
        {typeModal === ActionType.ADD
          ? 'Lập phiếu xuất kho cho Đối tác'
          : 'Xem chi tiết phiếu xuất kho cho Đối tác'}
      </TitleHeader>
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
                  name="orderId"
                  label="Mã đơn hàng"
                  rules={[
                    {
                      required: true,
                      message: MESSAGE.G06,
                    },
                  ]}
                  className="max-w-[440px]"
                >
                  <DebounceSelect
                    allowClear={false}
                    onSelect={handleChange}
                    fetchOptions={dataOrders}
                    placeholder="Chọn mã đơn hàng"
                  />
                </Form.Item>
              </Col>
            </Show.When>
            <Show.When isTrue={typeModal === ActionType.VIEW}>
              <Col span={24}>
                <Form.Item
                  name="orderId"
                  label="Mã đơn hàng"
                  rules={[
                    {
                      required: true,
                      message: MESSAGE.G06,
                    },
                  ]}
                  className="max-w-[440px]"
                >
                  <CInput value={detailOrderSale.orderNo} />
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
                label="Ngày lập"
                name="deliveryNoteDate"
                rules={[
                  validateForm.required,
                  {
                    validator: (_, value) => {
                      if (!value || !detailOrderSale.orderDate) {
                        return Promise.resolve();
                      } else if (
                        dayjs(value).isBefore(
                          dayjs(detailOrderSale.orderDate),
                          'day'
                        )
                      ) {
                        return Promise.reject(
                          'Ngày lập không được nhỏ hơn ngày tạo đơn hàng'
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
                initialValue={dayjs()}
              >
                <CDatePicker />
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
              >
                <CSelect
                  options={listWarehouseExport}
                  loading={loadingStockCurrentUser}
                  placeholder="Chọn kho"
                ></CSelect>
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
                <CSelect
                  disabled
                  options={[toOrgId]}
                  placeholder="Chọn kho nhập"
                ></CSelect>
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
                <CSelect
                  options={optionReason}
                  placeholder="Chọn lý do"
                ></CSelect>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item labelAlign="left" label="Ghi chú" name="description">
                <CTextArea
                  maxLength={250}
                  placeholder="Ghi chú"
                  autoSize={{ minRows: 3, maxRows: 5 }}
                />
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
              dataDetailStockOutForDistributor &&
              dataDetailStockOutForDistributor.status ===
                StatusStockOutForDistributor.CREATE &&
              dataDetailStockOutForDistributor.status !==
                StatusStockOutForDistributor.EXPORT && (
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
