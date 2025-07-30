import { ButtonProps } from 'antd';
import { Plus } from 'lucide-react';
import { CButton } from './CButton';

export const CButtonAdd: React.FC<ButtonProps> = ({ ...rest }) => {
  return (
    <CButton icon={<Plus size={18} />} {...rest}>
      Thêm mới
    </CButton>
  );
};
