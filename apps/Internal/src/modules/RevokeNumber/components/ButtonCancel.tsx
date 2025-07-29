import { faCancel } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@react/commons/index';
import { ButtonProps } from 'antd';
import { FormattedMessage } from 'react-intl';

const ButtonCancel: React.FC<ButtonProps> = ({ children, ...rest }) => {
  return (
    <Button
      icon={<FontAwesomeIcon icon={faCancel} />}
      style={{
        backgroundColor: '#ff4d4d',
        borderColor: '#ff4d4d',
        color: 'white',
      }}
      {...rest}
    >
      {children ?? <FormattedMessage id="Hủy" />}
    </Button>
  );
};

export default ButtonCancel;
