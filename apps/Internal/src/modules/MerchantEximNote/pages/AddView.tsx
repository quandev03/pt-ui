import {
  CButtonClose,
  CButtonDelete,
  CButtonPrint,
  CButtonSave,
  CButtonSaveAndAdd,
} from '@react/commons/Button';
import {
  CDatePicker,
  CInput,
  CModalConfirm,
  CSelect,
  CTextArea,
  DebounceSelect,
  NotificationError,
  NotificationSuccess,
} from '@react/commons/index';
import CTableUploadFile, { FileData } from '@react/commons/TableUploadFile';
import { TitleHeader } from '@react/commons/Template/style';
import { FieldErrorsType } from '@react/commons/types';
import {
  ActionsTypeEnum,
  ActionType,
  DateFormat,
  DeliveryOrderMethod,
  DeliveryOrderType,
} from '@react/constants/app';
import { CurrentStatusList } from '@react/constants/status';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import { subPageTitle } from '@react/utils/index';
import { MESSAGE } from '@react/utils/message';
import validateForm from '@react/utils/validator';
import { Card, Col, Flex, Form, Row, Spin } from 'antd';
import { ParamsOption } from 'apps/Internal/src/components/layouts/types';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import {
  useGetFile,
  useGetFileDownload,
} from 'apps/Internal/src/hooks/useGetFileDownload';
import {
  ReasonCodeType,
  useListReasonByCode,
} from 'apps/Internal/src/hooks/useListReasonByCode';
import dayjs from 'dayjs';
import { filter, sum, uniqBy } from 'lodash';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { OrganizationOptions } from '../../MerchantOrder/constants';
import { useMutateListOrder } from '../../MerchantOrder/hooks/useListOrder';
import { useMutateOrder } from '../../MerchantOrder/hooks/useViewOrder';
import ModalPrint from '../components/ModalPrint';
import TableProduct from '../components/TableProduct';
import { RequestAddNote, useAddNote } from '../hooks/useAddNote';
import { useEditStatusNote } from '../hooks/useEditStatusNote';
import { useViewNote } from '../hooks/useViewNote';
import '../index.scss';
import { FileType, ProductType } from '../types';

export interface NoteAddViewProps {
  actionType: ActionsTypeEnum | ActionType;
  isImport?: boolean;
}

