import {
  CButtonClose,
  CButtonSave,
  CButtonSaveAndAdd,
} from '@react/commons/Button';
import CDatePicker from '@react/commons/DatePicker';
import { CModalConfirm } from '@react/commons/index';
import CInput from '@react/commons/Input';
import CSelect from '@react/commons/Select';
import CTableUploadFile from '@react/commons/TableUploadFile';
import Show from '@react/commons/Template/Show';
import { TitleHeader } from '@react/commons/Template/style';
import CTextArea from '@react/commons/TextArea';
import { AnyElement, ParamsOption } from '@react/commons/types';
import { ActionType, DeliveryOrderType } from '@react/constants/app';
import { formatDateEnglishV2 } from '@react/constants/moment';
import {
  DeliveryOrderApprovalStatusList,
  DeliveryOrderStatusList,
} from '@react/constants/status';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import { MESSAGE } from '@react/utils/message';
import { Card, Col, Form, Row, Space } from 'antd';
import { useForm, useWatch } from 'antd/es/form/Form';
import { NumberProcessType } from 'apps/Internal/src/constants/constants';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useGetFile } from 'apps/Internal/src/hooks/useGetFileDownload';
import {
  ReasonCodeEnum,
  useListReasonCatalogService,
} from 'apps/Internal/src/hooks/useReasonCatalogService';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useAdd from '../hook/useAdd';
import { useCancel } from '../hook/useCancel';
import { useComboboxStockOut } from '../hook/useComboboxStockOut';
import useGetDetail from '../hook/useGetDetail';
import useGetFileDownload from '../hook/useGetFileDownload';
import useGetStockCurrentUser from '../hook/useGetStockCurrentUser';
import useGetStockIn from '../hook/useGetStockIn';
import { useListStock } from '../hook/useListStock';
import useStoreInternalExportProposal from '../store';
import { IDataPayloadDTO, IOrganizationUnitDTO, ProposalType } from '../type';
import CButtonCancel from './CButtonCancel';
import CButtonCopy from './CButtonCopy';
import TableProduct from './TableProduct';

