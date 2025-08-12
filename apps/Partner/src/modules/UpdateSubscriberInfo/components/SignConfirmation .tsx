import {
  CButton,
  CCheckbox,
  CInput,
  NotificationSuccess,
} from '@vissoft-react/common';
import { Form } from 'antd';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import { Copy } from 'lucide-react';
import { useEffect, useState } from 'react';
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
import PreviewPdf from './PreviewPdf';

const SignConfirmation = () => {
  const form = useFormInstance();
  const isAgreeND13 = Form.useWatch('agreeND13', form);
  const { setStep, ocrResponse, setIntervalApi, interval } =
    useUpdateSubscriberInfoStore();
  const [isSignSuccess, setIsSignSuccess] = useState(false);
  const [isOpenDecree13, setIsOpenDecree13] = useState(false);
  const { mutate: getND13Pdf, data: degree13Url } = useGetPreviewND13();
  const { mutate: getConfirmContractPdf, data: contractUrl } =
    useGetPreviewConfirmContract();
  const { mutate: checkSignedContract } = useCheckSignedContract((data) => {
    if (data) {
      setIsSignSuccess(true);
      NotificationSuccess('Ký thành công');
    }
  });
  const { mutate: genContract, isPending: loadingGenContract } = useGenContract(
    () => {
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

  const handleUpdate = () => {
    submitInfo(ocrResponse?.transactionId || '');
  };
  const handleOpenDecree13 = () => {
    setIsOpenDecree13(true);
  };
  const handleGenContract = () => {
    const agreedTerms = form.getFieldValue('terms');
    genContract({
      transactionId: ocrResponse?.transactionId || '',
      agreeDegree13: {
        agreeDk1: true,
        agreeDk2: true,
        agreeDk3: true,
        agreeDk4: agreedTerms.includes(4),
        agreeDk5: agreedTerms.includes(5),
      },
    });
  };
  useEffect(() => {
    if (isSignSuccess && interval) {
      clearInterval(interval);
      setIntervalApi(undefined);
    }
  }, [isSignSuccess, interval, setIntervalApi]);
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
                <PreviewPdf fileUrl={contractUrl} title="Biên bản xác nhận" />
              </div>
              <div className="flex-1">
                <p className="mb-1">BBXN NĐ13</p>
                <PreviewPdf fileUrl={degree13Url} title="BBXN NĐ13" />
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <Form.Item name="agreeND13" valuePropName="checked">
                <CCheckbox />
              </Form.Item>
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
        >
          Cập nhật TTTB
        </CButton>
      </div>
      <Decree13Modal
        open={isOpenDecree13}
        onClose={() => setIsOpenDecree13(false)}
      />
    </>
  );
};
export default SignConfirmation;
