import Button from '.';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfo } from '@fortawesome/free-solid-svg-icons';
import { ButtonProps } from 'antd';
import { FormattedMessage } from 'react-intl';

const ButtonDetail: React.FC<ButtonProps> = ({ ...rest }) => {
  return (
    <Button type="default" icon={<FontAwesomeIcon icon={faInfo} />} {...rest}>
      <FormattedMessage id={'common.detail'} />
    </Button>
  );
};

export default ButtonDetail;
