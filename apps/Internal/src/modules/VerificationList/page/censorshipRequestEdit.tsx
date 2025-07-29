import { WrapperPage } from '@react/commons/index';
import { ActionType } from '@react/constants/app';
import CensorshipRequest from '../components/CensorshipRequest';

const VerificationListPage = () => {
  return (
    <WrapperPage>
      <CensorshipRequest typeModal={ActionType.EDIT} />
    </WrapperPage>
  );
};
export default VerificationListPage;
