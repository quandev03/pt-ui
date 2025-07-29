import { WrapperPage } from '@react/commons/index';
import { ActionType } from '@react/constants/app';
import DocumentUpdateHistory from '../components/DocumentUpdateHistory/DocumentUpdateHistory';

const VerificationListPage = () => {
  return (
    <WrapperPage>
      <DocumentUpdateHistory typeModal={ActionType.VIEW} />
    </WrapperPage>
  );
};
export default VerificationListPage;
