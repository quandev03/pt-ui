import { ButtonProps } from 'antd';
import { Plus } from 'lucide-react';
import { CButton } from './CButton';

export const CButtonAddFile: React.FC<ButtonProps> = ({ ...rest }) => {
  return (
    <CButton icon={<Plus size={20} />} {...rest}>
      Thêm mới file
    </CButton>
  );
};
