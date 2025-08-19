import { ButtonProps } from 'antd';
import { Pencil } from 'lucide-react';
import { CButton } from './CButton';

export const CButtonEdit: React.FC<ButtonProps> = ({ ...rest }) => {
  return (
    <CButton icon={<Pencil size={18} />} {...rest}>
      Sửa
    </CButton>
  );
};