const NoteAddView: React.FC<NoteAddViewProps> = ({
  actionType,
  isImport = false,
}) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id = '' } = useParams();
  const isViewType = actionType === ActionType.VIEW;
  const isAddType = actionType === ActionType.ADD;
  const name = !isImport ? 'xuất' : 'nhập';
  const { PRODUCT_PRODUCT_UOM = [] } = useGetDataFromQueryKey<ParamsOption>([
    REACT_QUERY_KEYS.GET_PARAMS,
  ]);
  const [isOpenPrint, setIsOpenPrint] = useState<boolean>(false);
  const { mutate: mutateAdd, isPending: isLoadingAdd } = useAddNote();
  const { data = {}, isFetching: isLoadingView } = useViewNote(id);
  const { isFetching: isLoadingReason, data: listReason = [] } =
    useListReasonByCode(
      { reasonTypeCode: ReasonCodeType.NCC_IMPORT_EXPORT },
      data?.reasonId
    );
  const { mutateAsync: getFileDownload } = useGetFile();
  const { mutate: mutateDownloadFile, isPending: isLoadingFile } =
    useGetFileDownload();
  const { mutate: mutateStatus, isPending: isLoadingStatus } =
    useEditStatusNote();
  const { mutateAsync: mutateListOrder } = useMutateListOrder();
  const {
    mutateAsync: mutateOrder,
    isPending: isLoadingOrder,
    data: dataOrder,
  } = useMutateOrder();

  useEffect(() => {
    form.setFieldsValue({
      ...data,
      toOrgId: data?.toOrgId,
      deliveryNoteDate: data?.deliveryNoteDate ?? dayjs(),
      files: isViewType
        ? data?.files
        : !!data?.files?.length
        ? data?.files
        : [{}],
      products:
        data?.products?.map((e: any) => ({
          ...e,

          productUom: PRODUCT_PRODUCT_UOM?.find(
            (c) => c.value === e?.productUom
          )?.label,
        })) ?? [],
    });
    if (isViewType) {
      data?.deliveryOrderId && mutateOrder(data?.deliveryOrderId);
    } else {
      handleSelectOrder(data?.deliveryOrderId, true);
    }
  }, [isLoadingView, PRODUCT_PRODUCT_UOM, isViewType]);

  const handleRequestAdd = (
    { payload, listFile }: RequestAddNote,
    isSaveAndAdd?: boolean
  ) => {
    mutateAdd(
      {
        payload,
        listFile,
        isImport,
      },
      {
        onSuccess: () => {
          NotificationSuccess(isAddType ? MESSAGE.G01 : MESSAGE.G16);
          if (!isSaveAndAdd) {
            window.history.back();
          } else {
            form.resetFields();
            form.setFieldsValue({ deliveryNoteDate: dayjs(), products: [] });
          }
        },
        onError: (err: any) => {
          if (err?.errors?.length > 0) {
            form.setFields(
              err.errors.map((item: FieldErrorsType) => {
                const fieldArr = item.field.split('_');
                return {
                  name: ['products', Number(fieldArr[1]), fieldArr[0]],
                  errors: [item.detail],
                };
              })
            );
          }
        },
      }
    );
  };

  const handleSubmit = (values: any, isSaveAndAdd?: boolean) => {
    const { products, orderDate, deliveryNoteDate, id, files, ...restValues } =
      values;
    const listQuantity = products.map((e: ProductType) => e.quantity ?? 0);
    if (!sum(listQuantity)) {
      NotificationError(
        'Vui lòng kiểm tra lại, phiếu nhập cần có ít nhất 1 sản phẩm được nhập'
      );
      return;
    }
    const attachments = values?.files?.map((e: any) => ({
      fileName: e.name,
      description: e.desc,
      createdDate: dayjs(e.date, ''),
    }));
    let listFile = [];
    const payload = {
      ...restValues,
      deliveryNoteDate: dayjs(deliveryNoteDate).format(DateFormat.DATE_ISO),
      attachments,
      deliveryNoteLines: products?.filter((c: ProductType) => c.quantity),
      deliveryNoteType: DeliveryOrderType.NCC,
      deliveryNoteMethod: DeliveryOrderMethod.IMPORT,
    };
    if (!isAddType && files?.length) {
      Promise.all(
        files.map(
          (e: FileType) =>
            !e.files && e?.id && getFileDownload({ id: e.id, fileName: e.name })
        )
      ).then((res) => {
        listFile = files?.map(
          ({ files }: FileType, idx: number) => files ?? res[idx]
        );
        handleRequestAdd(
          {
            payload,
            listFile,
          },
          isSaveAndAdd
        );
      });
    } else {
      listFile = files?.map(({ files }: FileData) => files);
      handleRequestAdd(
        {
          payload,
          listFile,
        },
        isSaveAndAdd
      );
    }
  };

  const handleSaveAndAdd = () => {
    const values = form.getFieldsValue();
    form.validateFields().then(() => handleSubmit(values, true));
  };

  const handleFinish = (values: any) => {
    handleSubmit(values);
  };
  const handleClose = () => {
    navigate(-1);
  };
  const handleCancelNote = () => {
    CModalConfirm({
      message: MESSAGE.G15b('phiếu'),
      onOk: () => {
        id &&
          mutateStatus(
            { id, status: CurrentStatusList.REFUSE },
            {
              onSuccess: () => {
                window.history.back();
              },
            }
          );
      },
    });
  };
  const handleSelectOrder = (value: string, isInitialized = false) => {
    if (!value) return;
    mutateOrder(value, {
      onSuccess: (res) => {
        form.setFieldsValue({
          products: res?.products?.map((e: any) => ({
            ...e,
            fromSerial: !isInitialized ? e.fromSerial : undefined,
            toSerial: !isInitialized ? e.toSerial : undefined,
            productUom: PRODUCT_PRODUCT_UOM?.find(
              (c) => c.value === e?.productUom
            )?.label,
          })),
          toOrgId: res?.toOrgId,
        });
      },
    });
  };
  const handleClearOrder = () => {
    form.setFieldsValue({ products: [], toOrgId: undefined });
  };
  const handleDownloadFile = (file: FileData) => {
    if (file.id) {
      mutateDownloadFile({
        id: file.id as number,
        fileName: file?.name ?? '',
      });
    }
  };
  const handlePrint = () => {
    setIsOpenPrint(true);
  };

  return (
    <>
      <TitleHeader>{`${
        isAddType ? 'Lập' : subPageTitle(actionType)
      } phiếu ${name} kho từ NCC`}</TitleHeader>
      <Spin
        spinning={
          isLoadingAdd ||
          isLoadingView ||
          isLoadingStatus ||
          isLoadingOrder ||
          isLoadingFile
        }
      >
        <Form
          form={form}
          colon={false}
          onFinish={handleFinish}
          labelWrap
          labelCol={{ prefixCls: 'form-label--merchant-exim' }}
        >
          {isImport && (
            <Card>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="deliveryOrderId"
                    label="Mã đơn hàng"
                    className="mb-0"
                    rules={[validateForm.required]}
                  >
                    <DebounceSelect
                      placeholder="Nhập mã đơn hàng"
                      fetchOptions={mutateListOrder}
                      disabled={isViewType}
                      onSelect={(value) => handleSelectOrder(String(value))}
                      onClear={handleClearOrder}
                      originOptions={[
                        { value: dataOrder?.id, label: dataOrder?.orderNo },
                      ]}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          )}
          <Card className="mt-4">
            <Row gutter={16}>
              {isViewType && (
                <Col span={12}>
                  <Form.Item name="deliveryNoteCode" label={`Mã phiếu ${name}`}>
                    <CSelect
                      placeholder={`Mã phiếu ${name}`}
                      options={OrganizationOptions}
                      disabled
                      suffixIcon={null}
                    />
                  </Form.Item>
                </Col>
              )}
              <Col span={12}>
                <Form.Item
                  name="deliveryNoteDate"
                  label="Ngày lập"
                  rules={[
                    validateForm.required,
                    validateForm.beforeDay(
                      dataOrder?.orderDate,
                      'Ngày lập phiếu không được nhỏ hơn thời gian đặt hàng'
                    ),
                  ]}
                >
                  <CDatePicker
                    placeholder="Chọn thời gian"
                    disabled={isViewType}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="reasonId"
                  label={`Lý do ${name} kho`}
                  rules={[validateForm.required]}
                >
                  <CSelect
                    placeholder="Chọn lý do"
                    options={listReason}
                    disabled={isViewType}
                    isLoading={isLoadingReason}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="toOrgId" label={`Kho ${name}`}>
                  <CSelect
                    placeholder="Chọn kho"
                    //@ts-ignore
                    options={uniqBy(
                      filter(
                        [dataOrder?.orgOptions, ...OrganizationOptions],
                        'value'
                      ),
                      'value'
                    )}
                    disabled
                  />
                </Form.Item>
              </Col>
              {!isImport && (
                <Col span={12}>
                  <Form.Item name="toOrgId" label={`Kho nhận`}>
                    <CSelect
                      placeholder="Chọn kho"
                      options={[]}
                      disabled={isViewType}
                      isLoading={false}
                    />
                  </Form.Item>
                </Col>
              )}
              {!isViewType && <Col span={12} />}
              {isImport && (
                <>
                  <Col span={12}>
                    <Form.Item
                      name="delivererName"
                      label="Người giao hàng"
                      rules={[validateForm.required]}
                    >
                      <CInput
                        maxLength={100}
                        disabled={isViewType}
                        placeholder="Người giao hàng"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="recipientName"
                      label="Người nhận hàng"
                      rules={[validateForm.required]}
                    >
                      <CInput
                        maxLength={100}
                        disabled={isViewType}
                        placeholder="Người nhận hàng"
                      />
                    </Form.Item>
                  </Col>
                </>
              )}
              <Col span={24} className="mb-2">
                <Form.Item label={'Ghi chú'} name={'description'}>
                  <CTextArea maxLength={200} rows={3} disabled={isViewType} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <CTableUploadFile
                  acceptedFileTypes="*"
                  disabled={isViewType}
                  showAction={!isViewType}
                  onDownload={handleDownloadFile}
                />
              </Col>
              <TableProduct
                data={dataOrder?.products}
                actionType={actionType}
                isImport={isImport}
              />
            </Row>
          </Card>
          <Flex className="w-full mt-4" gap={12} justify="end">
            {isAddType && (
              <>
                <CButtonSaveAndAdd onClick={handleSaveAndAdd} />
                <CButtonSave htmlType="submit" />
              </>
            )}
            {isViewType && (
              <>
                {data.status === CurrentStatusList.PENDING && (
                  <CButtonDelete onClick={handleCancelNote}>
                    Hủy phiếu
                  </CButtonDelete>
                )}
                {data.status !== CurrentStatusList.REFUSE && (
                  <CButtonPrint onClick={handlePrint}>
                    Biên bản bàn giao
                  </CButtonPrint>
                )}
              </>
            )}
            <CButtonClose
              onClick={handleClose}
              disabled={false}
              type="default"
            />
          </Flex>
        </Form>
        <ModalPrint id={id} isOpen={isOpenPrint} setIsOpen={setIsOpenPrint} />
      </Spin>
    </>
  );
};

export default NoteAddView;
