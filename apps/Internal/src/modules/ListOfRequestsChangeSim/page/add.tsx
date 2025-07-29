import { StyledWrapperPage } from 'apps/Internal/src/modules/ActivateSubscription/pages/styles';
import AddEditView from '../components/AddEditView';
import { ActionType } from '@react/constants/app';

const ChangeSimmPage = () => {
  return (
    <StyledWrapperPage>
      <AddEditView typeModal={ActionType.ADD} />
    </StyledWrapperPage>
  );
};
export default ChangeSimmPage;
