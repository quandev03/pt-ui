import { ButtonProps } from 'antd';
import { Save } from 'lucide-react';
import { CButton } from './CButton';

export const CButtonSaveAndAdd: React.FC<ButtonProps> = ({ ...rest }) => {
  return (
    <CButton icon={<Save size={20} />} {...rest}>
      Lưu và thêm mới
    </CButton>
  );
};
