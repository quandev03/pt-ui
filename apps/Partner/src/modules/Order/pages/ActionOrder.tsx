import CButton, {
  CButtonClose,
  CButtonSave,
  CButtonSaveAndAdd,
} from '@react/commons/Button';
import Show from '@react/commons/Template/Show';
import { TitleHeader } from '@react/commons/Template/style';
import { ACTION_MODE_ENUM } from '@react/commons/types';
import { ActionsTypeEnum } from '@react/constants/app';
import { formatDateISO } from '@react/constants/moment';
import useActionMode from '@react/hooks/useActionMode';
import { Form, Spin } from 'antd';
import { useSupportPartnerInfo } from 'apps/Partner/src/components/layouts/queryHooks';
import useConfigAppNoPersistStore from 'apps/Partner/src/components/layouts/store/useConfigAppNoPersistStore';
import ModalConfirm from 'apps/Partner/src/components/modalConfirm';
import { pathRoutes } from 'apps/Partner/src/constants/routes';
import { useRolesByRouter } from 'apps/Partner/src/hooks/useRolesByRouter';
import dayjs from 'dayjs';
import { cloneDeep, debounce, includes } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CustomerInfor from '../components/CustomerInfor';
import DataTable from '../components/DataTable';
import { ModalESim } from '../components/ModalESim';
import OrderDetail from '../components/OrderDetail';
import { StatusOrderEnum } from '../constants';
import {
  useCreateOrder,
  useGetFileOrder,
  useGetOrderDetail,
  useSupportGetCalculateDiscount,
  useSupportUpdateStatusOrder,
} from '../queryHooks';
import useOrderStore from '../stores';
import {
  IDataOrder,
  IOrder,
  IPayloadCreateOrder,
  IPreferentialLine,
  IProductInOrder,
  TypeFormSale,
} from '../types';
import { useDecryptOperationsId } from 'apps/Partner/src/hooks/useDecryptOperationsId';

