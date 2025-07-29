import { CommonError } from '@react/commons/types';
import { pathRouterSign } from '@react/url/pathRouterSign';
import { useMutation } from '@tanstack/react-query';
import {
  baseSignUrl,
  prefixCustomerService,
} from 'apps/Internal/src/constants/app';
import useStoreListOfRequestsChangeSim from 'apps/Internal/src/modules/ListOfRequestsChangeSim/store';
import { axiosClient } from 'apps/Internal/src/service';
import { groupBy } from 'lodash';
import { useContractSigningChecker } from './useContractSigningChecker';

export enum SignEnum {
  PNG = 'PNG',
  PDF = 'PDF',
}

export enum SexEnum {
  FEMALE = '0',
  MALE = '1',
}

export enum SimEnum {
  PhysicalSim = '1',
  Esim = '2',
}

export enum ReasonChangeSimEnum {
  gurantee = 'BAHA',
  errorSim = 'KHYC',
  other = 'SIMOTHER',
  changeToEsim = 'TOESIM',
  changeToPhysicalSim = 'TOSIM',
}

interface Res {
  changeSimContractNo: string;
}

const fetcher = (body: any) => {
  const payload = {
    type: body.type,
    changeSimNo:
      (body.simType === SimEnum.Esim ? 'DSES' : 'DSVL') + body.changeSimCode,
    customerNo: body.customerCode,
    ccdvvt: body.ccdvvt,
    customerName: body.name,
    idNo: body.id,
    dateOfIssue: body.issueDate,
    placeOfIssue: body.issueBy,
    dateOfBirth: body.birthday,
    country: body.nationality,
    address: body.receiverAddress,
    balance: body.balance,
    phoneNumber: body.receiverPhone,
    originPhoneNumber: body.isdn?.substring(1),
    reGularPhoneNumbers: [
      {
        phoneNumber: body.phoneNumber1,
      },
      {
        phoneNumber: body.phoneNumber2,
      },
      {
        phoneNumber: body.phoneNumber3,
      },
      {
        phoneNumber: body.phoneNumber4,
      },
      {
        phoneNumber: body.phoneNumber5,
      },
    ],

    valueAddedService: body.valueAddedService,
    dataPackage: body.dataPackage,
    lastCardRechargeTime: body.lastCardRechargeTime,
    lastCardRechargeValue: body.lastCardRechargeValue,
    email: body.email,
    seriesSimOld: body.oldSerialSim,
    seriesSimNew: body.serial,
    firstSerialSimNew:
      body.reason === ReasonChangeSimEnum.changeToEsim ||
      body.reason === ReasonChangeSimEnum.changeToPhysicalSim
        ? ''
        : body.serial,
    firstSerialSimOld:
      body.reason === ReasonChangeSimEnum.changeToEsim ||
      body.reason === ReasonChangeSimEnum.changeToPhysicalSim
        ? ''
        : body.oldSerialSim,
    secondSerialSimNew:
      body.reason === ReasonChangeSimEnum.changeToEsim ||
      body.reason === ReasonChangeSimEnum.changeToPhysicalSim
        ? body.serial
        : '',
    secondSerialSimOld:
      body.reason === ReasonChangeSimEnum.changeToEsim ||
      body.reason === ReasonChangeSimEnum.changeToPhysicalSim
        ? body.oldSerialSim
        : '',
    male: body.sex === SexEnum.MALE ? true : false,
    feMale: body.sex === SexEnum.FEMALE ? true : false,
    gurantee: body.reason === ReasonChangeSimEnum.gurantee ? true : false,
    errorSim: body.reason === ReasonChangeSimEnum.errorSim ? true : false,
    other: body.reason === ReasonChangeSimEnum.other ? true : false,
    changeToEsim:
      body.reason === ReasonChangeSimEnum.changeToEsim ? true : false,
    changeToPhysicalSim:
      body.reason === ReasonChangeSimEnum.changeToPhysicalSim ? true : false,
    typeSim: body.simType,
  };

  return axiosClient.post<any, Res>(
    `${prefixCustomerService}/change-sim/gen-contract`,
    payload
  );
};

export const useGenContractChangeSim = () => {
  const {
    formAntd: form,
    setIsDisabledContract,
    setOpenModalPdf,
    interval,
    setIntervalApi,
    setSignSuccess,
  } = useStoreListOfRequestsChangeSim();
  const { setChangeSimCode } = useStoreListOfRequestsChangeSim();
  const { mutate: mutateSigningChecker } = useContractSigningChecker();
  return useMutation({
    mutationFn: fetcher,
    onSuccess: (res, variables) => {
      clearTimeout(interval);
      const id = res?.changeSimContractNo;
      form.setFieldsValue({
        contractId: res?.changeSimContractNo,
        cardContract: '',
      });
      setSignSuccess(false);
      if (variables.type === SignEnum.PNG) {
        const link = `${baseSignUrl || window.location.origin}/#${
          pathRouterSign.changeSim
        }?id=${id}`;

        form.setFieldValue('signLink', link);
        window.open(link, '_blank', 'top=200,left=500,width=600,height=600');

        const intervalNew = setInterval(() => {
          mutateSigningChecker({ contractId: id });
        }, 5000);
        setIntervalApi(intervalNew);
      } else {
        form.setFieldValue('signLink', '');
        setIsDisabledContract(false);
        setOpenModalPdf(true);
      }
    },
    onError: (err: CommonError) => {
      if (err.code === 'CUS70003') {
        setChangeSimCode();
      } else if (err?.errors?.length > 0) {
        const newObj = groupBy(err?.errors, 'field');
        const res = Object.entries(newObj).map(([field, obj]) => ({
          field,
          detail: obj?.map((item) => item.detail),
        }));
        form.setFields(
          res?.map((item: any) => ({
            name: item.field,
            errors: item.detail,
          }))
        );
      }
    },
  });
};