const ModalAddView = ({
  actionType,
  isReceive = false,
  isEnabledApproval = false,
}: {
  actionType: ActionType;
  isReceive?: boolean;
  isEnabledApproval?: boolean;
}) => {
  const navigate = useNavigate();
  const [form] = useForm();
  const { data: dataStockIn, isLoading: loadingStockIn } = useGetStockIn(
    actionType === ActionType.ADD
  );
  const { PRODUCT_PRODUCT_UOM } =
    useGetDataFromQueryKey<ParamsOption>([REACT_QUERY_KEYS.GET_PARAMS]) ?? {};
  const { data: dataGetStockCurrentUser, isLoading: loadingStockCurrentUser } =
    useGetStockCurrentUser(
      actionType === ActionType.ADD || actionType === ActionType.EDIT
    );
  const { data: dataListStock } = useListStock(actionType === ActionType.VIEW);
  const listStock = useMemo(() => {
    if (!dataListStock) return [];
    return dataListStock.map((item: IOrganizationUnitDTO) => {
      return { value: item.id, label: item.orgName };
    });
  }, [dataListStock]);
  const listWarehouseImport = useMemo(() => {
    if (!dataGetStockCurrentUser) return [];
    return dataGetStockCurrentUser.map((item: any) => {
      return { value: item.orgId, label: item.orgName };
    });
  }, [dataGetStockCurrentUser]);
  const { id } = useParams();
  const { data: dataDetail } = useGetDetail(id ?? '');
  const [submitType, setSubmitType] = useState<string>('');
  const optionProposalType = [
    {
      value: ProposalType.NhapHang,
      label: 'Nhập hàng',
    },
    {
      value: ProposalType.TraHang,
      label: 'Trả hàng',
    },
  ];
  const [typeProposalSend, setTypeProposalSend] = useState<string>(
    dataDetail ? dataDetail.orderType : ProposalType.NhapHang
  );
  const [optionsComboxStockOut, setOptionsComboxStockOut] = useState<any[]>([]);
  const disableForm = isEnabledApproval || actionType === ActionType.VIEW;
  const reasonId = useWatch<NumberProcessType>('reasonId', form);
  const optionReason = useListReasonCatalogService(
    disableForm,
    reasonId,
    ReasonCodeEnum.INTERNAL_IMPORT_EXPORT
  );
  const { mutateAsync: getFileDownloadCopy } = useGetFile();
  useEffect(() => {
    if (dataDetail) {
      setTypeProposalSend(dataDetail.orderType);
      if (actionType === ActionType.VIEW) {
        form.setFieldsValue({
          toOrgId: listStock.find(
            (item) => String(item.value) === String(dataDetail.toOrgId)
          ),
          fromOrgId: listStock.find(
            (item) => String(item.value) === String(dataDetail.fromOrgId)
          ),
          orderDate: dayjs(dataDetail.orderDate),
          reasonId: dataDetail.reasonId,
          description: dataDetail.description,
          orderType: String(dataDetail.orderType),
          orderNo: dataDetail.orderNo,
          files: dataDetail.attachmentsDTOS.map((item: any) => {
            return {
              name: item.fileName,
              desc: item.description,
              size: item.fileVolume,
              date: item.createdDate,
              id: item.id,
            };
          }),
          products: dataDetail.deliveryOrderLineDTOS.map((item: any) => {
            return {
              quantity: item.quantity,
              productCode: item.productDTO.productCode,
              productName: item.productDTO.productName,
              productUom: String(item.productDTO.productUom),
              id: item.productDTO.id,
            };
          }),
        });
      } else if (actionType === ActionType.EDIT) {
        const checkTypeTraHang =
          dataDetail.orderType === Number(ProposalType.TraHang);
        getComboboxStockOut(
          checkTypeTraHang ? dataDetail.fromOrgId : dataDetail.toOrgId
        );
        form.setFieldsValue({
          orderDate: dayjs(dataDetail.orderDate),
          reasonId:
            optionReason.find(
              (reason) => String(reason.value) === String(dataDetail.reasonId)
            )?.value ?? null,
          toOrgId: checkTypeTraHang ? dataDetail.fromOrgId : dataDetail.toOrgId,
          fromOrgId: checkTypeTraHang
            ? dataDetail.toOrgId
            : dataDetail.fromOrgId,
          description: dataDetail.description,
          orderType: String(dataDetail.orderType),
          orderNo: dataDetail.orderNo,
          files: dataDetail.attachmentsDTOS.map((item: any) => {
            return {
              name: item.fileName,
              desc: item.description,
              size: item.fileVolume,
              date: item.createdDate,
              id: item.id,
            };
          }),
          products: dataDetail.deliveryOrderLineDTOS.map((item: any) => {
            return {
              quantity: item.quantity,
              productCode: item.productDTO.productCode,
              productName: item.productDTO.productName,
              productUom: String(item.productDTO.productUom),
              id: item.productDTO.id,
            };
          }),
        });
      }
    }
  }, [dataDetail, actionType, form, listStock]);
  const { mutate: getFileDownload } = useGetFileDownload();
  const handleDownloadFile = (record: any) => {
    getFileDownload({
      id: record.id as number,
      fileName: record?.name ?? '',
    });
  };
  const handleCloseAddSave = useCallback(() => {
    form.resetFields();
    setTypeProposalSend(ProposalType.NhapHang);
    getComboboxStockOut(String(dataStockIn));
  }, [form, dataStockIn]);
  const handleClose = useCallback(() => {
    form.resetFields();
    navigate(pathRoutes.internalExportProposal);
  }, [navigate, form]);
  const handleCloseModal = useCallback(() => {
    navigate(-1);
  }, [navigate]);
  const { mutate: addInternalExportProposal, isPending: loadingAdd } = useAdd(
    () => {
      if (submitType === 'saveAndAdd') {
        handleCloseAddSave();
      } else {
        handleClose();
      }
    }
  );

  const handleSubmit = useCallback(
    async (values: IDataPayloadDTO) => {
      const deliveryOrderDTO = {
        fromOrgId:
          Number(typeProposalSend) === Number(ProposalType.NhapHang)
            ? values.fromOrgId
            : values.toOrgId,
        toOrgId:
          Number(typeProposalSend) === Number(ProposalType.NhapHang)
            ? values.toOrgId
            : values.fromOrgId,
        reasonId: values.reasonId,
        description: values.description,
        orderType: Number(values.orderType),
        orderDate: dayjs(values.orderDate).format(formatDateEnglishV2),
        deliveryOrderType: DeliveryOrderType.INTERNAL,
        deliveryOrderLineDTOS: values.products.map((item: any) => {
          return {
            orderDate: dayjs().format(formatDateEnglishV2),
            productId: item.id,
            quantity: Number(item.quantity),
          };
        }),
        attachmentsDTOS: values.files
          ? values.files.map((item: any) => {
              return {
                fileName: item.name,
                description: item.desc ?? '',
                createdDate: new Date().toISOString(),
              };
            })
          : [],
      };
      let attachmentFiles = {
        files: values.files
          ? values.files.reduce((acc: any, item: any) => {
              acc.push(item.files);
              return acc;
            }, [])
          : [],
      };
      if (actionType !== ActionType.ADD && values.files?.length) {
        const fetchedFiles = await Promise.all(
          values.files.map((file: any) =>
            !file.files && file.id
              ? getFileDownloadCopy({ id: file.id, fileName: file.name })
              : file.files
          )
        );
        attachmentFiles = {
          files: values.files.map(
            (file: any, idx) => file.files ?? fetchedFiles[idx]
          ),
        };
      }
      const data = {
        deliveryOrderDTO: deliveryOrderDTO,
        attachmentFiles: attachmentFiles,
      };
      addInternalExportProposal(data as AnyElement);
    },
    [addInternalExportProposal, typeProposalSend]
  );
  const renderTitle = useMemo(() => {
    switch (actionType) {
      case ActionType.VIEW:
        return 'Xem chi tiết đề nghị xuất kho nội bộ';
      case ActionType.ADD:
      case ActionType.EDIT:
        return 'Lập đề nghị xuất kho gửi đi nội bộ';
      default:
        return '';
    }
  }, [actionType]);
  const { mutate: onCancel } = useCancel(handleClose);
  const handleCancel = useCallback(() => {
    CModalConfirm({
      message: 'Bạn có chắc chắn muốn Hủy đề nghị này không?',
      onOk: () =>
        onCancel({
          id: id ?? '',
          status: DeliveryOrderStatusList.CANCEL,
        }),
    });
  }, [onCancel]);
  const handleCopy = useCallback(() => {
    navigate(pathRoutes.internalExportProposalCopy(id));
  }, [navigate, id]);
  const { mutate: getComboboxStockOut, isPending: loadingComboboxStockOut } =
    useComboboxStockOut((data) => {
      setOptionsComboxStockOut(data);
    });
  useEffect(() => {
    if (dataStockIn && actionType === ActionType.ADD && !!dataStockIn) {
      getComboboxStockOut(String(dataStockIn));
    }
  }, [dataStockIn, actionType, getComboboxStockOut]);
  const { setOrgIds } = useStoreInternalExportProposal();
  const handleChangeWarehouseImport = useCallback(
    (id: string) => {
      if (!id) {
        setOptionsComboxStockOut([]);
        return;
      }
      form.setFieldValue('fromOrgId', null);
      setOptionsComboxStockOut([]);
      getComboboxStockOut(id);
      setOrgIds(id);
      form.setFieldValue('products', [{}]);
    },
    [
      getComboboxStockOut,
      form,
      typeProposalSend,
      setOrgIds,
      setOptionsComboxStockOut,
    ]
  );
  const handleChangeTypeProposalSend = useCallback(
    (value: string) => {
      setTypeProposalSend(value);
      form.setFieldValue('products', [{}]);
    },
    [setTypeProposalSend, form]
  );
  useEffect(() => {
    if (actionType !== ActionType.VIEW) {
      if (String(typeProposalSend) === ProposalType.NhapHang) {
        setOrgIds(form.getFieldValue('fromOrgId'));
      } else {
        setOrgIds(form.getFieldValue('toOrgId'));
      }
    }
  }, [actionType, typeProposalSend, form, setOrgIds]);
  const handleChangeOrgExport = useCallback(
    (value: string) => {
      setOrgIds(value);
      form.setFieldValue('products', [{}]);
    },
    [setOrgIds]
  );
  useEffect(() => {
    return () => {
      setOrgIds('');
      form.resetFields();
    };
  }, []);
  return (
    <div>
      <TitleHeader>{renderTitle}</TitleHeader>
      {loadingStockIn ? null : (
        <div>
          <Form
            labelAlign="left"
            labelCol={{ style: { minWidth: '110px' } }}
            form={form}
            onFinish={handleSubmit}
            disabled={actionType === ActionType.VIEW}
            layout="horizontal"
          >
            <Card>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    rules={[{ required: true, message: MESSAGE.G06 }]}
                    label="Kiểu đề nghị"
                    name="orderType"
                    initialValue={ProposalType.NhapHang}
                  >
                    <CSelect
                      allowClear={false}
                      onChange={handleChangeTypeProposalSend}
                      placeholder="Chọn kiểu đề nghị"
                      options={optionProposalType}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}></Col>
                <Show.When isTrue={actionType === ActionType.VIEW}>
                  <Col span={12}>
                    <Form.Item
                      rules={[{ required: true, message: MESSAGE.G06 }]}
                      label="Mã đề nghị"
                      name="orderNo"
                    >
                      <CInput disabled />
                    </Form.Item>
                  </Col>
                </Show.When>
                {/* check đoạn này */}
                <Show.When
                  isTrue={
                    Number(typeProposalSend) ===
                      Number(ProposalType.NhapHang) ||
                    actionType === ActionType.VIEW
                  }
                >
                  <Col span={12}>
                    <Form.Item
                      rules={[{ required: true, message: MESSAGE.G06 }]}
                      label="Kho xuất"
                      name="fromOrgId"
                    >
                      <CSelect
                        placeholder="Chọn kho xuất"
                        allowClear={false}
                        loading={loadingComboboxStockOut}
                        options={optionsComboxStockOut}
                        onChange={handleChangeOrgExport}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      rules={[{ required: true, message: MESSAGE.G06 }]}
                      label="Kho nhận"
                      name="toOrgId"
                      initialValue={dataStockIn}
                    >
                      <CSelect
                        loading={loadingStockCurrentUser}
                        onChange={handleChangeWarehouseImport}
                        options={listWarehouseImport}
                        placeholder="Chọn kho nhận"
                        allowClear={false}
                      />
                    </Form.Item>
                  </Col>
                </Show.When>
                {/* check đoạn này */}
                <Show.When
                  isTrue={
                    Number(typeProposalSend) === Number(ProposalType.TraHang) &&
                    actionType !== ActionType.VIEW
                  }
                >
                  <Col span={12}>
                    <Form.Item
                      rules={[{ required: true, message: MESSAGE.G06 }]}
                      label="Kho xuất"
                      name="toOrgId"
                      initialValue={dataStockIn}
                    >
                      <CSelect
                        loading={loadingStockCurrentUser}
                        onChange={handleChangeWarehouseImport}
                        options={listWarehouseImport}
                        placeholder="Chọn kho xuất"
                        allowClear={false}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      rules={[{ required: true, message: MESSAGE.G06 }]}
                      label="Kho nhận"
                      name="fromOrgId"
                    >
                      <CSelect
                        placeholder="Chọn kho nhận"
                        loading={loadingComboboxStockOut}
                        options={optionsComboxStockOut}
                        allowClear={false}
                      />
                    </Form.Item>
                  </Col>
                </Show.When>
                {/* check đoạn này */}
                <Col span={12}>
                  <Form.Item
                    rules={[{ required: true, message: MESSAGE.G06 }]}
                    label="Ngày lập"
                    name="orderDate"
                    initialValue={dayjs()}
                  >
                    <CDatePicker />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    rules={[{ required: true, message: MESSAGE.G06 }]}
                    label="Lý do"
                    name="reasonId"
                  >
                    <CSelect placeholder="Chọn lý do" options={optionReason} />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Ghi chú" name="description">
                    <CTextArea maxLength={200} rows={3} />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <CTableUploadFile
                    showAction={actionType !== ActionType.VIEW}
                    onDownload={
                      actionType === ActionType.VIEW
                        ? handleDownloadFile
                        : undefined
                    }
                    disabled={actionType === ActionType.VIEW}
                    acceptedFileTypes="*"
                  />
                </Col>
                <Col span={24}>
                  <TableProduct actionType={actionType} />
                </Col>
              </Row>
            </Card>
            <Show.When isTrue={!isEnabledApproval}>
              <Space className="mt-4 flex justify-end">
                {actionType === ActionType.ADD ||
                actionType === ActionType.EDIT ? (
                  <>
                    <CButtonSaveAndAdd
                      onClick={() => setSubmitType('saveAndAdd')}
                      htmlType="submit"
                      loading={loadingAdd}
                    />
                    <CButtonSave
                      onClick={() => setSubmitType('save')}
                      htmlType="submit"
                      loading={loadingAdd}
                    />
                  </>
                ) : null}
                {actionType === ActionType.VIEW &&
                  dataDetail &&
                  dataDetail.approvalStatus ===
                    DeliveryOrderApprovalStatusList.PENDING &&
                  dataDetail.orderStatus === DeliveryOrderStatusList.CREATE &&
                  !isReceive && (
                    <CButtonCancel
                      onClick={handleCancel}
                      disabled={false}
                      type="default"
                    >
                      Hủy đề nghị
                    </CButtonCancel>
                  )}
                {actionType === ActionType.VIEW && !isReceive && (
                  <CButtonCopy onClick={handleCopy} disabled={false}>
                    Sao chép
                  </CButtonCopy>
                )}
                <CButtonClose
                  onClick={handleCloseModal}
                  disabled={false}
                  type="default"
                />
              </Space>
            </Show.When>
          </Form>
        </div>
      )}
    </div>
  );
};

export default ModalAddView;
