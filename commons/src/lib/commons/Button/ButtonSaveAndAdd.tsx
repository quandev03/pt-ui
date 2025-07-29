import Button from '.';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import { ButtonProps } from 'antd';

const CButtonSaveAndAdd: React.FC<ButtonProps> = ({ ...rest }) => {
  return (
    <Button icon={<FontAwesomeIcon icon={faFloppyDisk} />} {...rest}>
      Lưu và thêm mới
    </Button>
  );
};

export default CButtonSaveAndAdd;
