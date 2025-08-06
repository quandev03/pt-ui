import { CButton, CInput } from '@vissoft-react/common';
import { Form, FormInstance } from 'antd';
import { FC } from 'react';
import { useUpdateSubscriberInfoStore } from '../store';
import { StepEnum } from '../type';

type Props = {
  form: FormInstance;
};
const UpdateInfo: FC<Props> = ({ form }) => {
  const { setStep } = useUpdateSubscriberInfoStore();
  const handleClick = () => {
    setStep(StepEnum.STEP2);
  };
  return (
    <div className="flex items-center flex-col justify-between min-h-[72vh] gap-5">
      <div className="flex items-center flex-col">
        <p className="text-lg font-semibold mt-2">Cập nhật thông tin</p>
        <Form.Item className="w-full mt-3">
          <CInput
            onlyNumber
            className="py-3"
            placeholder="Nhập số điện thoại"
          />
        </Form.Item>
        <p className="text-lg font-semibold mt-4 mb-2">Thông báo</p>
        <div>
          <p>
            Để cập nhật thông tin thuê bao theo đúng quy định pháp luật Việt
            Nam, vui lòng thực hiện các bước sau:
          </p>
          <ul className="list-disc pl-8">
            <li>
              Cấp quyền truy cập Camera (nếu muốn chụp ảnh trực tiếp) hoặc tải
              lên ảnh giấy tờ tùy thân của khách hàng từ thiết bị
            </li>
            <li>Thực hiện eKYC</li>
          </ul>
          <p>
            Chúng tôi cam kết bảo mật tuyệt đối thông tin cá nhân của khách
            hàng, chỉ sử dụng cho mục đích cập nhật thông tin thuê bao và tuân
            thủ nghiêm ngặt Nghị định 13/2023/NĐ-CP cùng các quy định pháp luật
            hiện hành.
          </p>
        </div>
      </div>
      <CButton className="rounded-full w-full py-6 mb-10" onClick={handleClick}>
        Tiếp tục
      </CButton>
    </div>
  );
};
export default UpdateInfo;
