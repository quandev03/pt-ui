import { CButton } from '@vissoft-react/common';
import { FormInstance } from 'antd';
import { Copy } from 'lucide-react';
import { FC } from 'react';

type Props = {
  form: FormInstance;
};
const SignConfirmation: FC<Props> = ({ form }) => {
  const handleUpdate = () => {
    console.log('updae');
  };
  return (
    <div className="flex items-center flex-col justify-between min-h-[72vh] gap-5">
      <div className="flex items-center flex-col w-full">
        <p className="text-lg font-semibold mt-2 mb-3">Ký biên bản xác nhận</p>
        <div className="w-full">
          <p className="text-base mb-2">Link ký online</p>
          <div className="flex justify-between">
            <p>
              https://sign.bcss-vnsky-test.vissoft.vn/#/?id=5xkZ_tWbxm0ObQfxBrb1rA&type=2
            </p>
            <Copy />
          </div>
        </div>
        <CButton
          className="rounded-full py-6 w-full mt-3"
          onClick={handleUpdate}
        >
          Cập nhật TTTB
        </CButton>
      </div>
    </div>
  );
};
export default SignConfirmation;
