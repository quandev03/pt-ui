import { ActionType } from '@react/constants/app';
import FormGeneral from '../components/FormGeneral';
import { WrapperAdd } from './style';

const ParameterConfigPageEdit = () => {
  return (
    <WrapperAdd id="wrapperParameterConfig">
      <FormGeneral type={ActionType.EDIT} />
    </WrapperAdd>
  );
};

export default ParameterConfigPageEdit;
