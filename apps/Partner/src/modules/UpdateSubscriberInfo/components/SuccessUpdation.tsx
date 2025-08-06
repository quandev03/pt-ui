import { FormInstance } from 'antd';
import { FC } from 'react';

type Props = {
  form: FormInstance;
};
const SuccessUpdation: FC<Props> = ({ form }) => {
  return (
    <div>
      <p className="text-base font-semibold">Cập nhật thông tin</p>
    </div>
  );
};
export default SuccessUpdation;
