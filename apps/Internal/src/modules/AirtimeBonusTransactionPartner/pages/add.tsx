import { ActionType } from '@react/constants/app';
import ModalAdd from '../components/ModalAdd';

const AirtimeBonusTransactionPartner = ({ isEnabledApproval, typeModal }: { isEnabledApproval: boolean, typeModal: ActionType }) => {
  return (
    <div>
      <ModalAdd typeModal={typeModal} isEnabledApproval={isEnabledApproval} />
    </div>
  );
};
export default AirtimeBonusTransactionPartner;
