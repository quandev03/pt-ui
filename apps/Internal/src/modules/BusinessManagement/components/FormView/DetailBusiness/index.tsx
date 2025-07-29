import { StyledWrapperPage } from 'apps/Internal/src/modules/ActivateSubscription/pages/styles';
import AddEdit from 'apps/Internal/src/modules/BusinessManagement/components/FormAddEdit';
import { ActionType } from '@react/constants/app';

const Page = () => {
  return (
    <StyledWrapperPage>
      <AddEdit typeModal={ActionType.VIEW} />
    </StyledWrapperPage>
  );
};
export default Page;
