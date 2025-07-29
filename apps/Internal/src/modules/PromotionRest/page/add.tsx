import { Wrapper } from './style';
import { ActionType } from '@react/constants/app';
import FormGeneral from '../components/FormGeneral';

const PromotionRestPageAdd = () => {
  return (
    <Wrapper id="wrapperPromotionRest">
      <FormGeneral type={ActionType.ADD} />
    </Wrapper>
  );
};

export default PromotionRestPageAdd;
