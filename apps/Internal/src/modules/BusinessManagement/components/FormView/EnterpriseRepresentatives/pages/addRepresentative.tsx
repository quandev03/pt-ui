import { StyledWrapperPage } from '@react/commons/Page';
import { ActionType } from '@react/constants/app';
import RepresentativeAction from '../component/RepresentativeAction';

const AddRepresentativePage = () => {
  return (
    <StyledWrapperPage>
      <RepresentativeAction actionType={ActionType.ADD} />
    </StyledWrapperPage>
  );
};
export default AddRepresentativePage;
