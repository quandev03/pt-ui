import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import { CircleCheckIcon } from 'lucide-react';
import { FC } from 'react';
type Props = {
  isSuccess?: boolean;
};
const ViewImages: FC<Props> = ({ isSuccess }) => {
  const form = useFormInstance();
  return (
    <div className="flex justify-between gap-5">
      <div className="flex-1">
        <div className="bg-[#EEF3FE] p-4 rounded-lg relative flex justify-center items-center flex-col">
          <div>
            <img src={form.getFieldValue('passportUrl')} alt="passport" />
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
        <div className="bg-[#EEF3FE] p-4 rounded-lg relative flex justify-center items-center flex-col">
          <div className="w-[70%] aspect-[4/4] overflow-hidden rounded-full">
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
export default ViewImages;
