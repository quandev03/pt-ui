import { ActionType } from '@react/constants/app';
import FormGeneral from '../components/FormGeneral';

const DeliveryFeePageEdit = () => {
  return (
    <div id="wrapperDeliveryFee">
      <FormGeneral type={ActionType.EDIT} />
    </div>
  );
};

export default DeliveryFeePageEdit;
