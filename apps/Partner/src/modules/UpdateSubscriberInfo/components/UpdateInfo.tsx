import { CButton } from '@vissoft-react/common';
import { Form } from 'antd';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import { useCheckIsdn } from '../hooks';
import { StyledInput } from '../pages/styled';
import { useUpdateSubscriberInfoStore } from '../store';
import { StepEnum } from '../type';

// type Props = {};
const UpdateInfo = () => {
  const form = useFormInstance();
  const { setStep } = useUpdateSubscriberInfoStore();
  const { mutate: checkIsdn } = useCheckIsdn((data) => {
    setStep(StepEnum.STEP2);
    form.setFieldValue('serial', data);
  });
  const handleClick = () => {
    checkIsdn(form.getFieldValue('isdn'));
  };
  return (
    <div className="flex items-center flex-col justify-between min-h-[72vh] gap-5">
      <div className="flex items-center flex-col">
        <p className="text-lg font-semibold mt-2">Cập nhật thông tin</p>
        <Form.Item name="isdn" className="w-full mt-3">
          <StyledInput
            onlyNumber
            className="py-3 text-sky-600 text-[20px] font-semibold placeholder-slate-50"
            placeholder="Nhập số điện thoại"
            maxLength={10}
          />
        </Form.Item>
        <Form.Item hidden name="serial"></Form.Item>
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
