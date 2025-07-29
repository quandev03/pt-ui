import { faBan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ButtonProps } from 'antd';
import Button from '.';
const CButtonRefuse: React.FC<ButtonProps> = ({ ...rest }) => {
  return (
    <Button
      style={{ backgroundColor: '#ff4d4d', borderColor: '#ff4d4d' }}
      icon={<FontAwesomeIcon icon={faBan} />}
      {...rest}
    >
      Từ chối
    </Button>
  );
};

export default CButtonRefuse;
