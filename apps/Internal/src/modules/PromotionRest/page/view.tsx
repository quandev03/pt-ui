import { Wrapper } from './style';
import { ActionType } from '@react/constants/app';
import FormGeneral from '../components/FormGeneral';

const PromotionRestPageView = () => {
  return (
    <Wrapper id="wrapperPromotionRest">
      <FormGeneral type={ActionType.VIEW} />
    </Wrapper>
  );
};

export default PromotionRestPageView;
