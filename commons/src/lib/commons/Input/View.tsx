import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { StyledInput } from './styles';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { InputProps } from 'antd';

interface ViewInputProps extends InputProps {
  onView?: () => void;
}

const ViewInput: React.FC<ViewInputProps> = ({ onView, ...rest }) => {
  return (
    <StyledInput
      {...rest}
      disabled
      suffix={
        <FontAwesomeIcon
          icon={faEye}
          className="cursor-pointer text-black"
          onClick={onView}
        />
      }
    />
  );
};

export default ViewInput;
