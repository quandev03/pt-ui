import {
  CButtonClose,
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
import { TitleHeader } from '@react/commons/Template/style';
import { FieldErrorsType } from '@react/commons/types';
import {
  ActionsTypeEnum,
  ActionType,
  DateFormat,
  DeliveryOrderMethod,
  DeliveryOrderType,
} from '@react/constants/app';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import { getDayjs } from '@react/utils/datetime';
import { subPageTitle } from '@react/utils/index';
import { MESSAGE } from '@react/utils/message';
import validateForm from '@react/utils/validator';
import { Card, Col, Flex, Form, Row, Spin } from 'antd';
import { ParamsOption } from 'apps/Internal/src/components/layouts/types';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import {
  ReasonCodeType,
  useListReasonByCode,
} from 'apps/Internal/src/hooks/useListReasonByCode';
import dayjs from 'dayjs';
import { filter, uniqBy } from 'lodash';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutateListNote } from '../../MerchantEximNote/hooks/useListNote';
import { useMutateNote } from '../../MerchantEximNote/hooks/useViewNote';
import { OrganizationOptions } from '../../MerchantOrder/constants';
import TableProduct from '../components/TableProduct';
import { RequestAddTrans, useAddTrans } from '../hooks/useAddTrans';
import { useEditStatusTrans } from '../hooks/useEditStatusTrans';
import { useViewTrans } from '../hooks/useViewTrans';
import '../index.scss';

export interface TransAddViewProps {
  actionType: ActionsTypeEnum | ActionType;
  isExport?: boolean;
}

