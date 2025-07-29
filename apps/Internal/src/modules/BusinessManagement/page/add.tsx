import { StyledWrapperPage } from 'apps/Internal/src/modules/ActivateSubscription/pages/styles';
import AddEdit from '../components/FormAddEdit';
import { ActionType } from '@react/constants/app';

const Page = () => {
  return (
    <StyledWrapperPage>
      <AddEdit typeModal={ActionType.ADD} />
    </StyledWrapperPage>
  );
};
export default Page;
