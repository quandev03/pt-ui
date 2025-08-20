import { Button, ButtonProps } from 'antd';
import { Send } from 'lucide-react';
const CButtonApprove: React.FC<ButtonProps> = ({ ...rest }) => {
  return (
    <Button icon={<Send size={20} />} {...rest}>
      Phê duyệt
    </Button>
  );
};

export default CButtonApprove;
