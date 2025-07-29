import Button from '.';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { ButtonProps } from 'antd';

const CButtonEdit: React.FC<ButtonProps> = ({ ...rest }) => {
  return (
    <Button icon={<FontAwesomeIcon icon={faPencil} />} {...rest}>
      Sửa
    </Button>
  );
};

export default CButtonEdit;
