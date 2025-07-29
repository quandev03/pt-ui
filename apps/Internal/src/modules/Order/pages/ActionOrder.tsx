import CButton, { CButtonClose } from '@react/commons/Button';
import Show from '@react/commons/Template/Show';
import { TitleHeader } from '@react/commons/Template/style';
import { ACTION_MODE_ENUM } from '@react/commons/types';
import { ActionsTypeEnum } from '@react/constants/app';
import useActionMode from '@react/hooks/useActionMode';
import { Form, Spin } from 'antd';
import useConfigAppNoPersistStore from 'apps/Internal/src/components/layouts/store/useConfigAppNoPersistStore';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import dayjs from 'dayjs';
import { cloneDeep, includes } from 'lodash';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CustomerInfor from '../components/CustomerInfor';
import DataTable from '../components/DataTable';
import ModalAction from '../components/ModalAction';
import OrderDetail from '../components/OrderDetail';
import { StatusOrderEnum } from '../constants';
import { useGetFileOrder, useGetOrderDetail } from '../queryHooks';
import useOrderStore from '../stores';
import { IDataOrder, IPreferentialLine } from '../types';
import { useDecryptOperationsId } from 'apps/Internal/src/hooks/useDecryptOperationsId';

type Props = {
  isEnabledApproval?: boolean;
};
const ActionOrder: FC<Props> = ({ isEnabledApproval = false }) => {
  const { setBreadcrumbsParams } = useConfigAppNoPersistStore();
  const actionMode = useActionMode();
  const { id } = useParams();
  const navigate = useNavigate();
  const actionByRole = useRolesByRouter();
  const [isAllowReject, setIsAllowReject] = useState(true);
  const [isAllowFinish, setIsAllowFinish] = useState(true);

  const {
    setCalculateInfo,
    resetOrderStore,
    setProductSelected,
    orderDetail,
    setOrderDetail,
    typeAction,
    setTypeAction,
  } = useOrderStore();
  const [form] = Form.useForm();

  const initPage = (data: IDataOrder) => {
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
        status: data.status?.toString(),
        createdDate: dayjs(data.createdDate),
        paymentOption: String(data.paymentOption),
        shippingMethod: String(data.shippingMethod),
      })
    );
    setProductSelected(cloneDeep(products) ?? []);
    setCalculateInfo(
      cloneDeep({
        amountAdditionalDiscount: data.amountAdditionalDiscount,
        orderDetailInfos: data.saleOrderLines,
        amountTotal: data.amountTotal,
        amountTax: data.amountTax,
        amountDiscount: data.amountDiscount,
        amountProduct: data.amountProduct ?? 0,
        amountProductUntaxed: 0,
        amountUntaxed: data.amountUntaxed,
      })
    );
  };

  const {
    mutate: getOrderDetail,
    isPending: loadingGetOrderDetail,
    data: order,
  } = useGetOrderDetail((data) => {
    setBreadcrumbsParams({ id: data.orderNo! });
    initPage(data);
    const isAllowReject = data.status == StatusOrderEnum.WAITING_FOR_APPROVAL;
    const isAllowFinish = data.status == StatusOrderEnum.WAITING_FOR_APPROVAL;
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
    if (idDecrypt && id) {
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

  useEffect(() => {
    if (actionMode === ACTION_MODE_ENUM.CREATE) {
      form.setFieldsValue({
        orgId: 'VNSKY',
        paymentOption: 3,
        shippingMethod: 1,
      });
    }
  }, [actionMode, form]);

  const handleClose = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  useEffect(() => {
    return () => {
      resetOrderStore();
    };
  }, [resetOrderStore]);

  const handleFinishOrder = () => {
    setOrderDetail(order);
    setTypeAction('APPROVED');
  };

  const handleCancelOrder = () => {
    setOrderDetail(order);
    setTypeAction('REJECT');
  };

  return (
    <div className="flex flex-col w-full h-full mb-7 ">
      <TitleHeader>{Title}</TitleHeader>
      <Spin spinning={loadingGetOrderDetail}>
        <Form
          form={form}
          labelCol={{ span: 6 }}
          labelWrap={true}
          validateTrigger={['onSubmit']}
          disabled
        >
          <div className="flex flex-col gap-3">
            <div className="bg-white p-5 rounded-md">
              <CustomerInfor />
            </div>
            <div className="bg-white p-5 rounded-md">
              <OrderDetail />
              <div className="pt-3">
                <DataTable />
              </div>
            </div>
            {!isEnabledApproval && (
              <div className="flex gap-4 flex-wrap justify-end mt-5  mb-16 ">
                <Show>
                  <Show.When
                    isTrue={
                      includes(actionByRole, ActionsTypeEnum.REJECT) &&
                      isAllowReject
                    }
                  >
                    <CButton
                      onClick={handleCancelOrder}
                      className="min-w-[120px]"
                      danger
                      disabled={false}
                    >
                      Từ chối đơn hàng
                    </CButton>
                  </Show.When>
                </Show>
                <Show>
                  <Show.When
                    isTrue={
                      includes(actionByRole, ActionsTypeEnum.APPROVED) &&
                      isAllowFinish
                    }
                  >
                    <CButton
                      onClick={handleFinishOrder}
                      className="min-w-[120px]"
                      disabled={false}
                    >
                      Xác nhận đơn hàng
                    </CButton>
                  </Show.When>
                </Show>
                <CButtonClose onClick={handleClose} disabled={false} />
              </div>
            )}
          </div>
        </Form>
      </Spin>
      <ModalAction
        data={
          {
            ...orderDetail,
            id: id ?? '',
          } as IDataOrder
        }
        onClose={() => {
          setOrderDetail(undefined);
          setTypeAction('');
        }}
        callBackReCallDetail={() => getOrderDetail(id as string)}
        type={typeAction}
      />
    </div>
  );
};

export default ActionOrder;
