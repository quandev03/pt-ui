import { Wrapper } from '@react/commons/Template/style';
import { ActionType } from '@react/constants/app';
import FormGeneral from '../components/FormGeneral';

const DeliveryFeePageView = () => {
  return (
    <Wrapper id="wrapperDeliveryFee">
      <FormGeneral type={ActionType.VIEW} />
    </Wrapper>
  );
};

export default DeliveryFeePageView;