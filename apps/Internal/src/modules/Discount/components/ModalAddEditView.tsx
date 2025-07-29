import {
  CButtonClose,
  CButtonDelete,
  CButtonEdit,
  CButtonSave,
  CButtonSaveAndAdd,
} from '@react/commons/Button';
import {
  CDatePicker,
  CModalConfirm,
  CSelect,
  WrapperPage,
} from '@react/commons/index';
import CInput from '@react/commons/Input';
import CTableUploadFile, { FileData } from '@react/commons/TableUploadFile';
import { TitleHeader } from '@react/commons/Template/style';
import CTextArea from '@react/commons/TextArea';
import { IFieldErrorsItem } from '@react/commons/types';
import { ActionType } from '@react/constants/app';
import {
  formatDate,
  formatDateBe,
  formatDateTimeHHmm,
} from '@react/constants/moment';
import { handlePasteRemoveSpecialCharacters } from '@react/helpers/utils';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import { MESSAGE } from '@react/utils/message';
import validateForm from '@react/utils/validator';
import { Card, Col, Form, Row, Space } from 'antd';
import useConfigAppNoPersistStore from 'apps/Internal/src/components/layouts/store/useConfigAppNoPersistStore';
import { ParamsOption } from 'apps/Internal/src/components/layouts/types';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useGetFileDownload } from 'apps/Internal/src/hooks/useGetFileDownload';
import { useListOrgPartnerPublic } from 'apps/Internal/src/hooks/useListOrgPartnerPublic';
import ConditionApply from 'apps/Internal/src/modules/Discount/components/ConditionApply';
import dayjs, { Dayjs } from 'dayjs';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProductCategoryQuery } from '../../ProductCatalog/hooks/useProductCategoryQuery';
import { RowStyle, RowUploadFile } from '../page/style';
import {
  useAddDiscount,
  useDeleteDiscount,
  useGetDetailDiscount,
  useListProducts,
  useUpdateDiscount,
} from '../queryHook/useList';
import useStore from '../store';
import { IDiscountDetail, IPayloadDiscountForm } from '../types';

type Props = {
  typeModal: ActionType;
};
const range = (start: number, end: number) => {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
};

