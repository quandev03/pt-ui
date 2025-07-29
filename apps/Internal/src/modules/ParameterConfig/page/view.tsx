import { ActionType } from '@react/constants/app';
import FormGeneral from '../components/FormGeneral';
import { WrapperAdd } from './style';

const ParameterConfigPageView = () => {
  return (
    <WrapperAdd id="wrapperParameterConfig">
      <FormGeneral type={ActionType.VIEW} />
    </WrapperAdd>
  );
};

export default ParameterConfigPageView;