import { ButtonProps } from 'antd';
import { Download } from 'lucide-react';
import { CButton } from './CButton';

export const CButtonDownload: React.FC<ButtonProps> = ({ ...rest }) => {
  return (
    <CButton icon={<Download size={20} />} {...rest}>
      Tải file
    </CButton>
  );
};
