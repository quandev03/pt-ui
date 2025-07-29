import Button from '.';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FormattedMessage } from 'react-intl';
import { ButtonProps } from 'antd';

const CButtonAdd: React.FC<ButtonProps> = ({ ...rest }) => {
  return (
    <Button icon={<FontAwesomeIcon icon={faPlus} />} {...rest}>
      <FormattedMessage id="common.add" />
    </Button>
  );
};

export default CButtonAdd;
