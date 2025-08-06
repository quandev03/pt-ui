import { CButton } from '@vissoft-react/common';
import { FormInstance } from 'antd';
import { CircleCheckIcon } from 'lucide-react';
import { FC } from 'react';
import { useUpdateSubscriberInfoStore } from '../store';
import { StepEnum } from '../type';

type Props = {
  form: FormInstance;
};
const VerifyInfo: FC<Props> = ({ form }) => {
  const customerInfo = [
    { label: 'Loại giấy tờ', value: 'Passport' },
    { label: 'Họ và tên', value: 'Happy Traveller' },
    { label: 'Giới tính', value: 'Male' },
    { label: 'Ngày sinh', value: '01/01/1981' },
    { label: 'Số hộ chiếu', value: 'C03005988' },
    { label: 'Ngày cấp', value: '30/11/2009' },
    { label: 'Ngày hết hạn', value: '29/11/2019' },
    { label: 'Quốc tịch', value: 'American' },
  ];
  const { setStep } = useUpdateSubscriberInfoStore();
  const handleConfirm = () => {
    setStep(StepEnum.STEP5);
  };
  return (
    <div className="flex items-center flex-col justify-between min-h-[72vh] gap-5">
      <div className="flex items-center flex-col w-full">
        <p className="text-lg font-semibold mt-2 mb-3">Xác thực thông tin</p>
        <div className="w-full text-[#1A3263]">
          <p className="text-base font-semibold mb-2">Thông tin khách hàng</p>
          <ul className="list-none">
            {customerInfo.map((item, index) => (
              <li
                className={`flex py-[7px] justify-between ${
                  index < customerInfo.length - 1 ? 'border-b' : ''
                }  border-b-[#EEF3FE]`}
              >
                <p className="font-light">{item.label}</p>
                <p>{item.value}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="w-full text-[#1A3263] mt-3">
          <p className="text-base font-semibold mb-2">Ảnh xác minh</p>
          <div className="flex justify-between gap-5">
            <div className="flex-1">
              <div className="bg-[#EEF3FE] p-4 rounded-lg relative flex justify-center items-center flex-col">
                <div>
                  <img
                    src="https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?cs=srgb&dl=pexels-souvenirpixels-414612.jpg&fm=jpg"
                    alt=""
                  />
                </div>
                <CircleCheckIcon
                  className="absolute -top-[5px] -right-[5px]"
                  color="#45B38C"
                />
              </div>
              <p className="text-center mt-2">Hộ chiếu</p>
            </div>
            <div className="flex-1">
              <div className="bg-[#EEF3FE] p-4 rounded-lg relative flex justify-center items-center flex-col">
                <div className="w-[70%] aspect-[4/4] overflow-hidden rounded-full">
                  <img
                    src="https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?cs=srgb&dl=pexels-souvenirpixels-414612.jpg&fm=jpg"
                    alt=""
                    className="object-cover w-full h-full"
                  />
                </div>
                <CircleCheckIcon
                  className="absolute -top-[5px] -right-[5px]"
                  color="#45B38C"
                />
              </div>
              <p className="text-center mt-2">Khuôn mặt</p>
            </div>
          </div>
        </div>
        <CButton
          className="rounded-full py-6 w-full mt-3"
          onClick={handleConfirm}
        >
          Xác nhận
        </CButton>
      </div>
    </div>
  );
};
export default VerifyInfo;