const TransAddView: React.FC<TransAddViewProps> = ({
  actionType,
  isExport = false,
}) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id = '' } = useParams();
  const name = isExport ? 'xuất' : 'nhập';
  const isViewType = actionType === ActionType.VIEW;
  const isAddType = actionType === ActionType.ADD;
  const { noteCode } = Form.useWatch((e) => e, form) ?? {};
  const { PRODUCT_PRODUCT_UOM = [] } = useGetDataFromQueryKey<ParamsOption>([
    REACT_QUERY_KEYS.GET_PARAMS,
  ]);
  const { mutate: mutateAdd, isPending: isLoadingAdd } = useAddTrans();
  const { data = {}, isFetching: isLoadingView } = useViewTrans(id);
  const { isFetching: isLoadingReason, data: listReason = [] } =
    useListReasonByCode(
      { reasonTypeCode: ReasonCodeType.NCC_IMPORT_EXPORT },
      data?.reasonId
    );
  const { mutateAsync: mutateListNote } = useMutateListNote();
  const { mutate: mutateStatus, isPending: isLoadingStatus } =
    useEditStatusTrans();
  const {
    mutateAsync: mutateNote,
    isPending: isLoadingNote,
    data: dataNote,
  } = useMutateNote();

  useEffect(() => {
    form.setFieldsValue({
      ...data,
      moveDate: data?.moveDate ?? dayjs(),
      orgId: data?.orgId,
      products:
        data?.products?.map((e: any) => ({
          ...e,
          productUomValue: PRODUCT_PRODUCT_UOM?.find(
            (c) => c.value === e?.productUom
          )?.label,
        })) ?? [],
    });
    handleSelectNote(data.noteCode);
  }, [isLoadingView, PRODUCT_PRODUCT_UOM]);

  const handleRequestAdd = (
    payload: RequestAddTrans,
    isSaveAndAdd?: boolean
  ) => {
    mutateAdd(
      {
        payload,
        isImport: true,
      },
      {
        onSuccess: () => {
          NotificationSuccess(isAddType ? MESSAGE.G01 : MESSAGE.G16);
          if (!isSaveAndAdd) {
            window.history.back();
          } else {
            form.resetFields();
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
    const { products, moveDate, orgId, id, nodeCode, ...restValues } = values;
    const payload = {
      ...restValues,
      deliveryNoteId: dataNote?.id,
      deliveryNoteDate: dataNote?.deliveryNoteDate,
      orgId,
      ieOrgId: orgId,
      moveDate: dayjs(moveDate).format(DateFormat.DATE_ISO),
      stockMoveLineDTOS: products,
      moveType: DeliveryOrderType.NCC,
      moveMethod: !isExport
        ? DeliveryOrderMethod.IMPORT
        : DeliveryOrderMethod.EXPORT,
    };
    handleRequestAdd(payload, isSaveAndAdd);
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
  const handleCancelTrans = () => {
    CModalConfirm({
      message: MESSAGE.G15,
      onOk: () => {
        id &&
          mutateStatus(
            { id, status: DeliveryOrderMethod.REVOKE },
            {
              onSuccess: () => {
                window.history.back();
              },
            }
          );
      },
    });
  };
  const handleSelectNote = (value: number) => {
    if (!value) return;
    mutateNote(String(value), {
      onSuccess: (res) => {
        form.setFieldsValue({
          products: res?.products?.map((e) => ({
            ...e,
            productUom: PRODUCT_PRODUCT_UOM?.find(
              (c) => c.value === e?.productUom
            )?.label,
          })),
          orgId: res?.orgId,
          stockMoveCode: res?.deliveryNoteCode?.slice(1),
        });
      },
    });
  };
  const handleClearNote = () => {
    form.resetFields(['orgId', 'stockMoveCode']);
    form.setFieldsValue({ products: [] });
  };
  return (
    <>
      <TitleHeader>{`${
        isAddType ? 'Lập' : subPageTitle(actionType)
      } giao dịch ${name} kho từ NCC`}</TitleHeader>
      <Spin
        spinning={
          isLoadingAdd || isLoadingView || isLoadingStatus || isLoadingNote
        }
      >
        <Form
          form={form}
          colon={false}
          onFinish={handleFinish}
          labelWrap
          labelCol={{ prefixCls: 'form-label--merchant-trans' }}
        >
          <Card>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="noteCode"
                  label={`Mã phiếu ${name}`}
                  className="mb-0"
                  rules={[validateForm.required]}
                >
                  <DebounceSelect
                    placeholder={`Nhập mã phiếu ${name}`}
                    fetchOptions={mutateListNote}
                    disabled={isViewType}
                    //@ts-ignore
                    onSelect={handleSelectNote}
                    onClear={handleClearNote}
                    originOptions={[
                      {
                        value: dataNote?.id,
                        label: dataNote?.deliveryNoteCode,
                      },
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
          <Card className="mt-4">
            <Row gutter={16}>
              {
                <Col span={12}>
                  <Form.Item
                    name="stockMoveCode"
                    label={`Mã giao dịch`}
                    rules={[validateForm.required]}
                  >
                    <CInput
                      placeholder={`Mã giao dịch`}
                      maxLength={50}
                      preventSpace
                      preventVietnamese
                      uppercase
                      disabled
                    />
                  </Form.Item>
                </Col>
              }
              <Col span={12}>
                <Form.Item
                  name="moveDate"
                  label={`Ngày ${!isExport ? 'nhập' : 'lập'}`}
                  rules={[
                    validateForm.required,
                    validateForm.beforeDay(
                      getDayjs(dataNote?.deliveryNoteDate),
                      'Ngày nhập không được nhỏ hơn ngày lập phiếu nhập'
                    ),
                  ]}
                >
                  <CDatePicker
                    placeholder={`Ngày ${!isExport ? 'nhập' : 'lập'}`}
                    disabled={isViewType}
                  />
                </Form.Item>
              </Col>

              {isExport && (
                <Col span={12}>
                  <Form.Item
                    name="ieOrgId"
                    label="Kho xuất"
                    rules={[validateForm.required]}
                  >
                    <CSelect
                      placeholder="Chọn kho xuất"
                      options={[]}
                      disabled={isViewType}
                    />
                  </Form.Item>
                </Col>
              )}
              <Col span={12}>
                <Form.Item name="orgId" label="Kho nhập">
                  <CSelect
                    placeholder="Chọn kho nhập"
                    //@ts-ignore
                    options={uniqBy(
                      filter(
                        [
                          //@ts-ignore
                          dataNote?.orgOptions,
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
              <Col span={24} className="mb-2">
                <Form.Item
                  label={'Ghi chú'}
                  name={'description'}
                  rules={[validateForm.required]}
                >
                  <CTextArea maxLength={200} rows={3} disabled={isViewType} />
                </Form.Item>
              </Col>
              <TableProduct isExport={isExport} actionType={actionType} />
            </Row>
          </Card>
          <Flex className="w-full mt-4" gap={12} justify="end">
            {!isViewType && (
              <>
                {isAddType && (
                  <CButtonSaveAndAdd
                    loading={false}
                    onClick={handleSaveAndAdd}
                  />
                )}
                <CButtonSave htmlType="submit" loading={false} />
              </>
            )}
            <CButtonClose
              onClick={handleClose}
              disabled={false}
              type="default"
            />
          </Flex>
        </Form>
      </Spin>
    </>
  );
};

export default TransAddView;
