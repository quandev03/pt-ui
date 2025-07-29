import { ActionType } from '@react/constants/app';
import FormGeneral from '../components/FormGeneral';
import { WrapperAdd } from './style';

const ParameterConfigPageAdd = () => {
  return (
    <WrapperAdd id="wrapperParameterConfig">
      <FormGeneral type={ActionType.ADD} />
    </WrapperAdd>
  );
};

export default ParameterConfigPageAdd;
