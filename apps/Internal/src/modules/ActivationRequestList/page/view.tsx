
import { ActionType } from '@react/constants/app';
import ViewUpdate from '../components/ViewUpdate';
import { Wrapper } from './style';

const UserGroupManagerPage = () => {
  return (
    <Wrapper id="wrapperUserGroup">
      <ViewUpdate typeModal={ActionType.VIEW} isFromApprove={false} />
    </Wrapper>
  );
};

export default UserGroupManagerPage;
