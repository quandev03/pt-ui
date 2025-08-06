import { TitleHeader, Wrapper } from '@vissoft-react/common';
import { Card, Form } from 'antd';
import SignConfirmation from '../components/SignConfirmation ';
import UpdateInfo from '../components/UpdateInfo';
import VerifyFace from '../components/VerifyFace';
import VerifyInfo from '../components/VerifyInfo';
import VerifyPassport from '../components/VerifyPassport';
import { useUpdateSubscriberInfoStore } from '../store';
import { useEffect } from 'react';

export const UpdateSubscriberInfo = () => {
  const { step } = useUpdateSubscriberInfoStore();
  const [form] = Form.useForm();
  const stepComponents = [
    <UpdateInfo form={form} />,
    <VerifyPassport form={form} />,
    <VerifyFace form={form} />,
    <VerifyInfo form={form} />,
    <SignConfirmation form={form} />,
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

    // Kiểm tra nếu trình duyệt hỗ trợ
    if (navigator.mediaDevices) {
      requestCameraAccess();
    }
  }, []);
  return (
    <Wrapper>
      <TitleHeader>Cập nhật thông tin thuê bao</TitleHeader>
      <div className="flex justify-center">
        <div className="w-1/3">
          <Card>
            <div className="flex gap-[10px] justify-between mt-1 mb-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  className={`h-[5px] rounded-lg flex-1 ${
                    index === step ? 'bg-[#3371cd]' : 'bg-[#E8F2FF]'
                  }`}
                ></div>
              ))}
            </div>
            {stepComponents[step]}
          </Card>
        </div>
      </div>
    </Wrapper>
  );
};
