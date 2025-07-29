import Button from '.';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { ButtonProps } from 'antd';
import { FormattedMessage } from 'react-intl';

const CButtonSave: React.FC<ButtonProps> = ({ children, ...rest }) => {
  return (
    <Button icon={<FontAwesomeIcon icon={faSave} />} {...rest}>
      {children ?? <FormattedMessage id="common.save" />}
    </Button>
  );
};

export default CButtonSave;