const ActionOrder = () => {
  const [form] = Form.useForm();
  const { setBreadcrumbsParams } = useConfigAppNoPersistStore();
  const actionMode = useActionMode();
  const { id } = useParams();
  const navigate = useNavigate();
  const actionByRole = useRolesByRouter();
  const [isSubmitBack, setIsSubmitBack] = useState(false);
  const [isAllowReject, setIsAllowReject] = useState(true);
  const [isAllowFinish, setIsAllowFinish] = useState(true);
  const { mutate: updateStatusOrder, isPending: loadingUpdateStatus } =
    useSupportUpdateStatusOrder(() => {
      navigate(-1);
    });
  const {
    setCalculateInfo,
    setShowValidProduct,
    showValidDiscount,
    setShowValidDiscount,
    resetOrderStore,
    calculateInfo,
    setOrder,
  } = useOrderStore();
  const { data: partnerInfo } = useSupportPartnerInfo();
  useEffect(() => {
    if (partnerInfo) {
      form.setFieldsValue({
        requestOrgId: partnerInfo?.id,
        customerPhone: partnerInfo?.phone,
        customerName: partnerInfo?.orgName,
        businessLicenseAddress: partnerInfo?.businessLicenseAddress,
        receiverPhone:
          partnerInfo &&
          partnerInfo?.deliveryInfos &&
          partnerInfo.deliveryInfos.length > 0
            ? partnerInfo?.deliveryInfos[0]?.phone
            : '',
        customerAddress:
          partnerInfo &&
          partnerInfo?.deliveryInfos &&
          partnerInfo.deliveryInfos.length > 0
            ? partnerInfo?.deliveryInfos[0]?.address
            : '',
        provinceCode:
          partnerInfo &&
          partnerInfo?.deliveryInfos &&
          partnerInfo?.deliveryInfos.length > 0
            ? partnerInfo?.deliveryInfos[0]?.provinceCode
            : null,
        districtCode:
          partnerInfo &&
          partnerInfo?.deliveryInfos &&
          partnerInfo?.deliveryInfos.length > 0
            ? partnerInfo?.deliveryInfos[0]?.districtCode
            : null,
        wardCode:
          partnerInfo &&
          partnerInfo?.deliveryInfos &&
          partnerInfo?.deliveryInfos.length > 0
            ? partnerInfo?.deliveryInfos[0]?.wardCode
            : null,
        customerTaxCode: partnerInfo?.taxCode
          ? partnerInfo?.taxCode.includes('-')
            ? partnerInfo?.taxCode
            : `${partnerInfo?.taxCode.slice(
                0,
                -3
              )}-${partnerInfo?.taxCode.slice(-3)}`
          : '',
      });
    }
  }, [form, partnerInfo]);
  const products: IProductInOrder[] = Form.useWatch('products', form) ?? [];

  useEffect(() => {
    if (products.length > 0) {
      setShowValidProduct(false);
    }
  }, [products.length, setShowValidProduct]);

  const initPage = (data: IDataOrder) => {
    setOrder(data);
    const preferentialLines: IPreferentialLine[] = data.preferentialLines ?? [];
    const products = data.saleOrderLines.map((product) => {
      const preferentialLinesCurrent = preferentialLines.filter(
        (item) => item.productId === product.productId
      );
      preferentialLinesCurrent.forEach((preferentialLine) => {
        if (preferentialLine.discountType === 1) {
          product.packageDiscountAmount = preferentialLine.amount;
        } else if (preferentialLine.discountType === 2) {
          product.simDiscountAmount = preferentialLine.amount;
        }
      });
      return product;
    });

    form.setFieldsValue(
      cloneDeep({
        ...data,
        paymentOption: String(data.paymentOption),
        shippingMethod: String(data.shippingMethod),
        products: data.saleOrderLines,
        createdDate:
          actionMode === ACTION_MODE_ENUM.Copy
            ? dayjs()
            : dayjs(data.createdDate),
      })
    );
    setCalculateInfo(
      cloneDeep({
        amountAdditionalDiscount: data.amountAdditionalDiscount,
        preferentialLines: data.preferentialLines ?? [],
        orderDetailInfos: data.saleOrderLines,
        amountTotal: data.amountTotal,
        amountTax: data.amountTax,
        amountDiscount: data.amountDiscount,
        amountProduct: data.amountProduct ?? 0,
        amountProductUntaxed: 0,
        amountUntaxed: data.amountUntaxed,
        products: products,
      })
    );
  };

  const { mutate: createOrderAction, isPending: loadingCreate } =
    useCreateOrder((data) => {
      if (isSubmitBack) {
        if (actionMode === ACTION_MODE_ENUM.Copy) {
          navigate(pathRoutes.orderList);
        } else {
          navigate(-1);
        }
      } else {
        form.resetFields();
        resetOrderStore();
      }
    });

  const {
    mutate: getOrderDetail,
    isPending: loadingGetOrderDetail,
    data: orderDetail,
  } = useGetOrderDetail((data) => {
    setBreadcrumbsParams({ id: data.orderNo! });
    initPage(data);
    const isAllowReject =
      String(data.status) === StatusOrderEnum.WAITING_FOR_APPROVAL;
    const isAllowFinish = String(data.status) === StatusOrderEnum.SHIPPING;
    setIsAllowReject(isAllowReject);
    setIsAllowFinish(isAllowFinish);
  });
  const { mutate: getFileOrder } = useGetFileOrder((data) => {
    form.setFieldValue(
      'files',
      cloneDeep(
        data.map((file) => ({
          files: file,
          name: file.fileName,
          size: file.fileVolume,
          desc: file.description,
          date: new Date().toLocaleString(),
          id: file.id,
        }))
      )
    );
  });
  const { data: idDecrypt } = useDecryptOperationsId(id as string);
  useEffect(() => {
    if (id && idDecrypt) {
      getOrderDetail(id);
      getFileOrder({ objectName: 'SALE_ORDER', recordId: idDecrypt });
    }
  }, [getFileOrder, getOrderDetail, id, idDecrypt]);
  const Title = useMemo(() => {
    switch (actionMode) {
      case ACTION_MODE_ENUM.VIEW:
        return 'Xem chi tiết đơn đặt hàng';
      case ACTION_MODE_ENUM.CREATE:
        return 'Tạo đơn đặt hàng';
      case ACTION_MODE_ENUM.Copy:
        return 'Sao chép đơn đặt hàng';
      default:
        return 'Tạo đơn đặt hàng';
    }
  }, [actionMode]);

  const handleClose = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleFinish = (values: TypeFormSale) => {
    const { products } = values;
    const {
      customerAddress,
      customerName,
      customerPhone,
      customerTaxCode,
      description,
      districtCode,
      files,
      paymentOption,
      provinceCode,
      reasonId,
      requestOrgId,
      shippingMethod,
      wardCode,
      businessLicenseAddress,
      createdDate,
      receiverPhone,
    } = values;
    const payload: IPayloadCreateOrder = {
      saleOrderDTO: {
        createdDate: createdDate
          ? dayjs(createdDate).format(formatDateISO)
          : '',
        customerAddress,
        businessLicenseAddress,
        receiverPhone,
        customerName,
        customerPhone,
        customerTaxCode,
        description,
        districtCode,
        paymentOption,
        provinceCode,
        reasonId,
        requestOrgId,
        shippingMethod,
        wardCode,
        isCopy: actionMode === ACTION_MODE_ENUM.Copy,
        saleOrderLines: products.map((item) => ({
          ...item,
          id: undefined,
        })),
        amountTotal: calculateInfo?.amountTotal ?? 0,
        amountTax: calculateInfo?.amountTax ?? 0,
        amountDiscount: calculateInfo?.amountDiscount ?? 0,
        amountAdditionalDiscount: calculateInfo?.amountAdditionalDiscount ?? 0,
        amountUntaxed: calculateInfo?.amountUntaxed ?? 0,
      },
      attachmentFile: files
        ? files.filter((item) => !item.id).map((item) => item.files)
        : [],
      attachmentMetadata: {
        descriptions: files
          ? files.filter((item) => !item.id).map((item) => item.desc ?? '')
          : [], // mô tả file theo đúng thứ thự
        attachmentCopy: files
          ? files
              .filter((item) => item.id)
              .map((item) => ({
                copyId: item.id as number,
                description: item.desc,
              }))
          : [], // trong trường h ợp coppy thì truyền vào
      },
    };
    createOrderAction(payload);
  };

  useEffect(() => {
    return () => {
      resetOrderStore();
    };
  }, [resetOrderStore]);

  const handleFinishOrder = () => {
    ModalConfirm({
      title: 'Bạn có chắc chắn đã hoàn thành đơn hàng không?',
      handleConfirm: () => {
        updateStatusOrder({
          id: String(id),
          status: StatusOrderEnum.FINISH,
        });
      },
    });
  };
  const [nameFile, setNameFile] = useState<{
    name: string;
    id: number | string;
  }>({
    name: '',
    id: 0,
  });
  const handleCloseModalESim = () => {
    setNameFile({
      name: '',
      id: -1,
    });
  };
  const handleOpenModalESim = (record: IOrder) => {
    const nameFile = record.orderNo.replace(/[/-]/g, '_') + '.xlsx';
    setNameFile({
      name: nameFile,
      id: id ?? '',
    });
  };

  const handleCancelOrder = () => {
    ModalConfirm({
      title: 'Bạn có chắc chắn muốn hủy đơn hàng không?',
      handleConfirm: () => {
        updateStatusOrder({
          id: String(id),
          status: StatusOrderEnum.CANCELLED,
        });
      },
    });
  };
  const scrollToFirstError = () => {
    const firstErrorField = document.querySelector('.ant-form-item-has-error');
    if (firstErrorField) {
      firstErrorField.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  };

  const { mutate: getCalculateDiscountAction } = useSupportGetCalculateDiscount(
    (data) => {
      const isDiscountValid =
        data.amountAdditionalDiscount > data.amountProduct;
      setShowValidDiscount(isDiscountValid);

      const updatedProducts = data.orderDetailInfos.map((product) => {
        const currentProduct = products.find(
          (item) => item?.productId === product?.productId
        );
        const result: IProductInOrder = { ...currentProduct, ...product };
        const preferentialLinesCurrent = data.preferentialLines.filter(
          (item) => item?.productId === product?.productId
        );
        preferentialLinesCurrent.forEach((item) => {
          if (item.discountType === 1) {
            result.packageDiscountAmount = item.amount;
          } else if (item.discountType === 2) {
            result.simDiscountAmount = item.amount;
          }
        });
        return result;
      });
      form.setFieldValue('products', updatedProducts);
      setCalculateInfo(data);
    }
  );
  // Hàm debounce
  const debouncedChangeHandler = useCallback(
    debounce((changedValues, values) => {
      if (changedValues.products) {
        const isQuantityChange = changedValues.products.some(
          (item: any) => item.quantity
        );
        if (isQuantityChange) {
          getCalculateDiscountAction({
            orderDetailInfos: values.products,
            amountAdditionalDiscount:
              calculateInfo?.amountAdditionalDiscount ?? 0,
          });
        }
      }
    }, 1000),
    []
  );

  const handleValuesChange = (changedValues: any, values: any) => {
    debouncedChangeHandler(changedValues, values);
  };

  return (
    <div className="flex flex-col w-full h-full mb-7 ">
      <TitleHeader>{Title}</TitleHeader>
      <Spin spinning={loadingGetOrderDetail || loadingCreate}>
        <Form
          form={form}
          labelCol={{ span: 6 }}
          labelWrap
          validateTrigger={['onSubmit']}
          onValuesChange={handleValuesChange}
          onFinish={handleFinish}
          scrollToFirstError={true}
          initialValues={{
            createdDate: dayjs(),
            orgId: 'VNSKY',
            paymentOption: '3',
            shippingMethod: '1',
            products: [
              {
                productCode: null,
                productName: '',
                productUOM: '',
                quantity: 1,
                price: 0,
                simDiscountAmount: 0,
                packageDiscountAmount: 0,
                amountTotal: 0,
                amountDiscount: 0,
                vat: 0,
              },
            ],
          }}
          onFinishFailed={scrollToFirstError}
        >
          <div className="flex flex-col gap-3 ">
            <div className="bg-white p-5 rounded-md">
              <CustomerInfor />
            </div>
            <div className="bg-white p-5 rounded-md">
              <OrderDetail />
              <DataTable />
            </div>
            <div className="flex gap-4 flex-wrap justify-end mt-5 mb-16">
              {actionMode === ACTION_MODE_ENUM.CREATE && (
                <CButtonSaveAndAdd
                  onClick={() => {
                    console.log(form.getFieldsError());

                    if (products.length === 0) {
                      setShowValidProduct(true);
                    } else {
                      setShowValidProduct(false);
                      setShowValidDiscount(false);
                      form.submit();
                    }
                  }}
                  loading={loadingCreate}
                  disabled={loadingCreate}
                />
              )}
              {actionMode !== ACTION_MODE_ENUM.VIEW && (
                <CButtonSave
                  onClick={() => {
                    if (showValidDiscount) return;
                    if (products.length === 0) {
                      setShowValidProduct(true);
                    } else {
                      setShowValidProduct(false);
                      setShowValidDiscount(false);
                      setIsSubmitBack(true);
                      form.submit();
                    }
                  }}
                  loading={loadingCreate}
                  disabled={loadingCreate}
                />
              )}
              {actionMode === ACTION_MODE_ENUM.VIEW && (
                <>
                  <Show>
                    <Show.When
                      isTrue={includes(actionByRole, ActionsTypeEnum.CREATE)}
                    >
                      <CButton
                        onClick={() => {
                          navigate(pathRoutes.copyOrder(id));
                        }}
                        className="min-w-[120px]"
                      >
                        Sao chép
                      </CButton>
                    </Show.When>
                  </Show>
                  <Show>
                    <Show.When
                      isTrue={
                        includes(actionByRole, ActionsTypeEnum.CANCEL) &&
                        isAllowReject
                      }
                    >
                      <CButton
                        onClick={handleCancelOrder}
                        className="min-w-[120px]"
                        disabled={loadingUpdateStatus}
                        loading={loadingUpdateStatus}
                        danger
                      >
                        Hủy đơn hàng
                      </CButton>
                    </Show.When>
                  </Show>
                  <Show>
                    <Show.When
                      isTrue={
                        includes(actionByRole, ActionsTypeEnum.FINISH) &&
                        isAllowFinish
                      }
                    >
                      <CButton
                        onClick={handleFinishOrder}
                        className="min-w-[120px]"
                        disabled={loadingUpdateStatus}
                        loading={loadingUpdateStatus}
                      >
                        Xác nhận hoàn thành
                      </CButton>
                    </Show.When>
                  </Show>
                  <Show>
                    <Show.When
                      isTrue={
                        !!orderDetail &&
                        !!orderDetail.isGenerateEsim &&
                        orderDetail.status == StatusOrderEnum.FINISH
                      }
                    >
                      <CButton
                        onClick={() => handleOpenModalESim(orderDetail as any)}
                        className="min-w-[120px]"
                      >
                        Gen QR eSIM
                      </CButton>
                    </Show.When>
                  </Show>
                </>
              )}
              <CButtonClose
                onClick={handleClose}
                disabled={loadingCreate}
                loading={loadingCreate}
              />
            </div>
          </div>
        </Form>
      </Spin>
      <ModalESim onClose={handleCloseModalESim} nameFile={nameFile} />
    </div>
  );
};

export default ActionOrder;
