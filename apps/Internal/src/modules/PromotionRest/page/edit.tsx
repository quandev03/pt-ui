import { Wrapper } from './style';
import { ActionType } from '@react/constants/app';
import FormGeneral from '../components/FormGeneral';

const PromotionRestPageEdit = () => {
  return (
    <Wrapper id="wrapperPromotionRest">
      <FormGeneral type={ActionType.EDIT} />
    </Wrapper>
  );
};

export default PromotionRestPageEdit;
