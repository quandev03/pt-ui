import Button from '.';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { ButtonProps } from 'antd';

const CButtonExport: React.FC<ButtonProps> = ({ ...rest }) => {
  return (
    <Button icon={<FontAwesomeIcon icon={faUpload} />} {...rest}>
      Xuất excel
    </Button>
  );
};

export default CButtonExport;
