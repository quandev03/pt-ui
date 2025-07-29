import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCancel } from '@fortawesome/free-solid-svg-icons';
import { FormattedMessage } from 'react-intl';
import { ButtonProps } from 'antd';
import { Button } from '@react/commons/index';

const CButtonCancel: React.FC<ButtonProps> = ({ children, ...rest }) => {
  return (
    <Button
      icon={<FontAwesomeIcon icon={faCancel} />}
      style={{ backgroundColor: '#ff4d4d', borderColor: '#ff4d4d',color:"white" }}
      {...rest}
    >
      {children ?? <FormattedMessage id="Hủy" />}
    </Button>
  );
};

export default CButtonCancel;
