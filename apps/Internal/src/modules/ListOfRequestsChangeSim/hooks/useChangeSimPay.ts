import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';
import useStoreListOfRequestsChangeSim from 'apps/Internal/src/modules/ListOfRequestsChangeSim/store';
import { useStatusChangeSimPay } from './useStatusChangeSimPay';
import { Modal } from 'antd';
import { useChangeSimActivate } from './useChangeSimActivate';
import { ActionType, DateFormat } from '@react/constants/app';
import { CommonError } from '@react/commons/types';
import dayjs from 'dayjs';

interface Res {
  requestId: string;
  payData: string;
  free: boolean;
}

const fetcher = (body: any) => {
  if (body.typeModal === ActionType.ADD) {
    const payload = JSON.stringify({
      changeSimCode: body.changeSimCode,
      productType: body.simType,
      changeSimData: {
        id: body.id,
        fullName: body.name,
        email: body.email,
        address: body.address,
        isdn: body.isdn?.substring(1),
        phoneNumber: body.isdn?.substring(1),
        oldSerial: body.oldSerialSim,
        newSerial: body.serial,
        requestSimType: body.simType,
        reasonCode: body.reason,
        feeAmount: body.feeAmount,
        deliveryMethod: body.deliveryMethod,
        receiverName: body.receiverName,
        receiverPhone: body.receiverPhone,
        receiverProvince: body.province,
        receiverProvinceName: body.provinceName,
        receiverAddress: body.receiverAddress,
        newImsi: body.newImsi,
        requestType: 'BCSS', // kênh online chưa làm
        lpaData: body.lpaData,
        stockId: body.stockId,
        note: body.note,
        district: body.district,
        precinct: body.precinct,
      },
      delivery: {
        wardCode: body.precinct,
        districtCode: body.district,
        provinceCode: body.province,
        deliveryMethod: body.deliveryMethod,
      },
      ocrData: {
        idType: body.documentType,
        idNo: body.id,
        idIssuePlace: body.issueBy,
        idIssueDate: body.issueDate
          ? dayjs(body.issueDate, DateFormat.DEFAULT).format(
              DateFormat.DEFAULT_V4
            )
          : '',
        name: body.name,
        sex: body.sex,
        birthDate: body.birthday
          ? dayjs(body.birthday, DateFormat.DEFAULT).format(
              DateFormat.DEFAULT_V4
            )
          : '',
        nationality: body.nationality,
        address: body.address,
      },
    });

    const formData = new FormData();
    formData.append('data', payload);
    formData.append('front', body.cardFront);
    formData.append('back', body.cardBack);
    formData.append('portrait', body.portrait);
    formData.append('convince', body.cardContract);

    return axiosClient.post<any, Res>(
      `${prefixCustomerService}/change-sim/pay`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data ',
        },
      }
    );
  } else {
    const formData = new FormData();
    formData.append('requestId ', body.changeSimCode);
    return axiosClient.post<any, Res>(
      `${prefixCustomerService}/change-sim/re-pay`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data ',
        },
      }
    );
  }
};

export const useChangeSimPay = () => {
  const {
    formAntd: form,
    interval,
    timeout,
    setIntervalApi,
    changeSimCode,
    setPayData,
    setTimeoutCheck,
    setEnableCheck,
    setDisableForm,
    setSignSuccess,
  } = useStoreListOfRequestsChangeSim();
  const { mutate: mutateSimPayChecker } = useStatusChangeSimPay();
  const { mutate: mutateChangeSimActivate } = useChangeSimActivate();

  return useMutation({
    mutationFn: fetcher,
    onSuccess: (res) => {
      clearTimeout(interval);
      form.setFieldsValue({
        saleOrderNo: res?.requestId,
      });

      if (form.getFieldValue('feeAmount') === 0 && res.free === true) {
        //call đổi sim
        mutateChangeSimActivate({
          requestId: changeSimCode,
        });
        return;
      }
      if (form.getFieldValue('feeAmount') === 0 && res.free === false) {
        //thông báo lỗi chưa thanh toán
        return Modal.warning({
          centered: true,
          okText: 'Đóng',
          title: 'Chưa thanh toán',
          styles: { footer: { textAlign: 'center' } },
        });
      }

      if (res.payData) {
        setDisableForm(true);
        // chuyển sang màn thanh toán
        const link = res.payData;
        window.open(link, '_blank');
        setPayData(link);
        const intervalNew = setInterval(() => {
          mutateSimPayChecker({ requestId: changeSimCode, check: false });
        }, 5000);
        setIntervalApi(intervalNew);

        //Sẽ enable khi hết thời gian hiệu lực thanh toán (15 phút)
        clearTimeout(timeout);

        setEnableCheck(false);
        const check = setTimeout(() => {
          setEnableCheck(true);
        }, 15 * 60 * 1000);
        setTimeoutCheck(check);
      }
    },
    onError: (err: CommonError) => {
      if (err.code === 'SALE01604') {
        form.setFields([
          {
            name: 'serial',
            errors: [err.detail],
          },
          { name: 'enableResetSerial', value: true },
          { name: 'cardContract', value: '' },
          { name: 'signLink', value: '' },
        ]);
        setSignSuccess(false);
      }
    },
  });
};
