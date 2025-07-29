import Button from '.';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileArrowDown } from '@fortawesome/free-solid-svg-icons';
import { ButtonProps } from 'antd';

const ButtonDownload: React.FC<ButtonProps> = ({ ...rest }) => {
  return (
    <Button icon={<FontAwesomeIcon icon={faFileArrowDown} />} {...rest}>
      Tải file
    </Button>
  );
};

export default ButtonDownload;
