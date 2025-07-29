import Button from '.';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { ButtonProps } from 'antd';
import { FormattedMessage } from 'react-intl';

const CButtonDelete: React.FC<ButtonProps> = ({
  children,
  icon = <FontAwesomeIcon icon={faTrashCan} />,
  ...rest
}) => {
  return (
    <Button
      style={{ backgroundColor: '#ff4d4d', borderColor: '#ff4d4d' }}
      icon={icon}
      {...rest}
    >
      {children ?? <FormattedMessage id="common.delete" />}
    </Button>
  );
};

export default CButtonDelete;
