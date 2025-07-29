import {
  CButtonClose,
  CButtonDelete,
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
  NotificationSuccess,
} from '@react/commons/index';
import CTableUploadFile, { FileData } from '@react/commons/TableUploadFile';
import { TitleHeader } from '@react/commons/Template/style';
import { FieldErrorsType } from '@react/commons/types';
import {
  ActionsTypeEnum,
  ActionType,
  DateFormat,
  DeliveryOrderType,
} from '@react/constants/app';
import {
  DeliveryOrderApprovalStatusList,
  DeliveryOrderStatusList,
} from '@react/constants/status';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import { subPageTitle } from '@react/utils/index';
import { MESSAGE } from '@react/utils/message';
import validateForm from '@react/utils/validator';
import { Card, Col, Flex, Form, Row, Spin } from 'antd';
import { ParamsOption } from 'apps/Internal/src/components/layouts/types';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import {
  useGetFile,
  useGetFileDownload,
} from 'apps/Internal/src/hooks/useGetFileDownload';
import dayjs from 'dayjs';
import { filter, uniqBy } from 'lodash';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSupportPartnerInfo } from '../../Order/queryHooks';
import TableProduct from '../components/TableProduct';
import { OrganizationOptions } from '../constants';
import { RequestAddOrder, useAddOrder } from '../hooks/useAddOrder';
import { useEditStatusOrder } from '../hooks/useEditStatusOrder';
import { useListSupplier } from '../hooks/useListSupplier';
import { useViewOrder } from '../hooks/useViewOrder';
import '../index.scss';
import { FileType, ProductType } from '../types';

export interface OrderAddViewProps {
  actionType: ActionsTypeEnum | ActionType;
  isEnabledApproval?: boolean;
}

