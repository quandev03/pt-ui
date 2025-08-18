import { ButtonProps } from 'antd';
import { X } from 'lucide-react';
import { CButton } from './CButton';

export const CButtonClose: React.FC<ButtonProps> = ({ children, ...rest }) => {
  return (
    <CButton icon={<X size={20} />} type="default" {...rest}>
      {children ?? 'Đóng'}
    </CButton>
  );
};
