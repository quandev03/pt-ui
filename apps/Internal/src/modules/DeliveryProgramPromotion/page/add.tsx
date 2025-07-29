import { Wrapper } from './style';
import { ActionType } from '@react/constants/app';
import FormGeneral from '../components/FormGeneral';

const DeliveryPromotionPageAdd = () => {
  return (
    <Wrapper id="wrapperDeliveryPromotionscategory">
      <FormGeneral type={ActionType.ADD} />
    </Wrapper>
  );
};

export default DeliveryPromotionPageAdd;