const OrderAddView: React.FC<OrderAddViewProps> = ({
  actionType,
  isEnabledApproval = false,
}) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id = '' } = useParams();
  const isViewType = actionType === ActionType.VIEW;
  const isAddType = actionType === ActionType.ADD;
  const isCopyType = actionType === ActionsTypeEnum.COPY;
  const { PRODUCT_PRODUCT_UOM = [] } =
    useGetDataFromQueryKey<ParamsOption>([REACT_QUERY_KEYS.GET_PARAMS]) ?? {};
  const { mutate: mutateAdd, isPending: isLoadingAdd } = useAddOrder();
  const { data = {}, isFetching: isLoadingView } = useViewOrder(id);
  const { mutateAsync: mutateSupplier } = useListSupplier();
  const { mutateAsync: getFileDownload } = useGetFile();
  const { mutate: mutateDownloadFile, isPending: isLoadingFile } =
    useGetFileDownload();
  const { mutate: mutateStatus, isPending: isLoadingStatus } =
    useEditStatusOrder();
  const { data: dataOrg } = useSupportPartnerInfo({ vnskyInfo: true });

  useEffect(() => {
    form.setFieldsValue({
      ...data,
      toOrgId: data?.toOrgId ?? OrganizationOptions[0].value,
      orderDate: data?.orderDate ?? dayjs(),
      files: isViewType || data?.files?.length ? data?.files : [{}],
      products: data?.products?.map((e: any) => ({
        ...e,
        productUom: PRODUCT_PRODUCT_UOM?.find((c) => c.value === e?.productUom)
          ?.label,
      })) ?? [{ productCode: undefined, quantity: undefined }],
    });
  }, [isLoadingView, PRODUCT_PRODUCT_UOM, isViewType]);
  const handleRequestAdd = (
    { payload, listFile }: RequestAddOrder,
    isSaveAndAdd?: boolean
  ) => {
    mutateAdd(
      {
        payload,
        listFile,
      },
      {
        onSuccess: () => {
          NotificationSuccess(isAddType ? MESSAGE.G01 : MESSAGE.G16);
          if (!isSaveAndAdd) {
            window.history.back();
          } else {
            form.resetFields();
            form.setFieldsValue({
              toOrgId: OrganizationOptions[0].value,
              orderDate: dayjs(),
            });
          }
        },
        onError: (err: any) => {
          if (err?.errors?.length > 0) {
            form.setFields(
              err.errors.map((item: FieldErrorsType) => {
                return {
                  name: item.field,
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
    const { products, orderDate, id, files, ...restValues } = values;
    const attachmentsDTOS = values?.files?.map((e: any) => ({
      fileName: e.name,
      description: e.desc,
      createdDate: dayjs(e.date, ''),
    }));
    let listFile = [];
    const deliveryOrderLineDTOS = products?.map((e: ProductType) => ({
      productId: e.id,
      quantity: String(e.quantity),
    }));
    const payload = {
      ...restValues,
      orderDate: dayjs(
        `${dayjs(orderDate).format(DateFormat.DATE_ISO)} ${dayjs().format(
          DateFormat.TIME
        )}`
      )
        .add(7, 'h')
        .toISOString(),
      attachmentsDTOS,
      deliveryOrderLineDTOS,
      deliveryOrderType: DeliveryOrderType.NCC,
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
    form.validateFields(values).then(() => handleSubmit(values, true));
  };

  const handleFinish = (values: any) => {
    handleSubmit(values);
  };
  const handleClose = () => {
    navigate(-1);
  };
  const handleCancelOrder = () => {
    CModalConfirm({
      message: MESSAGE.G15,
      onOk: () => {
        id &&
          mutateStatus(
            { id, status: DeliveryOrderStatusList.CANCEL },
            {
              onSuccess: () => {
                window.history.back();
              },
            }
          );
      },
    });
  };
  const handleDownloadFile = (file: FileData) => {
    if (file.id) {
      mutateDownloadFile({
        id: file.id as number,
        fileName: file?.name ?? '',
      });
    }
  };
  const handleNavigateCopy = () => {
    navigate(pathRoutes.merchantOrderCopy(id));
  };
  return (
    <>
      <TitleHeader>{`${subPageTitle(
        actionType
      )} đơn mua hàng từ NCC`}</TitleHeader>
      <Spin
        spinning={
          isLoadingAdd || isLoadingView || isLoadingStatus || isLoadingFile
        }
      >
        <Form
          form={form}
          colon={false}
          onFinish={handleFinish}
          labelWrap
          labelCol={{ prefixCls: 'form-label--kit-craft' }}
        >
          <Card>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="toOrgId" label="Kho nhập">
                  <CSelect
                    placeholder="Chọn kho"
                    options={uniqBy(
                      filter(
                        [
                          { value: dataOrg?.id, label: dataOrg?.orgName },
                          ...OrganizationOptions,
                        ],
                        'value'
                      ),
                      'value'
                    )}
                    disabled
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="supplierId"
                  label="Nhà cung cấp"
                  rules={[validateForm.required]}
                >
                  <DebounceSelect
                    placeholder="Nhà cung cấp"
                    fetchOptions={mutateSupplier}
                    disabled={isViewType}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="orderNo"
                  label="Mã đơn hàng"
                  rules={[validateForm.required]}
                >
                  <CInput
                    maxLength={50}
                    preventSpace
                    preventVietnamese
                    uppercase
                    disabled={isViewType}
                    placeholder="Mã đơn hàng"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="orderDate"
                  label="Thời gian đặt hàng"
                  rules={[validateForm.required]}
                >
                  <CDatePicker disabled={isViewType} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="internalDocNo"
                  label={
                    <span
                      title="Số văn bản trình ký đơn mua hàng"
                      className="line-clamp-2"
                    >
                      Số văn bản trình ký đơn mua hàng
                    </span>
                  }
                >
                  <CInput
                    placeholder="Số văn bản trình ký đơn mua hàng"
                    disabled={isViewType}
                    maxLength={20}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="internalDocLink"
                  label={
                    <p
                      title="Link văn bản trình ký đơn mua hàng"
                      className="line-clamp-2"
                    >
                      Link văn bản trình ký đơn mua hàng
                    </p>
                  }
                >
                  <CInput
                    placeholder="Link văn bản trình ký đơn mua hàng"
                    disabled={isViewType}
                    maxLength={100}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="poContractNo" label="Số hợp đồng">
                  <CInput
                    placeholder="Số hợp đồng"
                    disabled={isViewType}
                    maxLength={20}
                  />
                </Form.Item>
              </Col>
              <Col span={24} className="mb-2">
                <Form.Item label={'Ghi chú'} name={'description'}>
                  <CTextArea maxLength={200} rows={3} disabled={isViewType} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <CTableUploadFile
                  showAction={!isViewType}
                  acceptedFileTypes="*"
                  disabled={isViewType}
                  onDownload={isViewType ? handleDownloadFile : undefined}
                />
              </Col>
              <TableProduct actionType={actionType} />
            </Row>
          </Card>
          {!isEnabledApproval && (
            <Flex className="w-full mt-4" gap={12} justify="end">
              {isAddType && (
                <>
                  <CButtonSaveAndAdd onClick={handleSaveAndAdd} />
                  <CButtonSave htmlType="submit" />
                </>
              )}
              {isViewType && (
                <>
                  {data.approvalStatus ===
                    DeliveryOrderApprovalStatusList.PENDING &&
                    data.orderStatus === DeliveryOrderStatusList.CREATE && (
                      <CButtonDelete onClick={handleCancelOrder}>
                        Hủy đơn hàng
                      </CButtonDelete>
                    )}
                  <CButtonSave onClick={handleNavigateCopy}>
                    Sao chép
                  </CButtonSave>
                </>
              )}
              {isCopyType && (
                <CButtonSave htmlType="submit">Sao chép</CButtonSave>
              )}
              <CButtonClose
                onClick={handleClose}
                disabled={false}
                type="default"
              />
            </Flex>
          )}
        </Form>
      </Spin>
    </>
  );
};

export default OrderAddView;
