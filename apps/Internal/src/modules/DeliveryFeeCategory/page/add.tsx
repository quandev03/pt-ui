import { ActionType } from '@react/constants/app';
import FormGeneral from '../components/FormGeneral';

const DeliveryFeePageAdd = () => {
  return (
    <div id="wrapperDeliveryFee">
      <FormGeneral type={ActionType.ADD} />
    </div>
  );
};

export default DeliveryFeePageAdd;
