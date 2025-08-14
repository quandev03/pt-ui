import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import { CircleCheckIcon } from 'lucide-react';
import React, { FC } from 'react';
type Props = {
  isSuccess?: boolean;
};
const ViewImages: FC<Props> = ({ isSuccess }) => {
  const form = useFormInstance();
  return (
    <div className="flex justify-between gap-5">
      <div className="flex-1">
        <div className="bg-[#EEF3FE] p-4 rounded-lg relative flex justify-center items-center flex-col aspect-[4/3]">
          <div className="aspect-[4/3] overflow-hidden">
            <img
              src={form.getFieldValue('passportUrl')}
              alt="passport"
              className="object-cover w-full h-full"
            />
          </div>
          {isSuccess && (
            <CircleCheckIcon
              className="absolute -top-[5px] -right-[5px]"
              color="#45B38C"
            />
          )}
        </div>
        <p className="text-center mt-2">Hộ chiếu</p>
      </div>
      <div className="flex-1">
        <div className="bg-[#EEF3FE] p-4 rounded-lg relative flex justify-center items-center flex-col aspect-[4/3]">
          <div className="w-[75%] aspect-[4/4] overflow-hidden rounded-full">
            <img
              src={form.getFieldValue('portraitUrl')}
              alt="portrait"
              className="object-cover w-full h-full"
            />
          </div>
          {isSuccess && (
            <CircleCheckIcon
              className="absolute -top-[5px] -right-[5px]"
              color="#45B38C"
            />
          )}
        </div>
        <p className="text-center mt-2">Khuôn mặt</p>
      </div>
    </div>
  );
};
export default React.memo(ViewImages);
