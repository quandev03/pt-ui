import { ButtonProps } from 'antd';
import { Upload } from 'lucide-react';
import { CButton } from './CButton';

export const CButtonExport: React.FC<ButtonProps> = ({ children, ...rest }) => {
  return (
    <CButton icon={<Upload size={20} />} {...rest}>
      {children ?? 'Xuất excel'}
    </CButton>
  );
};
