import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { FormattedMessage } from 'react-intl';
import { ButtonProps } from 'antd';
import { Button } from '@react/commons/index';

const CButtonCopy: React.FC<ButtonProps> = ({ children, ...rest }) => {
  return (
    <Button
      icon={<FontAwesomeIcon icon={faCopy} />}
      {...rest}
    >
      {children ?? <FormattedMessage id="Sao chép" />}
    </Button>
  );
};

export default CButtonCopy;
