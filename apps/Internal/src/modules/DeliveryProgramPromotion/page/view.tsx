import { Wrapper } from './style';
import { ActionType } from '@react/constants/app';
import FormGeneral from '../components/FormGeneral';

const DeliveryPromotionPageView = () => {
  return (
    <Wrapper id="wrapperDeliveryPromotionscategory">
      <FormGeneral type={ActionType.VIEW} />
    </Wrapper>
  );
};

export default DeliveryPromotionPageView;