const ModalAddEditView: FC<Props> = ({ typeModal }) => {
  const { setBreadcrumbsParams } = useConfigAppNoPersistStore();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const fromDate: Dayjs = Form.useWatch('fromDate', form);
  const toDate: Dayjs = Form.useWatch('toDate', form);
  const orgType = Form.useWatch('orgType', form);
  const productCategoryId = Form.useWatch('productCategoryId', form);
  const orgIds = Form.useWatch('orgIds', form);
  const { id: idDetail } = useParams();
  const { resetDiscount, isValuesChanged, setIsValuesChanged } = useStore();
  const { PARTNER_TYPE = [] } = useGetDataFromQueryKey<ParamsOption>([
    REACT_QUERY_KEYS.GET_PARAMS,
  ]);

  const [submitType, setSubmitType] = useState<string>('');

  const setFieldError = useCallback(
    (fieldErrors: IFieldErrorsItem[]) => {
      form.setFields(
        fieldErrors.map((item: IFieldErrorsItem) => ({
          name: item.field,
          errors: [item.detail],
        }))
      );
    },
    [form]
  );

  const { mutate: getFileDownload } = useGetFileDownload();
  const { mutate: deleteDiscount } = useDeleteDiscount(() => {
    navigate(pathRoutes.discount, { replace: true });
  });
  const { mutate: createDiscount, isPending: loadingAdd } = useAddDiscount(
    () => {
      if (submitType === 'saveAndAdd') {
        handleCloseAddSave();
      } else {
        handleClose();
      }
    },
    setFieldError
  );

  const { mutate: updateDiscount, isPending: loadingUpdate } =
    useUpdateDiscount(() => handleClose(), setFieldError);
  const { isFetching: isFetchingView, data: discountDetail } =
    useGetDetailDiscount(idDetail ?? '');
  const { data: listOrganization } = useListOrgPartnerPublic({
    status: '1',
    partnerType: orgType === 'ALL' ? undefined : orgType,
    size: 999999999,
    page: 0,
  });
  const { data: productList, isLoading: isLoadingProduct } = useListProducts(
    productCategoryId ?? undefined
  );
  const { isLoading: isLoadingProductCategory, data: productCategoryData } =
    useProductCategoryQuery();

  const disabledStartDate = (
    startValue: string | number | Date | dayjs.Dayjs | null | undefined
  ) => {
    const endValue = form.getFieldValue('toDate');
    return endValue && dayjs(startValue).isAfter(dayjs(endValue));
  };

  const disabledEndDate = (
    endValue: string | number | Date | dayjs.Dayjs | null | undefined
  ) => {
    if (!fromDate) return false;
    const hour = fromDate.get('hour');
    const minute = fromDate.get('minute');
    let isBeforeValue = fromDate;
    if (hour || minute) {
      isBeforeValue = isBeforeValue.add(-1, 'day');
    }
    return (
      dayjs(isBeforeValue.add(1, 'hour')).isBefore(
        isBeforeValue.add(1, 'hour')
      ) || dayjs(endValue).isBefore(isBeforeValue)
    );
  };

  const optionOrganization = useMemo(() => {
    if (!listOrganization) {
      return [];
    }
    listOrganization.unshift({ value: -1, label: 'Tất cả' });
    return listOrganization;
  }, [listOrganization]);

  const productCategoryOption: { label: string; value: number }[] =
    useMemo(() => {
      if (!productCategoryData) {
        return [];
      }
      const result = productCategoryData.map((item) => ({
        label: item.categoryName,
        value: item.id,
      }));
      return result;
    }, [productCategoryData]);

  const handleClose = useCallback(() => {
    form.resetFields();
    resetDiscount();
    navigate(-1);
  }, [form, navigate]);

  const handleCloseAddSave = useCallback(() => {
    form.resetFields();
  }, [form]);

  const handleCloseModal = useCallback(() => {
    handleClose();
  }, [handleClose]);

  const handleDelete = () => {
    CModalConfirm({
      message: MESSAGE.G05,
      onOk: () => discountDetail && deleteDiscount(idDetail as string),
    });
  };

  const handleDownloadFile = (file: FileData) => {
    if (file.id) {
      getFileDownload({
        id: file.id as number,
        fileName: file.name ?? '',
      });
    }
  };

  useEffect(() => {
    if (discountDetail && !!form) {
      setBreadcrumbsParams({ id: discountDetail.discountName });
      form.setFieldsValue({
        ...discountDetail,
        fromDate: discountDetail.fromDate
          ? dayjs(discountDetail.fromDate)
          : null,
        toDate: discountDetail.toDate ? dayjs(discountDetail.toDate) : null,
        orgType: discountDetail.orgType,
        orgIds: discountDetail.orgIds,
        files: discountDetail.attachments.map((item: any) => ({
          id: item.id,
          desc: item.description,
          name: item.fileName,
          url: item.fileUrl ? item.fileUrl : '',
          size: item.fileVolume,
          date: item.createdDate,
        })),
        calType: String(discountDetail?.calType ?? ''),
        discountDetails: discountDetail.discountDetails.map((item, index) => ({
          ...item,
          discountDetailLines: item.discountDetailLines.map((line) => ({
            ...line,
            discountType: line.discountType ? String(line.discountType) : null,
            formDiscount: line.formDiscount ? String(line.formDiscount) : null,
          })),
        })),
      });
    }
  }, [form, discountDetail, isFetchingView]);

  const handleFinishForm = useCallback(
    (values: IPayloadDiscountForm) => {
      const data: IPayloadDiscountForm = {
        ...values,
        fromDate: dayjs(values.fromDate).format(formatDateBe),
        toDate: dayjs(values.toDate).format(formatDateBe),
        orgIds: values.orgIds,
        productIds: values.productIds,
      };

      if (typeModal === ActionType.ADD) {
        createDiscount(data);
      } else if (typeModal === ActionType.EDIT) {
        CModalConfirm({
          message: MESSAGE.G04,
          onOk: () => {
            updateDiscount({ ...data, id: idDetail! });
          },
        });
      }
    },
    [idDetail, typeModal, form, createDiscount, updateDiscount]
  );

  const renderTitle = () => {
    switch (typeModal) {
      case ActionType.ADD:
        return 'Tạo chương trình chiết khấu';
      case ActionType.EDIT:
        return 'Chỉnh sửa chương trình chiết khấu';
      case ActionType.VIEW:
        return 'Xem chi tiết chương trình chiết khấu';
      default:
        return '';
    }
  };

  const disabledToTime = (current: Dayjs, fromDate: Dayjs | null) => {
    if (fromDate && current.isSame(fromDate, 'D')) {
      return {
        disabledHours: () => range(0, 24).splice(0, fromDate.get('h')),
        disabledMinutes: () =>
          current.isSame(fromDate, 'h')
            ? range(0, 60).splice(0, fromDate.get('m'))
            : [],
      };
    }
    return {};
  };

  const disabledFromTime = (current: Dayjs, toDate: Dayjs) => {
    if (toDate && current.isSame(toDate, 'D')) {
      return {
        disabledHours: () =>
          range(0, 24).splice(toDate.get('h'), 24 - toDate.get('h')),
        disabledMinutes: () =>
          current.isSame(toDate.add(-1, 'h'), 'h')
            ? range(0, 60).splice(toDate.get('m') + 1, 60 - toDate.get('m'))
            : [],
      };
    }
    return {};
  };

  const touchedAllToValue = useCallback(() => {
    const discountDetails: IDiscountDetail[] =
      form.getFieldValue(['discountDetails']) ?? [];
    discountDetails.forEach((item, index) => {
      form.setFields([
        {
          name: ['discountDetails', index, 'toValue'],
          touched: true,
        },
      ]);
    });
  }, [form]);
  const scrollToFirstError = () => {
    const firstErrorField = document.querySelector('.ant-form-item-has-error');
    if (firstErrorField) {
      firstErrorField.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  };
  return (
    <WrapperPage>
      <TitleHeader>{renderTitle()}</TitleHeader>
      <Form
        key={typeModal}
        form={form}
        initialValues={{
          calType: '1',
          discountType: 2,
          orgType: 'ALL',
          orgIds: [-1],
          productCategoryId: -1,
          productIds: [-1],
          discountDetails: [
            {
              key: 0,
              fromValue: '',
              toValue: '',
              discountDetailLines: [
                { discountType: null, formDiscount: null, discountValue: '' },
              ],
            },
          ],
        }}
        labelCol={{ style: { width: '160px' } }}
        colon={false}
        onFinish={handleFinishForm}
        disabled={typeModal === ActionType.VIEW}
        onFinishFailed={scrollToFirstError}
        onValuesChange={() => {
          if (!isValuesChanged) {
            setIsValuesChanged(true);
          }
        }}
      >
        <Card className="mb-5">
          <RowStyle gutter={[24, 0]} className="relative">
            <h3 className="title-blue absolute -top-4 left-2 text-xl bg-white">
              Thông tin chung
            </h3>
            <Col span={12}>
              <Form.Item
                name="discountCode"
                label="Mã CTCK"
                rules={[validateForm.required]}
              >
                <CInput
                  maxLength={50}
                  disabled={typeModal === ActionType.VIEW}
                  onPaste={(e) =>
                    handlePasteRemoveSpecialCharacters(e, 50, true, true)
                  }
                  uppercase
                  preventSpace
                  preventVietnamese
                  placeholder="Nhập mã CTCK"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="discountName"
                label="Tên CTCK"
                rules={[validateForm.required]}
              >
                <CInput
                  maxLength={50}
                  disabled={typeModal === ActionType.VIEW}
                  placeholder="Nhập tên CTCK"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="orgType"
                label="Loại đối tác"
                rules={[{ required: true, message: MESSAGE.G06 }]}
              >
                <CSelect
                  options={[{ label: 'Tất cả', value: 'ALL' }, ...PARTNER_TYPE]}
                  onChange={() => {
                    form.resetFields(['orgIds']);
                  }}
                  style={{ width: '100%' }}
                  disabled={typeModal === ActionType.VIEW}
                  placeholder="Nhập loại đối tác"
                  allowClear={false}
                  showSearch={false}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="orgIds"
                label="Đối tác"
                required={true}
                rules={[
                  {
                    required: orgType === 'ALL' ? false : true,
                    message: MESSAGE.G06,
                  },
                ]}
              >
                <CSelect
                  options={optionOrganization}
                  mode={'multiple'}
                  maxRow={3}
                  style={{ width: '100%' }}
                  disabled={typeModal === ActionType.VIEW}
                  placeholder={'Tất cả đối tác'}
                  onChange={(values: number[]) => {
                    const allOptionValue = -1;
                    let newValues = [...values];
                    if (values.includes(allOptionValue)) {
                      if (values[values.length - 1] === allOptionValue) {
                        newValues = [allOptionValue];
                      } else {
                        newValues = values.filter(
                          (val) => val !== allOptionValue
                        );
                      }
                    }
                    form.setFieldValue('orgIds', newValues);
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="fromDate"
                label="Ngày bắt đầu"
                rules={[
                  { required: true, message: MESSAGE.G06 },
                  {
                    validator: (_, value) => {
                      const toDate = form.getFieldValue('toDate');
                      if (value && toDate) {
                        if (
                          dayjs(value)
                            .startOf('day')
                            .diff(dayjs(toDate).startOf('day')) > 0
                        ) {
                          return Promise.reject(
                            new Error(
                              'Ngày bắt đầu không được lớn hơn ngày kết thúc'
                            )
                          );
                        }
                        if (toDate.diff(value, 'hour') < 1) {
                          return Promise.reject(
                            new Error(
                              'Giờ bắt đầu phải nhỏ hơn giờ kết thúc ít nhất 1 giờ'
                            )
                          );
                        }
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <CDatePicker
                  format={formatDateTimeHHmm}
                  disabledDate={disabledStartDate}
                  disabledTime={(e) => e && disabledFromTime(e, toDate)}
                  style={{ width: '100%' }}
                  allowClear={true}
                  showTime={{ format: 'HH:mm' }}
                  disabled={typeModal === ActionType.VIEW}
                  placeholder="Chọn thời gian"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="toDate"
                label="Ngày kết thúc"
                rules={[
                  { required: true, message: MESSAGE.G06 },
                  {
                    validator: (_, value) => {
                      const fromDate = form.getFieldValue('fromDate');
                      if (value && fromDate) {
                        if (
                          dayjs(value)
                            .startOf('day')
                            .diff(dayjs(fromDate).startOf('day')) < 0
                        ) {
                          return Promise.reject(
                            new Error(
                              'Ngày kết thúc không được nhỏ hơn ngày bắt đầu'
                            )
                          );
                        }
                        if (value.diff(fromDate, 'hour') < 1) {
                          return Promise.reject(
                            new Error(
                              'Giờ kết thúc phải lớn hơn giờ bắt đầu ít nhất 1 giờ'
                            )
                          );
                        }
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <CDatePicker
                  format={formatDateTimeHHmm}
                  disabledDate={disabledEndDate}
                  disabledTime={(e) =>
                    e &&
                    disabledToTime(e, fromDate ? fromDate.add(1, 'hour') : null)
                  }
                  style={{ width: '100%' }}
                  allowClear={true}
                  showTime={{ format: 'HH:mm' }}
                  disabled={typeModal === ActionType.VIEW}
                  placeholder="Chọn thời gian"
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Ghi chú" name="description">
                <CTextArea
                  maxLength={200}
                  rows={3}
                  disabled={typeModal === ActionType.VIEW}
                  placeholder={'Nhập ghi chú'}
                />
              </Form.Item>
            </Col>
          </RowStyle>
          <RowUploadFile>
            <Col span={24}>
              <CTableUploadFile
                acceptedFileTypes="*"
                disabled={typeModal === ActionType.VIEW}
                onDownload={
                  typeModal === ActionType.VIEW ? handleDownloadFile : undefined
                }
                showAction={typeModal !== ActionType.VIEW}
              />
            </Col>
          </RowUploadFile>
          <RowStyle gutter={[24, 0]} className="relative">
            <h3 className="title-blue absolute -top-4 left-2 text-xl bg-white">
              Sản phẩm áp dụng
            </h3>
            <Col span={12}>
              <Form.Item
                name="productCategoryId"
                label="Áp dụng cho loại sản phẩm"
              >
                <CSelect
                  options={[
                    { label: 'Tất cả', value: -1 },
                    ...productCategoryOption,
                  ]}
                  style={{ width: '100%' }}
                  disabled={typeModal === ActionType.VIEW}
                  placeholder="Tất cả loại sản phẩm"
                  defaultValue={undefined}
                  loading={isLoadingProductCategory}
                  onChange={(value: string | number) => {
                    form.resetFields(['productIds']);
                  }}
                  allowClear={true}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="productIds" label="Áp dụng cho sản phẩm">
                <CSelect
                  options={productList}
                  loading={isLoadingProduct}
                  mode="multiple"
                  style={{ width: '100%' }}
                  disabled={typeModal === ActionType.VIEW}
                  placeholder={'Tất cả sản phẩm'}
                  onChange={(values: number[]) => {
                    const allOptionValue = -1;
                    let newValues = [...values];
                    if (values.includes(allOptionValue)) {
                      if (values[values.length - 1] === allOptionValue) {
                        newValues = [allOptionValue];
                      } else {
                        newValues = values.filter(
                          (val) => val !== allOptionValue
                        );
                      }
                    }
                    form.setFieldValue('productIds', newValues);
                  }}
                />
              </Form.Item>
            </Col>
          </RowStyle>
          <ConditionApply typeModal={typeModal} />
        </Card>
        <Row justify="end" className="mb-20">
          <Space size="middle">
            {typeModal === ActionType.VIEW && (
              <>
                <CButtonDelete onClick={handleDelete} disabled={false} />
                <CButtonEdit
                  onClick={() => {
                    navigate(pathRoutes.discountEdit(idDetail ?? ''));
                  }}
                  disabled={false}
                />
                <CButtonClose
                  onClick={handleCloseModal}
                  disabled={false}
                  type="default"
                />
              </>
            )}
            {typeModal === ActionType.ADD && (
              <CButtonSaveAndAdd
                htmlType="submit"
                loading={loadingAdd || loadingUpdate}
                onClick={() => {
                  touchedAllToValue();
                  setSubmitType('saveAndAdd');
                }}
              />
            )}
            {typeModal !== ActionType.VIEW && (
              <CButtonSave
                htmlType="submit"
                loading={loadingAdd || loadingUpdate}
                onClick={() => {
                  touchedAllToValue();
                  setSubmitType('save');
                }}
              />
            )}
            {typeModal !== ActionType.VIEW && (
              <CButtonClose
                onClick={handleCloseModal}
                disabled={false}
                type="default"
              />
            )}
          </Space>
        </Row>
      </Form>
    </WrapperPage>
  );
};

export default ModalAddEditView;
