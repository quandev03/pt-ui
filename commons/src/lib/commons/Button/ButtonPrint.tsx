import Button from '.';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint } from '@fortawesome/free-solid-svg-icons';
import { ButtonProps } from 'antd';

const CButtonPrint: React.FC<ButtonProps> = ({ children, ...rest }) => {
  return (
    <Button icon={<FontAwesomeIcon icon={faPrint} />} {...rest}>
      {children ?? 'In'}
    </Button>
  );
};

export default CButtonPrint;
