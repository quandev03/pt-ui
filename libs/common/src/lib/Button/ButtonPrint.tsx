import { ButtonProps } from 'antd';
import { Printer } from 'lucide-react';
import { CButton } from './CButton';

export const CButtonPrint: React.FC<ButtonProps> = ({ children, ...rest }) => {
  return (
    <CButton icon={<Printer size={20} />} {...rest}>
      {children ?? 'In'}
    </CButton>
  );
};
