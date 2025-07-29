import { NotificationSuccess } from '@react/commons/index';
import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import useActiveSubscriptStore from '../store';
import dayjs from 'dayjs';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';
import { useNavigate } from 'react-router-dom';
import { CommonError } from '@react/commons/types';
import { groupBy } from 'lodash';
import md5 from 'crypto-js/md5';
import forge from 'node-forge';

interface EncryptedData {
  encryptedData: string;
  encryptedAESKey: string;
  iv: string;
}

export function encryptData(data: string, publicKeyStr: string): EncryptedData {
  try {
    // Tạo AES key ngẫu nhiên (256-bit)
    const aesKey = forge.random.getBytesSync(32);

    // Tạo IV ngẫu nhiên (12 bytes cho AES-GCM)
    const iv = forge.random.getBytesSync(12);

    // Mã hóa data bằng AES-GCM
    const cipher = forge.cipher.createCipher('AES-GCM', aesKey);
    cipher.start({
      iv: iv, // Initialization Vector
      tagLength: 128, // GCM tag length (bits)
    });
    cipher.update(forge.util.createBuffer(data, 'utf8'));
    cipher.finish();

    // Lấy encrypted data và auth tag
    const encryptedData = cipher.output.getBytes(); // Dữ liệu đã mã hóa
    const authTag = cipher.mode.tag.getBytes(); // Authentication tag

    // Combine encrypted data với auth tag
    const combinedData = forge.util.encode64(encryptedData + authTag);

    // Mã hóa AES key bằng RSA
    const publicKey = forge.pki.publicKeyFromPem(
      `-----BEGIN PUBLIC KEY-----\n${publicKeyStr}\n-----END PUBLIC KEY-----`
    );
    const encryptedAESKey = forge.util.encode64(
      publicKey.encrypt(aesKey, 'RSAES-PKCS1-V1_5')
    );

    // Đóng gói kết quả
    return {
      encryptedData: combinedData,
      encryptedAESKey: encryptedAESKey,
      iv: forge.util.encode64(iv),
    };
  } catch (error) {
    console.error('Encryption error:', error);
    throw error;
  }
}

export interface FilterConfirmOtp {
  isdn: string;
  idEkyc: string;
  id: string;
  otp: string;
  transactionId: string;
}

const fetcher = ({ files, form, contractUploadType }: any) => {
  const hash = window.location.hash;
  const path = hash.split('/')[1];
  const formData = new FormData();
  Object.keys(files).forEach((key: string) => {
    if (files[key]) {
      formData.append(key, files[key] as Blob);
    }
  });
  const details = JSON.stringify(
    {
      request: {
        strSex: form.sex,
        strSubName: form.name,
        strIdNo: form.id,
        strIdIssueDate: dayjs(form.issue_date, 'DD-MM-YYYY').format(
          'DD/MM/YYYY'
        ),
        strIdIssuePlace: form.issue_by,
        strBirthday: dayjs(form.birthday, 'DD-MM-YYYY').format('DD/MM/YYYY'),
        strProvince: form.city,
        strDistrict: form.district,
        strPrecinct: form.ward,
        strHome: form.address,
        strAddress: form.address,
        strContractNo: form.contractNo,
        strIsdn: form.phone,
        strSerial: form.serialSim,
      },
      idExpiryDateNote: form.idExpiryDateNote,
      idExpiryDate: form.expiry
        ? dayjs(form.expiry, 'YYYY-MM-DD').format('DD/MM/YYYY')
        : '',
      idType: form.document,
      idEkyc: form.id_ekyc,
      customerCode: form.customerId,
      contractDate: dayjs().format('DD/MM/YYYY'),
      decree13Accept: form.decree13Accept?.toString(),
      enterpriseId: form.enterpriseId,
      sessionToken: form.sessionToken,
      signature: md5(form.id_ekyc + form.sessionToken).toString(),
      contractUploadType: contractUploadType
    },
    null,
    2
  );

  console.log('BEFORE: ', details);

  const encrypted = encryptData(details, form.publicKey);
  const result = JSON.stringify(encrypted);
  formData.append('data', result);
  formData.append('idEkyc', form.id_ekyc);

  if (path !== 'activation-request-list') {
    return axiosClient.post<any>(
      `${prefixCustomerService}/activate`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data ',
        },
      }
    );
  } else {
    return axiosClient.post<any>(
      `${prefixCustomerService}/subscriber-request`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data ',
        },
      }
    );
  }
};

export const useActivate = () => {
  const { resetGroupStore, formAntd, interval } = useActiveSubscriptStore();
  return useMutation({
    mutationFn: fetcher,
    onSuccess: () => {
      NotificationSuccess('Kích hoạt thuê bao thành công');
      clearTimeout(interval);
      resetGroupStore();
      formAntd.resetFields();
    },
    onError: (err: CommonError) => {
      if (err?.errors?.length > 0) {
        const newObj = groupBy(err?.errors, 'field');
        const res = Object.entries(newObj).map(([field, obj]) => ({
          field,
          detail: obj?.map((item) => item.detail),
        }));
        formAntd.setFields(
          res?.map((item: any) => ({
            name: item.field,
            errors: item.detail,
          }))
        );
      }
    },
  });
};

export const useActivateRequest = () => {
  const { resetGroupStore, formAntd } = useActiveSubscriptStore();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: fetcher,
    onSuccess: () => {
      NotificationSuccess('Thêm mới thành công');
      resetGroupStore();
      formAntd.resetFields();
      navigate(-1);
    },
    onError: (err: CommonError) => {
      if (err?.errors?.length > 0) {
        const newObj = groupBy(err?.errors, 'field');
        const res = Object.entries(newObj).map(([field, obj]) => ({
          field,
          detail: obj?.map((item) => item.detail),
        }));
        formAntd.setFields(
          res?.map((item: any) => ({
            name: item.field,
            errors: item.detail,
          }))
        );
      }
    },
  });
};
