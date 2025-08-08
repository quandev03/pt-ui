import { TitleHeader, Wrapper } from '@vissoft-react/common';
import { Card, Form } from 'antd';
import { useEffect } from 'react';
import SignConfirmation from '../components/SignConfirmation ';
import SuccessUpdation from '../components/SuccessUpdation';
import UpdateInfo from '../components/UpdateInfo';
import VerifyFace from '../components/VerifyFace';
import VerifyInfo from '../components/VerifyInfo';
import VerifyPassport from '../components/VerifyPassport';
import { useUpdateSubscriberInfoStore } from '../store';
import { StepEnum } from '../type';

export const UpdateSubscriberInfo = () => {
  const { step, setStep } = useUpdateSubscriberInfoStore();
  const [form] = Form.useForm();
  const stepComponents = [
    <UpdateInfo />,
    <VerifyPassport />,
    <VerifyFace />,
    <VerifyInfo />,
    <SignConfirmation />,
    <SuccessUpdation />,
  ];
  useEffect(() => {
    async function requestCameraAccess() {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true });
        console.log('User granted camera permission');
      } catch (err) {
        console.warn('Camera access denied or not yet granted');
      }
    }
    if (navigator.mediaDevices) {
      requestCameraAccess();
    }
  }, []);
  useEffect(() => {
    if (step === StepEnum.STEP6) {
      const timer = setTimeout(() => {
        setStep(StepEnum.STEP1);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [step, setStep]);
  return (
    <Wrapper>
      <TitleHeader>Cập nhật thông tin thuê bao</TitleHeader>
      <div className="flex justify-center">
        <div className="w-1/3">
          <Card>
            <Form form={form} initialValues={{ terms: [1, 2, 3] }}>
              {step < StepEnum.STEP6 && (
                <div className="flex gap-[10px] justify-between mt-1 mb-4">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div
                      className={`h-[5px] rounded-lg flex-1 ${
                        index === step ? 'bg-[#3371cd]' : 'bg-[#E8F2FF]'
                      }`}
                    ></div>
                  ))}
                </div>
              )}

              {stepComponents[step]}
            </Form>
          </Card>
        </div>
      </div>
    </Wrapper>
  );
};
