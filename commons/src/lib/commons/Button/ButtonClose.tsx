import Button from '.';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FormattedMessage } from 'react-intl';
import { ButtonProps } from 'antd';

const CButtonClose: React.FC<ButtonProps> = ({ children, ...rest }) => {
  return (
    <Button
      icon={<FontAwesomeIcon icon={faXmark} size="lg" />}
      type="default"
      {...rest}
    >
      {children ?? <FormattedMessage id="common.close" />}
    </Button>
  );
};

export default CButtonClose;
