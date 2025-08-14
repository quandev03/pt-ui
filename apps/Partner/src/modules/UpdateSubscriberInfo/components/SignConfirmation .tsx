import {
  CButton,
  CCheckbox,
  CInput,
  NotificationSuccess,
} from '@vissoft-react/common';
import { Form } from 'antd';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import { Copy } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { baseSignUrl } from '../../../../src/constants';
import {
  useCheckSignedContract,
  useGenContract,
  useGetPreviewConfirmContract,
  useGetPreviewND13,
  useSubmitInfo,
} from '../hooks';
import { useUpdateSubscriberInfoStore } from '../store';
import { StepEnum } from '../type';
import Decree13Modal from './Decree13Modal';
import ModalPreviewPdf from './ModalPreviewPdf';
import PreviewPdf from './PreviewPdf';

const SignConfirmation = () => {
  const form = useFormInstance();
  const isAgreeND13 = Form.useWatch('agreeND13', form);
  const {
    setStep,
    ocrResponse,
    setIntervalApi,
    interval,
    agreeDegree13,
    isSignSuccess,
    setIsSignSuccess,
  } = useUpdateSubscriberInfoStore();
  const [isOpenDecree13, setIsOpenDecree13] = useState(false);
  const [isOpenModalContract, setIsOpenModalContract] = useState(false);
  const [isOpenModalDegree, setIsOpenModalDegree] = useState(false);
  const { mutate: getND13Pdf } = useGetPreviewND13((data) =>
    form.setFieldValue('degree13Url', data)
  );
  const { mutate: getConfirmContractPdf } = useGetPreviewConfirmContract(
    (data) => form.setFieldValue('contractUrl', data)
  );
  const { mutate: checkSignedContract } = useCheckSignedContract((data) => {
    if (data) {
      setIsSignSuccess(true);
      NotificationSuccess('Ký thành công');
    }
  });
  const { mutate: genContract, isPending: loadingGenContract } = useGenContract(
    () => {
      setIsSignSuccess(false);
      getND13Pdf(ocrResponse?.transactionId || '');
      getConfirmContractPdf(ocrResponse?.transactionId || '');
      const link = `${baseSignUrl || window.location.origin}/sign?id=${
        ocrResponse?.transactionId || ''
      }`;
      form.setFieldValue('signLink', link);
      window.open(link, '_blank', 'top=200,left=500,width=600,height=600');
      const interval = setInterval(() => {
        checkSignedContract(ocrResponse?.transactionId || '');
      }, 5000);
      setIntervalApi(interval);
    }
  );
  const { mutate: submitInfo, isPending: loadingSubmit } = useSubmitInfo(() =>
    setStep(StepEnum.STEP6)
  );
  const contractUrl = Form.useWatch('contractUrl', form);
  const degree13Url = Form.useWatch('degree13Url', form);
  const handleUpdate = () => {
    submitInfo(ocrResponse?.transactionId || '');
  };
  const handleOpenDecree13 = () => {
    setIsOpenDecree13(true);
  };
  const handleGenContract = () => {
    genContract({
      transactionId: ocrResponse?.transactionId || '',
      agreeDegree13: {
        agreeDk1: true,
        agreeDk2: true,
        agreeDk3: true,
        agreeDk4: agreeDegree13.includes(4),
        agreeDk5: agreeDegree13.includes(5),
      },
    });
  };
  useEffect(() => {
    if (isSignSuccess && interval) {
      clearInterval(interval);
      setIntervalApi(undefined);
    }
  }, [isSignSuccess, interval, setIntervalApi]);
  useEffect(() => {
    if (isSignSuccess) {
      getND13Pdf(ocrResponse?.transactionId || '');
      getConfirmContractPdf(ocrResponse?.transactionId || '');
    }
  }, [
    isSignSuccess,
    getConfirmContractPdf,
    getND13Pdf,
    ocrResponse?.transactionId,
  ]);

  const handleCloseModal = useCallback((isND13: boolean) => {
    if (isND13) setIsOpenModalDegree(false);
    else setIsOpenModalContract(false);
  }, []);
  return (
    <>
      <div className="flex items-center flex-col justify-between min-h-[72vh] gap-5">
        <div className="flex items-center flex-col w-full">
          <p className="text-lg font-semibold mt-2 mb-3">
            Ký biên bản xác nhận
          </p>
          <div className="w-full">
            <p className="text-[15px] mb-2 font-medium">Link ký online</p>
            <div className="flex justify-between gap-4 items-center">
              <Form.Item name="signLink" className="flex-1 mb-0">
                <CInput
                  disabled={true}
                  placeholder="Link ký"
                  suffix={
                    <Copy
                      size={22}
                      onClick={() => {
                        navigator.clipboard.writeText(
                          form.getFieldValue('signLink')
                        );
                        NotificationSuccess('Copy thành công');
                      }}
                      className="cursor-pointer"
                      color="#444444"
                    />
                  }
                />
              </Form.Item>
              <CButton
                disabled={!isAgreeND13}
                onClick={handleGenContract}
                loading={loadingGenContract}
              >
                Tạo link ký
              </CButton>
            </div>
            <div className="flex gap-3 mt-3">
              <div className="flex-1">
                <p className="mb-1">Biên bản xác nhận</p>
                <div className="relative">
                  <PreviewPdf fileUrl={contractUrl} title="Biên bản xác nhận" />
                  <div
                    className="absolute cursor-pointer top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2"
                    onClick={() => setIsOpenModalContract(true)}
                  ></div>
                </div>
              </div>
              <div className="flex-1">
                <p className="mb-1">BBXN NĐ13</p>
                <div className="relative">
                  <PreviewPdf fileUrl={degree13Url} title="BBXN NĐ13" />
                  <div
                    className="absolute cursor-pointer top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2"
                    onClick={() => setIsOpenModalDegree(true)}
                  ></div>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <Form.Item name="agreeND13" valuePropName="checked">
                <CCheckbox />
              </Form.Item>
              <Form.Item name="contractUrl" hidden></Form.Item>

              <Form.Item name="degree13Url" hidden></Form.Item>
              <p>
                Tôi đã đọc và đồng ý với{' '}
                <span
                  className="text-[#005AA9] font-semibold cursor-pointer"
                  onClick={handleOpenDecree13}
                >
                  văn bản chấp nhận về việc xử lý và bảo vệ dữ liệu cá nhân.
                </span>
              </p>
            </div>
          </div>
        </div>
        <CButton
          className="rounded-full py-6 w-full mt-3"
          onClick={handleUpdate}
          loading={loadingSubmit}
          disabled={!isSignSuccess}
        >
          Cập nhật TTTB
        </CButton>
      </div>
      <Decree13Modal
        open={isOpenDecree13}
        onClose={() => setIsOpenDecree13(false)}
      />
      <ModalPreviewPdf
        open={isOpenModalContract}
        onClose={() => handleCloseModal(false)}
        title="Biên bản xác nhận"
        isND13={false}
      />
      <ModalPreviewPdf
        open={isOpenModalDegree}
        onClose={() => handleCloseModal(true)}
        title="BBXN NĐ13"
        isND13={true}
      />
    </>
  );
};
export default React.memo(SignConfirmation);
